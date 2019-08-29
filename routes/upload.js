const express = require('express');
const fileUpload = require('express-fileupload');

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

const app = express();
app.use(fileUpload({ useTempFiles: true }));

const { verifyToken, verifyAdmin } = require('../middlewares/auth');

app.put('/upload/user-profile', verifyToken, async(req, res) => {

    let user = await User.findById(req.user._id).exec();
    return fnUpdateFile(req.files, user, res);

});

app.put('/upload/product-img/:id', [verifyToken, verifyAdmin], async(req, res) => {
    let id = req.params.id;
    let product = await Product.findById(id).exec();
    return fnUpdateFile(req.files, product, res);
});

fnUpdateFile = (files, model, res) => {

    if (!files || files.file == undefined) {
        return res.status(400).json({
            successful: false,
            message: "File not select"
        });
    }

    let file = files.file;

    let fileExtsValid = ['png', 'jpg', 'gif', 'jpeg'];
    let nameSplit = file.name.split('.');
    let fileExt = nameSplit[nameSplit.length - 1];

    if (fileExtsValid.indexOf(fileExt) == -1) {
        return res.status(400).json({
            successful: false,
            message: "File extension is not valid"
        });
    }

    let _path = './uploads/filename.jpeg'

    if (model instanceof User) {

        let newNameImg = 'profile_' + model._id + '-' + new Date().getMilliseconds() + '.jpeg';
        _path = './uploads/users/' + newNameImg;
        fnUpdateAndRemoveImg(newNameImg, model);

    } else if (model instanceof Product) {

        let newNameImg = 'product_' + model._id + '-' + new Date().getMilliseconds() + '.jpeg';
        _path = './uploads/products/' + newNameImg;
        fnUpdateAndRemoveImg(newNameImg, model);

    }

    file.mv(_path, (err) => {

        if (err) {
            return res.status(400).json({
                successful: false,
                err,
                message: "File Server Not Found"
            });

        }

        return res.json({
            successful: true,
            file,
            message: "File update"
        });

    });



};

fnUpdateAndRemoveImg = (newNameImg, model) => {

    let pathImg = "undefined.jpeg";
    let lastNameImg = "" + model.img;
    model.img = newNameImg;
    model.save();

    if ((model instanceof User) && lastNameImg) {
        pathImg = path.resolve(__dirname, '../uploads/users/' + lastNameImg);
    } else if ((model instanceof Product) && lastNameImg) {
        pathImg = path.resolve(__dirname, '../uploads/products/' + lastNameImg);
    }

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }

}

app.put('/upload', function(req, res) {

    return res.status(404);

    if (!req.files) {
        return res.status(400).json({
            successful: false,
            message: "File not select"
        });
    }

    let file = req.files.file;
    let _path = './uploads/filename.jpg'


    let fileExtsValid = ['png', 'jpg', 'gif', 'jpeg'];
    let nameSplit = file.name.split('.');
    let fileExt = nameSplit[nameSplit.length - 1];

    if (fileExtsValid.indexOf(fileExt) == -1) {
        return res.status(400).json({
            successful: false,
            message: "File extension is not valid"
        });
    }

    file.mv(_path, (err) => {

        if (err) {
            return res.status(400).json({
                successful: false,
                err,
                message: "File Server Not Found"
            });

        }

        return res.status(400).json({
            successful: false,
            file,
            message: "File update"
        });

    });




});

module.exports = app;