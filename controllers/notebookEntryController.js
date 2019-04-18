var ObjectId = require('mongoose').Types.ObjectId;
const NotebookEntry = require('../models/notebookEntry');

var moment = require('moment');


exports.get = function (req, res, next) {
    const userId = req.params.userId;
    NotebookEntry.find({ 'userId': ObjectId(userId) }, (err, notebookEntries) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding NotebookEntry object",
                data: err
            });
        }
        if (!notebookEntries) {
            return res.status(500).json({ message: "Could not find NotebookEntries", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found NotebookEntries", data: notebookEntries });
    })
}


exports.create = function (req, res, next) {


    console.log("Request:", req.body)

    const notebookEntry = new NotebookEntry({
        userId: req.body.userId,
        forDateISO: req.body.forDate,
        dateCreatedISO: req.body.dateCreated,
        dateModifiedISO: req.body.dateModified,
        type: req.body.type,
        textContent: req.body.textContent,
        title: req.body.title,
        tags: req.body.tags

    });


    console.log("Saving notebook entry")
    console.log(notebookEntry);

    notebookEntry.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating NotebookEntry object', data: err });
        } else {
            return res.status(200).json({
                message: 'NotebookEntry object saved',
                data: notebookEntry
            });

        }
    });
};
exports.delete = function (req, res, next) {
    NotebookEntry.findByIdAndDelete({ '_id': new ObjectId(req.body.id) }, (err, doc) => {
        if (err) return res.status(500).json({ message: 'DB error deleting NotebookEntry object', data: null });
        return res.status(200).json({ message: "Successfully deleted NotebookEntry object", data: null });
    });
};
exports.update = function (req, res, next) {
    console.log("updating notebookEntry.  incoming request:", req.body );

    const updateNotebookEntry = new NotebookEntry({
        _id: req.body.id,
        userId: req.body.userId,

    });



    NotebookEntry.findByIdAndUpdate(req.body.id, updateNotebookEntry, { new: true }, (err, notebookEntry) => {

        if (err) return res.status(500).json({ message: 'DB error updating NotebookEntry object', data: err });
        if (!notebookEntry) return res.status(500).json({ message: "Error updating NotebookEntry object", data: req.body.id });

        console.log("updated notebookEntry: ", notebookEntry);
        return res.status(200).json({ message: "Successfully update NotebookEntry object", data: notebookEntry });
    });
};
