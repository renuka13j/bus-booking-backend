const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  name: { type: String, required: true },     
  type: { type: String, enum: ['bus', 'train'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Operator', operatorSchema);