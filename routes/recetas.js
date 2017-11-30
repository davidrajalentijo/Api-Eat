module.exports = function (app) {
var Receta = require('../models/receta.js');
var User = require('../models/users.js');
var Rate = require('../models/rate.js');
var Comment = require('../models/comments.js');
var fs = require("fs");
var crypto = require("crypto");

//Return All the recipes inserted the DB
findAllRecetas = function (req, res) {
    Receta.find(function (err, receta) {
        if(!err){
            res.send(200, receta);
        }
        else
        {
            console.log(500, err.message);
        }
    });
};

// Return Recipe by ID
findById = function(req, res) {
    Receta.findById(req.params.id, function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }
        else{
            res.send(receta)
        }
    });
}

//Return recipe by Title
findByTitle = function(req, res) {  
    Receta.find({ $text: { $search: req.query.titulo } } , function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }
        else{    
            res.send(200, receta)}
    })
};

//Return recipe by Dificulty
findByDificultad = function(req, res) {  
    Receta.find({"Dificultad":req.params.dificultad}, function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }
        else{    
            res.send(200, receta)}
    });
};

//Return recipe by Tag
findByTag = function(req, res) {  
    Receta.find({"Tags.Tag":req.params.tag}, function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }
        else{    
            res.send(200, receta)}
    });
};

//Return recipe by Rating
findByRating = function(req, res) {  
    Receta.find(function (err, receta) {
        if(!err){
            var a = receta.Rating;
            var sorted = receta.sort(function(a,b){return b.Rating-a.Rating});
            var top = sorted.slice(0, 100);
            res.send(top);
        }
        else
        {
            console.log('Error: ' + err);
        }
    });
};

//Return comments of a Recipe sorted by date
findCommentsByReceta = function(req, res){
    Receta.findById(req.params.id, function(err, receta) {
        if (err){
            res.send(500, err.message);
        }
        else{
            var array = receta.Comments;
            var sorted = array.sort(function(a,b){
                return new Date(a.Date_Created) - new Date(b.Date_Created);
            });
            res.send(200, sorted);
        }

    });
};

//Return Last comments of a Recipe sorted by date
getLastCommentsByReceta = function(req, res){
    Receta.findById(req.params.id, function(err, receta) {
        if (err){
            res.send(500, err.message);
        }
        else{
            var array = receta.Comments;
            var sorted = array.sort(function(a,b){
                return new Date(a.Date_Created) - new Date(b.Date_Created);
            });
            var last = sorted.slice((sorted.length - 4), sorted.length);
            res.send(200, last);
        }
    });
};

//Return Recipes by Ingrediente
findByIngredient = function(req, res) {  
    Receta.find({"Ingredientes.Ingrediente":req.params.ingrediente}, function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }
        else{    
            res.send(200, receta)}
    });
};

//Return rating of User in one Recipe
getUserRating = function(req, res) {  
    Receta.findOne({"_id": req.params.id}, function(err, receta) {
        var array = receta.Ratings;
        var rated;
        if( array.length == 0){
            rated = 0;
        }
        else{
            array.forEach(function(ratings) {
                if (ratings.user_id == req.params.userid){
                    rated = ratings.Rating;
                }
                else{
                    rated = 0;
                }
            });
        }    
        res.send(200, rated);
    })
};


var URL = 'http://ec2-52-56-121-182.eu-west-2.compute.amazonaws.com:3008/';
//var URL = 'http://localhost:3008/img/';
//var pwd = '/home/david/Escritorio/api-WhereEat/public/img/'
var pwd = '/home/ubuntu/Api-Previous/Api-Eat/public/';
     
