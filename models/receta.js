var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tags = new Schema({
    Tag: {type: String}
});
var Ingredientes = new Schema({
    Ingrediente: {type: String},
    Cantidad: {type : Number}
});
var IndividualRating = new Schema({
    Rating: {type:Number,default:0}
});
    var Ratings = new Schema({
    Rating:{type:Number},
    user_id :{type: Schema.ObjectId, ref: 'User'},
    receta_id : {type: Schema.ObjectId, ref: 'Receta'},
});


var CommentsSchema = new Schema({
    user_id :{type: Schema.ObjectId, ref: 'User'},
    Username : {type : String},
    Text : { type : String},
    receta_id : {type: Schema.ObjectId, ref: 'Receta'},
    Date_Created : { type : String},
        Answers: [{
        UserID: {type: Schema.ObjectId, ref: 'User'},
        Username: {type: String},
        Answer: {type: String}
    }]
});

var recetaSchema = new Schema({
    Titulo : { type : String},
    user_id :{type: Schema.ObjectId, ref: 'User'},
    Username : {type : String},
    Descripción : { type : String},
    Ingredientes : [Ingredientes],
    Dificultad : { type : String, enum: ['Beginner', 'Initiated', 'Professional']},
    Tags : [Tags],
    imageUrl: {type: String},
    Personas : { type : Number},
    Date : { type : String, format: "YYYY-MM-DD"},
    Date_Created : { type : String},
    Tiempo : { type : String, format: "HH:mm"},
    Rating : {type : Number, default:0},
    Ratings : [Ratings],
    Comments: [CommentsSchema],
    imageUrl: {type: String, default:'http://ec2-52-56-121-182.eu-west-2.compute.amazonaws.com:3008/user.png'},


});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('Receta', recetaSchema);
