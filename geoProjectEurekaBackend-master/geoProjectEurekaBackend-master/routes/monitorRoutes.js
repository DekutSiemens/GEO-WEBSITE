// routes/monitorRoutes.js
// =============================================================================
// Live Sensor Monitor — public-via-API-key route.
//
// Mirrors the auto-create pattern: API-key auth (not JWT) because the caller
// is a background service (the GitHub poller, or a future direct PLC gateway),
// not a logged-in user.
// =============================================================================

const express = require('express');
const { appendSensorReading } = require('../controllers/monitorController');
const { apiKeyAuth }          = require('../middlewares/apiKeyMiddleware');

const router = express.Router();

// POST /api/monitor/append
//   x-api-key: <AUTOMATION_API_KEY>
//   body: { userId, device_id, location?, temperature?, humidity?, timestamp? }
router.post('/append', apiKeyAuth, appendSensorReading);

module.exports = router;
