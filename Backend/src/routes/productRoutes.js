const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getMyListings,
    getLikedProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), createProduct);

router.get('/my-listings', protect, admin, getMyListings);
router.get('/liked', protect, getLikedProducts);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.single('image'), updateProduct)
    .delete(protect, admin, deleteProduct);

const productController = require('../controllers/productController');

router.route('/:id/visit')
    .put(productController.incrementVisits);

router.route('/:id/like')
    .put(protect, productController.toggleLike);

module.exports = router;
