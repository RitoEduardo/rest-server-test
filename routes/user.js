const express = require('express');
const User = require('../models/user')
const app = express();

const bcrypt = require('bcrypt');
//const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
//const someOtherPlaintextPassword = 'not_bacon';

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.json({ init: 'Hello Word in API' });
});

app.get('/users', function(req, res) {
    res.json('Get Users Local');
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
    res.json({
        id,
        'resp': 'Put Users'
    });
});

app.delete('/users/:id', function(req, res) {
    res.send('Delete Users');
});

module.exports = app;