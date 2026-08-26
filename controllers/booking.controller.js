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

// PATCH /api/bookings/:id/cancel
async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Security check: only the person who made the booking can cancel it
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Free up the seats on the trip
    await Trip.updateOne(
      { _id: booking.trip },
      { $set: { 'seats.$[elem].isBooked': false } },
      { arrayFilters: [{ 'elem.seatNumber': { $in: booking.seatsBooked } }] }
    );

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed', error: err.message });
  }
}

module.exports = { createBooking, getMyBookings, cancelBooking };