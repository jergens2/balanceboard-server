var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EventSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    description: String
  }, { collection: 'event' }
);

//Export model
module.exports = mongoose.model('Event', EventSchema);