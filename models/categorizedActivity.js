var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorizedActivitySchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    treeId: {type: String, required: true},
    name: {type: String, required: true},
    description: String,

    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },

    parentTreeId: String,
    // childrenCategories: [String],

    icon: String,
    color: String,
    
  }, 
  { 
    collection: 'categorizedActivity' 
  }
);

//Export model
module.exports = mongoose.model('CategorizedActivity', CategorizedActivitySchema);
