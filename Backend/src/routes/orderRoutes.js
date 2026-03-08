const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require authentication

router.route('/')
    .post(orderController.createOrder)
    .get(orderController.getUserOrders);

router.route('/:id')
    .get(orderController.getOrderById)
    .put(orderController.updateOrderStatus);

module.exports = router;
