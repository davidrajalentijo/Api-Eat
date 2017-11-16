module.exports = function (app) {

var User = require('../models/users.js');
var Receta = require('../models/receta.js');
var Comment = require('../models/comments.js');
var fs = require("fs");
var crypto = require("crypto");
var jwt = require('jwt-simple'); 
var moment = require('moment');
var Secret = require('../config/config.js');
      

function encrypt(user, pass) {
  var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex')
  return hmac
}

//Get All Users in the Database
findAllUsers = function (req, res) {
  User.find(function (err, users) {
    if(!err){
      res.send(users);
    }
    else
    {
      console.log('Error: ' + err);
    }
  });
};

//Search One User by ID
findById = function(req, res) {  
  User.findById(req.params.id, function(err, user) {
    if(err){ 
      res.send(500, err.message);
    }
    else{
      res.send(200, user)
    }
  });
};

//Return All the Receipts from an user
findUserRecetas = function(req, res) {  
  User.findById(req.params.id, function(err, users) {
    if(err){ 
      res.send(500, err.message);
    }
    else{
      res.send(200, users.Recetas)}
  });
};

//Return One User by Username
findByUsername = function(req, res) {  
  User.find({"Username": req.params.username}, function(err, user) {
    if(err){ 
      res.send(500, err.message);
    }
    else{
      res.send(200, user)
    }  
  });
};

//Return One User by Email
findByEmail = function(req, res) {  
  User.findOne(req.params.email, function(err, users) {
    if(err){ 
      res.send(500, err.message);
    }
    else{
      res.send(200, users)
    }
  });
};

//LogIn User
logIn = function (req, res) {
  User.findOne({"Username": req.body.username}, function (err, user) {
    if (err) throw err;
      if (!user) {
        res.send(404, 'Username incorrect');
      } 
      else if (user) {
        var Password = encrypt(user.Username, req.body.password);
          if (user.Password != Password){
            res.send(404, 'Password error');
          }
          else{
            var expires = moment().add(2, 'days').valueOf();
            var token = jwt.encode({iss: user._id, exp: expires, username: user.Username}, Secret.TOKEN_SECRET);
            res.send(200, token);                  
          }
      }
  });
};

//Follow User
followUser = function (req, res) {
  User.findOneAndUpdate({_id: req.params.id},{$addToSet : {"following":{"_id": req.params.idfollow}}},{}, function(err, user) {
    if(err) {
      res.send(err);
    }
    User.findOneAndUpdate({_id: req.body._id},{$addToSet : {"followers": {"_id": user._id}}},{},function(err, user2) {
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
    })
  });
}

//Unfollow User
unfollowUser = function (req, res) {
  User.findOneAndUpdate({_id: req.params.id},{$pull : {"following": {"_id": req.params.idfollow}}},{}, function(err, user) {
    if(err) {
      res.send(err);
    }
  User.findOneAndUpdate({_id: req.body._id},{$pull : {"followers": { "_id": user._id}}},{},function(err, user2) {
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
  })
  });
}




//var URL = 'http://ec2-52-56-121-182.eu-west-2.compute.amazonaws.com:3008/';
//LOCAL
//var URL = 'http://localhost:3008/img/';
//var pwd = '/home/david/Escritorio/api-WhereEat/public/img/'

//var pwd = '/home/ubuntu/Api-Eat/public/img/';

var URL = 'http://ec2-52-56-121-182.eu-west-2.compute.amazonaws.com:3008/';
//var URL = 'http://localhost:3008/img/';
//var pwd = '/home/david/Escritorio/api-WhereEat/public/img/'
var pwd = '/home/ubuntu/Api-Previous/Api-Eat/public/';

//Validate Email
validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

//Insert a new User in the DatabaseB
addUser = function (req, res) {
  if (req.body.email == '' || req.body.username == '' || req.body.password == '' || req.body.password == null || req.body.username == null || req.body.email == null ){
    res.send(400, 'Please, complete all the fields');
  }
  else if (req.body.username.length > 11){
    res.send(400, 'Username too long');
  }
  else if (req.body.password > 11){
    res.send(400, 'Password too long');
  }
  else{
    if (!this.validateEmail(req.body.email)) {
      res.send(400, 'Email with invalid format');
    }
    else{
      User.findOne({Username: req.body.username}, function (err, user) {
        if (!user) {
          User.findOne({Email: req.body.email}, function (err, user) {
            if (!user) {
              var Password = encrypt(req.body.username, req.body.password);
              var user = new User({
              Username:  req.body.username,
              Password:  Password,
              Email:  req.body.email       
              })
              user.save(function(err) {
                if(!err) {
                  console.log('Created');
                } 
                else {
                  console.log('ERROR: ' + err);
                }
              });
              var expires = moment().add(2, 'days').valueOf();
              var token = jwt.encode({iss: user._id, exp: expires, username: user.Username}, Secret.TOKEN_SECRET);
              res.send(200, token);
            }
            else{
              res.send(400, 'There is a User with this Email');
            }
          });
        }
        else{
          res.send(400, 'There is a User with this Username');
        }
      });
    }
  }
};

//Insert a photo User in the Database
addPhotoUser = function (req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(500, err.message);
    }
    else{
      fs.readFile(req.files.file.path, function (err, data) {
        var id = crypto.randomBytes(16).toString("hex");
        var newPath = pwd + id +req.files.file.originalFilename;
        fs.writeFile(newPath, data, function (err) {
          user.imageUrl= URL + id + req.files.file.originalFilename;
          user.save(function(err) {
            if(!err) {
              console.log('Updated');
            } 
            else {
              console.log('ERROR: ' + err);
            }
          });
          res.send(user);
        });
      });
    }
  });
};

