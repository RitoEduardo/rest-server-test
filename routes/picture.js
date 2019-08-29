const express = require('express');

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

const app = express();

app.get('/profile-img/:id', async(req, res) => {
    let id = req.params.id;
    let user = await User.findById(id).exec();
    return fnShowPicture(user, res);



});

app.get('/product-img/:id', async(req, res) => {
    let id = req.params.id;
    let product = await Product.findById(id).exec();
    return fnShowPicture(product, res);
});

fnShowPicture = (model, res) => {

    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')

    let nameImg, _path;

    if (!model.img) {
        return res.sendFile(noImagePath);
    }

    if (model instanceof User) {
        _path = './uploads/users/' + model.img;;

    } else if (model instanceof Product) {
        _path = './uploads/products/' + model.img;;
    }

    return res.sendFile(path.resolve(_path));

}

module.exports = app;