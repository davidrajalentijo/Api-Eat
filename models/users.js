var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    Username : { type : String},
    Password : {type : String},
    Email : { type : String}


});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('User', userSchema);
