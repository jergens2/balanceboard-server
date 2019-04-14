var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var DaySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateYYYYMMDD: {type: String, required: true},
    primaryObjectiveId: {type: Schema.Types.ObjectId, ref: 'Objective', required: false },
    //daily task list
  }, 
  { 
    collection: 'day' 
  }
);

//Export model
module.exports = mongoose.model('Day', DaySchema);

