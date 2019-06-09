var ObjectId = require('mongoose').Types.ObjectId;
const DailyTaskList = require('../models/dailyTaskList');


var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    DailyTaskList.find({ 'userId': ObjectId(userId) }, (err, dailyTaskList) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DailyTaskList object",
                data: err
            });
        }
        if (!dailyTaskList) {
            return res.status(500).json({ message: "Could not find dailyTaskList", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found dailyTaskList", data: dailyTaskList });
    })
}

exports.getByDate = function (req, res, next) {
    const userId = req.params.userId;
    const date = req.params.date
    DailyTaskList.findOne({ 'userId': ObjectId(userId), 'dateYYYYMMDD': date }, (err, dailyTaskList) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DailyTaskList object",
                data: err
            });
        }
        if (!dailyTaskList) {
            return res.status(404).json({ message: "Could not find DailyTaskList", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found DailyTaskList", data: dailyTaskList });    
    })
}

exports.getByRange = function (req, res, next) {
    const userId = req.params.userId;
    const startDate = req.params.start;
    const endDate = req.params.end;
    DailyTaskList.find({ 'userId': ObjectId(userId), $and:[ {'dateYYYYMMDD': {$gte: startDate }}, {'dateYYYYMMDD': {$lte: endDate }},  ], }, (err, dailyTaskList) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DailyTaskList object",
                data: err
            });
        }
        if (!dailyTaskList) {
            return res.status(404).json({ message: "Could not find DailyTaskList", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found DailyTaskList", data: dailyTaskList });



        
    })
}



exports.create = function (req, res, next) {
    // console.log("Creating DailyTaskList object");
    const newDailyTaskList = new DailyTaskList({
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        taskListItems: req.body.taskListItems,
    });


    newDailyTaskList.save((err) => {
        if (err) {
            console.log("ERROR", err)
            return res.status(500).json({ message: 'DB Error creating DailyTaskList object', data: err });
        } else {
            return res.status(200).json({
                message: 'DailyTaskList object saved',
                data: newDailyTaskList
            });

        }
    });
};
exports.delete = function (req, res, next) {
    DailyTaskList.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting DailyTaskList object', data: null });
        return res.status(200).json({ message: "Successfully deleted DailyTaskList object", data: null });
    });
};
exports.update = function (req, res, next) {
    // console.log("Updating".yellow, req.body);
    const updatedDay = new DailyTaskList({
        _id: req.body.id,
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        taskListItems: req.body.taskListItems,
    });
    DailyTaskList.findByIdAndUpdate(req.body.id, updatedDay, { new: true }, (err, DailyTaskList) => {

        if (err) return res.status(500).json({ message: 'DB error updating DailyTaskList object', data: err });
        if (!DailyTaskList) return res.status(500).json({ message: "Error updating DailyTaskList object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update DailyTaskList object", data: DailyTaskList });
    });
};
