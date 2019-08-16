var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var RecurringTaskDefinitionSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {type: String, require: true},
    groupIds: [String],
    activityTreeId: String,
    repititions: {type: [], required: true },
    
  }, 
  { 
    collection: 'recurringTaskDefinition_rework' 
  }
);

//Export model
module.exports = mongoose.model('RecurringTask', RecurringTaskDefinitionSchema);
