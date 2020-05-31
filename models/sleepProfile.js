var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SleepProfileSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    previousFallAsleepTime: { type: String, required: true },
    previousFallAsleepUTCOffset: { type: Number, required: true },
    previousWakeupTime: { type: String, required: true },
    previousWakeupUTCOffset: { type: Number, required: true },
    energyAtWakeup:  { type: Number, required: true },
    nextFallAsleepTime: { type: String, required: true },
    nextFallAsleepUTCOffset: { type: Number, required: true },
    nextWakeupTime: { type: String, required: true },
    nextWakeupUTCOffset: { type: Number, required: true },
  }, 
  { 
    collection: 'sleepManagerProfile' 
  }
);

//Export model
module.exports = mongoose.model('SleepManagerProfile', SleepProfileSchema);


