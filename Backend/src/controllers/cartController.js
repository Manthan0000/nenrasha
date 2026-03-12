const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [] } });
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving cart' });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, color, size } = req.body;
        
        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Find existing cart or create a new one
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if item already exists in cart with same product, color, and size
        const existingItemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.color === color && 
            item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            cart.items[existingItemIndex].quantity += Number(quantity);
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity: Number(quantity),
                color: color || '',
                size: size || ''
            });
        }

        await cart.save();
        
        // Populate product details before sending response to ensure immediate UI update with full product details
        const populatedCart = await Cart.findById(cart._id).populate('items.product');

        res.status(200).json({ success: true, message: 'Added to cart', cart: populatedCart });
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).json({ success: false, message: 'Server error adding to cart' });
    }
};

// Update item quantity
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { itemId } = req.params; // Document ID of the item in the cart.items array
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1', action: 'USE_REMOVE_ROUTE_INSTEAD' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        item.quantity = Number(quantity);
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.status(200).json({ success: true, message: 'Cart updated', cart: populatedCart });
    } catch (error) {
        console.error('Error in updateCartItemQuantity:', error);
        res.status(500).json({ success: false, message: 'Server error updating cart item' });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.status(200).json({ success: true, message: 'Item removed from cart', cart: populatedCart });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(500).json({ success: false, message: 'Server error removing item' });
    }
};

// Clear cart completely
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(200).json({ success: true, message: 'Cart already empty', cart: { items: [] } });
        }

        cart.items = [];
        await cart.save();
        res.status(200).json({ success: true, message: 'Cart cleared', cart });
    } catch (error) {
        console.error('Error in clearCart:', error);
        res.status(500).json({ success: false, message: 'Server error clearing cart' });
    }
};
