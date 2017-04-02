module.exports = function (app) {

    var Receta = require('../models/receta.js');
    var User = require('../models/users.js');
     var fs = require("fs");
    var crypto = require("crypto");

    //GET - Return All the recetas inserted the DB
    findAllRecetas = function (req, res) {
        console.log("GET - /recetas");
        Receta.find(function (err, receta) {
            if(!err){
                res.send(receta);
            }
            else
            {
                console.log('Error: ' + err);
            }
        });
    };

    //GET - Return ONE recetas inserted the DB
    findById = function(req, res) {  
        console.log('GET - /receta/ID');
        Receta.findById(req.params.id, function(err, receta) {
            if(err){ 
                res.send(500, err.message);
            }else{
                res.send(200, receta)}
        });
    };
    //GET - Return recetas inserted the DB by Dificulty
    findByTitle = function(req, res) {  
        console.log('GET - /receta/title');
        console.log(req.query.titulo);
        
        Receta.find({ $text: { $search: req.query.titulo } } , function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }else{    
            res.send(200, receta)}
        })
    };

     //GET - Return recetas inserted the DB by Dificulty
    findByDificultad = function(req, res) {  
        console.log('GET - /receta/dificultad');
        Receta.find({"Dificultad":req.params.dificultad}, function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }else{    
            res.send(200, receta)}
        });
    };

    //GET - Return recetas inserted the DB by Tags
    findByTag = function(req, res) {  
        console.log('GET - /receta/tag');
        Receta.find({"Tags.Tag":req.params.tag}, function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }else{    
            res.send(200, receta)}
        });
    };

     //GET - Return recetas inserted the DB by Tags
    findByIngredient = function(req, res) {  
        console.log('GET - /receta/ingredient');
        Receta.find({"Ingredientes.Ingrediente":req.params.ingrediente}, function(err, receta) {
        if(err){ 
            res.send(500, err.message);
        }else{    
            res.send(200, receta)}
        });
    };

var URL = 'http://ec2-52-56-121-182.eu-west-2.compute.amazonaws.com:3008/';
//var URL = 'http://localhost:3008/img/';
//var pwd = '/home/david/Escritorio/api-WhereEat/public/img/'
var pwd = '/home/ubuntu/Api-Eat/public/img/';
     
    //POST - Insert a new Receta in the DB
    addReceta = function (req, res) {
        User.findById(req.params.id, function(err, user){
        if (!user){
            res.send(404, 'User not found');
        }
        else{
        fs.readFile(req.files.file.path, function (err, data) {
         var id = crypto.randomBytes(16).toString("hex");
        var newPath = pwd + id +req.files.file.name;
        fs.writeFile(newPath, data, function (err) {
        console.log('POST - /receta');
        var receta = new Receta({
        Titulo:  req.body.titulo,
        Username:  req.body.username,
        Ingredientes:  req.body.ingredientes,
        Dificultad:  req.body.dificultad,
        Descripción: req.body.descripcion,
        Tags:  req.body.tags,
        Personas:  req.body.personas,
        Date_Created:  req.body.date,
        Tiempo:  req.body.tiempo,
        user_id: req.params.id,
        imageUrl: URL + id + req.files.file.name

        })

        receta.save(function(err) {
        if(!err) {
            console.log('Created in Receta');
        } else {
             res.send(500, err);
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
                Date_Created : receta.Date_Created,
                Tiempo : receta.Tiempo,
                user_id : receta.user_id,
                imageUrl: receta.imageUrl
        });

        user.Recetas.push(UserReceta);
        user.save(function (err){
               if (!err) {
                       console.log('Created in User Recetas');
                } else {
                        res.send(500, err);
                                }

        });
        res.send(receta);
        });
        });
        };
        
        });
        };

    //UPDATE- Actualiza los datos de un usuario
    updateReceta = function(req, res) {
    Receta.findById(req.params.id, function(err, receta) {
        Titulo:  req.body.titulo;
        Username:  req.body.username;
        Ingredientes:  req.body.ingredientes;
        Dificultad:  req.body.dificultad;
        Descripción: req.body.descripcion;
        //Tags:  req.body.tags;
        Personas:  req.body.personas;
        Date:  req.body.date;
        Tiempo:  req.body.tiempo;
         
//guardamos en la base de datos
        receta.save(function(err) {
            if(!err) {
                console.log('Updated');
                res.send(200);
            } else {
                console.log('ERROR: ' + err);
            }
            res.send(receta);
        });
    });
}

    //DELETE- Borra un usuario de la base de datos
    deleteReceta = function(req, res) {
    Receta.findById(req.params.id, function(err, receta) {
      //borramos en la base de datos
        receta.remove(function(err) {
            if(!err) {
                console.log('Removed');
                res.send(200);

            } else {
                console.log('ERROR: ' + err);
            }
        })
    });
}


//POST - Insert a new Receta in the DB
/*
    getDashboard = function (req, res) {
         var myarray = new Array();
            //myarray = [];
        User.findById(req.params.id, function(err, user){
        if (!user){
            res.send(404, 'User not found');
        }
        else{
            
            var a = user.following;
            console.log(a.length);         

                a.forEach(function(current_value){

                     Receta.find({"user_id":current_value._id},function (err, recetas) {
                    if(!err){
                             
                                  //myarray.push(receta);



                             recetas.forEach(function(receta){
                                console.log(receta);
                                myarray.push(receta);

                                });
                           
                             
                            }
                    else
                            {
                            console.log('Error: ' + err);
                            }                          

                });

                })
                res.send(myarray);
        }
        });
        };*/

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

            } else {
                    reject(err);
                    }
            });
            });
            });

            Promise.all(promises).then(function(allData) {
                
                result = [].concat(...allData);
                res.send(result);
            }).catch(function(error) {
                res.send(error);
            });
        }
  });
};

