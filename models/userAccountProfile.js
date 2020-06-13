const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var UserAccountProfileSchema = new Schema(
    {
      userId: { type: String, required: true, unique: true },
      userProfile: { type: Schema.Types.Mixed, required: true },
    }, 
    { 
      collection: 'userAccountProfile' 
    }
);

UserAccountProfileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserAccountProfile', UserAccountProfileSchema);