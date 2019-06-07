var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var DayDataSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateYYYYMMDD: {type: String, required: true},
    activityData: {type: [Schema.Types.Mixed], required: true },
    dailyTaskListItems: {type: [Schema.Types.Mixed], required: true },
    taskData: {type: [Schema.Types.Mixed], required: true },
    timelogEntryData: {type: [Schema.Types.Mixed], required: true },
  }, 
  { 
    collection: 'dayData' 
  }
);

//Export model
module.exports = mongoose.model('DayData', DayDataSchema);

