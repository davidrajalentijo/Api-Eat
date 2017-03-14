var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var recipeSchema = new Schema({  
  name:    { type: String },
  duration:     { type: Number },
  difficulty:  { type: String },
 
});

module.exports = mongoose.model('Recipe', receipSchema);  
