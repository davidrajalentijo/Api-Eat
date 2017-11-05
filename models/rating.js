    var mongoose = require('mongoose');
	var Schema = mongoose.Schema;



    var RatingSchema = new Schema({
    Rating:{type:Number},
    user_id :{type: Schema.ObjectId, ref: 'User'},
    receta_id : {type: Schema.ObjectId, ref: 'Receta'},
	});

module.exports = mongoose.model('Rating', RatingSchema);