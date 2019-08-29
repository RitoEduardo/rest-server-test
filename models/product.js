const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is necesary']
    },
    unitPrice: {
        type: Number,
        required: [true, 'The unit price is necesary']
    },
    description: {
        type: String,
        required: false
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    img: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('product', productSchema);