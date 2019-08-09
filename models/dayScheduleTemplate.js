var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var DayScheduleTemplateSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {type: String, required: true},
    color: {type: String, required: true},
    delineations: {type: [], required: true},
  }, 
  { 
    collection: 'dayScheduleTemplate' 
  }
);

//Export model
module.exports = mongoose.model('DayScheduleTemplate', DayScheduleTemplateSchema);

