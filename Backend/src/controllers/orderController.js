const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, totalAmount, paymentStatus } = req.body;

        // 1. Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // 2. Format cart items into order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            priceINR: item.product.priceINR,
            image: item.product.image,
            color: item.color,
            size: item.size
        }));

        // 3. Create the order
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentStatus: paymentStatus || 'Paid', // Assuming mock payment is successful
            paymentMethod: 'Mock Payment'
        });

        const createdOrder = await order.save();

        // 4. Empty the user's cart after successful order
        cart.items = [];
        await cart.save();

        res.status(201).json({ 
            success: true, 
            message: 'Order created successfully!',
            order: createdOrder 
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Server error while creating order' });
    }
};

// Get logged in user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving orders' });
    }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if order belongs to the user or user is admin
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving order details' });
    }
};

// Update order status (Admin only in real app, but we'll leave it open for demo)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.orderStatus = status;
        
        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Server error updating order' });
    }
};

// Get orders containing products listed by the current admin/seller
exports.getSellerOrders = async (req, res) => {
    try {
        // 1. Find all products created by this user
        const sellerProducts = await Product.find({ createdBy: req.user._id }).select('_id');
        const sellerProductIds = sellerProducts.map(p => p._id);

        if (sellerProductIds.length === 0) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        // 2. Find all orders that contain at least one item from the seller's products
        const orders = await Order.find({
            'items.product': { $in: sellerProductIds }
        })
        .populate('user', 'name email address mobile')
        .sort({ createdAt: -1 });

        // Filter the items to only include those belonging to the seller
        const filteredOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.items = orderObj.items.filter(item => 
                sellerProductIds.some(spId => spId.toString() === item.product.toString())
            );
            return orderObj;
        });

        res.status(200).json({ success: true, count: filteredOrders.length, data: filteredOrders });
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving seller orders' });
    }
};

// Update status of a specific item in an order
exports.updateOrderItemStatus = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const item = order.items.id(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Order item not found' });
        }

        // Optional: verify the seller owns this product
        const product = await Product.findById(item.product);
        if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
        }

        item.status = status;
        if (status === 'Delivered') {
            item.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Error updating order item status:', error);
        res.status(500).json({ success: false, message: 'Server error updating order item' });
    }
};
