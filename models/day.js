var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var DaySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateYYYYMMDD: {type: String, required: true},
    activityData: {type: [Schema.Types.Mixed], required: true },
    dailyTaskListData: {type: [Schema.Types.Mixed], required: true },
    taskData: {type: [Schema.Types.Mixed], required: true },
    timelogEntryData: {type: [Schema.Types.Mixed], required: true },
    //daily task list
  }, 
  { 
    collection: 'day' 
  }
);

//Export model
module.exports = mongoose.model('Day', DaySchema);

