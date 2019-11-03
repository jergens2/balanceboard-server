
var ObjectId = require('mongoose').Types.ObjectId;
const ActivityCategoryDefinition = require('../models/activityCategoryDefinitionOld');


exports.createDefault = function (req, res, next) {
    console.log("do nothing")
}

exports.create = function (req, res, next) {
    console.log("do nothing")
};
exports.delete = function (req, res, next) {
    ActivityCategoryDefinition.findByIdAndRemove({ '_id': new ObjectId(req.body.id) }, (err, document) => {
        if (err) return res.status(500).json({ message: 'DB error deleting ActivityCategoryDefinition object', status: "ERROR", data: err });
        if (document) {
            return res.status(200).json({ message: "ActivityCategoryDefinition object successfully deleted", status: "SUCCESS", data: req.body.id });
        } else {
            return res.status(200).json({ message: "no document", status: "NO_DOC", data: req.body.id });
        }

    });
};

exports.update = function (req, res, next) {
    let updatedActivityCategoryDefinition = req.body;
    ActivityCategoryDefinition.findByIdAndUpdate({ '_id': new ObjectId(updatedActivityCategoryDefinition._id) }, updatedActivityCategoryDefinition, { new: true }, (err, document) => {
        if (err) return res.status(500).json({ message: 'DB error updating ActivityCategoryDefinition object', data: err });
        else {
            if (!document) {
                return res.status(500).json({ message: "Error updating ActivityCategoryDefinition object", data: req.parms.id });
            } else {
                return res.status(201).json({ message: "Successfully updated", data: document });
            }
        }
    });
};
exports.getByUserId = function (req, res, next) {

    ActivityCategoryDefinition.find({ 'userId': ObjectId(req.params.userId) }, (err, activities) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding ActivityCategoryDefinition object",
                data: err
            });
        }
        if (!activities) {
            return res.status(500).json({ message: "Could not find Activities", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found Activities", data: activities });
    })
};
