var ObjectId = require('mongoose').Types.ObjectId;
const DayScheduleTemplate = require('../models/dayScheduleTemplate');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    DayScheduleTemplate.find({ 'userId': ObjectId(userId) }, (err, dayScheduleTemplates) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DayScheduleTemplate object",
                data: err
            });
        }
        if (!dayScheduleTemplates) {
            return res.status(500).json({ message: "Could not find DayScheduleTemplates", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found DayScheduleTemplates", data: dayScheduleTemplates });
    })
}


exports.create = function (req, res, next) {

    const dayScheduleTemplate = new DayScheduleTemplate({
        userId: req.body.userId,
        name: req.body.name,
        color: req.body.color,
        delineations: req.body.delineations,
    });

    console.log("Thing is: " , dayScheduleTemplate)
    dayScheduleTemplate.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating DayScheduleTemplate object', data: err });
        } else {
            return res.status(200).json({
                message: 'DayScheduleTemplate object saved',
                data: dayScheduleTemplate
            });

        }
    });
};
exports.delete = function (req, res, next) {
    DayScheduleTemplate.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting DayScheduleTemplate object', data: null });
        return res.status(200).json({ message: "Successfully deleted DayScheduleTemplate object", data: null });
    });
};
exports.update = function (req, res, next) {
    const updatedDayScheduleTemplate = new DayScheduleTemplate({
        _id: req.body.id,
        userId: req.body.userId,

        name: req.body.name,
        color: req.body.color,
        delineations: req.body.delineations,
    });


    DayScheduleTemplate.findByIdAndUpdate(req.body.id, updatedDayScheduleTemplate, { new: true }, (err, dayScheduleTemplate) => {

        if (err) return res.status(500).json({ message: 'DB error updating DayScheduleTemplate object', data: err });
        if (!dayScheduleTemplate) return res.status(500).json({ message: "Error updating DayScheduleTemplate object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update DayScheduleTemplate object", data: dayScheduleTemplate });
    });
};
