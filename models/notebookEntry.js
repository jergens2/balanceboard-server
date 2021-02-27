var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var NotebookEntrySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    journalDateISO: { type: String, required: true },
    dateCreatedISO: { type: String, required: true },
    dateModifiedISO: { type: String, required: true },
    type: { type: Number, required: true },
    textContent: { type: String, required: true },
    tags: { type: [String], required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: 'notebook'
  }
);

//Export model
module.exports = mongoose.model('NotebookEntry', NotebookEntrySchema);


