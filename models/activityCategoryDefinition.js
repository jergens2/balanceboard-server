var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ActivityCategoryDefinitionSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    treeId: {type: String, required: true},
    parentTreeId: {type: String, required: true},

    name: {type: String, required: true},
    description: {type: String, required: true},
    color: {type: String, required: true},
    icon: {type: String, required: false},

    durationSetting: {type: String, required: true},
    specifiedDurationMinutes: {type: Number, required: false},
    

    scheduleConfiguration: {type: Schema.Types.Mixed, required: false},
    currentPointsConfiguration: {type: Schema.Types.Mixed, required: false},
    pointsConfigurationHistory: {type: [Schema.Types.Mixed], required: false},


    isRoutine: {type: Boolean, required: true},
    routineMembersActivityIds: {type: [Schema.Types.Mixed], required: false},

    isConfigured: {type: Boolean, required: true},
  }, 
  { 
    collection: 'activityCategoryDefinition_rework' 
  }
);

//Export model
module.exports = mongoose.model('ActivityCategoryDefinition', ActivityCategoryDefinitionSchema);
