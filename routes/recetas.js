module.exports = function (app) {

    var Receta = require('../models/receta.js');

    findAllRecetas = function (req, res) {
        console.log("GET - /recetas");
        Receta.find(function (err, receta) {
            if(!err){
                console.log('seguimos');
                res.send(receta);
            }
            else
            {
                console.log('Error: ' + err);
            }
        });

    };/*
    orderAllRecetas = function (req, res) {
        console.log("GET - /recetas");
        var cursor = Receta.find().sort({"Date" : 1});
         cursor.each(function(err, receta) {
      assert.equal(err, null);
      if (receta != null) {
         console.dir(receta);
      } else {
         console.log('Error: ' + err);
      }
   });


    };*/

orderAllRecetas = function (req, res) {
        console.log("GET - /recetas");
        Receta.find(function (err, receta) {
            console.log("hello");
            if(!err){
                console.log('seguimos');
                var data = receta.$orderby({"Date" : -1});
                res.send(data);
            }
            else
            {
                console.log('Error: ' + err);
            }
        });

    };




var findRestaurants = function(db, callback) {
   var cursor =db.collection('restaurants').find().sort( { "borough": 1, "address.zipcode": 1 } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};


















    findById = function(req, res) {  
         console.log('GET - /receta/ID');
    Receta.findById(req.params.id, function(err, receta) {
    if(err){ res.send(500, err.message);
}else{
    console.log('GET /receta/' + req.params.id);
        res.send(200, receta)}
    });
};

findByDificultad = function(req, res) {  
         console.log('GET - /receta/dificultad');
    Receta.findOne({"Dificultad":req.params.dificultad}, function(err, receta) {
    if(err){ res.send(500, err.message);
}else{
    console.log('GET /receta/' + req.params.dificultad);
        res.send(200, receta)}
    });
};



     
    //POST - Insert a new User in the DB
    addReceta = function (req, res) {
        console.log('POST - /receta');
        var receta = new Receta({
        Titulo:  req.body.titulo,
        Username:  req.body.username,
        Ingredientes:  req.body.ingredientes,
        Dificultad:  req.body.dificultad,
        Descripción: req.body.descripcion,
       Tags:  req.body.tags,
        Personas:  req.body.personas,
        Date:  req.body.date,
        Tiempo:  req.body.tiempo

        })
        console.log(receta);

        receta.save(function(err) {
        if(!err) {
            console.log('Created');
        } else {
            console.log('ERROR: ' + err);
        }
    });

res.send(receta);
 
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
            } else {
                console.log('ERROR: ' + err);
            }
        })
    });
}






    //Link routes and functions
    app.get('/receta', findAllRecetas);
    app.get('/recetas', orderAllRecetas);   
    app.get('/receta/:id', findById);
    app.get('/receta/dificultad/:dificultad', findByDificultad);
    app.post('/receta', addReceta);
    app.put('/receta/:id', updateReceta);
    app.delete('/receta/:id', deleteReceta);

};