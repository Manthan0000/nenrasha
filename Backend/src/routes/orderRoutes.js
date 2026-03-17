const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require authentication

router.route('/')
    .post(orderController.createOrder)
    .get(orderController.getUserOrders);

router.route('/seller-orders')
    .get(orderController.getSellerOrders);

router.route('/:id')
    .get(orderController.getOrderById)
    .put(orderController.updateOrderStatus);

router.route('/:id/item/:itemId/status')
    .put(orderController.updateOrderItemStatus);

module.exports = router;
