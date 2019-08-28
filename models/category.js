const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var categorySchema = new mongoose.Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'The Name is necesary']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

categorySchema.indexes();
categorySchema.plugin(uniqueValidator, {});

module.exports = mongoose.model('category', categorySchema);