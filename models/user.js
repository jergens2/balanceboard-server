var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

var User = mongoose.model('User', userSchema);