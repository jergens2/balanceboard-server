

const CategorizedActivity = require('../models/categorizedActivity');


exports.create = function (req, res, next) {
    const categorizedActivity = new CategorizedActivity({
        name: req.body.name,
        userId: req.body.userId,
        timeMarkId: req.body.timeMarkId,
        parentCategoryId: req.body.parentCategoryId,
        childrenCategories: '',
        icon: '',
        color: req.body.color,
        description: req.body.description

    });
    categorizedActivity.save((err) => {
        if (err)
            return res.status(500).json({ message: 'DB Error creating CategorizedActivity object', data: err });
        return res.status(200).json({
            message: 'CategorizedActivity object saved',
            data: categorizedActivity
        });
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
exports.get = function (req, res, next) {
    CategorizedActivity.findById(req.params.id, (err, dataEntry)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding CategorizedActivity object",
                data: err
            });
        }
        if(!dataEntry){
            return res.status(500).json({message:"Could not find CategorizedActivity object", data: req.params.id});
        }
        return res.status(200).json({message: "Successfully found CategorizedActivity object", data: dataEntry});
    });
};
