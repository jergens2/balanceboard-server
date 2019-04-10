var ObjectId = require('mongoose').Types.ObjectId;
const ScheduleRotation = require('../models/scheduleRotation');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    ScheduleRotation.find({ 'userId': ObjectId(userId) }, (err, scheduleRotations) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding ScheduleRotation object",
                data: err
            });
        }
        if (!scheduleRotations) {
            return res.status(500).json({ message: "Could not find ScheduleRotations", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found ScheduleRotations", data: scheduleRotations });
    })
}


exports.create = function (req, res, next) {

    const scheduleRotation = new ScheduleRotation({
        userId: req.body.userId,
        dayTemplateItems: req.body.dayTemplateItems,
        startTimeISO: req.body.startTimeISO
    });


    scheduleRotation.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating ScheduleRotation object', data: err });
        } else {
            return res.status(200).json({
                message: 'ScheduleRotation object saved',
                data: scheduleRotation
            });

        }
    });
};
exports.delete = function (req, res, next) {
    ScheduleRotation.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting ScheduleRotation object', data: null });
        return res.status(200).json({ message: "Successfully deleted ScheduleRotation object", data: null });
    });
};
exports.save = function (req, res, next) {

};
