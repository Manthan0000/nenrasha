const Product = require('../models/Product');
const User = require('../models/User');
const cloudinary = require('../config/cloudinaryConfig');


// @desc    Toggle product like
// @route   PUT /api/products/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const user = await User.findById(req.user._id);
        const likedIndex = user.likedProducts.findIndex(id => id.toString() === product._id.toString());

        if (likedIndex > -1) {
            // Unliking
            user.likedProducts.splice(likedIndex, 1);
            product.likes = Math.max(0, (product.likes || 1) - 1);
            // Ensure likes count doesn't go below 0
        } else {
            // Liking
            user.likedProducts.push(product._id);
            product.likes = (product.likes || 0) + 1;
        }

        await user.save();
        await product.save();

        res.status(200).json({ 
            success: true, 
            likedProducts: user.likedProducts,
            likes: product.likes 
        });

    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ success: false, message: 'Server error toggling like' });
    }
};


// @desc    Increment product visits
// @route   PUT /api/products/:id/visit
// @access  Public
exports.incrementVisits = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.visits = (product.visits || 0) + 1;
            await product.save();
            res.status(200).json({ success: true, visits: product.visits });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error('Increment visits error:', error);
        res.status(500).json({ success: false, message: 'Server error incrementing visits' });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving products'
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json({
                success: true,
                data: product
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving product'
        });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {

        let {
            name,
            brand,
            priceINR,
            oldPriceINR,
            discount,
            category,
            colors,
            size
        } = req.body;

        let image = req.body.image; // Fallback to URL if provided

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'nenrasha_products',
                    resource_type: 'image'
                });
                image = result.secure_url;
                
                // Remove file from local uploads folder after successful upload
                fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // Remove file from local uploads folder even if upload fails
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(500).json({
                    success: false,
                    message: 'Image upload failed'
                });
            }
        }
        
        // Ensure colors and sizes are arrays
        if (typeof colors === 'string') {
            colors = colors.split(',').map(c => c.trim()).filter(c => c !== '');
        }
        if (typeof size === 'string') {
            size = size.split(',').map(s => s.trim()).filter(s => s !== '');
        }

        const product = new Product({
            name,
            brand,
            priceINR,
            oldPriceINR,
            discount,
            image,
            category,
            colors,
            size,
            createdBy: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json({
            success: true,
            data: createdProduct
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating product'
        });
    }
};
