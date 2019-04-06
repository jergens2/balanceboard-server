var ObjectId = require('mongoose').Types.ObjectId;
const DayTemplate = require('../models/dayTemplate');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    DayTemplate.find({ 'userId': ObjectId(userId) }, (err, dayTemplates) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DayTemplate object",
                data: err
            });
        }
        if (!dayTemplates) {
            return res.status(500).json({ message: "Could not find DayTemplates", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found DayTemplates", data: dayTemplates });
    })
}


exports.create = function (req, res, next) {

    const dayTemplate = new DayTemplate({
        userId: req.body.userId,

        name: req.body.name,
        color: req.body.color,
        sleepTimeRanges: req.body.sleepTimeRanges,
        nonDiscretionaryTimeRanges: req.body.nonDiscretionaryTimeRanges,
        discretionaryTimeRanges: req.body.discretionaryTimeRanges,
    });


    dayTemplate.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating DayTemplate object', data: err });
        } else {
            return res.status(200).json({
                message: 'DayTemplate object saved',
                data: dayTemplate
            });

        }
    });
};
exports.delete = function (req, res, next) {
    DayTemplate.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting DayTemplate object', data: null });
        return res.status(200).json({ message: "Successfully deleted DayTemplate object", data: null });
    });
};
exports.update = function (req, res, next) {
    /*
        When this method receives the updatedDayTemplate, the properties startTimeISO and endTimeISO actually are: _startTimeISO and _endTimeISO , with the underscores, from the front-end.
        so, we just make a new one and update the existing one by ID
    */

    const updatedDayTemplate = new DayTemplate({
        _id: req.body.id,
        userId: req.body.userId,

        name: req.body.name,
        color: req.body.color,
        sleepTimeRanges: req.body.sleepTimeRanges,
        nonDiscretionaryTimeRanges: req.body.nonDiscretionaryTimeRanges,
        discretionaryTimeRanges: req.body.discretionaryTimeRanges,
    });


    DayTemplate.findByIdAndUpdate(req.body.id, updatedDayTemplate, { new: true }, (err, dayTemplate) => {

        if (err) return res.status(500).json({ message: 'DB error updating DayTemplate object', data: err });
        if (!dayTemplate) return res.status(500).json({ message: "Error updating DayTemplate object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update DayTemplate object", data: dayTemplate });
    });
};
