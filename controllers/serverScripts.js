var ObjectId = require('mongoose').Types.ObjectId;
// const Task = require('../models/task');  
const NotebookEntry = require('../models/notebookEntry');

var moment = require('moment');
var colors = require('colors');


exports.cleanseNotes = function (req, res, next) {
    // console.log("Cleansing Notes");

    NotebookEntry.find({ 'userId': ObjectId("5b9c362dd71b00180a7cf701") }, (err, notes) => {

        responseData = "";

        notes.forEach(note => {

            

                // console.log("Note: ", note);
                // console.log(note.forDateISO)

                const newNote = {
                    _id: note._id,
                    userId: note.userId,
                    title: note.title,
                    journalDateISO: note.forDateISO,
                    dateCreatedISO: note.dateCreatedISO,
                    dateModifiedISO: note.dateModifiedISO,
                    type: note.type,
                    textContent: note.textContent,
                    tags: note.tags
                }

                // NotebookEntry.findByIdAndUpdate(note._id, newNote, { new: true }, (err, returnedNote) => {

                //     if (err) {
                //         responseData += "error. ";
                //     }
                //     if (!returnedNote) {
                //         responseData += "No note. ";
                //     } else {
                //         responseData += "Note updated! ";
                //     }

                //     console.log("Note updated".green, returnedNote);
                // });



        });

        return res.status(201).json({ responseData })

    });
    // NotebookEntry.find({ 'userId':ObjectId("5b9c362dd71b00180a7cf701") }, (err, notes)=>{
    //     console.log("anything?")
    //     console.log(err, notes);
    //     notes.forEach((note)=>{

    //     })
    //     // return res.status(201);
    //     // if( err) {
    //     //     return res.status(500).json({
    //     //         data: err
    //     //     })
    //     // }

    //     // if(!notes){
    //     //     return res.status(500).json({ message: "no notes" })
    //     // }

    //     // return res.status(200).json({ message: "these are the notes", data: notes});
    //     return res.status(200).json({ message: "Cleansing Notes", data: notes });
    // })

    // Task.findOne({ 'userId': ObjectId(userId), 'taskId': ObjectId(taskId) }, (err, task) => {
    //     if (err) {
    //         return res.status(500).json({
    //             message: "DB Error finding Task object",
    //             data: err
    //         });
    //     }
    //     if (!task) {
    //         return res.status(500).json({ message: "Could not find Tasks", data: taskId });
    //     }
    //     return res.status(200).json({ message: "Successfully found Tasks", data: task });
    // })


}

