const express = require('express');
const router = express.Router();
const { createOrder, captureOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/payment/create-order   — body: { amount (INR), description? }
router.post('/create-order', protect, createOrder);

// POST /api/payment/capture/:orderId  — called after PayPal popup approval
router.post('/capture/:orderId', protect, captureOrder);

module.exports = router;
