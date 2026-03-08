const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(cartController.getCart)
    .post(cartController.addToCart)
    .delete(cartController.clearCart);

router.route('/:itemId')
    .put(cartController.updateCartItemQuantity)
    .delete(cartController.removeFromCart);

module.exports = router;
