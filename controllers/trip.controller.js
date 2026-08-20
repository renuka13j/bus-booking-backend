const Trip = require('../models/Trip');
const Route = require('../models/Route');

// GET /api/trips
async function getAllTrips(req, res) {
  try {
    const trips = await Trip.find().populate({
      path: 'route',
      populate: { path: 'operator' }
    });

    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips', error: err.message });
  }
}

// GET /api/trips/:id
async function getTripById(req, res) {
  try {
    const trip = await Trip.findById(req.params.id).populate({
      path: 'route',
      populate: { path: 'operator' }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trip', error: err.message });
  }
}

// GET /api/trips/search?source=...&destination=...&date=...
async function searchTrips(req, res) {
  try {
    const { source, destination, date } = req.query;

    const matchingRoutes = await Route.find({ source, destination });
    const routeIds = matchingRoutes.map(route => route._id);

    const trips = await Trip.find({
      route: { $in: routeIds },
      date: date
    }).populate({
      path: 'route',
      populate: { path: 'operator' }
    });

    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
}

module.exports = { getAllTrips, getTripById, searchTrips };