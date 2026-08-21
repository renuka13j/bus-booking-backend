const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createBooking);

module.exports = router;