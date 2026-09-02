const Trip = require('../models/Trip');
const Route = require('../models/Route');

// Maps common misspellings/variants to the exact city name stored in the database
const cityAliases = {
  bangalore: 'Bangalore',
  banglore: 'Bangalore',
  bengaluru: 'Bangalore',
  bengalore: 'Bangalore',
  mumbai: 'Mumbai',
  bombay: 'Mumbai',
  pune: 'Pune',
  poona: 'Pune',
  nagpur: 'Nagpur',
  delhi: 'Delhi',
  newdelhi: 'Delhi',
  chennai: 'Chennai',
  madras: 'Chennai',
  jaipur: 'Jaipur',
};

function normalizeCity(input) {
  if (!input) return input;
  const key = input.trim().toLowerCase().replace(/\s+/g, '');
  return cityAliases[key] || input;
}

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

async function searchTrips(req, res) {
  try {
    const { source, destination, date } = req.query;

    const normalizedSource = normalizeCity(source);
    const normalizedDestination = normalizeCity(destination);

    const matchingRoutes = await Route.find({
      source: { $regex: `^${normalizedSource}$`, $options: 'i' },
      destination: { $regex: `^${normalizedDestination}$`, $options: 'i' }
    });

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