//Insert a new Receta in the Database
addReceta = function (req, res) {
    var datos2 = JSON.parse(req.body.info);                
    if (datos2.titulo == '' || datos2.username == '' || datos2.ingredientes == '' || datos2.dificultad == '' || datos2.descripcion == '' || datos2.personas == '' || datos2.tiempo == '' || datos2.titulo == null || datos2.username == null || datos2.ingredientes == null || datos2.dificultad == null || datos2.descripcion == null || datos2.personas == null || datos2.tiempo == null || req.files.file.originalFilename == '' || req.files.file.originalFilename == null){
        res.send(400, 'Please, complete all the fields');
    }
    else if (datos2.titulo.length > 15){
        res.send(400, 'Title can only have 15 characters');
    } 
    else if (datos2.personas.length > 3){
        res.send(400, 'You can only introduce maximum three numbers in People');
    }
    else if (datos2.descripcion < 10){
        res.send(400, 'Description minimum have to have 10 characters');        
    }
    var array = datos2.ingredientes;
    array.forEach(function(ingrediente) {
            if (ingrediente.Ingrediente.length > 20){
                res.send(400, 'Ingredients name only can have 15 characters');
            }
            else if (ingrediente.Cantidad.length > 20){
                res.send(400, 'Quantity only can have 10 characters');
            }
            else if (ingrediente.Ingrediente == '' || ingrediente.Ingrediente == null){
                res.send(400, 'Some Ingredient is empty')
            }
            else if (ingrediente.Cantidad == '' || ingrediente.Cantidad == null){
                res.send(400, 'Some Quantity is empty')
            }
        });

    User.findById(req.params.id, function(err, user){
        if (!user){
            res.send(404, 'User not found');
        }
        else{
            fs.readFile(req.files.file.path, function (err, data) {
                var id = crypto.randomBytes(16).toString("hex");
                var newPath = pwd + id +req.files.file.originalFilename;
                    fs.writeFile(newPath, data, function (err) {
                        var date_created = new Date();
                        var date  = date_created.toISOString().slice(0,10);
                        var receta = new Receta({
                            Titulo:  datos2.titulo,
                            Username:  datos2.username,
                            Ingredientes:  datos2.ingredientes,
                            Dificultad:  datos2.dificultad,
                            Descripción: datos2.descripcion,
                            Personas:  datos2.personas,
                            Date_Created: date_created,
                            Tiempo:  datos2.tiempo,
                            user_id: req.params.id,
                            imageUrl: URL + id + req.files.file.originalFilename
                        })
                        receta.save(function(err) {
                            if(!err) {
                                console.log('Created in Receta');
                            } 
                            else {
                                console.log(error);
                            }
                        });
                        var UserReceta = ({
                            _id: receta._id,
                            Titulo : receta.Titulo,
                            Username : receta.Username,
                            Descripción : receta.Descripción,
                            Ingredientes : receta.Ingredientes,
                            Dificultad : receta.Dificultad,
                            Tags : receta.Tags,
                            Personas : receta.Personas,
                            Date_Created: date_created,
                            Tiempo : receta.Tiempo,
                            user_id : receta.user_id,
                            imageUrl: receta.imageUrl
                        });
                        user.Recetas.push(UserReceta);
                        user.save(function (err){
                            if (!err) {
                                console.log('Created in User Recetas');
                            } 
                            else {
                                res.send(500, err);
                            }
                        });
                        res.send(receta);
                    });
            });
        };
    });
};

//Update information of Recipe
updateReceta = function(req, res) {
    if (req.body.ingredientes == '' || req.body.dificultad == '' || req.body.descripcion == '' || req.body.personas == '' || req.body.tiempo == '' || req.body.ingredientes == null || req.body.dificultad == null || req.body.descripcion == null || req.body.personas == null || req.body.tiempo == null){
        res.send(400, 'Please, complete all the fields');
    }
    else if (req.body.personas.length > 3){
        res.send(400, 'You can only introduce maximum three numbers in People');
    }
    var array = req.body.ingredientes;
    array.forEach(function(ingrediente) {
            if (ingrediente.Ingrediente.length > 20){
                res.send(400, 'Ingredients name only can have 15 characters');
            }
            else if (ingrediente.Cantidad.length > 20){
                res.send(400, 'Quantity only can have 10 characters');
            }
            else if (ingrediente.Ingrediente == '' || ingrediente.Ingrediente == null){
                res.send(400, 'Some Ingredient is empty')
            }
            else if (ingrediente.Cantidad == '' || ingrediente.Cantidad == null){
                res.send(400, 'Some Quantity is empty')
            }
        });

    User.findById(req.params.iduser, function (err, user) {
        if (!user) {
            res.send(404, 'User not found');
        }
        else{
            var array = user.Recetas;
            for (var i = 0; i < array.length; i++) { 
                if (array[i]._id == req.params.idreceta) { 
                    result = array[i];
                    if (req.body.ingredientes != null) result.Ingredientes = req.body.ingredientes;
                    if (req.body.dificultad != null) result.Dificultad = req.body.dificultad;
                    if (req.body.descripcion != null) result.Descripción = req.body.descripcion;
                    if (req.body.personas != null) result.Personas = req.body.personas;
                    if (req.body.tiempo != null) result.Tiempo = req.body.tiempo;
                    break;
                } 
            }
            user.save(function(err){
                if(!err){
                    console.log('saved');
                }
                else{
                    console.log('ERROR: ' + err);
                }
            })
        }
    });
    Receta.findById(req.params.idreceta, function(err, receta) {
        if (!receta) {
            res.send(404, 'Receta not found');
        }
        else{    
            //Titulo:  req.body.titulo;
            if (req.body.ingredientes != null) receta.Ingredientes = req.body.ingredientes;
            if (req.body.dificultad != null) receta.Dificultad = req.body.dificultad;
            if (req.body.descripcion != null) receta.Descripción = req.body.descripcion;
            if (req.body.personas != null) receta.Personas = req.body.personas;
            if (req.body.tiempo != null) receta.Tiempo = req.body.tiempo;
            receta.save(function(err) {
                if(!err) {
                console.log('Updated');
                } 
                else {
                console.log('ERROR: ' + err);
                }
            });
            res.send(receta);
        }
    });
}

