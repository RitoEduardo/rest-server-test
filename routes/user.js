const express = require('express');
const User = require('../models/user')
const app = express();

const _ = require('underscore');

const bcrypt = require('bcrypt');
//const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
//const someOtherPlaintextPassword = 'not_bacon';

app.get('/', function(req, res) {
    res.json({ init: 'Hello Word in API' });
});

app.get('/users', function(req, res) {

    const viewForPage = Number(req.query.limit) || 3;
    const page = Number(req.query.page) || 1;
    const asFrom = viewForPage * (page - 1);

    let filters = {
        state: true
    };

    User.find(filters, 'name email')
        .skip(asFrom)
        .limit(viewForPage)
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    err,
                    successful: false,
                })
            }

            User.countDocuments(filters, (err, count) => {
                res.json({
                    successful: true,
                    'total_users': count,
                    'view_for_page': viewForPage,
                    page,
                    users
                });
            });



        });
    //res.json('Get Users Local 2');
});

app.post('/users', function(req, res) {

    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            resp: false,
            msg: "The name is necesary"
        });
    }

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        //img: body.img
        role: body.role
    });

    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                //err,
                errors: err.errors,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: userDB
        });

    })

});

app.put('/users/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findOneAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                err,
                //errors: err.errors,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: userDB
        });

    });

});

app.delete('/users/:id', async function(req, res) {
    //res.send('Delete Users');
    let id = req.params.id;
    //res.send({ 'id': id })
    //delete user
    /*
    User.findByIdAndRemove(id, (err, userDelete) => {

        if (err) {
            return res.status(400).json({
                err,
                successful: false,
            })
        }

        res.json({
            successful: true,
            model: userDelete
        });
    });
    */
    //update state 

    var model = await User.where({ _id: id }).update({ state: false }).exec();

    res.json({
        successful: true,
        'hope': id,
        model
    });


});

module.exports = app;