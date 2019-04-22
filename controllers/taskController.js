var ObjectId = require('mongoose').Types.ObjectId;
const Task = require('../models/task');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    Task.find({ 'userId': ObjectId(userId) }, (err, tasks) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding Task object",
                data: err
            });
        }
        if (!tasks) {
            return res.status(500).json({ message: "Could not find Tasks", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found Tasks", data: tasks });
    })
}

exports.getById = function( req, res, next) { 
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    Task.findOne({ 'userId': ObjectId(userId), 'taskId': ObjectId(taskId) }, (err, task) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding Task object",
                data: err
            });
        }
        if (!task) {
            return res.status(500).json({ message: "Could not find Tasks", data: taskId });
        }
        return res.status(200).json({ message: "Successfully found Tasks", data: task });
    })
}


exports.create = function (req, res, next) {

    const task = new Task({
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
        startDateISO: req.body.startDateISO,
        dueDateISO: req.body.dueDateISO,
        priority: req.body.priority

    });


    task.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating Task object', data: err });
        } else {
            return res.status(200).json({
                message: 'Task object saved',
                data: task
            });

        }
    });
};
exports.delete = function (req, res, next) {
    Task.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting Task object', data: null });
        return res.status(200).json({ message: "Successfully deleted Task object", data: null });
    });
};
exports.update = function (req, res, next) {
    console.log("updating task.  incoming request:", req.body );

    const updateTask = new Task({
        _id: req.body.id,
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
        startDateISO: req.body.startDateISO,
        dueDateISO: req.body.dueDateISO,
        completionDateISO: req.body.completionDateISO,
        isComplete: req.body.isComplete,
        priority: req.body.priority

    });



    Task.findByIdAndUpdate(req.body.id, updateTask, { new: true }, (err, task) => {

        if (err) return res.status(500).json({ message: 'DB error updating Task object', data: err });
        if (!task) return res.status(500).json({ message: "Error updating Task object", data: req.body.id });

        console.log("updated task: ", task);
        return res.status(200).json({ message: "Successfully update Task object", data: task });
    });
};
