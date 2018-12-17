var ObjectId = require('mongoose').Types.ObjectId; 
const TimeMark = require('../models/timeMark');

var moment = require('moment');

var colors = require('colors');


exports.create = function (req, res, next) {


    let precedingTimeMarkId = null;
    let followingTimeMarkId = null;

    if(req.body.precedingTimeMarkId == "NO_PRECEDING_TIME_MARK"){
        precedingTimeMarkId = null;
    }else{
        precedingTimeMarkId = req.body.precedingTimeMarkId;
    }

    if(req.body.followingTimeMarkId == "NO_FOLLOWING_TIME_MARK"){
        followingTimeMarkId = null;
    }else{
        followingTimeMarkId = req.body.followingTimeMarkId;
    }

    const timeMark = new TimeMark({
        userId: req.body.userId,
        precedingTimeMarkId: precedingTimeMarkId,
        followingTimeMarkId: followingTimeMarkId,

        startTimeISO: req.body._startTimeISO,
        endTimeISO: req.body._endTimeISO,
        description: req.body.description,
        activities: req.body.activities,
    });


    timeMark.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating TimeMark object', data: err });
        }else{
            // //Now that we've saved the new time mark which points to the previous time mark, the previous time mark needs to be updated to point to the new time mark.
            // let responseMessage = "Successfully created new timeMark. ";
            // let data = {};
            // data.currentTimeMark = timeMark;
            // data.precedingTimeMark = null;

            // if(precedingTimeMarkId){
            //     let timeMarkToUpdate = null;
            //     TimeMark.findById(precedingTimeMarkId, (err, previousTimeMark)=>{
            //         if(err){
            //             responseMessage += "Could not update previous timeMark.";
            //             //return res.status(500).json({ message: responseMessage, data: err });
            //         }else{
            //             timeMarkToUpdate = previousTimeMark;
            //             timeMarkToUpdate.followingTimeMarkId = timeMark._id;
            //             TimeMark.findByIdAndUpdate(precedingTimeMarkId, timeMarkToUpdate, {new: true}, (err, timeMark)=>{
            //                 if(err){
            //                     //return res.status(500).json({ message: "Error updating previous timeMark", data: err });
            //                 }else{
            //                     data.precedingTimeMark = timeMark;
            //                     //return res.status(200).json({message: "Success with both previous and current timeMark", data: data});
            //                 }
                            
            //             })
    
            //         }
            //     });
            // }
            return res.status(200).json({
                message: 'TimeMark object saved',
                data: timeMark
            });

        }
    });
};
exports.delete = function (req, res, next) {
    TimeMark.findByIdAndDelete({'_id':new ObjectId(req.body.id)}, (err, doc)=>{
        if(err) return res.status(500).json({message:'DB error deleting TimeMark object', data: null});
        return res.status(200).json({message:"Successfully deleted TimeMark object", data: null});
    });
};
exports.update = function (req, res, next) {
    let updatedTimeMark = req.body;
    TimeMark.findByIdAndUpdate(req.params.id, updatedTimeMark, {new: true}, (err, timeMark)=>{
        if(err) return res.status(500).json({message:'DB error updating TimeMark object', data: err});
        if(!timeMark) return res.status(500).json({message: "Error updating TimeMark object", data: req.parms.id});
        return res.status(200).json({message:"Successfully update TimeMark object", data: timeMark});
    });
};
exports.get = function (req, res, next) {
    let startTime = moment(req.params.start).toISOString();
    let endTime = moment(req.params.end).toISOString();
    TimeMark.find({'userId': ObjectId(req.params.userId), 'endTimeISO' :{$gt : startTime}, 'startTimeISO': {$lt : endTime}}, (err, timeMarks)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding TimeMark object",
                data: err
            });
        }
        if(!timeMarks){
            return res.status(500).json({message:"Could not find TimeMarks", data: req.params.id});
        }
        return res.status(200).json({message: "Successfully found TimeMarks", data: timeMarks});
    })
};


exports.getMonth = function (req, res, next) {    
    let startOfMonth = moment(req.params.start).startOf('month').toISOString();
    let endOfMonth = moment(req.params.start).endOf('month').toISOString();
    TimeMark.find({'userId': ObjectId(req.params.userId), 'endTimeISO' :{$lt : endOfMonth}, 'startTimeISO': {$gt : startOfMonth}}, (err, timeMarks)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding TimeMarks for month",
                data: err
            });
        }else{
            if(!timeMarks){
                return res.status(500).json({message:"No TimeMarks found for month of " + moment(startOfMonth).format('MMMM'), data: req.params.id});
            }else{
                let timeMarkDates = [];
                let startOfDay = startOfMonth;
                let endOfDay = moment(startOfDay).endOf('day').toISOString();
                while(endOfDay <= endOfMonth){
                    let thisDaysTimeMarks = [];
                    for(let timeMark of timeMarks){
                        if((timeMark.startTimeISO >= startOfDay) && (timeMark.endTimeISO <= endOfDay)) {
                            thisDaysTimeMarks.push(timeMark);
                        }
                    }
                    timeMarkDates.push({
                        date: moment(startOfDay).format('YYYY-MM-DD'),
                        timeMarks: thisDaysTimeMarks.length
                    })
                    startOfDay = moment(startOfDay).add(1, 'days').toISOString();
                    endOfDay = moment(endOfDay).add(1,'days').toISOString();
                }
                return res.status(200).json({message: "Successfully found TimeMarks", data: timeMarkDates});
            }
        }
    })
};
