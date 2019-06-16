const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


var Schema = mongoose.Schema;

var UserAccountSchema = new Schema(
    {
      email: { type: String, required: true, unique: true},
      name: {type: String, required: false},
      password: { type: String, required: true},
      socialId: { type: String, required: true},
      userSettings: []
    }, 
    { 
      collection: 'userAccount' 
    }
);

UserAccountSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserAccount', UserAccountSchema);