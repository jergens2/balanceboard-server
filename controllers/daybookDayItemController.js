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
    })
}


exports.create = function (req, res, next) {

    const daybookDayItem = new DaybookDayItem({
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        daybookTimelogEntryDataItems: req.body.daybookTimelogEntryDataItems,
        daybookActivityDataItems: req.body.daybookActivityDataItems,
        dailyTaskListDataItems: req.body.dailyTaskListDataItems,
        dayTemplateId: req.body.dayTemplateId,
        scheduledEventIds: req.body.scheduledEventIds,
        notebookEntryIds: req.body.notebookEntryIds,
        taskItemIds: req.body.taskItemIds,
    });


    daybookDayItem.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating DaybookDayItem object', data: err });
        } else {
            return res.status(200).json({
                message: 'DaybookDayItem object saved',
                data: daybookDayItem
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

    const updateDaybookDayItem = new DaybookDayItem({
        _id: req.body._id,
        userId: req.body.userId,
        dateYYYYMMDD: req.body.dateYYYYMMDD,
        daybookTimelogEntryDataItems: req.body.daybookTimelogEntryDataItems,
        daybookActivityDataItems: req.body.daybookActivityDataItems,
        dailyTaskListDataItems: req.body.dailyTaskListDataItems,
        dayTemplateId: req.body.dayTemplateId,
        scheduledEventIds: req.body.scheduledEventIds,
        notebookEntryIds: req.body.notebookEntryIds,
        taskItemIds: req.body.taskItemIds,
    });



    DaybookDayItem.findByIdAndUpdate(req.body.id, updateDaybookDayItem, { new: true }, (err, daybookDayItem) => {

        if (err) return res.status(500).json({ message: 'DB error updating DaybookDayItem object', data: err });
        if (!daybookDayItem) return res.status(500).json({ message: "Error updating DaybookDayItem object", data: req.body.id });

        console.log("updated daybookDayItem: ", daybookDayItem);
        return res.status(200).json({ message: "Successfully update DaybookDayItem object", data: daybookDayItem });
    });
};
