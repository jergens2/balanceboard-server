var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorizedActivitySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    name: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    timeMarkId: { type: Schema.Types.ObjectId, ref: 'TimeMark', required: true},
    parentCategoryId: {type: Schema.Types.ObjectId, ref: 'CategorizedActivity'},
    // childrenCategories: [CategorizedActivity],
    childrenCategories: [String],
    icon: String,
    color: String,
    description: String,
  }, 
  { 
    collection: 'categorizedActivity' 
  }
);

//Export model
module.exports = mongoose.model('CategorizedActivity', CategorizedActivitySchema);
