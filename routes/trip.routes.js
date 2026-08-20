const express = require('express');
const router = express.Router();
const { getAllTrips, getTripById, searchTrips } = require('../controllers/trip.controller');

router.get('/', getAllTrips);
router.get('/search', searchTrips);
router.get('/:id', getTripById);

module.exports = router;