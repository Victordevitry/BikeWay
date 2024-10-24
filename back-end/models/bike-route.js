const mongoose = require('mongoose');

const bikeRouteSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now } // Optional: to track when the route was created
});

module.exports = mongoose.model('BikeRoute', bikeRouteSchema);
