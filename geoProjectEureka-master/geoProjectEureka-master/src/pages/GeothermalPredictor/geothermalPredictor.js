// src/components/GeothermalPredictor/geothermalPredictor.js
//
// Geothermal prediction page. Calls the LARGER-Africa AI service (Flask, :5001),
// submits coordinates, polls for the async result, and visualizes the
// calibrated probability + per-factor breakdown with react-apexcharts.
//
// Add to your router, e.g. in App.js:
//   import GeothermalPredictor from './components/GeothermalPredictor/geothermalPredictor';
//   <Route path="/predict" element={<GeothermalPredictor />} />

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

// The AI service URL. For local dev it's localhost:5001.
// When you deploy, change this to your hosted AI service URL.
const AI_SERVICE_URL = "http://localhost:5001";

const FACTOR_ORDER = [
  "thermal",
  "geomorphology",
  "hydrology",
  "mineralogy",
  "deformation",
  "structures",
  "vegetation",
];

const GeothermalPredictor = () => {
  const [mode, setMode] = useState("point"); // "point" | "area"
  const [lat, setLat] = useState("-0.905");
  const [lon, setLon] = useState("36.30");
  const [bbox, setBbox] = useState({
    lat_min: "-0.92",
    lat_max: "-0.88",
    lon_min: "36.27",
    lon_max: "36.33",
  });
  const [gridN, setGridN] = useState(12);

  const [status, setStatus] = useState("idle"); // idle|processing|done|error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const pollRef = useRef(null);
  const timerRef = useRef(null);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handlePredict = async () => {
    setStatus("processing");
    setResult(null);
    setError(null);
    startTimer();

    // Build request body
    let body;
    if (mode === "point") {
      body = { point: { lat: parseFloat(lat), lon: parseFloat(lon) } };
    } else {
      body = {
        bbox: {
          lat_min: parseFloat(bbox.lat_min),
          lat_max: parseFloat(bbox.lat_max),
          lon_min: parseFloat(bbox.lon_min),
          lon_max: parseFloat(bbox.lon_max),
        },
        grid_n: parseInt(gridN, 10),
      };
    }

    try {
      const submit = await axios.post(`${AI_SERVICE_URL}/predict`, body);
      const jobId = submit.data.job_id;

      pollRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${AI_SERVICE_URL}/result/${jobId}`);
          if (res.data.status === "done") {
            clearInterval(pollRef.current);
            stopTimer();
            setResult(res.data.result);
            setStatus("done");
          } else if (res.data.status === "error") {
            clearInterval(pollRef.current);
            stopTimer();
            setError(res.data.error || "Prediction failed");
            setStatus("error");
          }
        } catch (e) {
          clearInterval(pollRef.current);
          stopTimer();
          setError("Lost connection to AI service");
          setStatus("error");
        }
      }, 5000);
    } catch (e) {
      stopTimer();
      setError(
        e.response
          ? `Server error: ${e.response.status}`
          : "Cannot reach AI service. Is it running on port 5001?"
      );
      setStatus("error");
    }
  };

  // ---- Helpers for display ----
  const probColor = (p) =>
    p >= 0.7 ? "#16a34a" : p >= 0.5 ? "#ca8a04" : "#6b7280";
  const probLabel = (p) =>
    p >= 0.7
      ? "High geothermal potential"
      : p >= 0.5
      ? "Moderate potential"
      : "Low potential";

  const singlePoint =
    result && result.points && result.points.length === 1
      ? result.points[0]
      : null;

  // Factor bar chart config (single-point mode)
  const factorChart = singlePoint
    ? {
        options: {
          chart: { type: "bar", toolbar: { show: false } },
          plotOptions: {
            bar: { horizontal: true, borderRadius: 4, barHeight: "65%" },
          },
          colors: ["#0ea5e9"],
          dataLabels: {
            enabled: true,
            formatter: (v) => v.toFixed(2),
            style: { fontSize: "11px" },
          },
          xaxis: {
            categories: FACTOR_ORDER.map(
              (f) => f.charAt(0).toUpperCase() + f.slice(1)
            ),
            max: 1,
            min: 0,
            title: { text: "Per-factor probability" },
          },
          annotations: {
            xaxis: [
              {
                x: 0.5,
                borderColor: "#ef4444",
                strokeDashArray: 4,
                label: { text: "0.5" },
              },
            ],
          },
        },
        series: [
          {
            name: "Probability",
            data: FACTOR_ORDER.map((f) =>
              singlePoint.factors[f] != null
                ? Number(singlePoint.factors[f].toFixed(3))
                : 0
            ),
          },
        ],
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Geothermal Prediction</h1>
      <p className="text-gray-500 mb-6">
        Enter coordinates to estimate geothermal potential from satellite data.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            mode === "point" ? "bg-sky-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("point")}
        >
          Single Point
        </button>
        <button
          className={`px-4 py-2 rounded ${
            mode === "area" ? "bg-sky-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("area")}
        >
          Area (grid)
        </button>
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        {mode === "point" ? (
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Latitude</span>
              <input
                className="border rounded px-3 py-2"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Longitude</span>
              <input
                className="border rounded px-3 py-2"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {["lat_min", "lat_max", "lon_min", "lon_max"].map((k) => (
              <label className="flex flex-col" key={k}>
                <span className="text-sm text-gray-600">{k}</span>
                <input
                  className="border rounded px-3 py-2"
                  value={bbox[k]}
                  onChange={(e) =>
                    setBbox({ ...bbox, [k]: e.target.value })
                  }
                />
              </label>
            ))}
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">
                Grid size ({gridN}x{gridN} = {gridN * gridN} points)
              </span>
              <input
                type="range"
                min="5"
                max="25"
                value={gridN}
                onChange={(e) => setGridN(e.target.value)}
              />
            </label>
          </div>
        )}

        <button
          className="mt-4 px-6 py-2 bg-sky-600 text-white rounded font-semibold disabled:opacity-50"
          onClick={handlePredict}
          disabled={status === "processing"}
        >
          {status === "processing" ? "Analyzing…" : "Predict"}
        </button>
      </div>

      {/* Processing state */}
      {status === "processing" && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sky-800 font-medium">
            Extracting satellite features & running model…
          </p>
          <p className="text-sky-600 text-sm">
            Elapsed: {elapsed}s (typically 1–3 minutes)
          </p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Single-point result */}
      {status === "done" && singlePoint && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">
                {singlePoint.lat.toFixed(4)}, {singlePoint.lon.toFixed(4)} ·{" "}
                {singlePoint.rift_segment.replace(/_/g, " ")}
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: probColor(singlePoint.probability) }}
              >
                {(singlePoint.probability * 100).toFixed(0)}% —{" "}
                {probLabel(singlePoint.probability)}
              </h2>
            </div>
            <div
              className="text-5xl font-extrabold"
              style={{ color: probColor(singlePoint.probability) }}
            >
              {singlePoint.probability.toFixed(2)}
            </div>
          </div>

          {factorChart && (
            <ReactApexChart
              options={factorChart.options}
              series={factorChart.series}
              type="bar"
              height={320}
            />
          )}
          <p className="text-sm text-gray-500 mt-2">
            Calibrated probability. The bars show what each of the seven factor
            models contributed — the meta-model fuses them into the final score.
          </p>
        </div>
      )}

      {/* Area (grid) result */}
      {status === "done" && result && result.points.length > 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Area summary</h2>
          <div className="grid grid-cols-4 gap-3 mb-4 text-center">
            <Stat label="Points" value={result.summary.n_points} />
            <Stat
              label="Mean P"
              value={result.summary.mean_probability.toFixed(2)}
            />
            <Stat
              label="Max P"
              value={result.summary.max_probability.toFixed(2)}
            />
            <Stat
              label="High-prospect"
              value={result.summary.n_high_prospect}
            />
          </div>

          {/* Simple colored heatmap grid */}
          <HeatmapGrid points={result.points} />
          <p className="text-sm text-gray-500 mt-2">
            Each cell is a sampled location, colored by geothermal probability
            (grey = low, yellow = moderate, green = high).
          </p>
        </div>
      )}
    </div>
  );
};

// Small stat box
const Stat = ({ label, value }) => (
  <div className="bg-gray-50 rounded p-3">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

// Heatmap grid for area mode — infers grid dimensions from point count
const HeatmapGrid = ({ points }) => {
  const n = Math.round(Math.sqrt(points.length));
  const color = (p) =>
    p >= 0.7 ? "#16a34a" : p >= 0.5 ? "#ca8a04" : "#9ca3af";
  // Sort by lat desc then lon asc to roughly arrange as a map grid
  const sorted = [...points].sort(
    (a, b) => b.lat - a.lat || a.lon - b.lon
  );
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
    >
      {sorted.map((pt, i) => (
        <div
          key={i}
          title={`${pt.lat.toFixed(4)}, ${pt.lon.toFixed(4)} → ${pt.probability.toFixed(
            2
          )}`}
          className="aspect-square rounded-sm"
          style={{ backgroundColor: color(pt.probability), opacity: 0.4 + pt.probability * 0.6 }}
        />
      ))}
    </div>
  );
};

export default GeothermalPredictor;
