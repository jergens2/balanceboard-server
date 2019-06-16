var ObjectId = require('mongoose').Types.ObjectId;
const UserAccount = require('../models/userAccount');

var moment = require('moment');




exports.save = function (req, res, next) {

    console.log("request: ", req.body);
    let newSettings = Object.assign([], req.body.userSettings);

    UserAccount.findById(req.body.id).exec(function(err, userAccount){

        userAccount.userSettings = newSettings;

        userAccount.save(function(err, userAccount){
            if (err) return res.status(500).json({ message: 'Error saving userAccount settings', data: err});
            return res.status(200).json({
                message: "UserAccount settings have been saved.",
                data: userAccount,
            })
        })
    })



};