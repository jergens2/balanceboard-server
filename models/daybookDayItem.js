var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DaybookDayItemSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateYYYYMMDD: {type: String, require: true},

    // -DataItem suffix types are data which represent the actual record in the database, not a reference. 
    daybookTimelogEntryDataItem: { type: [Schema.Types.Mixed], required: true },
    daybookActivityDataItem: { type: [Schema.Types.Mixed], required: true },
    dailyTaskListDataItem: { type: [Schema.Types.Mixed], required: true },

    // These represent references to data stored in other tables in the database.
    // eventually, convert the types from [String] to [Schema.Types.ObjectId]
    dayTemplateId: { type: [String], required: true },
    scheduledEventIds: { type: [String], required: true },
    notebookEntryIds: { type: [String], required: true },
    taskItemIds: { type: [String], required: true },
  }, 
  { 
    collection: 'daybookDayItem' 
  }
);

//Export model
module.exports = mongoose.model('DaybookDayItem', DaybookDayItemSchema);
