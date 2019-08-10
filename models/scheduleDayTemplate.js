var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var ScheduleDayTemplateSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {type: String, required: true},
    color: {type: String, required: true},
    delineations: {type: [Schema.Types.Mixed], required: true},
  }, 
  { 
    collection: 'scheduleDayTemplate' 
  }
);

//Export model
module.exports = mongoose.model('ScheduleDayTemplate', ScheduleDayTemplateSchema);

