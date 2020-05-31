const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserAccount = require('../models/userAccount');
const fs = require("fs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const moment = require("moment");
const expressJwt = require("express-jwt");

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

    const message = {
        from: '"Balanceboard Registration" <registration@balanceboardapp.com>', // sender address
        to: email, // list of receivers
        subject: subjectLine, // Subject line
        text: textBody, // plain text body
        html: htmlBody, // html body
        // dsn: {
        //     id: uuid.v4(),
        //     return: 'full',
        //     notify: ['success', 'failure', 'delay'],
        //     recipient: 'registration@balanceboardapp.com'
        // }
    }

    let send = transporter.sendMail(message, (err, info) => {
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
                                registeredAt: "",
                            });
                            userAccount.save()
                                .then(result => {
                                    res.status(201).json({
                                        message: "UserAccount created",
                                        data: result
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({ mesage: "Issue saving user account document", data: err });
                                })
                        })
                        .catch(err => {
                            res.status(500).json({ mesage: "Issue after hasing PIN", data: err });
                        });
                })
                .catch(err => {
                    res.status(500).json({ mesage: "Issue after hashing password", data: err });
                });
        }
    })
};

exports.finalizeRegistration = function (req, res, next) {
    const code = req.body.code;
    const email = req.body.email;
    console.log("Searching for thing by email: ", req.body)
    if (code) {
        UserAccount.findOne({ 'email': email, "registeredAt": "" }, (err, foundAccount) => {
            if (err) {
                return res.status(500).json({ message: 'Error finding user account ', err });
            } else {
                if (foundAccount) {
                    console.log("Found account: " + foundAccount.registrationCode, foundAccount)
                    if (foundAccount.registrationCode === code) {
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
                        UserAccount.findByIdAndUpdate(foundAccount._id, newAccount, (err, updatedAccount) => {
                            if (err) {
                                return res.status(500).json({ message: 'Error finding user account ', err });
                            } else {
                                return res.status(200).json({ message: 'Successfully matched the registration codes!  Account is registered.', currentTime: currentTime, codeMatch: true });
                            }
                        })
                    } else {
                        return res.status(200).json({ message: 'Failed to match codes', currentTime: '', codeMatch: false });
                    }
                } else {
                    console.log("Error with something: ", foundAccount);
                    return res.status(500).json({ message: 'Error finding user account ', err });
                }
            }
        })
    } else {
        return res.status(500).json("Error with provided code");
    }
}
exports.resendCode = function (req, res, next) {
    const email = req.body.email.toLowerCase();
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

    const message = {
        from: '"Balanceboard Registration" <registration@balanceboardapp.com>', // sender address
        to: email, // list of receivers
        subject: subjectLine, // Subject line
        text: textBody, // plain text body
        html: htmlBody, // html body
        // dsn: {
        //     id: uuid.v4(),
        //     return: 'full',
        //     notify: ['success', 'failure', 'delay'],
        //     recipient: 'registration@balanceboardapp.com'
        // }
    }

    let send = transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log("Err!, ".red, err)
            return res.status(500).json({
                message: "Error sending email",
                data: err
            });
        } else {
            UserAccount.findOne({ 'email': email }, (err, existingAccount) => {
                if (err) {
                    res.status(500).json({
                        message: "Error finding account",
                        data: err
                    });
                } else {
                    if (existingAccount) {
                        const existingId = existingAccount._id
                        const newAccount = new UserAccount({
                            email: email,
                            username: existingAccount.username,
                            usernameStylized: existingAccount.usernameStylized,
                            password: existingAccount.hashedPassword,
                            pin: existingAccount.hashedPin,
                            registrationCode: code,
                            registeredAt: '',
                            _id: existingId,
                        });
                        UserAccount.findByIdAndUpdate(existingId, newAccount, { new: true }, (err, updatedAccount) => {
                            if (err) {
                                res.status(500).json({
                                    message: "Error updating account code",
                                    data: err
                                });
                            } else {
                                if (updatedAccount) {
                                    res.status(200).json({
                                        message: "Successfully updated code",
                                        data: email,
                                    });
                                } else {
                                    res.status(500).json({
                                        message: "Error updating account code",
                                        data: err
                                    });
                                }
                            }
                        })
                    } else {
                        res.status(500).json({
                            message: "Error, no existing account",
                            data: err
                        });
                    }
                }
            })
        }
    })
}

