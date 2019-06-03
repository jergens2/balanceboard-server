var ObjectId = require('mongoose').Types.ObjectId;
const TimelogEntry = require('../models/timelogEntry');

var moment = require('moment');

var colors = require('colors');


exports.create = function (req, res, next) {

    const timelogEntry = new TimelogEntry({
        userId: req.body.userId,
        startTimeISO: req.body.startTimeISO,
        endTimeISO: req.body.endTimeISO,
        description: req.body.description,
        itleActivities: req.body.itleActivities,
    });


    timelogEntry.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating TimelogEntry object', data: err });
        } else {
            console.log("Successfully build new TimelogEntry".green, timelogEntry);
            return res.status(200).json({
                message: 'TimelogEntry object saved',
                data: timelogEntry
            });

        }
    });
};
exports.delete = function (req, res, next) {
    console.log("Deleting", req.body.id);
    TimelogEntry.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting TimelogEntry object', data: null });
        return res.status(200).json({ message: "Successfully deleted TimelogEntry object", data: null });
    });
};
exports.update = function (req, res, next) {
    /*
        When this method receives the updatedTimelogEntry, the properties startTimeISO and endTimeISO actually are: _startTimeISO and _endTimeISO , with the underscores, from the front-end.
        so, we just make a new one and update the existing one by ID
    */

    const updatedTimelogEntry = new TimelogEntry({
        _id: req.body.id,
        userId: req.body.userId,
        startTimeISO: req.body._startTimeISO,
        endTimeISO: req.body._endTimeISO,
        description: req.body.description,
        activities: req.body.activities,
    });


    TimelogEntry.findByIdAndUpdate( req.body.id, updatedTimelogEntry, { new: true }, (err, timelogEntry) => {

        if (err) return res.status(500).json({ message: 'DB error updating TimelogEntry object', data: err });
        if (!timelogEntry) return res.status(500).json({ message: "Error updating TimelogEntry object", data: req.body.id });

        return res.status(200).json({ message: "Successfully update TimelogEntry object", data: timelogEntry });
    });
};
exports.get = function (req, res, next) {
    let startTime = moment(req.params.start).toISOString();
    let endTime = moment(req.params.end).toISOString();
    console.log("finding from: "+startTime + "  - to - " + endTime);
    TimelogEntry.find(
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
        }, (err, timelogEntrys) => {
            if (err) {
                return res.status(500).json({
                    message: "DB Error finding TimelogEntry object",
                    data: err
                });
            }
            if (!timelogEntrys) {
                return res.status(500).json({ message: "Could not find TimelogEntrys", data: req.params.id });
            }
            let sum = 0;
            timelogEntrys.forEach((timelogEntry)=>{
                sum += moment(timelogEntry.endTimeISO).diff(moment(timelogEntry.startTimeISO), "hours");
            })


            return res.status(200).json({ message: "Successfully found TimelogEntrys", data: timelogEntrys });
        })
};


exports.getMonth = function (req, res, next) {
    let startOfMonth = moment(req.params.start).startOf('month').toISOString();
    let endOfMonth = moment(req.params.start).endOf('month').toISOString();
    TimelogEntry.find({ 'userId': ObjectId(req.params.userId), 'endTimeISO': { $lt: endOfMonth }, 'startTimeISO': { $gt: startOfMonth } }, (err, timelogEntrys) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding TimelogEntrys for month",
                data: err
            });
        } else {
            if (!timelogEntrys) {
                return res.status(500).json({ message: "No TimelogEntrys found for month of " + moment(startOfMonth).format('MMMM'), data: req.params.id });
            } else {
                let timelogEntryDates = [];
                let startOfDay = startOfMonth;
                let endOfDay = moment(startOfDay).endOf('day').toISOString();
                while (endOfDay <= endOfMonth) {
                    let thisDaysTimelogEntrys = [];
                    for (let timelogEntry of timelogEntrys) {
                        if ((timelogEntry.startTimeISO >= startOfDay) && (timelogEntry.endTimeISO <= endOfDay)) {
                            thisDaysTimelogEntrys.push(timelogEntry);
                        }
                    }
                    timelogEntryDates.push({
                        date: moment(startOfDay).format('YYYY-MM-DD'),
                        timelogEntrys: thisDaysTimelogEntrys.length
                    })
                    startOfDay = moment(startOfDay).add(1, 'days').toISOString();
                    endOfDay = moment(endOfDay).add(1, 'days').toISOString();
                }
                return res.status(200).json({ message: "Successfully found TimelogEntrys", data: timelogEntryDates });
            }
        }
    })
};

exports.getActivityData = function (req, res, next) {
    TimelogEntry.find({ "activities.activityTreeId": req.params.treeId }, (err, timelogEntrys) => {
        if (err) {
            return res.status(500).json({
                message: "Error finding activity data for " + req.params.treeId,
                data: err
            });
        } else {
            if (!timelogEntrys) {
                return res.status(500).json({ message: "No activity data found" });
            } else {
                return res.status(200).json({ message: "Activity data:", data: timelogEntrys });
            }
        }
    });
}
