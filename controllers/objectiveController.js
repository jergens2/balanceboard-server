var ObjectId = require('mongoose').Types.ObjectId;
const Objective = require('../models/objective');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    Objective.find({ 'userId': ObjectId(userId) }, (err, objectives) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding Objective object",
                data: err
            });
        }
        if (!objectives) {
            return res.status(500).json({ message: "Could not find Objectives", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found Objectives", data: objectives });
    })
}

exports.getById = function( req, res, next) { 
    const userId = req.params.userId;
    const objectiveId = req.params.objectiveId;
    Objective.findOne({ 'userId': ObjectId(userId), 'objectiveId': ObjectId(objectiveId) }, (err, objective) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding Objective object",
                data: err
            });
        }
        if (!objective) {
            return res.status(500).json({ message: "Could not find Objectives", data: objectiveId });
        }
        return res.status(200).json({ message: "Successfully found Objectives", data: objective });
    })
}


exports.create = function (req, res, next) {

    const objective = new Objective({
        userId: req.body.userId,
        description: req.body.description,
        startDateISO: req.body.startDateISO,
        dueDateISO: req.body.dueDateISO

    });


    objective.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating Objective object', data: err });
        } else {
            return res.status(200).json({
                message: 'Objective object saved',
                data: objective
            });

        }
    });
};
exports.delete = function (req, res, next) {
    Objective.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting Objective object', data: null });
        return res.status(200).json({ message: "Successfully deleted Objective object", data: null });
    });
};
exports.update = function (req, res, next) {

    const objective = new Objective({
        _id: req.body.id,
        userId: req.body.userId,
        description: req.body.description,
        startDateISO: req.body.startDateISO,
        dueDateISO: req.body.dueDateISO

    });



    Objective.findByIdAndUpdate(req.body.id, updatedObjective, { new: true }, (err, objective) => {

        if (err) return res.status(500).json({ message: 'DB error updating Objective object', data: err });
        if (!objective) return res.status(500).json({ message: "Error updating Objective object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update Objective object", data: objective });
    });
};
