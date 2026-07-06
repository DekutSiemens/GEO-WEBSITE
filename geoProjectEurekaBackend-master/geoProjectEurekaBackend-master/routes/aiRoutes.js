// routes/aiRoutes.js
// =============================================================================
// AI proxy routes. Same auth pattern as monitorRoutes.js.
//
// POST /api/ai/predict         → protected (API key required)
// GET  /api/ai/result/:jobId   → protected (API key required)
// GET  /api/ai/health          → open (health checks are safe)
// =============================================================================

const express = require('express');
const {
    startPrediction,
    getPredictionResult,
    aiHealth,
} = require('../controllers/aiController');
const { apiKeyAuth } = require('../middlewares/apiKeyMiddleware');

const router = express.Router();

router.post('/predict', apiKeyAuth, startPrediction);
router.get('/result/:jobId', apiKeyAuth, getPredictionResult);
router.get('/health', aiHealth);   // no auth on health

module.exports = router;
