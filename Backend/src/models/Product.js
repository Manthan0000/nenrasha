const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    priceINR: {
        type: Number,
        required: true
    },
    oldPriceINR: {
        type: Number,
    },
    discount: {
        type: Number,
        default: 0
    },
    visits: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    colors: [{
        type: String
    }],
    size: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
