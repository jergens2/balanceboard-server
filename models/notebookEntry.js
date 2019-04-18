var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var NotebookEntrySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: false},
    forDateISO: {type: String, required: false},
    dateCreatedISO: {type: String, required: true},
    dateModifiedISO: {type: String, required: true},
    type: Number,
    textContent: String,
    tags: [String]
  }, 
  { 
    collection: 'notebook' 
  }
);

//Export model
module.exports = mongoose.model('NotebookEntry', NotebookEntrySchema);
