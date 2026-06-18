// middlewares/apiKeyMiddleware.js
// =============================================================================
// API key middleware for service-to-service endpoints (e.g., auto-create).
//
// Use this instead of `protect` (JWT) when an endpoint should be callable
// by a background service or external integration, not a logged-in user.
//
// The expected key is read from the .env file:
//   AUTOMATION_API_KEY=<some long random string>
//
// Callers must include this header on every request:
//   x-api-key: <same long random string>
// =============================================================================

const apiKeyAuth = (req, res, next) => {
    const provided = req.header('x-api-key');
    const expected = process.env.AUTOMATION_API_KEY;

    if (!expected) {
        console.error('[apiKeyAuth] AUTOMATION_API_KEY is not set in .env');
        return res.status(500).json({
            error: 'Server is misconfigured: AUTOMATION_API_KEY missing',
        });
    }

    if (!provided) {
        return res.status(401).json({
            error: 'Missing x-api-key header',
        });
    }

    if (provided !== expected) {
        return res.status(401).json({
            error: 'Invalid x-api-key',
        });
    }

    next();
};

module.exports = { apiKeyAuth };
