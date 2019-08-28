const express = require('express');
const _ = require('underscore');

const app = express();

const { verifyToken } = require('../middlewares/auth');

let Category = require('../models/category');

app.get('/category', verifyToken, (req, res) => {

    Category.find().exec((err, categorys) => {

        if (err) {
            return res.status(400).json({
                err,
                successful: false,
            })
        }

        Category.countDocuments({}, (err, count) => {
            res.json({
                successful: true,
                'total_categorys': count,
                categorys
            });
        });
    });

});

app.delete('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, {}, (err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                err,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: categoryDB
        });

    });


});

app.post('/category', verifyToken, (req, res) => {

    let user = req.user;
    let body = req.body;

    categorySchema = new Category({
        name: body.name,
        userAt: user._id,
    });

    categorySchema.save((err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                errors: err.errors,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: categoryDB
        });

    });

});

app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name']);

    Category.findByIdAndRemove(id, (err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                err,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: categoryDB
        });

    });

});


app.delete('/users/:id', verifyToken, async function(req, res) {

    let id = req.params.id;
    CategorySchema.findByIdAndRemove(id, (err, categoryDelete) => {

        if (err) {
            return res.status(400).json({
                err,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: categoryDelete
        });
    });


});


module.exports = app;