const Prediction = require('../models/predictionModel');

// POST /api/predictions/add  — save a prediction (called by VR or website)
exports.addPrediction = async (req, res) => {
    try {
        const prediction = new Prediction(req.body);
        await prediction.save();
        res.status(201).json({ message: 'Prediction saved', id: prediction._id });
    } catch (err) {
        console.error('addPrediction error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/predictions/all  — list (newest first), without the heavy points array
exports.getPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.find()
            .select('-points')          // omit points for a light list view
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(predictions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/predictions/:id  — one full prediction (with all points)
exports.getPredictionById = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) return res.status(404).json({ error: 'Not found' });
        res.json(prediction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
