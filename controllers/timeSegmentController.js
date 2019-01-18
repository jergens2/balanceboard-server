var ObjectId = require('mongoose').Types.ObjectId; 
const TimeSegment = require('../models/timeSegment');

var moment = require('moment');

var colors = require('colors');


exports.create = function (req, res, next) {


    // let precedingTimeSegmentId = null;
    // let followingTimeSegmentId = null;

    // if(req.body.precedingTimeSegmentId == "NO_PRECEDING_TIME_MARK"){
    //     precedingTimeSegmentId = null;
    // }else{
    //     precedingTimeSegmentId = req.body.precedingTimeSegmentId;
    // }

    // if(req.body.followingTimeSegmentId == "NO_FOLLOWING_TIME_MARK"){
    //     followingTimeSegmentId = null;
    // }else{
    //     followingTimeSegmentId = req.body.followingTimeSegmentId;
    // }

    const timeSegment = new TimeSegment({
        userId: req.body.userId,
        // precedingTimeSegmentId: precedingTimeSegmentId,
        // followingTimeSegmentId: followingTimeSegmentId,

        startTimeISO: req.body._startTimeISO,
        endTimeISO: req.body._endTimeISO,
        description: req.body.description,
        activities: req.body.activities,
    });


    timeSegment.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating TimeSegment object', data: err });
        }else{
            
            return res.status(200).json({
                message: 'TimeSegment object saved',
                data: timeSegment
            });

        }
    });
};
exports.delete = function (req, res, next) {
    TimeSegment.findByIdAndDelete({'_id':new ObjectId(req.body.id)}, (err, doc)=>{
        if(err) return res.status(500).json({message:'DB error deleting TimeSegment object', data: null});
        return res.status(200).json({message:"Successfully deleted TimeSegment object", data: null});
    });
};
exports.update = function (req, res, next) {
    let updatedTimeSegment = req.body;
    TimeSegment.findByIdAndUpdate(req.body.id, updatedTimeSegment, {new: true}, (err, timeSegment)=>{
        if(err) return res.status(500).json({message:'DB error updating TimeSegment object', data: err});
        if(!timeSegment) return res.status(500).json({message: "Error updating TimeSegment object", data: req.body.id});
        return res.status(200).json({message:"Successfully update TimeSegment object", data: timeSegment});
    });
};
exports.get = function (req, res, next) {
    let startTime = moment(req.params.start).toISOString();
    let endTime = moment(req.params.end).toISOString();
    TimeSegment.find({'userId': ObjectId(req.params.userId), 'endTimeISO' :{$gt : startTime}, 'startTimeISO': {$lt : endTime}}, (err, timeSegments)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding TimeSegment object",
                data: err
            });
        }
        if(!timeSegments){
            return res.status(500).json({message:"Could not find TimeSegments", data: req.params.id});
        }
        return res.status(200).json({message: "Successfully found TimeSegments", data: timeSegments});
    })
};


exports.getMonth = function (req, res, next) {    
    let startOfMonth = moment(req.params.start).startOf('month').toISOString();
    let endOfMonth = moment(req.params.start).endOf('month').toISOString();
    TimeSegment.find({'userId': ObjectId(req.params.userId), 'endTimeISO' :{$lt : endOfMonth}, 'startTimeISO': {$gt : startOfMonth}}, (err, timeSegments)=>{
        if(err){
            return res.status(500).json({
                message: "DB Error finding TimeSegments for month",
                data: err
            });
        }else{
            if(!timeSegments){
                return res.status(500).json({message:"No TimeSegments found for month of " + moment(startOfMonth).format('MMMM'), data: req.params.id});
            }else{
                let timeSegmentDates = [];
                let startOfDay = startOfMonth;
                let endOfDay = moment(startOfDay).endOf('day').toISOString();
                while(endOfDay <= endOfMonth){
                    let thisDaysTimeSegments = [];
                    for(let timeSegment of timeSegments){
                        if((timeSegment.startTimeISO >= startOfDay) && (timeSegment.endTimeISO <= endOfDay)) {
                            thisDaysTimeSegments.push(timeSegment);
                        }
                    }
                    timeSegmentDates.push({
                        date: moment(startOfDay).format('YYYY-MM-DD'),
                        timeSegments: thisDaysTimeSegments.length
                    })
                    startOfDay = moment(startOfDay).add(1, 'days').toISOString();
                    endOfDay = moment(endOfDay).add(1,'days').toISOString();
                }
                return res.status(200).json({message: "Successfully found TimeSegments", data: timeSegmentDates});
            }
        }
    })
};
