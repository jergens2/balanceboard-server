var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var ActivityDayDataSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateYYYYMMDD: {type: String, required: true},
    activityDataItems: {type: [Schema.Types.Mixed], required: true },
  }, 
  { 
    collection: 'activityDayData' 
  }
);

//Export model
module.exports = mongoose.model('ActivityDayData', ActivityDayDataSchema);

