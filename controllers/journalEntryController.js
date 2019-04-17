var ObjectId = require('mongoose').Types.ObjectId;
const JournalEntry = require('../models/journalEntry');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    JournalEntry.find({ 'userId': ObjectId(userId) }, (err, journalEntrys) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding JournalEntry object",
                data: err
            });
        }
        if (!journalEntrys) {
            return res.status(500).json({ message: "Could not find JournalEntrys", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found JournalEntrys", data: journalEntrys });
    })
}


exports.create = function (req, res, next) {


    console.log("Request:", req.body)

    const journalEntry = new JournalEntry({
        userId: req.body.userId,
        forDateISO: req.body.forDate,
        dateCreatedISO: req.body.dateCreated,
        dateModifiedISO: req.body.dateModified,
        type: req.body.type,
        textContent: req.body.textContent,
        title: req.body.title,
        tags: req.body.tags

    });


    console.log("Saving journal entry")
    console.log(journalEntry);

    journalEntry.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating JournalEntry object', data: err });
        } else {
            return res.status(200).json({
                message: 'JournalEntry object saved',
                data: journalEntry
            });

        }
    });
};
exports.delete = function (req, res, next) {
    JournalEntry.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting JournalEntry object', data: null });
        return res.status(200).json({ message: "Successfully deleted JournalEntry object", data: null });
    });
};
exports.update = function (req, res, next) {
    console.log("updating journalEntry.  incoming request:", req.body );

    const updateJournalEntry = new JournalEntry({
        _id: req.body.id,
        userId: req.body.userId,

    });



    JournalEntry.findByIdAndUpdate(req.body.id, updateJournalEntry, { new: true }, (err, journalEntry) => {

        if (err) return res.status(500).json({ message: 'DB error updating JournalEntry object', data: err });
        if (!journalEntry) return res.status(500).json({ message: "Error updating JournalEntry object", data: req.body.id });

        console.log("updated journalEntry: ", journalEntry);
        return res.status(200).json({ message: "Successfully update JournalEntry object", data: journalEntry });
    });
};
