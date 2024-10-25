const mongoose = require('mongoose');

const bikeRouteSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, min: 0, max: 5, default: 0 }
});

module.exports = mongoose.model('BikeRoute', bikeRouteSchema);