//Delete Recipe from the Database
deleteReceta = function(req, res) {
    
    User.findOne({"Recetas._id": req.params.id}, function(err, user) {
        var array = user.Recetas;
        for (var i = 0; i < array.length; i++){
            if (array[i]._id == req.params.id){
                array.splice(i, 1);
                break;
            }                            
        }
        user.Recetas = array;
        user.save(function(err){
            if(!err){
                console.log("OK");
            }
            else{
                console.log("error");
            }
        })
    })
   
    Comment.find({"receta_id": req.params.id}, function(err, comments) {
        var array = comments;
        console.log(array.length);
        array.forEach(function(comment) {
            comment.remove(function(err) {
                if(!err) {
                    console.log("OK");
                } 
                else {
                    console.log('ERROR: ' + err);
                }
            })
        }) 
    })

    Receta.findById(req.params.id, function(err, receta) {
        receta.remove(function(err) {
            if(!err) {
                console.log("OK");
            } 
            else {
                console.log('ERROR: ' + err);
            }
        })
    }); 
    res.send(200);  

}

//Rate one Recipe
addRating = function (req, res) {
    Receta.findById(req.params.id, function(err, receta){
            if(!receta){
                res.send(404, 'Receta not found');
            }
            else{
                var array = receta.Ratings
                var rated;
                var refresh;
                array.forEach(function(rating){
                    if (rating.user_id == req.body.userid){
                        rating.Rating = req.body.rating;
                        refresh = rating;
                        rated = "Rated";
                        
                }});
                if (rated == "Rated"){
                    var total = 0;
                    array.forEach(function(rating) {
                    total += rating.Rating;
                    });
                    var puntuacion = total/array.length;
                    receta.Ratings = array;
                    receta.Rating = puntuacion;
                    receta.save(function(err){
                        if(!err){
                            console.log("Updated");
                        }
                        else{
                            console.log(err);
                        }
                        res.send(receta);
                    })

                }
                else{
                                    //add element in the array
               
                var element = {
                        Rating: req.body.rating,
                        user_id : req.body.userid,
                        receta_id : req.params.id
                };

                array.push(element);

                //Hemos añadido un nueva puntuacion en el array
                //ahora tenemos que volver a calcular el rating total
                var total = 0;
                array.forEach(function(rating) {
                    total += rating.Rating;
                }); 
                var puntuacion = total/array.length;
                receta.Ratings = array;
                receta.Rating = puntuacion;
                //editamos la puntuacion total
                //un mismo usuario no puede volver a puntuar 
                receta.save(function(err) {
                if(!err) {
                console.log('Updated');
                //res.send(200);
                } else {
                console.log('ERROR: ' + err);
                }
                res.send(receta);
                });  
                
                }




            }
        });
    }

//Return the Dashboard
getDashboard = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (!user) {
            res.send(404, 'User not found');
        }
        else {
            var a = user.following;
            var promises = a.map(function(current_value) {
                return new Promise(function(resolve, reject) {
                    Receta.find({"user_id":current_value._id}, function (err, recetas) {
                        if(!err) {              
                            resolve(recetas);
                        } 
                        else {
                            reject(err);
                        }
                    });
                });
            });

            Promise.all(promises).then(function(allData) {
                //Produccion
                var result = allData.reduce(function(prev,curv){
                    return prev.concat(curv)}, []);;
                //result = [].concat(...allData);
                var sorted = result.sort(function(a,b) { 
                    return new Date(b.Date_Created).getTime() - new Date(a.Date_Created).getTime() 
                });
                res.send(sorted);
            }).catch(function(error) {
                res.send(error);
            });
        }
  });
};

//Link routes and functions
app.get('/receta', findAllRecetas);
app.get('/receta/:id', findById);
app.get('/receta/comments/:id', findCommentsByReceta);
app.get('/receta/lastcomments/:id', getLastCommentsByReceta)
app.get('/receta/dificultad/:dificultad', findByDificultad);
app.get('/receta/title/title', findByTitle);
app.get('/receta/tag/:tag', findByTag);
app.get('/receta/dashboard/:id', getDashboard);
app.get('/receta/ingrediente/:ingrediente', findByIngredient);
app.post('/receta/:id', addReceta);
app.put('/receta/:iduser/edit/:idreceta', updateReceta);
app.put('/receta/rating/:id', addRating);
app.delete('/receta/:id', deleteReceta);
app.get('/ratings', findByRating);
app.get('/receta/:id/rating/user/:userid', getUserRating);

};



