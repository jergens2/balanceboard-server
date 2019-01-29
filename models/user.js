const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
      email: { type: String, required: true, unique: true},
      name: {type: String, required: false},
      password: { type: String, required: true},
      userSettings: []
    }, 
    { 
      collection: 'user' 
    }
);

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);