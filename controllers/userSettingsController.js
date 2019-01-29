var ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');

var moment = require('moment');




exports.save = function (req, res, next) {

    console.log("request: ", req.body);
    let newSettings = Object.assign([], req.body.userSettings);

    User.findById(req.body.id).exec(function(err, user){

        user.userSettings = newSettings;

        user.save(function(err, user){
            if (err) return res.status(500).json({ message: 'Error saving user settings', data: err});
            return res.status(200).json({
                message: "User settings have been saved.",
                data: user,
            })
        })
    })



};