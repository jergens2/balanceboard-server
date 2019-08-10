var ObjectId = require('mongoose').Types.ObjectId;
const ScheduleDayTemplate = require('../models/scheduleDayTemplate');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    ScheduleDayTemplate.find({ 'userId': ObjectId(userId) }, (err, scheduleDayTemplates) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding ScheduleDayTemplate object",
                data: err
            });
        }
        if (!scheduleDayTemplates) {
            return res.status(500).json({ message: "Could not find ScheduleDayTemplates", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found ScheduleDayTemplates", data: scheduleDayTemplates });
    })
}


exports.create = function (req, res, next) {

    const scheduleDayTemplate = new ScheduleDayTemplate({
        userId: req.body.userId,
        name: req.body.name,
        color: req.body.color,
        delineations: req.body.delineations,
    });

    console.log("Thing is: " , scheduleDayTemplate)
    scheduleDayTemplate.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating ScheduleDayTemplate object', data: err });
        } else {
            return res.status(200).json({
                message: 'ScheduleDayTemplate object saved',
                data: scheduleDayTemplate
            });

        }
    });
};
exports.delete = function (req, res, next) {
    ScheduleDayTemplate.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting ScheduleDayTemplate object', data: null });
        return res.status(200).json({ message: "Successfully deleted ScheduleDayTemplate object", data: null });
    });
};
exports.update = function (req, res, next) {
    const updatedScheduleDayTemplate = new ScheduleDayTemplate({
        _id: req.body.id,
        userId: req.body.userId,

        name: req.body.name,
        color: req.body.color,
        delineations: req.body.delineations,
    });


    ScheduleDayTemplate.findByIdAndUpdate(req.body.id, updatedScheduleDayTemplate, { new: true }, (err, scheduleDayTemplate) => {

        if (err) return res.status(500).json({ message: 'DB error updating ScheduleDayTemplate object', data: err });
        if (!scheduleDayTemplate) return res.status(500).json({ message: "Error updating ScheduleDayTemplate object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update ScheduleDayTemplate object", data: scheduleDayTemplate });
    });
};
