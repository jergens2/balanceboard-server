const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
      email: { type: String, required: true, unique: true},
      password: { type: String, required: true}
    }, 
    { 
      collection: 'user' 
    }
);

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);