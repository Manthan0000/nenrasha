const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), createProduct);

router.route('/:id')
    .get(getProductById);

router.route('/:id/visit')
    .put(require('../controllers/productController').incrementVisits);

router.route('/:id/like')
    .put(protect, require('../controllers/productController').toggleLike);

module.exports = router;
