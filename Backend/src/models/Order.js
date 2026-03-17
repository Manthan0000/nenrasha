const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    priceINR: { type: Number, required: true },
    image: { type: String },
    color: { type: String },
    size: { type: String },
    status: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
    },
    deliveredAt: {
        type: Date
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        mobile: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Mock Payment'
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Paid',
        enum: ['Pending', 'Paid', 'Failed']
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing',
        enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
    },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
