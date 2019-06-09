var ObjectId = require('mongoose').Types.ObjectId;
const ActivityDayData = require('../models/activityDayData');


var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    ActivityDayData.find({ 'userId': ObjectId(userId) }, (err, activityDayData) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding ActivityDayData object",
                data: err
            });
        }
        if (!activityDayData) {
            return res.status(500).json({ message: "Could not find activityDayData", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found activityDayData", data: activityDayData });
    })
}

// exports.getByDate = function (req, res, next) {
//     const userId = req.params.userId;
//     const date = req.params.date
//     ActivityDayData.findOne({ 'userId': ObjectId(userId), 'dateYYYYMMDD': date }, (err, activityDayData) => {
//         if (err) {
//             return res.status(500).json({
//                 message: "DB Error finding ActivityDayData object",
//                 data: err
//             });
//         }
//         if (!activityDayData) {
//             return res.status(404).json({ message: "Could not find ActivityDayData", data: req.params.id });
//         }
//         return res.status(200).json({ message: "Successfully found ActivityDayData", data: activityDayData });



        
//     })
// }


exports.create = function (req, res, next) {
    // console.log("Creating ActivityDayData object");
    const newActivityDayData = new ActivityDayData({
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        activityDataItems: req.body.activityDataItems,
    });


    newActivityDayData.save((err) => {
        if (err) {
            console.log("ERROR", err)
            return res.status(500).json({ message: 'DB Error creating ActivityDayData object', data: err });
        } else {
            return res.status(200).json({
                message: 'ActivityDayData object saved',
                data: newActivityDayData
            });

        }
    });
};
exports.delete = function (req, res, next) {
    ActivityDayData.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting ActivityDayData object', data: null });
        return res.status(200).json({ message: "Successfully deleted ActivityDayData object", data: null });
    });
};
exports.update = function (req, res, next) {
    // console.log("Updating".yellow, req.body);
    const updatedDay = new ActivityDayData({
        _id: req.body.id,
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        activityDataItems: req.body.activityDataItems,
    });
    ActivityDayData.findByIdAndUpdate(req.body.id, updatedDay, { new: true }, (err, ActivityDayData) => {

        if (err) return res.status(500).json({ message: 'DB error updating ActivityDayData object', data: err });
        if (!ActivityDayData) return res.status(500).json({ message: "Error updating ActivityDayData object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update ActivityDayData object", data: ActivityDayData });
    });
};
