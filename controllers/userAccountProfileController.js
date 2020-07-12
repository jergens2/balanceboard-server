var ObjectId = require('mongoose').Types.ObjectId;
const UserAccountProfile = require('../models/userAccountProfile');

var moment = require('moment');




exports.save = function (req, res, next) {
    // console.log("Saving changes: ", req.body)

    const idVal = req.body.id;
    
    const userProfile = req.body.userProfile;
    // userId: { type: String, required: true, unique: true },
    // userProfile: { type: Schema.Types.Mixed, required: true },
    if (!idVal) {
        const updateItem = new UserAccountProfile({
            userId: req.body.userId,
            userProfile: req.body.userProfile
        });
        updateItem.save((err, savedItem) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to save new item', data: err, success: false });
            } else {
                return res.status(200).json({ message: 'Successfully saved new item', data: savedItem, success: true });
            }
        })
    } else {
        const id = new ObjectId(idVal);
        UserAccountProfile.findById(id, (err, foundItem) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to find item', data: err, success: false });
            } else {
                if (foundItem) {
                    foundItem.userProfile = userProfile;
                    foundItem.save((err, savedItem) => {
                        if (err) {
                            return res.status(500).json({ message: 'Failed to save new item', data: err, success: false });
                        } else {
                            if (savedItem) {
                                return res.status(200).json({ message: 'Successfully saved new item', data: savedItem, success: true });
                            } else {
                                return res.status(500).json({ message: 'Failed to save new item', data: err, success: false });
                            }
                        }
                    });
                } else {
                    return res.status(500).json({ message: 'Failed to find item', data: {}, success: false });
                }
            }
        });
    }





};

exports.get = function (req, res, next) {
    // console.log("GETTING: ", req.body)
    const userId = req.body.userId;
    UserAccountProfile.findOne({ "userId": userId }, (err, userAccountProfile) => {
        if (err) return res.status(500).json({ message: 'Error saving userAccount settings', data: err, success: false });
        else {
            if (userAccountProfile) {
                return res.status(200).json({
                    message: "Successfully found document",
                    data: userAccountProfile,
                    success: true,
                });
            } else {
                return res.status(200).json({
                    message: "No document found",
                    data: null,
                    success: false
                });
            }
        }

    });

}