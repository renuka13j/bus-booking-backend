const express = require('express');
const router = express.Router();
const {
  createOperator, getOperators,
  createRoute, getRoutes,
  createTrip,
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

router.post('/operators', protect, isAdmin, createOperator);
router.get('/operators', protect, isAdmin, getOperators);

router.post('/routes', protect, isAdmin, createRoute);
router.get('/routes', protect, isAdmin, getRoutes);

router.post('/trips', protect, isAdmin, createTrip);

module.exports = router;