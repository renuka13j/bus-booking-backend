const Operator = require('../models/Operator');
const Route = require('../models/Route');
const Trip = require('../models/Trip');

// POST /api/admin/operators
async function createOperator(req, res) {
  try {
    const { name, type } = req.body;
    const operator = await Operator.create({ name, type });
    res.status(201).json(operator);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create operator', error: err.message });
  }
}

// GET /api/admin/operators (for dropdowns)
async function getOperators(req, res) {
  try {
    const operators = await Operator.find().sort({ name: 1 });
    res.status(200).json(operators);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch operators', error: err.message });
  }
}

// POST /api/admin/routes
async function createRoute(req, res) {
  try {
    const { operator, source, destination, distanceKm } = req.body;
    const route = await Route.create({ operator, source, destination, distanceKm });
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create route', error: err.message });
  }
}

// GET /api/admin/routes (for dropdowns)
async function getRoutes(req, res) {
  try {
    const routes = await Route.find().populate('operator').sort({ source: 1 });
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch routes', error: err.message });
  }
}

// POST /api/admin/trips
async function createTrip(req, res) {
  try {
    const { route, date, departureTime, arrivalTime, price, seatCount } = req.body;

    // Auto-generate seats A1, A2, ... based on seatCount
    const seats = [];
    for (let i = 1; i <= seatCount; i++) {
      seats.push({ seatNumber: `A${i}`, type: 'seater', isBooked: false });
    }

    const trip = await Trip.create({
      route,
      date,
      departureTime,
      arrivalTime,
      price,
      seats,
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create trip', error: err.message });
  }
}

module.exports = { createOperator, getOperators, createRoute, getRoutes, createTrip };