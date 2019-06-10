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

exports.getByRange = function (req, res, next) {
    const userId = req.params.userId;
    const startDate = req.params.start;
    const endDate = req.params.end;
    ActivityDayData.find({
        'userId': ObjectId(userId),
        $and: [            
            { "dateYYYYMMDD": { $gte: startDate } },
            { "dateYYYYMMDD": { $lte: endDate } }
        ]
    }, (err, activityDayData) => {
        if (err) {
            return res.status(500).json({ message: 'DB error updating ActivityDayData object', data: err });
        }
        if (!activityDayData) {
            return res.status(500).json({ message: "Error finding ActivityDayData object", data: req.body });
        }else{
            return res.status(200).json({ message: "Successfully retrieved ActivityDayData", data: activityDayData });
        }   
    });    
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
    const updatedActivityDayData = new ActivityDayData({
        _id: req.body.id,
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        activityDataItems: req.body.activityDataItems,
    });
    ActivityDayData.findByIdAndUpdate(req.body.id, updatedActivityDayData, { new: true }, (err, activityDayData) => {

        if (err) return res.status(500).json({ message: 'DB error updating ActivityDayData object', data: err });
        if (!activityDayData) return res.status(500).json({ message: "Error updating ActivityDayData object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update ActivityDayData object", data: activityDayData });
    });
};
exports.updateByDate = function (req, res, next) {
    console.log("Updating by date".green)
    const newActivityDayData = new ActivityDayData({
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        activityDataItems: req.body.activityDataItems,
    });

    ActivityDayData.findOne(
        {
            "userId": newActivityDayData.userId,
            "dateYYYYMMDD": newActivityDayData.dateYYYYMMDD,
        }, (err, foundData) => {
            if (err) {
                console.log("Error finding activityDayData".yellow)
                return res.status(500).json({ message: 'Error finding activityDayData', data: err });
            }
            if (foundData) {
                const updateData = new ActivityDayData({
                    _id: foundData._id,
                    userId: foundData.userId,
                    dateYYYYMMDD: foundData.dateYYYYMMDD,
                    activityDataItems: foundData.activityDataItems,
                });
                console.log("Updating existing".green)
                foundData.updateOne(updateData, (err, updatedData)=>{
                    if (err) {
                        console.log("Error updating existing".yellow)
                        return res.status(500).json({ message: 'Error updating this activityDayData', data: updateData.dateYYYYMMDD });
                    }
                    if (!updatedData) return res.status(500).json({ message: "Error updating ActivityDayData object", data: updateData.dateYYYYMMDD });
                    return res.status(200).json({ message: "Successfully update ActivityDayData object", data: updatedData });
                })
            }
            if (!foundData) {
                console.log("Creating a new one");
                newActivityDayData.save((err, savedDayData)=>{
                    if (err) {
                        console.log("Error creating new".yellow)
                        return res.status(500).json({ message: 'Error Saving new activityDayData', data: newActivityDayData.dateYYYYMMDD });
                    }
                    if (!savedDayData) return res.status(500).json({ message: "??", data: newActivityDayData.dateYYYYMMDD });
                    return res.status(200).json({ message: "Successfully update ActivityDayData object", data: savedDayData });
                })
            }
        });


    // ActivityDayData.findOneAndUpdate({"userId":}, updatedDay, { new: true }, (err, ActivityDayData) => {

    //     if (err) return res.status(500).json({ message: 'DB error updating ActivityDayData object', data: err });
    //     if (!ActivityDayData) return res.status(500).json({ message: "Error updating ActivityDayData object", data: req.body.id });

    //     return res.status(200).json({ message: "Successfully update ActivityDayData object", data: ActivityDayData });
    // });
};
