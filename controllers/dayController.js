var ObjectId = require('mongoose').Types.ObjectId;
const Day = require('../models/day');
const Objective = require('../models/objective');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    Day.find({ 'userId': ObjectId(userId) }, (err, days) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding Day object",
                data: err
            });
        }
        if (!days) {
            return res.status(500).json({ message: "Could not find Days", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found Days", data: days });
    })
}

exports.getByDate = function (req, res, next) {
    const userId = req.params.userId;
    const date = req.params.date
    Day.findOne({ 'userId': ObjectId(userId), 'dateYYYYMMDD': date }, (err, day) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding Day object",
                data: err
            });
        }
        if (!day) {
            return res.status(404).json({ message: "Could not find Day", data: req.params.id });
        }

        Objective.findById(day.primaryObjectiveId, (err, objective) => {
            if (err) {
                return res.status(500).json({
                    message: "DB Error finding Objective from Day",
                    data: err
                });
            }
            if(!objective){
                return res.status(200).json({ message: "Found day but not primary objective", data: {day: day, objective: null} });
            }else{
                return res.status(200).json({ message: "Successfully found Day", data: {day:day, objective:objective} });
            }
        })

        
    })
}


exports.create = function (req, res, next) {

    const day = new Day({

        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        primaryObjectiveId: req.body.primaryObjectiveId

    });


    day.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating Day object', data: err });
        } else {
            return res.status(200).json({
                message: 'Day object saved',
                data: day
            });

        }
    });
};
exports.delete = function (req, res, next) {
    Day.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting Day object', data: null });
        return res.status(200).json({ message: "Successfully deleted Day object", data: null });
    });
};
exports.update = function (req, res, next) {
    const updatedDay = new Day({
        _id: req.body.id,
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        primaryObjectiveId: req.body.primaryObjectiveId
    });


    Day.findByIdAndUpdate(req.body.id, updatedDay, { new: true }, (err, day) => {

        if (err) return res.status(500).json({ message: 'DB error updating Day object', data: err });
        if (!day) return res.status(500).json({ message: "Error updating Day object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update Day object", data: day });
    });
};
