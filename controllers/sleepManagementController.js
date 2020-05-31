
var ObjectId = require('mongoose').Types.ObjectId;
const SleepManagerProfile = require('../models/sleepProfile');


exports.update = function (req, res, next) {

    const userId = req.body.userId;
    const previousFallAsleepTime = req.body.previousFallAsleepTime;
    const previousFallAsleepUTCOffset = req.body.previousFallAsleepUTCOffset;
    const previousWakeupTime = req.body.previousWakeupTime;
    const previousWakeupUTCOffset = req.body.previousWakeupUTCOffset;
    const nextFallAsleepTime = req.body.nextFallAsleepTime;
    const nextFallAsleepUTCOffset = req.body.nextFallAsleepUTCOffset;
    const nextWakeupTime = req.body.nextWakeupTime;
    const nextWakeupUTCOffset = req.body.nextWakeupUTCOffset;
    const energyAtWakeup = req.body.energyAtWakeup;

    const newProfile = new SleepManagerProfile({
        userId: userId,
        previousFallAsleepTime: previousFallAsleepTime,
        previousFallAsleepUTCOffset: previousFallAsleepUTCOffset,
        previousWakeupTime: previousWakeupTime,
        previousWakeupUTCOffset: previousWakeupUTCOffset,
        energyAtWakeup: energyAtWakeup,
        nextFallAsleepTime: nextFallAsleepTime,
        nextFallAsleepUTCOffset: nextFallAsleepUTCOffset,
        nextWakeupTime: nextWakeupTime,
        nextWakeupUTCOffset: nextWakeupUTCOffset,
    });

    console.log("Updating sleep profile", newProfile);

    SleepManagerProfile.findOne({ 'userId': userId }, (err, foundProfile)=>{
        if (err) {
            res.status(500).json({
                message: "server error",
                success: false,
                data: err,
            });
        } else {
            if(foundProfile){
                const id = foundProfile._id;
                newProfile._id = id;
                newProfile.update(newProfile, (err, updatedProfile)=>{
                    if (err) {
                        res.status(500).json({
                            message: "Error updating sleep profile",
                            success: false,
                            data: err,
                        });
                    } else {
                        if (updatedProfile) {
                            res.status(200).json({
                                message: 'Successfully updated profile',
                                success: true,
                                data: updatedProfile,
                            })
                        } else {
                            
                            res.status(500).json({
                                message: "Error updating sleep profile",
                                success: false,
                                data: err,
                            });
                        }
                    }
                })
            }else{
                newProfile.save({}, (err, savedDoc) => {
                    if (err) {
                        console.log("Error saving: " , err)
                        res.status(500).json({
                            message: "Error saving new sleep profile",
                            success: false,
                            data: err,
                        });
                    } else {
                        if (savedDoc) {
                            res.status(200).json({
                                message: 'Successfully updated profile',
                                success: true,
                                data: savedDoc,
                            });
                        } else {
                            res.status(500).json({
                                message: 'No item saved?',
                                success: false,
                                data: {},
                            });
                        }
                    }
                });
            }
            

        }
    })
}
exports.read = function (req, res, next) {
    console.log(req.body)
    const userId = req.body.userId;
    console.log("finding a profile by usrid", userId)
    SleepManagerProfile.findOne({'userId': userId}, (err, profile) => {
        if (err) {
            res.status(500).json({
                message: "Error finding sleep profile",
                success: false,
                data: err,
            });
        } else {
            if (profile) {
                res.status(200).json({
                    message: 'Successfully found profile',
                    success: true,
                    data: profile,
                })
            } else {
                res.status(200).json({
                    message: 'No profile exists',
                    success: false,
                    data: {},
                })
            }
        }
    });
}

exports.delete = function (req, res, next) {

}