//Update User Information
updateUser = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    user.Password = req.body.Password
    //Username:    req.body.username;
    //"Password" =     req.body.password
    //Email:  req.body.email;
    user.save(function(err) {
      if(!err) {
        console.log('Updated');
      } 
      else {
        console.log('ERROR: ' + err);
      }
      res.send(user);
    });
  });
}

//Delete an User form the Database
deleteUser = function(req, res) {
  //Delete - All the ratings made by the user
  Receta.find({"Ratings.user_id": req.params.id}, function(err, recetas) {
    var array = recetas;
    array.forEach(function(receta) {
      var arrayratings = receta.Ratings;
      for (var i = 0; i < arrayratings.length; i++){
        if (arrayratings[i].user_id == req.params.id){
          arrayratings.splice(i, 1);
          break;
        }
      }
      var total = 0;
      arrayratings.forEach(function(rating) {
        total += rating.Rating;
      });
      var puntuacion = total/arrayratings.length;
      receta.Rating = puntuacion;
      receta.Ratings = arrayratings;
      receta.save(function(err){
        if(!err){
          console.log("OK");
        }
        else{
          console.log("error");
        }
      })
    });        
  }); 
  //Delete - All the comments made by the user
  Receta.find({"Comments.user_id": req.params.id}, function(err, recetas) {
    var array = recetas;
    array.forEach(function(receta) {
      var arraycomments = receta.Comments;
      var i;
      for (i = arraycomments.length - 1; i >= 0; i -= 1) {
        if (arraycomments[i].user_id == req.params.id) {
          arraycomments.splice(i, 1);
        }
      }
      receta.Comments = arraycomments;      
      receta.save(function(err){
        if(!err){
          console.log("OK");
        }
        else{
          console.log("error");
        }
      })
    });        
  });
  //Delete - All the followers from the user
  User.find({"followers._id": req.params.id}, function(err, users) {
    var array = users;
    array.forEach(function(user) {
      var arrayfollowers = user.followers;
      for (var i = 0; i < arrayfollowers.length; i++){
        if (arrayfollowers[i]._id == req.params.id){
          arrayfollowers.splice(i, 1);
          break;
        }                            
      }
      user.followers = arrayfollowers; 
      user.save(function(err){
        if(!err){
          console.log("OK");
        }
        else{
          console.log("error");
        }
      })
    });        
  });
  //Delete - All the followig from the user
  User.find({"following._id": req.params.id}, function(err, users) {
    var array = users;
    array.forEach(function(user) {        
      var arrayfollowing = user.following;
      for (var i = 0; i < arrayfollowing.length; i++){
        if (arrayfollowing[i]._id == req.params.id){
          arrayfollowing.splice(i, 1);
          break;
        }                            
      }
      user.followers = arrayfollowing; 
      user.save(function(err){
        if(!err){
          console.log("OK");
        }
        else{
          console.log("error");
        }
      })
    });
  });
  Comment.find({"user_id": req.params.id}, function(err, comments) {
    var array = comments;
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
  //Delete - ALL the receipts from the user     
  Receta.find({"user_id": req.params.id}, function(err, recetas) {
    var array = recetas;
    array.forEach(function(receta) {
      receta.remove(function(err){
        if(!err){
          console.log("OK");
        }
        else{
          console.log("error");
        }
      })
    });        
  }); 
  //Delete - All the information of the user    
  User.findById(req.params.id, function(err, user) {
    user.remove(function(err) {
      if(!err) {
        console.log('Removed');
        res.send(200);
      }
      else {
        console.log('ERROR: ' + err);
      }
    })
  });
}

//Return Users Following
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
            if(!err) {            
              resolve(users);
            }
            else {
              reject(err);
            }
          });
        });
      });
      Promise.all(promises).then(function(allData) {
        //result = [].concat(...allData);
        //Produccion
        var result = allData.reduce(function(prev,curv){
          return prev.concat(curv)}, []);;
        res.send(result);
      }).catch(function(error) {
          res.send(error);
        });
    }
  });
};

