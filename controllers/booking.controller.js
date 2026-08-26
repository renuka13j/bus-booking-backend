const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

async function createBooking(req, res) {
  try {
    const { tripId, passengers, totalAmount } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const seatNumbers = passengers.map(p => p.seatNumber);

    const updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: tripId,
        seats: {
          $not: {
            $elemMatch: { seatNumber: { $in: seatNumbers }, isBooked: true }
          }
        }
      },
      { $set: { 'seats.$[elem].isBooked': true } },
      {
        arrayFilters: [{ 'elem.seatNumber': { $in: seatNumbers } }],
        new: true
      }
    );

    if (!updatedTrip) {
      return res.status(409).json({ message: 'Selected seats are no longer available' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      trip: tripId,
      seatsBooked: seatNumbers,
      passengers,
      totalAmount,
      status: 'confirmed'
    });

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
}

// GET /api/bookings/my
async function getMyBookings(req, res) {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'trip',
        populate: { path: 'route', populate: { path: 'operator' } }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
}

module.exports = { createBooking, getMyBookings };