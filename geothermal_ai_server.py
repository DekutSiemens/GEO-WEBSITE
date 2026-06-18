"""
=============================================================================
LARGER-Africa Geothermal AI — Flask Prediction Service v1.1
=============================================================================

A web service that serves the coordinate-based geothermal prediction model.
Matches the style of the existing server.py (Flask + Flask-CORS) so it fits
your existing stack. Runs as its own process on port 5001.

The website's React frontend and the VR app both call this service over HTTP.

------------------------------------------------------------
ENDPOINTS
------------------------------------------------------------
  GET  /health
       Quick check that the service is up and the model is loaded.
       -> {"status": "ok", "model_loaded": true, "has_calibrator": true}

  POST /predict
       Submit a prediction job. Returns a job_id immediately (async).
       Body (single point):
         {"point": {"lat": -0.905, "lon": 36.30}}
       Body (bounding box — the VR screenshot case):
         {"bbox": {"lat_min": -0.92, "lat_max": -0.88,
                   "lon_min": 36.27, "lon_max": 36.33},
          "grid_n": 15}
       -> {"job_id": "uuid", "status": "processing"}

  GET  /result/<job_id>
       Poll for results. While running: {"status": "processing"}.
       When done: {"status": "done", "result": {...}}.
       On failure: {"status": "error", "error": "..."}.

------------------------------------------------------------
SETUP (run from your GEO_AI folder where the model + scripts live)
------------------------------------------------------------
  pip install flask flask-cors --break-system-packages
  python geothermal_ai_server.py

  Required files in the same folder:
    larger_gee_extractor_v1.py
    larger_train_v1.py
    larger_predict_v1.py
    results/models_v1.1.joblib

  Edit PROJECT_ID below to your GEE project.

=============================================================================
"""

import queue
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path

import ee
import joblib
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

# Reuse the inference code we already wrote (no duplication, no schema drift)
import larger_gee_extractor_v1 as extr
import larger_train_v1 as trainer
from larger_predict_v1 import (
    determine_rift_segment,
    extract_features_for_points,
    points_from_bbox,
    apply_model,
)

# =============================================================================
# CONFIG — edit these for your environment
# =============================================================================

# Resolve paths relative to THIS script's folder so it works no matter what
# directory you launch it from (PowerShell, VS Code Run button, etc.)
SCRIPT_DIR = Path(__file__).resolve().parent

PROJECT_ID = 'blender-3d-479509'                              # your GEE project
MODEL_PATH = str(SCRIPT_DIR / 'results' / 'models_v1.1.joblib')  # trained model
PORT = 5001                                # service port
DEFAULT_GRID_N = 15                        # bbox sampling resolution
MAX_GRID_N = 30                            # cap to prevent runaway jobs

# When a job finishes, auto-save the result to the website backend (history page).
AUTO_SAVE = True
NODE_BACKEND_URL = 'http://localhost:5101/api'   # Node/Express backend

# =============================================================================
# APP SETUP
# =============================================================================

app = Flask(__name__)
CORS(app)  # allow the React frontend (and VR) to call this

print("Loading model...")
MODEL = joblib.load(MODEL_PATH)
HAS_CAL = MODEL.get('calibrator') is not None
print(f"  Model loaded. Calibrator present: {HAS_CAL}")

print(f"Initializing Earth Engine (project={PROJECT_ID})...")
ee.Initialize(project=PROJECT_ID)
print("  GEE ready.")

# In-memory job store (status + result for polling). For a single-user dev
# setup this is fine. (For production, swap for Redis or a DB.)
JOBS = {}
JOBS_LOCK = threading.Lock()

# Sequential job queue: screenshots are enqueued instantly; ONE worker thread
# processes them one at a time so parallel GEE extractions don't pile up.
JOB_QUEUE = queue.Queue()


# =============================================================================
# BACKGROUND WORKER (single thread, processes the queue sequentially)
# =============================================================================

def save_to_backend(meta, summary, point_results):
    """POST a completed prediction to the Node backend so it appears in history."""
    if not AUTO_SAVE:
        return
    payload = {
        'site_name': meta.get('site_name', 'unknown'),
        'source': meta.get('source', 'unknown'),
        'center_lat': meta.get('center_lat'),
        'center_lon': meta.get('center_lon'),
        'bbox': meta.get('bbox'),
        'grid_n': meta.get('grid_n'),
        'summary': summary,
        'points': point_results,
    }
    try:
        r = requests.post(f"{NODE_BACKEND_URL}/predictions/add",
                          json=payload, timeout=15)
        if r.status_code in (200, 201):
            print(f"    saved to history ({meta.get('source')}, {meta.get('site_name')})")
        else:
            print(f"    backend save failed: HTTP {r.status_code}")
    except Exception as exc:
        print(f"    backend save error: {exc} (is the Node backend running?)")


