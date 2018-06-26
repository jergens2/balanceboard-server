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

exports.validateNewEmail = function (req, res, next){
    User.findOne({ 'email': req.params.email }, 
        (err, account) => {

            if(err) return res.status(500).json({ message: 'Error', data: err})
            if (!account){
                return res.status(200).json({
                    message: 'Success: account does not exist',
                    data: null
                });
            }
        
            return res.status(200).json({ message: 'Account Exists', data: account.email});
       })
}