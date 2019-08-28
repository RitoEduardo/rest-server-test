const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The Name is necesary']
    },
    userAt: {
        type: String,
        required: [true, 'The User is required']
    }
});

module.exports = mongoose.model('category', categorySchema);