def process_job(job_id, points, mode_desc, meta):
    """Extract features, predict, store result for polling, save to backend."""
    try:
        features_df = extract_features_for_points(points, PROJECT_ID, verbose=True)
        preds = apply_model(features_df, MODEL)

        point_results = []
        factor_cols = [c for c in preds.columns if c.startswith('p_')]
        for _, row in preds.iterrows():
            point_results.append({
                'lat': float(row['lat']),
                'lon': float(row['lon']),
                'probability': float(row['probability']),
                'probability_raw': float(row['probability_raw']),
                'rift_segment': row['rift_segment'],
                'factors': {c.replace('p_', ''): float(row[c]) for c in factor_cols},
                'status': row['status'],
            })

        probs = preds['probability'].astype(float)
        summary = {
            'n_points': int(len(preds)),
            'mean_probability': float(probs.mean()),
            'max_probability': float(probs.max()),
            'min_probability': float(probs.min()),
            'n_high_prospect': int((probs > 0.5).sum()),
            'mode': mode_desc,
        }

        with JOBS_LOCK:
            JOBS[job_id] = {
                'status': 'done',
                'result': {'summary': summary, 'points': point_results},
                'finished_at': datetime.now(timezone.utc).isoformat(),
            }

        # Auto-save to the website history
        save_to_backend(meta, summary, point_results)

    except Exception as exc:
        with JOBS_LOCK:
            JOBS[job_id] = {
                'status': 'error',
                'error': str(exc),
                'finished_at': datetime.now(timezone.utc).isoformat(),
            }
        print(f"    job {job_id} failed: {exc}")


def queue_worker():
    """Single worker: pulls jobs off the queue and runs them one at a time."""
    while True:
        job_id, points, mode_desc, meta = JOB_QUEUE.get()
        queued = JOB_QUEUE.qsize()
        print(f"\n[worker] processing job {job_id} ({mode_desc}) "
              f"| {queued} still queued")
        process_job(job_id, points, mode_desc, meta)
        JOB_QUEUE.task_done()


# Start the single worker thread at import time
_worker = threading.Thread(target=queue_worker, daemon=True)
_worker.start()


# =============================================================================
# ENDPOINTS
# =============================================================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': MODEL is not None,
        'has_calibrator': HAS_CAL,
        'project': PROJECT_ID,
    })


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Send JSON with either "point" or "bbox"'}), 400

    # Metadata for the history record (optional, sent by VR/website)
    meta = {
        'source': data.get('source', 'unknown'),
        'site_name': data.get('site_name', 'unknown'),
        'center_lat': data.get('center_lat'),
        'center_lon': data.get('center_lon'),
        'grid_n': None,
        'bbox': None,
    }

    # Build the list of points to predict
    try:
        if 'point' in data:
            lat = float(data['point']['lat'])
            lon = float(data['point']['lon'])
            points = [(lat, lon)]
            mode_desc = f"point({lat:.4f},{lon:.4f})"
            if meta['center_lat'] is None:
                meta['center_lat'], meta['center_lon'] = lat, lon
        elif 'bbox' in data:
            b = data['bbox']
            grid_n = min(int(data.get('grid_n', DEFAULT_GRID_N)), MAX_GRID_N)
            points = points_from_bbox(
                float(b['lat_min']), float(b['lat_max']),
                float(b['lon_min']), float(b['lon_max']),
                grid_n=grid_n)
            mode_desc = (f"bbox {grid_n}x{grid_n} "
                         f"[{b['lat_min']},{b['lon_min']}]-"
                         f"[{b['lat_max']},{b['lon_max']}]")
            meta['grid_n'] = grid_n
            meta['bbox'] = {
                'lat_min': float(b['lat_min']), 'lat_max': float(b['lat_max']),
                'lon_min': float(b['lon_min']), 'lon_max': float(b['lon_max']),
            }
            if meta['center_lat'] is None:
                meta['center_lat'] = (float(b['lat_min']) + float(b['lat_max'])) / 2
                meta['center_lon'] = (float(b['lon_min']) + float(b['lon_max'])) / 2
        else:
            return jsonify({'error': 'Provide "point" or "bbox"'}), 400
    except (KeyError, ValueError, TypeError) as exc:
        return jsonify({'error': f'Bad request format: {exc}'}), 400

    # Create job, mark queued, and enqueue (worker processes sequentially).
    # Returns immediately — caller does NOT need to wait (fire-and-forget).
    job_id = str(uuid.uuid4())
    with JOBS_LOCK:
        JOBS[job_id] = {'status': 'processing',
                        'started_at': datetime.now(timezone.utc).isoformat(),
                        'mode': mode_desc}
    JOB_QUEUE.put((job_id, points, mode_desc, meta))

    return jsonify({'job_id': job_id, 'status': 'queued',
                    'queue_position': JOB_QUEUE.qsize(),
                    'n_points': len(points), 'mode': mode_desc})


@app.route('/result/<job_id>', methods=['GET'])
def get_result(job_id):
    with JOBS_LOCK:
        job = JOBS.get(job_id)
    if job is None:
        return jsonify({'error': 'job_id not found'}), 404
    return jsonify(job)


@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'service': 'LARGER-Africa Geothermal AI',
        'version': '1.1',
        'endpoints': ['/health', 'POST /predict', '/result/<job_id>'],
    })


if __name__ == '__main__':
    import socket
    # Show the LAN IP so you know what URL to use from the Quest headset
    try:
        hostname = socket.gethostname()
        lan_ip = socket.gethostbyname(hostname)
    except Exception:
        lan_ip = "<your-laptop-IP>"
    print(f"\nStarting Geothermal AI service on port {PORT}")
    print(f"  From this laptop:  http://localhost:{PORT}/health")
    print(f"  From the Quest:    http://{lan_ip}:{PORT}/health")
    print(f"  (Quest must be on the same WiFi; Windows Firewall must allow port {PORT})\n")
    # host='0.0.0.0' makes it reachable from other devices on the network (the Quest).
    # threaded=True so polling requests aren't blocked by running jobs.
    app.run(host='0.0.0.0', port=PORT, debug=False, threaded=True)
