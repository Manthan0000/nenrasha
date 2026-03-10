const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    getTestimonials
} = require('../controllers/reviewController');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);
router.get('/testimonials', getTestimonials);

module.exports = router;
