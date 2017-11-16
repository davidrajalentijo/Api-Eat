var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Ingredientes = new Schema({
    Ingrediente: {type: String},
    Cantidad: {type : String}
});

var Following = new Schema({
	_id: {type: Schema.ObjectId, ref: 'User'}
});

var Followers = new Schema({
	_id: {type: Schema.ObjectId, ref: 'User'}
});

var RecetaSchema = new Schema({
	_id: {type: Schema.ObjectId, ref: 'Recetas'},
    user_id :{type: Schema.ObjectId, ref: 'User'},
    Titulo : { type : String},
    Username : {type : String},
    Descripción : { type : String},
    Ingredientes : [Ingredientes],
    Dificultad : { type : String, enum: ['Beginner', 'Initiated', 'Professional']},
    imageUrl: {type: String},
    Personas : { type : Number},
    Date_Created : { type : String},
    Tiempo : { type : String, format: "HH:mm"},
    imageUrl: {type: String, default:'http://ec2-52-56-121-182.eu-west-2.compute.amazonaws.com:3008/user.png'},


});

var userSchema = new Schema({
    Username : { type : String},
    Password : {type : String},
    Email : { type : String},
    Recetas: [RecetaSchema],
    imageUrl: {type: String, default:'http://ec2-52-56-121-182.eu-west-2.compute.amazonaws.com:3008/user.png'},
    followers: [ Followers],
    following: [ Following]
});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('User', userSchema);
