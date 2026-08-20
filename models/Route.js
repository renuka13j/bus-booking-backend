const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'Operator', required: true },
  source: { type: String, required: true },       
  destination: { type: String, required: true },  
  distanceKm: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);