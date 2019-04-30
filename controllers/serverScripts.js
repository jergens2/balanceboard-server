var ObjectId = require('mongoose').Types.ObjectId;
// const Task = require('../models/task');  
const NotebookEntry = require('../models/notebookEntry');

var moment = require('moment');


exports.cleanseNotes = function (req, res, next) {
    console.log("Cleansing Notes");
    
    NotebookEntry.find({ 'userId':ObjectId("5b9c362dd71b00180a7cf701") }, (err, notes)=>{
        console.log("anything?")
        console.log(err, notes);

        // return res.status(201);
        // if( err) {
        //     return res.status(500).json({
        //         data: err
        //     })
        // }

        // if(!notes){
        //     return res.status(500).json({ message: "no notes" })
        // }

        // return res.status(200).json({ message: "these are the notes", data: notes});
        return res.status(200).json({ message: "Cleansing Notes", data: notes });
    })
    
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

