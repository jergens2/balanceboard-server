var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var TaskSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, require: true},
    description: String,
    startDateISO: {type: String, required: true},
    dueDateISO: {type: String, required: false},
    completionDateISO: {type: String, required: false},
    isComplete: {type: Boolean, require: true},
    priority: {type: String, required }
  }, 
  { 
    collection: 'task' 
  }
);

//Export model
module.exports = mongoose.model('Task', TaskSchema);

