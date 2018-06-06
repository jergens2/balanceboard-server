var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EventSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    description: String,
    category: String
  }, { collection: 'event' }
);

//Export model
module.exports = mongoose.model('Event', EventSchema);
