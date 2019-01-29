const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/user');

// 2018-06-29:  this secret is temporary until better key management is implemented
const secret = "1D78454C81ED9CB8E1348851F25DFE11BE0DCA6C277C5AC1CAB58B7B196B81C30F87F047F25871DAC35BA5ACA760EFF07F58A438FC2CDC1956EBC265E1";

exports.register = function (req, res, next) {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.user.email.toLowerCase(),
                name: req.body.user.name,
                password: hash,
                userSettings: req.body.user.userSettings
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
    let foundUser;
    User.findOne({ 'email': req.body.user.email.toLowerCase()})
        .then((user)=>{
            
            if(!user){
                return res.status(401).json({
                    message: "Authorization failed.  Could not find an account with email '" + req.body.user.email + "'"
                })
            }
            foundUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then((result) => {
            if(!result){
                return res.status(401).json({
                    message: "Authentication failed.  Bad password."
                })
            }
            const token = jwt.sign(
                {
                    email: foundUser.email, 
                    userId: foundUser._id
                },
                secret,
                {
                    expiresIn: "1h"
                }
            );
            res.status(200).json({
                message: "Authentication successful.",
                data: {
                    "user": foundUser,
                    "token": token                
                }
            })

         })
         .catch((err) => {
             return res.status(401).json({
                 message: "Error.  Authentication failed."
             })
         })

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
};

exports.getUserById = function (req, res, next){
    User.findById(req.params.id, 
        (err, user)=>{
            if(err) return res.status(500).json({message:'Error', data: err})
            if(!user){
                return res.status(500).json({message:"Could not find user.", data: req.params.id})
            }
            return res.status(200).json({message: "Found user by localStorage ID", data: user})
        }
    );
};