exports.pinUnlock = function (req, res, next) {
    const pin = req.body.pin;
    const email = req.body.email;
    var foundUser = null;
    console.log("Pin unlock:  ", req.body)
    UserAccount.findOne({ "email": email })
        .then((userAccount) => {
            if (!userAccount) {
                console.log("Error: no account found - " + email);
                return res.status(500).json({
                    message: "Error: no account by email: " + email,
                    success: false,
                    data: {},
                });
            } else {
                foundUser = userAccount;
                return bcrypt.compare(pin, userAccount.pin);
            }
        })
        .then((result) => {
            if (!result) {
                console.log("Authentication failed.  Bad pin.");
                res.status(401).json({
                    message: "Authentication failed.  Bad pin.",
                    success: false,
                    data: {},
                })
            } else {
                console.log("Successful Pin authentication...")
                const expiresInSeconds = 90;
                const token = jwt.sign(
                    {
                        email: foundUser.email,
                        username: foundUser.usernameStylized,
                        userId: foundUser._id
                    },
                    {
                        key: RSA_PRIVATE_KEY,
                        passphrase: passphrase
                    },
                    {
                        algorithm: 'RS256',
                        expiresIn: expiresInSeconds,
                    },
                );
                res.status(200).json({
                    message: "Authentication successful.",
                    success: true,
                    data: {
                        id: foundUser._id,
                        username: foundUser.usernameStylized,
                        email: foundUser.email,
                        token: token,
                        expiresIn: expiresInSeconds,
                    }
                });
            }
        })
        .catch((err) => {
            console.log("Error".red, err)
            res.status(500).json({
                message: "Authentication failed.  Server error",
                success: false,
                data: {},
            })
        })
}


exports.forgotPassword = function (req, res, next) {
    res.status(200).json({
        message: "cool.  not implemented",
        data: {}
    });
}


exports.refreshToken = function (req, res, next) {

    const userId = req.body.userId;
    UserAccount.findById(userId, (err, foundUser)=>{
        if(err){
            return res.status(500).json({
                message: "Error",
                data: err
            });
        }else{
            if(foundUser){
                const expiresInSeconds = 90;
                const newToken = jwt.sign(
                    {
                        email: foundUser.email,
                        username: foundUser.usernameStylized,
                        userId: foundUser._id
                    },
                    {
                        key: RSA_PRIVATE_KEY,
                        passphrase: passphrase
                    },
                    {
                        algorithm: 'RS256',
                        expiresIn: expiresInSeconds,
                    },
                );
                res.status(200).json({
                    message: "Fresh token",
                    success: true,
                    data: {
                        id: foundUser._id,
                        username: foundUser.usernameStylized,
                        email: foundUser.email,
                        token: newToken,
                        expiresIn: expiresInSeconds,
                    }
                });
    
            }else{
                return res.status(500).json({
                    message: "Error of some kind",
                    data: err
                });
            }
        }
    })


}

exports.attemptLogin = function (req, res, next) {
    var foundUser = null;
    const email = req.body.username.toLowerCase();
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    query = {
        $or:
            [
                { 'username': username },
                { 'email': email },
            ]
    };
    UserAccount.findOne(query)
        .then((userAccount) => {
            if (!userAccount) {
                res.status(401).json({
                    message: "Authorization failed.  Could not find an account with username: " + email,
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
            } else {
                const expiresInSeconds = 90;
                const token = jwt.sign(
                    {
                        email: foundUser.email,
                        username: foundUser.usernameStylized,
                        userId: foundUser._id
                    },
                    {
                        key: RSA_PRIVATE_KEY,
                        passphrase: passphrase
                    },
                    {
                        algorithm: 'RS256',
                        expiresIn: expiresInSeconds,
                    },
                );
                res.status(200).json({
                    message: "Authentication successful.",
                    success: true,
                    data: {
                        id: foundUser._id,
                        username: foundUser.usernameStylized,
                        email: foundUser.email,
                        token: token,
                        expiresIn: expiresInSeconds,
                    }
                })
            }


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
                        code: '',
                    });
                } else {
                    //account does exist
                    let usernameIsUnique = true;
                    let emailIsUnique = true;
                    if (email === account.email) {
                        emailIsUnique = false;
                    }
                    if (username === account.username) {
                        usernameIsUnique = false;
                    }



                    var accountIsRegistered = false;
                    if (account.registeredAt) {
                        if (account.registeredAt !== null && account.registeredAt !== "") {
                            accountIsRegistered = true;
                        }
                    }
                    if (accountIsRegistered) {
                        return res.status(200).json({
                            message: 'Credential already exists',
                            usernameIsUnique: usernameIsUnique,
                            emailIsUnique: emailIsUnique,
                            alreadyRegistered: true,
                            codeIsPresent: false,
                            registeredAt: account.registeredAt,
                        });
                    } else {
                        var codeIsPresent = false;
                        if (account.registrationCode) {
                            if (account.registrationCode !== null && account.registrationCode !== "") {
                                codeIsPresent = true;
                            }
                        }
                        return res.status(200).json({
                            message: 'Credential already exists',
                            usernameIsUnique: usernameIsUnique,
                            emailIsUnique: emailIsUnique,
                            alreadyRegistered: false,
                            codeIsPresent: codeIsPresent,
                            registeredAt: '',
                        });
                    }

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