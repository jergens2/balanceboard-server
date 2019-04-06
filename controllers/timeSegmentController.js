var ObjectId = require('mongoose').Types.ObjectId;
const TimeSegment = require('../models/timeSegment');

var moment = require('moment');

var colors = require('colors');


exports.create = function (req, res, next) {

    const timeSegment = new TimeSegment({
        userId: req.body.userId,

        startTimeISO: req.body._startTimeISO,
        endTimeISO: req.body._endTimeISO,
        description: req.body.description,
        activities: req.body.activities,
    });


    timeSegment.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating TimeSegment object', data: err });
        } else {
            console.log("Successfully build new TimeSegment".green, timeSegment);
            return res.status(200).json({
                message: 'TimeSegment object saved',
                data: timeSegment
            });

        }
    });
};
exports.delete = function (req, res, next) {
    TimeSegment.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting TimeSegment object', data: null });
        return res.status(200).json({ message: "Successfully deleted TimeSegment object", data: null });
    });
};
exports.update = function (req, res, next) {
    /*
        When this method receives the updatedTimeSegment, the properties startTimeISO and endTimeISO actually are: _startTimeISO and _endTimeISO , with the underscores, from the front-end.
        so, we just make a new one and update the existing one by ID
    */

    const updatedTimeSegment = new TimeSegment({
        _id: req.body.id,
        userId: req.body.userId,
        startTimeISO: req.body._startTimeISO,
        endTimeISO: req.body._endTimeISO,
        description: req.body.description,
        activities: req.body.activities,
    });


    TimeSegment.findByIdAndUpdate( req.body.id, updatedTimeSegment, { new: true }, (err, timeSegment) => {

        if (err) return res.status(500).json({ message: 'DB error updating TimeSegment object', data: err });
        if (!timeSegment) return res.status(500).json({ message: "Error updating TimeSegment object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update TimeSegment object", data: timeSegment });
    });
};
exports.get = function (req, res, next) {
    let startTime = moment(req.params.start).toISOString();
    let endTime = moment(req.params.end).toISOString();
    console.log("finding from: "+startTime + "  - to - " + endTime);
    TimeSegment.find(
        {
            'userId': ObjectId(req.params.userId),
            $or: [
                {
                    'startTimeISO': { $lte: startTime },
                    'endTimeISO': { $gte: startTime }
                },
                {
                    'startTimeISO': { $gte: startTime },
                    'endTimeISO': { $lte: endTime }
                },
                {
                    'startTimeISO': { $lte: endTime },
                    'endTimeISO': { $gte: endTime }
                }
            ]
        }, (err, timeSegments) => {
            if (err) {
                return res.status(500).json({
                    message: "DB Error finding TimeSegment object",
                    data: err
                });
            }
            if (!timeSegments) {
                return res.status(500).json({ message: "Could not find TimeSegments", data: req.params.id });
            }
            let sum = 0;
            timeSegments.forEach((timeSegment)=>{
                sum += moment(timeSegment.endTimeISO).diff(moment(timeSegment.startTimeISO), "hours");
            })

            console.log("the sum of timesegments is " + sum);

            return res.status(200).json({ message: "Successfully found TimeSegments", data: timeSegments });
        })
};


exports.getMonth = function (req, res, next) {
    let startOfMonth = moment(req.params.start).startOf('month').toISOString();
    let endOfMonth = moment(req.params.start).endOf('month').toISOString();
    TimeSegment.find({ 'userId': ObjectId(req.params.userId), 'endTimeISO': { $lt: endOfMonth }, 'startTimeISO': { $gt: startOfMonth } }, (err, timeSegments) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding TimeSegments for month",
                data: err
            });
        } else {
            if (!timeSegments) {
                return res.status(500).json({ message: "No TimeSegments found for month of " + moment(startOfMonth).format('MMMM'), data: req.params.id });
            } else {
                let timeSegmentDates = [];
                let startOfDay = startOfMonth;
                let endOfDay = moment(startOfDay).endOf('day').toISOString();
                while (endOfDay <= endOfMonth) {
                    let thisDaysTimeSegments = [];
                    for (let timeSegment of timeSegments) {
                        if ((timeSegment.startTimeISO >= startOfDay) && (timeSegment.endTimeISO <= endOfDay)) {
                            thisDaysTimeSegments.push(timeSegment);
                        }
                    }
                    timeSegmentDates.push({
                        date: moment(startOfDay).format('YYYY-MM-DD'),
                        timeSegments: thisDaysTimeSegments.length
                    })
                    startOfDay = moment(startOfDay).add(1, 'days').toISOString();
                    endOfDay = moment(endOfDay).add(1, 'days').toISOString();
                }
                return res.status(200).json({ message: "Successfully found TimeSegments", data: timeSegmentDates });
            }
        }
    })
};

exports.getActivityData = function (req, res, next) {
    TimeSegment.find({ "activities.activityTreeId": req.params.treeId }, (err, timeSegments) => {
        if (err) {
            return res.status(500).json({
                message: "Error finding activity data for " + req.params.treeId,
                data: err
            });
        } else {
            if (!timeSegments) {
                return res.status(500).json({ message: "No activity data found" });
            } else {
                return res.status(200).json({ message: "Activity data:", data: timeSegments });
            }
        }
    });
}
