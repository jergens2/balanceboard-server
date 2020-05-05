const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


var Schema = mongoose.Schema;

var UserAccountSchema = new Schema(
    {
      email: { type: String, required: false, unique: true},
      username: {type: String, required: true, unique: true},
      password: { type: String, required: true},
    }, 
    { 
      collection: 'userAccount' 
    }
);

UserAccountSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserAccount', UserAccountSchema);