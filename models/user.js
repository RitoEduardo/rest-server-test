const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} is not rol valid'
}

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The Name is necesary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The Email is necesary']
    },
    password: {
        type: String,
        required: [true, 'The Password is necesary']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google_sign_in: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.indexes();
userSchema.plugin(uniqueValidator, {
    //message: '{PATH} necesary '
});
//var Kitten = mongoose.model('Kitten', kittySchema);

module.exports = mongoose.model('user', userSchema);