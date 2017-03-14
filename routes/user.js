module.exports = function (app) {

    var User = require('../models/users.js');

    findAllUsers = function (req, res) {
        console.log("GET - /users");
        User.find(function (err, user) {
            if(!err){
                console.log('seguimos');
                res.send(user);
            }
            else
            {
                console.log('Error: ' + err);
            }
        });

    };

    findById = function(req, res) {  
         console.log('GET - /user/ID');
    User.findById(req.params.id, function(err, users) {
    if(err){ res.send(500, err.message);
}else{
    console.log('GET /user/' + req.params.id);
        res.send(200, users)}
    });
};

findByEmail = function(req, res) {  
         console.log('GET - /user/email');
    User.findOne(req.params.email, function(err, users) {
    if(err){ res.send(500, err.message);
}else{
    console.log('GET /user/' + req.params.email);
        res.send(200, users)}
    });
};



     
    //POST - Insert a new User in the DB
    addUser = function (req, res) {
        console.log('POST - /user');
        var user = new User({
        Username:  req.body.username,
        Password:  req.body.password,
        Email:  req.body.email       
        })
        console.log(user);

        user.save(function(err) {
        if(!err) {
            console.log('Created');
        } else {
            console.log('ERROR: ' + err);
        }
    });

res.send(user);
 
    };
    //UPDATE- Actualiza los datos de un usuario
    updateUser = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        Username:    req.body.username;
        Password:     req.body.password;
        Email:  req.body.email;
         
//guardamos en la base de datos
        user.save(function(err) {
            if(!err) {
                console.log('Updated');
            } else {
                console.log('ERROR: ' + err);
            }
            res.send(user);
        });
    });
}

    //DELETE- Borra un usuario de la base de datos
    deleteUser = function(req, res) {
    User.findById(req.params.id, function(err, user) {
      //borramos en la base de datos
        user.remove(function(err) {
            if(!err) {
                console.log('Removed');
            } else {
                console.log('ERROR: ' + err);
            }
        })
    });
}






    //Link routes and functions
    app.get('/user', findAllUsers);
    app.get('/user/:id', findById);
    app.get('/user/email/:email', findByEmail);
    app.post('/user', addUser);
    app.put('/user/:id', updateUser);
    app.delete('/user/:id', deleteUser);

};