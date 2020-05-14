const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserAccount = require('../models/userAccount');
const fs = require("fs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const moment = require("moment");

const RSA_PRIVATE_KEY = fs.readFileSync('key/private_key.key');
const registration_password = fs.readFileSync('key/registration@balanceboardapp.com.txt')
const passphrase = fs.readFileSync('key/passphrase.txt');

function generateEmailCode() {
    let code = "";
    for (let i = 0; i < 16; i++) {
        let decimalVal = Math.floor((Math.random() * 16) + 1);
        let hexString = decimalVal.toString(16);
        code += hexString
    }
    code = code.toUpperCase();
    return code;
}

exports.startRegistration = function (req, res, next) {

    /**
     * AuthData: {
        email: string, (toLowerCase()'d)
        username: string, (toLowerCase()'d)
        usernameStylized: string,
        password: string,
        pin: string,
     * }
     */
    console.log("Registering new user: ".green, req.body);

    const email = req.body.email.toLowerCase();
    const usernameValue = req.body.username;
    var usernameStylized = req.body.usernameStylized;
    const passwordPlainText = req.body.password;
    const pinPlainText = req.body.pin;

    var username = usernameValue;
    if (usernameValue === 'NO_REGISTERED_USERNAME_USE_EMAIL') {
        username = "NULL_" + uuid.v4();
        usernameStylized = username;
    }

    const subjectLine = 'balanceboard.app Account Registration';


    const code = generateEmailCode();
    var textBody = "Your registration code is:  \n" + code;
    var htmlBody = "Your registration code is:  <br><span style='font-size:2em'>" + code + "</span>";

    const transporter = nodemailer.createTransport({
        host: "box.balanceboardapp.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'registration@balanceboardapp.com',
            pass: registration_password,
        }
    });


    let send = transporter.sendMail({
        from: '"Balanceboard Registration" <registration@balanceboardapp.com>', // sender address
        to: email, // list of receivers
        subject: subjectLine, // Subject line
        text: textBody, // plain text body
        html: htmlBody // html body
    }, (err, info) => {
        if (err) {
            console.log("Err!, ".red, err)
            return res.status(500).json({
                message: "Error sending email",
                data: err
            });
        } else {
            bcrypt.hash(passwordPlainText, 10)
                .then(hashedPassword => {
                    bcrypt.hash(pinPlainText, 10)
                        .then(hashedPin => {
                            const userAccount = new UserAccount({
                                email: email,
                                username: username,
                                usernameStylized: usernameStylized,
                                password: hashedPassword,
                                pin: hashedPin,
                                registrationCode: code,
                            });
                            userAccount.save()
                                .then(result => {
                                    res.status(201).json({
                                        message: "UserAccount created",
                                        data: result
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json(err);
                                })
                        })

                })
                .catch(err => {
                    res.status(500).json(err);
                });
        }

    })



};

exports.finalizeRegistration = function (req, res, next) {
    const code = req.body.code;
    const email = req.body.email;
    console.log("Searching for thing by email: " , req.body)
    if(code){
        UserAccount.findOne({ 'email': email }, (err, foundAccount)=>{
            if(err){
                return res.status(500).json({message: 'Error finding user account ', err});
            }else{
                if(foundAccount){
                    console.log("Found account: " + foundAccount.registrationCode, foundAccount)
                    if(foundAccount.registrationCode === code){
                        const currentTime = moment().toISOString();
                        const newAccount = new UserAccount({
                            email: email,
                            username: foundAccount.username,
                            usernameStylized: foundAccount.usernameStylized,
                            password: foundAccount.hashedPassword,
                            pin: foundAccount.hashedPin,
                            registrationCode: '',
                            registeredAt: currentTime,
                            _id: foundAccount._id,
                        });
                        UserAccount.findByIdAndUpdate(foundAccount._id, newAccount, (err, updatedAccount)=>{
                            if(err){
                                return res.status(500).json({message: 'Error finding user account ', err});
                            }else{
                                return res.status(200).json({message: 'Successfully matched the registration codes!  Account is registered.', data: currentTime});
                            }
                        })
                    }else{
                        console.log("Error with codes.  existing code vs received code: " , foundAccount.registrationCode, code)
                        return res.status(500).json("Error matching registration codes.");
                    }
                }else{
                    console.log("Error with something: " , foundAccount);
                    return res.status(500).json({message: 'Error finding user account ', err});
                }
            }
        })
    }else{
        return res.status(500).json("Error with provided code");
    }
}

exports.attemptLogin = function (req, res, next) {
    // console.log("Key: ", RSA_PRIVATE_KEY.toString(), RSA_PRIVATE_KEY.toJSON())
    // console.log("Login attempt: " , req.body)
    let foundUser = null;
    UserAccount.findOne({ 'username': req.body.userAccount.username.toLowerCase() })
        .then((userAccount) => {

            if (!userAccount) {
                res.status(401).json({
                    message: "Authorization failed.  Could not find an account with username '" + req.body.userAccount.username + "'"
                })
            }
            foundUser = userAccount;
            return bcrypt.compare(req.body.password, userAccount.password);
        })
        .then((result) => {
            if (!result) {
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
                {
                    key: RSA_PRIVATE_KEY,
                    passphrase: passphrase
                },
                {
                    algorithm: 'RS256',
                    expiresIn: 120,

                },
            );
            console.log("")
            res.status(200).json({
                message: "Authentication successful.",
                data: {
                    userAccount: {
                        id: foundUser._id,
                        username: foundUser.username,
                        email: foundUser.email,
                    },
                    token: token,
                    expiresIn: 120,
                }
            })

        })
        .catch((err) => {
            console.log("Error".red, err)
            res.status(401).json({
                message: "Error.  Authentication failed."
            })
        })

};

exports.checkForExisting = function (req, res, next) {

    /**
     *  username field and email field have been .toLowerCase()'d and thus ensuring uniqueness.
     *  
     */

    const emailValue = '' + req.params.email;
    const usernameValue = '' + req.params.username;
    const userIsProvided = !(usernameValue === 'NO_USERNAME_PROVIDED_BY_USER');

    console.log("Req: ", req.params)
    if (emailValue !== "") {
        const email = emailValue.toLowerCase();
        const username = '' + usernameValue.toLowerCase();
        var query = { 'email': email };
        if (userIsProvided) {
            query = {
                $or:
                    [
                        { 'username': username },
                        { 'email': email },
                    ]
            };
        }
        UserAccount.findOne(
            query,
            (err, account) => {
                if (err) return res.status(500).json({ message: 'Error', data: err })
                if (!account) {
                    return res.status(200).json({
                        message: 'Success: account does not exist',
                        usernameIsUnique: true,
                        emailIsUnique: true,
                    });
                } else {
                    let usernameIsUnique = true;
                    let emailIsUnique = true;
                    if (email === account.email) {
                        emailIsUnique = false;
                    }
                    if (username === account.username) {
                        usernameIsUnique = false;
                    }
                    return res.status(200).json({
                        message: 'Credential already exists',
                        usernameIsUnique: usernameIsUnique,
                        emailIsUnique: emailIsUnique,
                    });
                }
            });
    } else {
        return res.status(500).json({
            message: "Error with provide values",
        });
    }


};

exports.getUserById = function (req, res, next) {
    UserAccount.findById(req.params.id,
        (err, userAccount) => {
            if (err) return res.status(500).json({ message: 'Error', data: err })
            if (!userAccount) {
                return res.status(500).json({ message: "Could not find userAccount.", data: req.params.id })
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