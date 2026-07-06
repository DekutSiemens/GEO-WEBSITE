// controllers/aiController.js
// =============================================================================
// Node backend as a proxy to the local Flask AI service.
//
// The Flask AI service listens only on 127.0.0.1:5001 (Pattern 1 architecture).
// The Quest headset and website talk to the Node backend at
// https://vmlabackend.dkut.ac.ke/api/ai/*, and this controller relays those
// requests to the local Flask service.
//
// Endpoints proxied:
//   POST /api/ai/predict         -> POST http://localhost:5001/predict
//   GET  /api/ai/result/:jobId   -> GET  http://localhost:5001/result/:jobId
//   GET  /api/ai/health          -> GET  http://localhost:5001/health
//
// Auth: uses the same apiKeyAuth middleware as the /monitor and /data/auto-create
// endpoints (see routes/aiRoutes.js).
// =============================================================================

const axios = require('axios');

// The local Flask AI service — same Windows VM, so we can use localhost.
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// --- POST /api/ai/predict ---
// Body: { point: {lat, lon} }  OR  { bbox: {...}, grid_n }, plus optional
//   { source, site_name, center_lat, center_lon }
exports.startPrediction = async (req, res) => {
    try {
        const r = await axios.post(`${AI_URL}/predict`, req.body, {
            timeout: 30000,   // 30s to accept a job (GEE init can be slow first time)
            headers: { 'Content-Type': 'application/json' },
        });
        // Relay the AI's response back to the client unchanged
        return res.status(r.status).json(r.data);
    } catch (err) {
        console.error('[ai-proxy] /predict failed:', err.message);
        // If the AI service itself returned an error, forward its status + body
        if (err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        return res.status(502).json({
            error: 'AI service unreachable',
            details: err.message,
        });
    }
};

// --- GET /api/ai/result/:jobId ---
exports.getPredictionResult = async (req, res) => {
    try {
        const r = await axios.get(`${AI_URL}/result/${req.params.jobId}`, {
            timeout: 15000,
        });
        return res.status(r.status).json(r.data);
    } catch (err) {
        console.error(`[ai-proxy] /result/${req.params.jobId} failed:`, err.message);
        if (err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        return res.status(502).json({
            error: 'AI service unreachable',
            details: err.message,
        });
    }
};

// --- GET /api/ai/health ---
// Used by the frontend and Quest to check if the AI is up before submitting.
// No auth required (health checks are ok to leave open).
exports.aiHealth = async (req, res) => {
    try {
        const r = await axios.get(`${AI_URL}/health`, { timeout: 5000 });
        return res.status(r.status).json(r.data);
    } catch (err) {
        return res.status(502).json({
            status: 'unreachable',
            error: err.message,
        });
    }
};
