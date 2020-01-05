var ObjectId = require('mongoose').Types.ObjectId;
const DaybookDayItem = require('../models/daybookDayItem');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    DaybookDayItem.find({ 'userId': ObjectId(userId) }, (err, daybookDayItems) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DaybookDayItem object",
                data: err
            });
        }
        if (!daybookDayItems) {
            return res.status(500).json({ message: "Could not find DaybookDayItems", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found DaybookDayItems", data: daybookDayItems });
    });
}

exports.getInRange = function (req, res, next) {
    const startDateYYYYMMDD = req.params.startDateYYYYMMDD;
    const endDateYYYYMMDD = req.params.endDateYYYYMMDD;
    // console.log("StartDate: " + startDateYYYYMMDD + " - TO - END DATE:  " + endDateYYYYMMDD)
    DaybookDayItem.find(
        {
            'userId': ObjectId(req.params.userId),
            'dateYYYYMMDD': {
                $gte: startDateYYYYMMDD,
                $lte: endDateYYYYMMDD,
            },
        }, (err, daybookDayItems) => {
            if (err) {
                return res.status(500).json({
                    message: "DB Error finding DaybookDayItem object",
                    data: err
                });
            }
            if (!daybookDayItems) {
                return res.status(500).json({ message: "Could not find DaybookDayItems", data: req.params.id });
            }

            return res.status(200).json({ message: "Successfully found DaybookDayItems", data: daybookDayItems });
        })

}


exports.create = function (req, res, next) {

    const dateYYYYMMDD = req.body.dateYYYYMMDD;
    // console.log("Creating daybook day item")
    const saveNewItem = new DaybookDayItem({
        userId: req.body.userId,
        dateYYYYMMDD: dateYYYYMMDD,

        daybookTimelogEntryDataItems: req.body.daybookTimelogEntryDataItems,
        timeDelineators: req.body.timeDelineators,

        sleepTimes: req.body.sleepTimes,
        sleepEnergyLevelInputs: req.body.sleepEnergyLevelInputs,

        daybookActivityDataItems: req.body.daybookActivityDataItems,
        dailyTaskListDataItems: req.body.dailyTaskListDataItems,
        dayStructureDataItems: req.body.dayStructureDataItems,

        dailyWeightLogEntryKg: req.body.dailyWeightLogEntryKg,
        scheduledActivityItems: req.body.scheduledActivityItems,
        dayTemplateId: req.body.dayTemplateId,
        scheduledEventIds: req.body.scheduledEventIds,
        notebookEntryIds: req.body.notebookEntryIds,
        taskItemIds: req.body.taskItemIds,
    });

    console.log("Creating: daybookDayItem for date", dateYYYYMMDD);

    DaybookDayItem.findOne({
        'userId': ObjectId(req.params.userId),
        'dateYYYYMMDD': dateYYYYMMDD,
    }, (err, existingItem) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding DaybookDayItem object.  Did not create new items either.",
                data: err
            });
        }
        if (existingItem) {
            return res.status(200).json({ message: "Found existing item by date", data: existingItem });
        } else {
            saveNewItem.save((err) => {
                if (err) {
                    console.log('Error saving new DaybookDayItem.')
                    return res.status(500).json({ message: 'DB Error creating DaybookDayItem object', data: err });
                } else {
                    return res.status(200).json({
                        message: 'DaybookDayItem object saved',
                        data: saveNewItem
                    });

                }
            });
        }
    });
};

exports.delete = function (req, res, next) {
    DaybookDayItem.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting DaybookDayItem object', data: null });
        return res.status(200).json({ message: "Successfully deleted DaybookDayItem object", data: null });
    });
};
exports.update = function (req, res, next) {
    // console.log("updating daybookDayItem.  incoming request:", req.body );
    console.log("updating daybookDayItem for date", req.body.dateYYYYMMDD);
    const updateDaybookDayItem = new DaybookDayItem({
        _id: req.body._id,
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,

        daybookTimelogEntryDataItems: req.body.daybookTimelogEntryDataItems,
        timeDelineators: req.body.timeDelineators,

        sleepTimes: req.body.sleepTimes,
        sleepEnergyLevelInputs: req.body.sleepEnergyLevelInputs,

        daybookActivityDataItems: req.body.daybookActivityDataItems,
        dailyTaskListDataItems: req.body.dailyTaskListDataItems,
        dayStructureDataItems: req.body.dayStructureDataItems,

        dailyWeightLogEntryKg: req.body.dailyWeightLogEntryKg,
        scheduledActivityItems: req.body.scheduledActivityItems,
        dayTemplateId: req.body.dayTemplateId,
        scheduledEventIds: req.body.scheduledEventIds,
        notebookEntryIds: req.body.notebookEntryIds,
        taskItemIds: req.body.taskItemIds,
    });

    console.log("Updating daybook Day Item: ", updateDaybookDayItem);


    DaybookDayItem.findByIdAndUpdate(req.body._id, updateDaybookDayItem, { new: true }, (err, daybookDayItem) => {

        if (err) return res.status(500).json({ message: 'DB error updating DaybookDayItem object', data: err });
        if (!daybookDayItem) return res.status(500).json({ message: "Error updating DaybookDayItem object", data: req.body.id });

        // console.log("updated daybookDayItem: ", daybookDayItem);
        return res.status(200).json({ message: "Successfully update DaybookDayItem object", data: daybookDayItem });
    });
};
