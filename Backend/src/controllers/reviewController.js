const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name profilePhoto')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Get product reviews error:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving reviews' });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const existingReview = await Review.findOne({ product: productId, user: req.user._id });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }

        const review = new Review({
            product: productId,
            user: req.user._id,
            rating,
            comment
        });

        await review.save();
        
        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name profilePhoto');

        res.status(201).json({
            success: true,
            data: populatedReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ success: false, message: 'Server error creating review' });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name profilePhoto');

        res.status(200).json({
            success: true,
            data: populatedReview
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ success: false, message: 'Server error updating review' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(req.params.reviewId);

        res.status(200).json({
            success: true,
            message: 'Review deleted'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting review' });
    }
};

exports.getTestimonials = async (req, res) => {
    try {
        const reviews = await Review.find({ rating: { $gte: 4 } })
            .populate('user', 'name profilePhoto')
            .populate('product', 'name')
            .sort({ rating: -1, createdAt: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving testimonials' });
    }
};
