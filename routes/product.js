const express = require('express');
const _ = require('underscore');
const { verifyToken } = require('../middlewares/auth');

let app = express();
let Product = require('../models/product');
let Category = require('../models/category');

/*  GET PRODUCTS */
app.get('/products', (req, res) => {

    let filters = {
        available: true
    };

    const viewForPage = Number(req.query.limit) || 7;
    const page = Number(req.query.page) || 1;
    const asFrom = viewForPage * (page - 1);


    Product.find(filters)
        .sort('name')
        .skip(asFrom)
        .limit(viewForPage)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {

            if (err) {
                return res.status(400).json({
                    error: err.error ? err.error : err,
                    successful: false,
                })
            }

            Product.countDocuments(filters, (err, count) => {
                res.json({
                    successful: true,
                    'total_products': count,
                    'view_for_page': viewForPage,
                    page,
                    products
                });
            });
        });

});

/*  GET FOR ID PRODUCT  */
app.get('/products/:id', (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {

            if (err) {
                return res.status(400).json({
                    error: (err && err.errors) ? err.error : err,
                    successful: false,
                })
            }

            res.json({
                successful: true,
                model: productDB
            });

        });

});

/*  GET SEARCH NAME PRODUCT  */
app.get('/products/search/:param', (req, res) => {

    let name = req.params.param;

    let regex = new RegExp(name, 'i');

    let filters = {
        available: true,
        name: regex
    };

    const viewForPage = Number(req.query.limit) || 7;
    const page = Number(req.query.page) || 1;
    const asFrom = viewForPage * (page - 1);


    Product.find(filters)
        .sort('name')
        .skip(asFrom)
        .limit(viewForPage)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {

            if (err) {
                return res.status(400).json({
                    error: err.error ? err.error : err,
                    successful: false,
                })
            }

            Product.countDocuments(filters, (err, count) => {
                res.json({
                    successful: true,
                    'total_products': count,
                    'view_for_page': viewForPage,
                    page,
                    products
                });
            });
        });
});


app.post('/products', verifyToken, async(req, res) => {

    let body = req.body;

    let category_id = body.category;

    let categoryDB = await Category.findById(category_id, {}).exec();

    if (!categoryDB) {
        return res.status(400).json({
            error: "Category id not found",
            successful: false,
        })
    }

    let user = req.user;

    productSchema = new Product({
        name: body.name,
        unitPrice: Number(body.unit_price),
        description: body.description,
        category: categoryDB._id,
        user: user._id,
    });

    productSchema.save((err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                errors: (err && err.errors) ? err.errors : err,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: categoryDB,
            message: "Product Create"
        });

    });

});

app.put('/products/:id', async(req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'description', 'available']);

    if (req.body.unit_price) {
        body.unitPrice = Number(req.body.unit_price);
    }

    if (req.body.category) {

        let categoryDB = await Category.findById(req.body.category, {}).exec();

        if (!categoryDB) {
            return res.status(400).json({
                error: "Category id not found",
                successful: false,
            })
        }

        body.category = categoryDB._id;

    }

    Product.findOneAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productDB) => {

        if (err) {
            return res.status(400).json({
                errors: (err && err.errors) ? err.errors : err,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: productDB,
            message: "Product Update"
        });

    });

});

app.delete('/products/:id', (req, res) => {

    let id = req.params.id;
    Product.findByIdAndRemove(id, (err, productDelete) => {

        if (err) {
            return res.status(400).json({
                errors: (err && err.errors) ? err.errors : err,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: productDelete,
            message: productDelete ? "Product remove" : "Product not found"
        });

    });

});



module.exports = app;