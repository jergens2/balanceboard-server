var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SleepProfileSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    previousWakeupTime: { type: String, required: true },
    energyAtWakeup:  { type: Number, required: true },
    nextFallAsleepTime: { type: String, required: true },
    nextWakeupTime: { type: String, required: true },
  }, 
  { 
    collection: 'sleepManagerProfile' 
  }
);

//Export model
module.exports = mongoose.model('SleepManagerProfile', SleepProfileSchema);