//Return Followers
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
            if(!err) {            
              resolve(users);
            } 
            else {
              reject(err);
            }
          });
        });
      });
      Promise.all(promises).then(function(allData) {
      //result = [].concat(...allData);
      //Produccion
        var result = allData.reduce(function(prev,curv){return prev.concat(curv)}, []);;
        res.send(result);
      }).catch(function(error) {
        res.send(error);
      });
    }
  });
};

//Check is an User is followin another
checkFollow = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (!user) {
      res.send(404, 'User not found');
    }
    else {
      var a = user.following;
      var output = a.filter(function(value){ return value._id== req.params.idfollow;})
      var promises = output.map(function(current_value) {
        return current_value._id;
      });
      if (promises == req.params.idfollow){
        res.send("Unfollow");
      }
      else{
        res.send("Follow");
      }
    }
  });
};

//Check if the JWT is valid
validateToken = function(req, res){
  var date = Date.now();
  var id = jwt.decode(req.params.id, Secret.TOKEN_SECRET);
  if(id.exp >= date){
    res.send(200,'OK');
  }
  else{
    res.send(400,'Token Expired');
  }
};

//Link routes and functions
app.get('/user', findAllUsers);
app.get('/user/:id', findById);
app.get('/user/email/:email', findByEmail);
app.get('/user/following/:id', getFollowing);
app.get('/user/followers/:id', getFollowers);
app.get('/user/me/:id/following/:idfollow', checkFollow);
app.get('/user/username/:username', findByUsername);
app.post('/user/login', logIn);
app.get('/user/recetas/:id', findUserRecetas);
app.post('/user', addUser);
app.post('/user/me/:id/follow/:idfollow', followUser);
app.post('/user/me/:id/unfollow/:idfollow', unfollowUser);
app.put('/user/:id', updateUser);
app.put('/user/photo/:id', addPhotoUser);
app.get('/user/validate/:id', validateToken);
app.delete('/user/:id', deleteUser);

};
















