const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const app = express();

app.get('/validate_token', [verifyToken, verifyAdmin], (req, res) => {
    return res.json({
        success: true,
        user: req.user
    })
});


app.post('/login', async(req, res) => {

    let body = req.body;

    try {
        let model = await User.findOne({ email: body.email }).exec();
        if (!model) {
            throw new Error("Usuario no encontrado");
        }
        if (!bcrypt.compareSync(body.password, model.password)) {
            throw new Error("Password incorrecta");
        }

        let token = jwt.sign({
            model
        }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

        res.json({
            'success': true,
            model,
            token
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err
        });
    }

});


module.exports = app;