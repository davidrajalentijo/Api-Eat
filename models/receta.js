var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tags = new Schema({
    Tag: {type: String}
});
var Ingredientes = new Schema({
    Ingrediente: {type: String},
    Cantidad: {type : Number}
});

var recetaSchema = new Schema({
    Titulo : { type : String},
    Username : {type : String},
    Descripción : { type : String},
    Ingredientes : [Ingredientes],
    Dificultad : { type : String, enum: ['Beginner', 'Initiated', 'Professional']},
    Tags : [Tags],
    Personas : { type : Number},
    Date : { type : String, format: "YYYY-MM-DD"},
    Tiempo : { type : String, format: "HH:mm"}


});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('Receta', recetaSchema);
