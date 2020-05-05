const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserAccount = require('../models/userAccount');
const fs = require("fs");

const RSA_PRIVATE_KEY = fs.readFileSync('key/private_key.key');

exports.register = function (req, res, next) {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userAccount = new UserAccount({
                email: req.body.userAccount.email.toLowerCase(),
                name: req.body.userAccount.name,
                socialId: req.body.userAccount.socialId,
                password: hash,
                userSettings: req.body.userAccount.userSettings
            });
            console.log("Registering new user".green, userAccount)
            userAccount.save()
                .then(result => {
                    res.status(201).json({
                        message: "UserAccount created",
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

exports.attemptLogin = function (req, res, next) {
    // console.log("Key: ", RSA_PRIVATE_KEY.toString(), RSA_PRIVATE_KEY.toJSON())
    // console.log("Login attempt: " , req.body)
    let foundUser = null;
    UserAccount.findOne({ 'username': req.body.userAccount.username.toLowerCase()})
        .then((userAccount)=>{
            
            if(!userAccount){
                res.status(401).json({
                    message: "Authorization failed.  Could not find an account with username '" + req.body.userAccount.username + "'"
                })
            }
            foundUser = userAccount;
            return bcrypt.compare(req.body.password, userAccount.password);
        })
        .then((result) => {
            if(!result){
                res.status(401).json({
                    message: "Authentication failed.  Bad password."
                })
            }
            const token = jwt.sign(
                {
                    email: foundUser.email, 
                    username: foundUser.username,
                    userId: foundUser._id
                },
                RSA_PRIVATE_KEY,
                {
                    expiresIn: 1200,
                }
            );
            res.status(200).json({
                message: "Authentication successful.",
                data: {
                    "userAccount": {
                        id: foundUser._id,
                        username: foundUser.username,
                        email: foundUser.email,
                    },
                    "token": token                
                }
            })

         })
         .catch((err) => {
             res.status(401).json({
                 message: "Error.  Authentication failed."
             })
         })

};

exports.validateNewEmail = function (req, res, next){
    UserAccount.findOne({ 'email': req.params.email }, 
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
    UserAccount.findById(req.params.id, 
        (err, userAccount)=>{
            if(err) return res.status(500).json({message:'Error', data: err})
            if(!userAccount){
                return res.status(500).json({message:"Could not find userAccount.", data: req.params.id})
            }
            return res.status(200).json(
                {
                    message: "Found userAccount by ID", data: {
                        id: userAccount._id,
                        username: userAccount.username,
                        email: userAccount.email,
                    }
                })
        }
    );
};