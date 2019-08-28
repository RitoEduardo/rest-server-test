const express = require('express');
const _ = require('underscore');

const app = express();

const { verifyToken } = require('../middlewares/auth');

let Category = require('../models/category');

app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categorys) => {

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

app.get('/category/:id', verifyToken, (req, res) => {

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
        description: body.description,
        user: user._id,
    });

    categorySchema.save((err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                errors: (err && err.errors) ? err.errors : err,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: categoryDB
        });

    });

});

/* 
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['description']);

    Category.findOneAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, categoryDB) => {

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
*/

app.delete('/category/:id', verifyToken, async function(req, res) {

    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, categoryDelete) => {

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