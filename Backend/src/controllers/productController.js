const Product = require('../models/Product');
const User = require('../models/User');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');


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
        const { sort } = req.query;
        let query = Product.find({});

        if (sort === 'popularity') {
            query = query.sort({ visits: -1 });
        } else if (sort === 'newest') {
            query = query.sort({ createdAt: -1 });
        } else if (sort === 'price-low-high') {
            query = query.sort({ priceINR: 1 });
        } else if (sort === 'price-high-low') {
            query = query.sort({ priceINR: -1 });
        }

        const products = await query;
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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if the user is the one who created the product
        if (product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized: Only the admin who listed this product can update it' 
            });
        }

        const {
            name,
            brand,
            priceINR,
            oldPriceINR,
            discount,
            category,
            colors,
            size
        } = req.body;

        product.name = name || product.name;
        product.brand = brand || product.brand;
        product.priceINR = priceINR || product.priceINR;
        product.oldPriceINR = oldPriceINR !== undefined ? oldPriceINR : product.oldPriceINR;
        product.discount = discount !== undefined ? discount : product.discount;
        product.category = category || product.category;

        if (colors) {
            product.colors = typeof colors === 'string' ? colors.split(',').map(c => c.trim()).filter(c => c !== '') : colors;
        }
        if (size) {
            product.size = typeof size === 'string' ? size.split(',').map(s => s.trim()).filter(s => s !== '') : size;
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'nenrasha_products',
                resource_type: 'image'
            });
            product.image = result.secure_url;
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } else if (req.body.image) {
            product.image = req.body.image;
        }

        const updatedProduct = await product.save();
        res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Server error updating product' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if the user is the one who created the product
        if (product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized: Only the admin who listed this product can delete it' 
            });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Product removed' });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting product' });
    }
};
