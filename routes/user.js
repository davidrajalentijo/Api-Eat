module.exports = function (app) {

    var User = require('../models/users.js');
    var fs = require("fs");
    var crypto = require("crypto");


    findAllUsers = function (req, res) {
        console.log("GET - /users");
        User.find(function (err, user) {
            if(!err){
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
    findUserRecetas = function(req, res) {  
         console.log('GET - /user/ID');
    User.findById(req.params.id, function(err, users) {
    if(err){ res.send(500, err.message);
    }else{
    console.log('GET /user/' + req.params.id);
        res.send(200, users.Recetas)}
    });
};

findByUsername = function(req, res) {  
        console.log('GET - /user/ID');
        User.find({"Username": req.params.username}, function(err, users) {
        if(err){ res.send(500, err.message);
        }else{
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
    followUser = function (req, res) {

        User.findOneAndUpdate({_id: req.params.id},{$addToSet : {"following":{"_id": req.params.idfollow}}},{}, function(err, user) {
             if(err) {
               res.send(err);
           }
           User.findOneAndUpdate(
               {_id: req.body._id},
               {$addToSet : {"followers": {"_id": user._id}}},
               {},
               function(err, user2) {
                   if(err) {
                       res.send(err);
                   }

                      User.findOneAndUpdate({_id: req.params.idfollow},{$addToSet : {"followers":{ "_id": req.params.id}}},{}, function(err, user) {
             if(err) {
               res.send(err);
           }
           else{
            console.log("ok");
           }

           res.send(200, user);

       });
                  
               }
           )
});
 }


     unfollowUser = function (req, res) {

        User.findOneAndUpdate({_id: req.params.id},{$pull : {"following": {"_id": req.params.idfollow}}},{}, function(err, user) {
             if(err) {
               res.send(err);
           }
           User.findOneAndUpdate(
               {_id: req.body._id},
               {$pull : {"followers": { "_id": user._id}}},
               {},
               function(err, user2) {
                   if(err) {
                       res.send(err);
                   }

                      User.findOneAndUpdate({_id: req.params.idfollow},{$pull : {"followers": { "_id": req.params.id}}},{}, function(err, user) {
             if(err) {
               res.send(err);
           }
           else{
            console.log("ok");
           }

           res.send(200, user);

       });
                  
               }
           )
});
 }



var URL = 'http://ec2-52-56-121-182.eu-west-2.compute.amazonaws.com:3008/';
//var URL = 'http://localhost:3008/img/';
//var pwd = '/home/david/Escritorio/api-WhereEat/public/img/'
var pwd = '/home/ubuntu/Api-Eat/public/img/';

     
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

    //POST - Insert a photo User in the DB
    addPhotoUser = function (req, res) {


User.findById(req.params.id, function(err, user) {
fs.readFile(req.files.file.path, function (err, data) {
  var id = crypto.randomBytes(16).toString("hex");
  var newPath = pwd + id +req.files.file.name;
  fs.writeFile(newPath, data, function (err) {
    imageUrl: URL + id + req.files.file.name;

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
});
});
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
                res.send(200);
            } else {
                console.log('ERROR: ' + err);
            }
        })
    });
}

 getFollowing = function (req, res) {
  User.findById(req.params.id, function (err, user) {
        if (!user) {
            res.send(404, 'User not found');
        }
        else {
            var a = user.following;
            var promises = a.map(function(current_value) {
            return new Promise(function(resolve, reject) {
            User.findById(current_value._id, function (err, users) {
              console.log(current_value);
            if(!err) {            
                    resolve(users);

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

 getFollowers = function (req, res) {
  User.findById(req.params.id, function (err, user) {
        if (!user) {
            res.send(404, 'User not found');
        }
        else {
            var a = user.followers;
            var promises = a.map(function(current_value) {
            return new Promise(function(resolve, reject) {
            User.findById(current_value._id, function (err, users) {
              console.log(current_value);
            if(!err) {            
                    resolve(users);

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



    //Link routes and functions
    app.get('/user', findAllUsers);
    app.get('/user/:id', findById);
    app.get('/user/email/:email', findByEmail);
    app.get('/user/following/:id', getFollowing);
    app.get('/user/followers/:id', getFollowers);
    app.get('/user/username/:username', findByUsername);
    app.get('/user/recetas/:id', findUserRecetas);
    app.post('/user', addUser);
    app.post('/user/me/:id/follow/:idfollow', followUser);
    app.post('/user/me/:id/unfollow/:idfollow', unfollowUser);
    app.put('/user/:id', updateUser);
    app.put('/user/photo/:id', addPhotoUser);
    app.delete('/user/:id', deleteUser);

    


    

};
















