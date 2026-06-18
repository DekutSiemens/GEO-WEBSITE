const express = require('express');
const {
    addPrediction,
    getPredictions,
    getPredictionById
} = require('../controllers/predictionController');
const router = express.Router();

// NOTE: these are public (no `protect` middleware) so the VR app, which has no
// JWT token, can post predictions. If you later want to restrict viewing to
// logged-in users, add the `protect` middleware to the GET routes:
//   const { protect } = require('../middlewares/authMiddleware');
//   router.get('/all', protect, getPredictions);

router.post('/add', addPrediction);          // VR / website save a prediction
router.get('/all', getPredictions);          // history list
router.get('/:id', getPredictionById);       // one full prediction

module.exports = router;
