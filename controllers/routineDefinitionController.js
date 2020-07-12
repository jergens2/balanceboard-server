var ObjectId = require('mongoose').Types.ObjectId;
const RoutineDefinition = require('../models/routineDefinition');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    // console.log("Finding RTDefinitions by userID", userId);
    RoutineDefinition.find({ 'userId': ObjectId(userId) }, (err, routineDefinitions) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding RoutineDefinition object",
                data: err
            });
        }
        if (!routineDefinitions) {
            return res.status(500).json({ message: "Could not find RoutineDefinitions", data: req.params.userId });
        }
        return res.status(200).json({ message: "Successfully found RoutineDefinitions", data: routineDefinitions });
    })
}




exports.create = function (req, res, next) {
 
    const routineDefinition = new RoutineDefinition({
        userId: req.body.userId,
        routineTreeId: req.body.routineTreeId,
        name: req.body.name,
        frequency: req.body.frequency,
        timeOfDay: req.body.timeOfDay,
        timeOfDayRanges: req.body.timeOfDayRanges,
        activityIds: req.body.activityIds,
        childOfRoutineId: req.body.childOfRoutineId,
    });

    routineDefinition.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating RoutineDefinition object', data: err });
        } else {
            return res.status(200).json({
                message: 'RoutineDefinition object saved',
                data: routineDefinition
            });

        }
    });
};
exports.delete = function (req, res, next) {
    RoutineDefinition.findByIdAndDelete({ '_id': new ObjectId(req.body._id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting RoutineDefinition object', data: null });
        return res.status(200).json({ message: "Successfully deleted RoutineDefinition object", data: null });
    });
};
exports.update = function (req, res, next) {

    const routineDefinition = new RoutineDefinition({
        _id: req.body._id,
        userId: req.body.userId,
        routineTreeId: req.body.routineTreeId,
        name: req.body.name,
        frequency: req.body.frequency,
        timeOfDay: req.body.timeOfDay,
        timeOfDayRanges: req.body.timeOfDayRanges,
        activityIds: req.body.activityIds,
        childOfRoutineId: req.body.childOfRoutineId,
    });

    RoutineDefinition.findByIdAndUpdate(req.body._id, updateRoutineDefinition, { new: true }, (err, updatedDefinition) => {

        if (err) return res.status(500).json({ message: 'DB error updating RoutineDefinition object', data: err });
        if (!updatedDefinition) return res.status(500).json({ message: "Error updating RoutineDefinition object", data: req.body._id });

        // console.log("updated task: ", updatedDefinition);
        return res.status(200).json({ message: "Successfully update RoutineDefinition object", data: updatedDefinition });
    });
};
