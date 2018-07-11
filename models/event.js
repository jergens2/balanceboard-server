var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EventSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    description: String,
    category: String
  }, 
  { 
    collection: 'event' 
  }
);

//Export model
module.exports = mongoose.model('Event', EventSchema);
