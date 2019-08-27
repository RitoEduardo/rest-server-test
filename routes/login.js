const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de google

async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        'first-name': payload.given_name,
        'last-name': payload.given_name,
        'email': payload.email,
        'img': payload.picture,
        'name': payload.name,
        'pass': payload.sub
    };
}


app.post('/sign-in-google', async(req, res) => {

    let token = req.body.idtoken;

    let google_user = await verify(token).catch(err => {
        res.status(403).json({
            success: false,
            err
        })
    });

    let user = await User.findOne({ email: google_user.email }).exec();

    if (user) {

        if (user.google_sign_in === false) {
            res.status(400).json({
                success: false,
                message: "Usign Auth with E-mail and Password"
            });

        } else {

            let token = jwt.sign({
                user
            }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

            res.json({
                'success': true,
                user,
                token,
                createdNew: false
            });

        }

    } else { //No existe el usuario

        let newUser = new User({
            name: google_user.name,
            email: google_user.email,
            password: bcrypt.hashSync(google_user.pass, 10),
            img: google_user.img,
            google_sign_in: true
        });

        newUser.save((err, userDB) => {

            if (err) {
                return res.status(400).json({
                    //err,
                    errors: err.errors,
                    successful: false,
                })
            }

            let token = jwt.sign({
                newUser
            }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

            res.json({
                successful: true,
                model: userDB,
                token,
                createdNew: true
            });

        })


    }




});

module.exports = app;