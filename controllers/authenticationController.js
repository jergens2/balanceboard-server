const bcrypt = require("bcrypt");
const User = require('../models/user');


exports.register = function (req, res, next) {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: "User created",
                        data: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: err
                    })
                })
        })
};

exports.authenticate = function (req, res, next) {

};