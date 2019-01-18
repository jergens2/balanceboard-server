var mongoose = require('mongoose');
// var CategorizedActivity = require('./categorizedActivity');


var Schema = mongoose.Schema;

var TimeSegmentSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    startTimeISO: {type: String, required: true},
    endTimeISO: {type: String, required: true},
    // timeISO: {type: String, required: true},
    title: String,
    description: String,
    activities: []
  }, 
  { 
    collection: 'timeSegment' 
  }
);

//Export model
module.exports = mongoose.model('TimeSegment', TimeSegmentSchema);
