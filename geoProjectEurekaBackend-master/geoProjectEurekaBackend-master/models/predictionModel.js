const mongoose = require('mongoose');

// Per-factor probabilities (fixed 7 factors). _id:false keeps it as a plain subdoc.
const factorSchema = new mongoose.Schema({
    thermal: Number,
    geomorphology: Number,
    hydrology: Number,
    mineralogy: Number,
    deformation: Number,
    structures: Number,
    vegetation: Number
}, { _id: false });

// One sampled point in the prediction grid.
const pointSchema = new mongoose.Schema({
    lat: Number,
    lon: Number,
    probability: Number,        // calibrated
    probability_raw: Number,
    rift_segment: String,
    factors: factorSchema,
    status: String
}, { _id: false });

const predictionSchema = new mongoose.Schema({
    site_name: { type: String, default: 'VR_view' },
    source: { type: String, default: 'VR' },     // 'VR' or 'website'
    center_lat: Number,
    center_lon: Number,
    bbox: {
        lat_min: Number,
        lat_max: Number,
        lon_min: Number,
        lon_max: Number
    },
    grid_n: Number,
    summary: {
        n_points: Number,
        mean_probability: Number,
        max_probability: Number,
        min_probability: Number,
        n_high_prospect: Number,
        mode: String
    },
    points: [pointSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
