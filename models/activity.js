var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ActivitySchema = new Schema(
  {
    name: {type: String, required: true}
  }
);

//Export model
module.exports = mongoose.model('Activity', ActivitySchema);