var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var DailyTaskListSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateYYYYMMDD: {type: String, required: true},
    taskListItems: {type: [Schema.Types.Mixed], required: true },
  }, 
  { 
    collection: 'dailyTaskList' 
  }
);

//Export model
module.exports = mongoose.model('DailyTaskList', DailyTaskListSchema);

