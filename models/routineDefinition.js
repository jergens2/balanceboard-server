var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var RoutineDefinitionSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    routineTreeId: {type: String, required: true },
    name: {type: String, required: true },
    frequency: {type: Schema.Types.Mixed, required: true },
    timeOfDay: {type: String, required: true },
    timeOfDayRanges: {type: [Schema.Types.Mixed], required: true },
    activityIds: {type: [String], required: true },
    childOfRoutineId: {type: String, required: true },
  }, 
  { 
    collection: 'routineDefinition' 
  }
);

//Export model
module.exports = mongoose.model('RoutineDefinition', RoutineDefinitionSchema);