//58d6b8bb411cc4e115000005
//58c188c03bf370921d000001
    //Link routes and functions
    app.get('/receta', findAllRecetas);
    //app.get('/recetas', orderAllRecetas);   
    app.get('/receta/:id', findById);
    app.get('/receta/dificultad/:dificultad', findByDificultad);
    app.get('/receta/title/title', findByTitle);
    app.get('/receta/tag/:tag', findByTag);
    app.get('/receta/dashboard/:id', getDashboard);
    app.get('/receta/ingrediente/:ingrediente', findByIngredient);
    app.post('/receta/:id', addReceta);
    app.put('/receta/:id', updateReceta);
    app.delete('/receta/:id', deleteReceta);

};



/*
//console.log(user);
            //console.log(user.following);
            //console.log(user.following._id);
            var a = user.following;
            //console.log(a);
            //console.log(user.Recetas);
            var b = a.join(", ");
            var obj = JSON.parse(a);
            console.log(obj);
            var myarray = new Array();
            myarray = [];
            myarray.push(b);
            console.log(myarray);
            console.log(a.join(", "));
            console.log(Object.keys(myarray).length);




            for (i = 0; i < Object.keys(a).length; i++) {
                //console.log("hola");
                //console.log(a);


                Receta.find({"user_id":a._id},function (err, receta) {

                        //console.log("estamos");
                    if(!err){
                             //console.log("ok");
                             //console.log(receta);
                             myarray.push(receta);
                             //console.log(receta);
                            //res.send(receta);
                            //res.send(receta);
                            }
                    else
                            {
                            console.log('Error: ' + err);
                            }

                            //console.log(myarray);
                            
                    });





            }

            a.forEach(function(entry){
                //console.log(entry);
                
                var myarray = [];
                

                    //console.log("hola");


                      Receta.find({"user_id":entry._id},function (err, receta) {

                        //console.log("estamos");
                    if(!err){
                             //console.log("ok");
                             //console.log(receta);
                             myarray.push(receta);
                            //res.send(receta);
                            //res.send(receta);
                            }
                    else
                            {
                            console.log('Error: ' + err);
                            }

                            //console.log(myarray);
                            
                    });




                

              //console.log(recetas);




               //console.log(myarray);


            })
            //console.log(myarray);







Promise.all(prom).then(function(allData) {
res.send(allData);
 
}).catch(function(error) {
    res.send(error);
});
*/