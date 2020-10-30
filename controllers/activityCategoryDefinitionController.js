
var ObjectId = require('mongoose').Types.ObjectId;
const ActivityCategoryDefinition = require('../models/activityCategoryDefinition');


exports.createDefault = function (req, res, next) {
    //req.body is an array of CategorizedActivities

    let defaultActivities = req.body;
    let userId = "";

    function saveActivity(activities, userId) {
        var activity = activities.pop();
        activity.save((err, savedActivity) => {
            if (err) throw err;

            if (activities.length > 0) {
                saveActivity(activities, userId);
            } else {

                ActivityCategoryDefinition.find({ 'userId': ObjectId(userId) }, (err, activities) => {
                    if (err) {
                        return res.status(500).json({
                            message: "DB Error finding ActivityCategoryDefinition object",
                            data: err
                        });
                    }
                    if (!activities) {
                        return res.status(500).json({ message: "Could not find Activities", data: userId });
                    }
                    return res.status(200).json({ message: "Successfully found Activities", data: activities });
                })
            }
        })
    }

    let newDefaultActivities = [];
    for (let activity of defaultActivities) {
        const newDefaultActivity = new ActivityCategoryDefinition({
            userId: activity.userId,
            treeId: activity.treeId,
            parentTreeId: activity.parentTreeId,
    
            name: activity.name,
            icon: activity.icon,
            color: activity.color,
            description: activity.description,

            isSleepActivity: activity.isSleepActivity,
            canDelete: activity.canDelete,
            isInTrash: activity.isInTrash,
    
            durationSetting: activity.durationSetting,
            specifiedDurationMinutes: activity.specifiedDurationMinutes,
            
            scheduleRepititions: activity.scheduleRepititions,
            currentPointsConfiguration: activity.currentPointsConfiguration,
            pointsConfigurationHistory: activity.pointsConfigurationHistory,
        
            isRoutine: activity.isRoutine,
            routineMembersActivityIds: activity.routineMembersActivityIds,
        
            isConfigured: activity.isConfigured,
        });
        newDefaultActivities.push(newDefaultActivity);
        userId = activity.userId;
    }

    saveActivity(newDefaultActivities, userId);
}

exports.create = function (req, res, next) {
    const activityCategoryDefinition = new ActivityCategoryDefinition({

        userId: req.body.userId,
        treeId: req.body.treeId,
        parentTreeId: req.body.parentTreeId,

        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        description: req.body.description,

        isSleepActivity: req.body.isSleepActivity,
        canDelete: req.body.canDelete,
        isInTrash: req.body.isInTrash,
    

        durationSetting: req.body.durationSetting,
        specifiedDurationMinutes: req.body.specifiedDurationMinutes,
        
        scheduleRepititions: req.body.scheduleRepititions,
        currentPointsConfiguration: req.body.currentPointsConfiguration,
        pointsConfigurationHistory: req.body.pointsConfigurationHistory,
    
        isRoutine: req.body.isRoutine,
        routineMembersActivityIds: req.body.routineMembersActivityIds,
    
        isConfigured: req.body.isConfigured,
    });

    activityCategoryDefinition.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating ActivityCategoryDefinition object', data: err });
        } else {
            return res.status(200).json({
                message: 'ActivityCategoryDefinition object saved',
                data: activityCategoryDefinition
            });
        }

    });
};
exports.permanentlyDelete = function (req, res, next) {
    // console.log("deleting item: " , req.body)
    const id = new ObjectId(req.body._id);
    ActivityCategoryDefinition.findByIdAndDelete(id, (err) => {
        if (err) return res.status(500).json({ message: 'DB error deleting ActivityCategoryDefinition object', success: false, data: err });
        else{
            return res.status(200).json({ message: "ActivityCategoryDefinition object successfully deleted", success: true, data: req.body._id });
        }
    });
};

exports.update = function (req, res, next) {
    let updatedActivityCategoryDefinition = req.body;
    // console.log("UPDATING ACTIVITY: " , updatedActivityCategoryDefinition);
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
