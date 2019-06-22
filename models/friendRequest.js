var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var FriendRequestSchema = new Schema(
  {
    requesterId: {type: String, required: true },
    recipientId: {type: String, required: true},
    dateISO: {type: String, required: true },
  }, 
  { 
    collection: 'friendRequest' 
  }
);

//Export model
module.exports = mongoose.model('FriendRequest', FriendRequestSchema);

