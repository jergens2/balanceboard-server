
var ObjectId = require('mongoose').Types.ObjectId;
const SleepManagerProfile = require('../models/sleepProfile');


exports.create = function(req, res, next){
    const userId = req.body.userId;
    const previousWakeupTime = req.body.previousWakeupTime;
    const nextFallAsleepTime = req.body.nextFallAsleepTime;
    const nextWakeupTime = req.body.nextWakeupTime;
    const energyAtWakeup = req.body.energyAtWakeup;
    // const newProfile

}
exports.read = function(req, res, next){
    const documentId = req.body.id;
    SleepManagerProfile.findById(documentId, (err, profile)=>{
        if(err){
            res.status(500).json({
                message: "Error finding sleep profile",
                success: false,
                data: err,
            });
        }else{
            if(profile){
                res.status(200).json({
                    message: 'Successfully found profile',
                    success: true,
                    data: profile,
                })
            }else{
                res.status(200).json({
                    message: 'No profile exists',
                    success: false,
                    data: {},
                })
            }
        }
    });
}
exports.update = function(req, res, next){

}
exports.delete = function(req, res, next){

}
