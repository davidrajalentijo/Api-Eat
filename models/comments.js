var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var commentSchema = new Schema({
    user_id :{type: Schema.ObjectId, ref: 'User'},
    Username : {type : String},
    Text : { type : String},
    receta_id : {type: Schema.ObjectId, ref: 'Receta'},
    Date_Created : { type : String},
    ParentID: {type: Schema.ObjectId},
    Answers: [{
        UserID: {type: Schema.ObjectId, ref: 'User'},
        Username: {type: String},
        Answer: {type: String}
    }]
});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('Comments', commentSchema);
