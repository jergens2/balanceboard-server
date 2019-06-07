var ObjectId = require('mongoose').Types.ObjectId;
const DayData = require('../models/dayData');


var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    DayData.find({ 'userId': ObjectId(userId) }, (err, dayData) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DayData object",
                data: err
            });
        }
        if (!dayData) {
            return res.status(500).json({ message: "Could not find dayData", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found dayData", data: dayData });
    })
}

exports.getByDate = function (req, res, next) {
    const userId = req.params.userId;
    const date = req.params.date
    DayData.findOne({ 'userId': ObjectId(userId), 'dateYYYYMMDD': date }, (err, dayData) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DayData object",
                data: err
            });
        }
        if (!dayData) {
            return res.status(404).json({ message: "Could not find DayData", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found DayData", data: dayData });



        
    })
}


exports.getByRange = function (req, res, next) {
    const userId = req.params.userId;
    const startDate = req.params.start;
    const endDate = req.params.end;
    DayData.find({ 'userId': ObjectId(userId), $and:[ {'dateYYYYMMDD': {$gte: startDate }}, {'dateYYYYMMDD': {$lte: endDate }},  ], }, (err, dayData) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DayData object",
                data: err
            });
        }
        if (!dayData) {
            return res.status(404).json({ message: "Could not find dayData", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found dayData", data: dayData });



        
    })
}



exports.create = function (req, res, next) {
    console.log("Creating DayData object");
    const newDayData = new DayData({

        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        activityData: req.body.activityData,
        dailyTaskListItems: req.body.dailyTaskListItems,
        taskData: req.body.taskData,
        timelogEntryData: req.body.timelogEntryData

    });


    newDayData.save((err) => {
        if (err) {
            console.log("ERROR", err)
            return res.status(500).json({ message: 'DB Error creating DayData object', data: err });
        } else {
            return res.status(200).json({
                message: 'DayData object saved',
                data: newDayData
            });

        }
    });
};
exports.delete = function (req, res, next) {
    DayData.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting DayData object', data: null });
        return res.status(200).json({ message: "Successfully deleted DayData object", data: null });
    });
};
exports.update = function (req, res, next) {
    console.log("Updating".yellow, req.body);
    const updatedDay = new DayData({
        _id: req.body.id,
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        activityData: req.body.activityData,
        dailyTaskListItems: req.body.dailyTaskListItems,
        taskData: req.body.taskData,
        timelogEntryData: req.body.timelogEntryData
    });


    DayData.findByIdAndUpdate(req.body.id, updatedDay, { new: true }, (err, DayData) => {

        if (err) return res.status(500).json({ message: 'DB error updating DayData object', data: err });
        if (!DayData) return res.status(500).json({ message: "Error updating DayData object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update DayData object", data: DayData });
    });
};
