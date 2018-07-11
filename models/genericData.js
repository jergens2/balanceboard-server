var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenericDataEntrySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdTimeISO: { type: String, required: true},
    startTime: {type: String, required: false},
    endTime: {type: String, required: false},
    category: String,
    dataObject: Object
  }, 
  { 
    collection: 'genericData' 
  }
);

module.exports = mongoose.model('GenericDataEntry', GenericDataEntrySchema);


