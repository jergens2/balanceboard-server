var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var JournalEntrySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: false},
    forDateISO: {type: String, required: false},
    dateCreatedISO: {type: String, required: true},
    dateModifiedISO: {type: String, required: true},
    type: String,
    textContent: String,
    tags: [String]
  }, 
  { 
    collection: 'journal' 
  }
);

//Export model
module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
