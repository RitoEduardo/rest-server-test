const jwt = require('jsonwebtoken');
const User = require('../models/user');
// =========================================
//            VERIFICA TOKEN
// =========================================
let verifyToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                err
            })
        }

        req.user = decoded.model;

        next();
    });

}

let verifyAdmin = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.status(401).json({
            success: false,
            err: "Permiso denegado"
        })
    }


}

module.exports = {
    verifyToken,
    verifyAdmin
}