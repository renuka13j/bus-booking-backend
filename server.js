const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

require('./models/User');
require('./models/Operator');
require('./models/Route');
require('./models/Trip');
require('./models/Booking');

const app = express();
app.use(cors());
app.use(express.json());

const bookingRoutes = require('./routes/booking.routes');
app.use('/api/bookings', bookingRoutes);

const tripRoutes = require('./routes/trip.routes');
app.use('/api/trips', tripRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Bus Booking API is running');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });