var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var TaskSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, require: true},
    priority: {type: Number, required: true },
    directoryPath: {type: String, require: true},
    description: String,
    createdDateISO: {type: String, required: true},
    hasDueDate: {type: Boolean, required: true},
    dueDateISO: {type: String, required: true},
    completionDateISO: {type: String, required: false},
    isComplete: {type: Boolean, require: true},
    
  }, 
  { 
    collection: 'task' 
  }
);

//Export model
module.exports = mongoose.model('Task', TaskSchema);

