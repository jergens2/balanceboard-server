var ObjectId = require('mongoose').Types.ObjectId;
const RecurringTaskDefinition = require('../models/recurringTaskDefinition');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    RecurringTaskDefinition.find({ 'userId': ObjectId(userId) }, (err, RecurringTaskDefinitions) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding RecurringTaskDefinition object",
                data: err
            });
        }
        if (!RecurringTaskDefinitions) {
            return res.status(500).json({ message: "Could not find RecurringTaskDefinitions", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found RecurringTaskDefinitions", data: RecurringTaskDefinitions });
    })
}




exports.create = function (req, res, next) {
 
    const recurringTaskDefinition = new RecurringTaskDefinition({
        userId: req.body.userId,
        name: req.body.name,
        groupIds: req.body.groupIds,
        activityTreeId: req.body.activityTreeId,
        repititions: req.body.repititions,
    });

    recurringTaskDefinition.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating RecurringTaskDefinition object', data: err });
        } else {
            return res.status(200).json({
                message: 'RecurringTaskDefinition object saved',
                data: recurringTaskDefinition
            });

        }
    });
};
exports.delete = function (req, res, next) {
    RecurringTaskDefinition.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting RecurringTaskDefinition object', data: null });
        return res.status(200).json({ message: "Successfully deleted RecurringTaskDefinition object", data: null });
    });
};
exports.update = function (req, res, next) {

    const updateRecurringTaskDefinition = new RecurringTaskDefinition({
        _id: req.body.id,
        userId: req.body.userId,
        name: req.body.name,
        groupIds: req.body.groupIds,
        activityTreeId: req.body.activityTreeId,
        repititions: req.body.repititions,
    });

    RecurringTaskDefinition.findByIdAndUpdate(req.body.id, updateRecurringTaskDefinition, { new: true }, (err, updatedDefinition) => {

        if (err) return res.status(500).json({ message: 'DB error updating RecurringTaskDefinition object', data: err });
        if (!updatedDefinition) return res.status(500).json({ message: "Error updating RecurringTaskDefinition object", data: req.body.id });

        console.log("updated task: ", updatedDefinition);
        return res.status(200).json({ message: "Successfully update RecurringTaskDefinition object", data: updatedDefinition });
    });
};
