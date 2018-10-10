
const TimeMark = require('../models/timeMark');



exports.create = function (req, res, next) {
    const timeMark = new TimeMark({
        userId: req.body.userId,
        //previousTimeMarkId: req.body.previousTimeMarkId,
        timeISO: req.body.timeISO,
        description: req.body.description,
        activities: req.body.activities
    });
    timeMark.save((err) => {
        if (err)
            return res.status(500).json({ message: 'DB Error creating TimeMark object', data: err });
        return res.status(200).json({
            message: 'TimeMark object saved',
            data: timeMark
        });
    });
};
exports.delete = function (req, res, next) {
    TimeMark.findByIdAndRemove(req.body.id, (err, res)=>{
        if(err) return res.status(500).json({message:'DB error deleting TimeMark object', data: err});
        return res.status(204).json({message:"TimeMark object successfully deleted"});
    });
};
exports.update = function (req, res, next) {
    let updatedTimeMark = req.body;
    TimeMark.findByIdAndUpdate(req.params.id, updatedTimeMark, {new: true}, (err, dataEntry)=>{
        if(err) return res.status(500).json({message:'DB error updating TimeMark object', data: err});
        if(!dataEntry) return res.status(500).json({message: "Error updating TimeMark object", data: req.parms.id});
        return res.status(200).json({message:"Successfully update TimeMark object", data: dataEntry});
    });
};
exports.get = function (req, res, next) {
    TimeMark.findById(req.params.id, (err, dataEntry)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding TimeMark object",
                data: err
            });
        }
        if(!dataEntry){
            return res.status(500).json({message:"Could not find TimeMark object", data: req.params.id});
        }
        return res.status(200).json({message: "Successfully found TimeMark object", data: dataEntry});
    });
};
