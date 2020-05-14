const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


var Schema = mongoose.Schema;

var UserAccountSchema = new Schema(
    {
      email: { type: String, required: true, unique: true},
      username: {type: String, required: true, unique: true},
      usernameStylized: {type: String, required: true },
      password: { type: String, required: true},
      pin: {type: String, required: true},
      registeredAt: {type: String, required: false},
      registrationCode: {type: String, required: false},
    }, 
    { 
      collection: 'userAccount' 
    }
);

UserAccountSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserAccount', UserAccountSchema);