const express = require('express');
const fileUpload = require('express-fileupload');

const User = require('../models/user');
const Product = require('../models/product');

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

    let _path = './uploads/filename.jpg'

    if (model instanceof User) {
        _path = './uploads/users/profile_' + model._id + '.jpeg';
    } else if (model instanceof Product) {
        _path = './uploads/products/product_' + model._id + '.jpeg';
    }

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

        return res.json({
            successful: true,
            file,
            message: "File update"
        });

    });



};

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