var ObjectId = require('mongoose').Types.ObjectId; 
const GenericDataEntry = require('../models/genericData');



exports.dataEntryPostCreate = function (req, res, next) {
    const genericDataEntry = new GenericDataEntry({
        userId: req.body.userId,
        dateUpdatedISO: req.body.dateUpdatedISO,
        category: req.body.category,
        dataType: req.body.dataType,
        dataObject: req.body.dataObject
    });
    genericDataEntry.save((err) => {
        if (err)
            return res.status(500).json({ message: 'DB Error creating GenericDataEntry object', data: err });
        return res.status(200).json({
            message: 'GenericDataEntry object saved',
            data: genericDataEntry
        });
    });
};
exports.dataEntryDelete = function (req, res, next) {
    GenericDataEntry.findByIdAndRemove(req.body.id, (err, res)=>{
        if(err) return res.status(500).json({message:'DB error deleting GenericDataEntry object', data: err});
        return res.status(204).json({message:"GenericDataEntry object successfully deleted"});
    });
};
exports.dataEntryUpdate = function (req, res, next) {
    let updatedDataEntry = req.body;
    GenericDataEntry.findByIdAndUpdate(req.params.id, updatedDataEntry, {new: true}, (err, dataEntry)=>{
        if(err) return res.status(500).json({message:'DB error updating GenericDataEntry object', data: err});
        if(!dataEntry) return res.status(500).json({message: "Error updating GenericDataEntry object", data: req.parms.id});
        return res.status(200).json({message:"Successfully update GenericDataEntry object", data: dataEntry});
    });
};
exports.dataEntryGet = function (req, res, next) {
    GenericDataEntry.findById(req.params.id, (err, dataEntry)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding GenericDataEntry object",
                data: err
            });
        }
        if(!dataEntry){
            return res.status(500).json({message:"Could not find GenericDataEntry object", data: req.params.id});
        }
        return res.status(200).json({message: "Successfully found GenericDataEntry object", data: dataEntry});
    });
};

exports.dataEntryGetByUser = function (req, res, next) {
    GenericDataEntry.find({'userId': new ObjectId(req.params.userId)}, (err, dataEntries)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding GenericDataEntry object",
                data: err
            });
        }
        if(!dataEntries){
            return res.status(500).json({message:"Could not find GenericDataEntry objects", data: req.params.userId});
        }
        return res.status(200).json({message: "Successfully found GenericDataEntry objects", data: dataEntries});
    });
};

