var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenericDataEntrySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateUpdatedISO: { type: String, required: true},
    category: String,
    dataType: {type:String, required: true},
    dataObject: Object
  }, 
  { 
    collection: 'genericData' 
  }
);

module.exports = mongoose.model('GenericDataEntry', GenericDataEntrySchema);


