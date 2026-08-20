const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },     
  type: { type: String, enum: ['seater', 'sleeper', 'window'], default: 'seater' },
  isBooked: { type: Boolean, default: false }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  date: { type: String, required: true },             
  departureTime: { type: String, required: true },   
  arrivalTime: { type: String, required: true },    
  price: { type: Number, required: true },
  seats: [seatSchema]                                 
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);