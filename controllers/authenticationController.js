const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserAccount = require('../models/userAccount');

// 2018-06-29:  this secret is temporary until better key management is implemented
const secret = "1D78454C81ED9CB8E1348851F25DFE11BE0DCA6C277C5AC1CAB58B7B196B81C30F87F047F25871DAC35BA5ACA760EFF07F58A438FC2CDC1956EBC265E1";

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

exports.authenticate = function (req, res, next) {

    let foundUser = null;
    UserAccount.findOne({ 'email': req.body.userAccount.email.toLowerCase()})
        .then((userAccount)=>{
            
            if(!userAccount){
                return res.status(401).json({
                    message: "Authorization failed.  Could not find an account with email '" + req.body.userAccount.email + "'"
                })
            }
            foundUser = userAccount;
            return bcrypt.compare(req.body.password, userAccount.password);
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
                    "userAccount": foundUser,
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
            return res.status(200).json({message: "Found userAccount by localStorage ID", data: userAccount})
        }
    );
};