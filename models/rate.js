var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RatingsSchema = new Schema({
    Rating:{type:Number,default:0},
    user_id :{type: Schema.ObjectId, ref: 'User'},
    receta_id : {type: Schema.ObjectId, ref: 'Receta'},
});

RatingsSchema.statics.avg = function(wineId){
    console.log("average");
    return new Promise((resolve, reject) => {
        this.aggregate([{
            $match: {
                receta: new ObjectId(wineId)
            }
        }, {
            $group: {
                _id: '$receta',
                Rating: {
                    $avg: '$Rating'
                }
            }
        }], (error, results) => {
            if(error) return reject(error);
            return resolve(results);
        });
        console.log(results);
    });
};



//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('Rate', RatingsSchema);
