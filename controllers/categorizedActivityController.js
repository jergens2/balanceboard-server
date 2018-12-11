
var ObjectId = require('mongoose').Types.ObjectId; 
const CategorizedActivity = require('../models/categorizedActivity');


exports.createDefault = function (req, res, next) {
    //req.body is an array of CategorizedActivities

    let defaultActivities = req.body;
    let userId = "";
    
    function saveActivity(activities, userId){
        var activity = activities.pop();
        activity.save((err, savedActivity)=>{
            if(err) throw err;

            if(activities.length > 0){
                saveActivity(activities, userId);
            }else{

                CategorizedActivity.find({'userId': ObjectId(userId)}, (err, activities)=>{
                    if(err){
                        return res.status(500).json({
                            message: "DB Error finding CategorizedActivity object",
                            data: err
                        });
                    }
                    if(!activities){
                        return res.status(500).json({message:"Could not find Activities", data: userId});
                    }
                    return res.status(200).json({message: "Successfully found Activities", data: activities});
                })
            }
        })
    }
    
    let newDefaultActivities = [];
    for(let activity of defaultActivities){
        const newDefaultActivity = new CategorizedActivity({
            treeId: activity.id,
            name: activity.name,
            userId: activity.userId,
            parentCategoryId: activity.parentActivityId,
            icon: '',
            color: activity.color,
            description: activity.description

        });
        newDefaultActivities.push(newDefaultActivity);
        userId = activity.userId;
    }
    
    saveActivity(newDefaultActivities, userId);
}

exports.create = function (req, res, next) {
    const categorizedActivity = new CategorizedActivity({
        name: req.body.name,
        userId: req.body.userId,
        parentCategoryId: req.body.parentActivityId,
        icon: '',
        color: req.body.color,
        description: req.body.description

    });

    console.log("Parent category was: ".green);
    console.log(req.body.parentActivityId);

    categorizedActivity.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating CategorizedActivity object', data: err });
        } else {

            console.log("creating categoryactivity was successful.  now to update the parent")

            CategorizedActivity.findByIdAndUpdate(categorizedActivity.parentCategoryId, { $push: {childrenCategories: categorizedActivity.id} }).exec();

            return res.status(200).json({
                message: 'CategorizedActivity object saved',
                data: categorizedActivity
            });
        }
        
    });
};
exports.delete = function (req, res, next) {
    CategorizedActivity.findByIdAndRemove(req.body.id, (err, res)=>{
        if(err) return res.status(500).json({message:'DB error deleting CategorizedActivity object', data: err});
        return res.status(204).json({message:"CategorizedActivity object successfully deleted"});
    });
};
exports.update = function (req, res, next) {
    let updatedCategorizedActivity = req.body;
    CategorizedActivity.findByIdAndUpdate(req.params.id, updatedCategorizedActivity, {new: true}, (err, dataEntry)=>{
        if(err) return res.status(500).json({message:'DB error updating CategorizedActivity object', data: err});
        if(!dataEntry) return res.status(500).json({message: "Error updating CategorizedActivity object", data: req.parms.id});
        return res.status(200).json({message:"Successfully update CategorizedActivity object", data: dataEntry});
    });
};
exports.getByUserId = function (req, res, next) {

    CategorizedActivity.find({'userId': ObjectId(req.params.userId)}, (err, activities)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding CategorizedActivity object",
                data: err
            });
        }
        if(!activities){
            return res.status(500).json({message:"Could not find Activities", data: req.params.id});
        }
        return res.status(200).json({message: "Successfully found Activities", data: activities});
    })
};
