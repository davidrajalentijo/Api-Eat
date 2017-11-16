module.exports = function (app) {
var Receta = require('../models/receta.js');
var User = require('../models/users.js');
var Comment = require('../models/comments.js');

//Return ALL the Comments
findAllMessage = function (req, res) {
    Comment.find(function (err, msg) {
        if (!msg) {
            res.send(404, "There are no msgs")
        } 
        else {
            if (!err) {
                res.send(200, msg);
            } 
            else {
                res.send(500, "Mongo Error");
                console.log('ERROR: ' + err);
            }
        }
    });
};

//GET - Return message in the DB by ID_message
findCommentsByReceta = function (req, res) {
        Comment.findOne({_id: req.params.id}, function (err, msg) {
            if (!msg) {
                res.send(404, "Message not found");
            } else {
                if (!err) {
                    res.send(200, msg);
                } else {
                    res.send(500, "Mongo Error");
                    console.log('ERROR: ' + err);
                }
            }
        });
};

//Add a Comment in a Recipe
addComment = function (req, res) {
    Receta.findById(req.params.id, function(err, receta){
        if (!receta){
            res.send(404, 'Receta not found');
        }
        else{
            var date_created = new Date();
            var date  = date_created.toISOString().slice(0,10);
            var comment = new Comment({
                user_id:  req.body.user_id,
                Username:  req.body.username,
                Text:  req.body.text,
                receta_id:  req.params.id,
                Date_Created: date_created,
            })
            comment.save(function(err) {
                if(!err) {
                    console.log('Created in Comments');
                } 
                else {
                    res.send(500, err);
                }
            });
            var CommentReceta = ({
                user_id:  req.body.user_id,
                Username:  req.body.username,
                Text:  req.body.text,
                receta_id:  req.params.id,
                Date_Created: date_created,
                _id: comment._id
            });
            receta.Comments.push(CommentReceta);
            receta.save(function (err){
               if (!err) {
                    console.log('Created in Recetas');
                } 
                else {
                    res.send(500, err);
                }
            });
            res.send(receta);
        };
    });
};

addAnswer = function (req, res) {
        console.log("Hola");
        var id = req.params.id;
        console.log(id);
        //var userid = jwt.decode(req.body.UserID, Secret);
        //console.log('id: ' + userid);
        var user_id = "58d7e478203964d90d000006";
        User.findOne({_id: user_id}, function (err, user) {
            //console.log('u: ' + user);
            if (!user) {
                res.send(404, 'User Not Found');
            } else {
                //var race = true;
                //var group = true;
                Comment.findOne({_id: req.params.id}, function (err, message) {
                    if (!message) {
                        res.send(404, 'Message Not Found');
                    } else {
                        console.log(message);
                        console.log(message.Answer);
                            var answer = ({
                                UserID: id,
                                Username: "David",
                                Answer: "I just say hello fro two"
                            });
                            message.Answers.push(answer);
                            message.save(function (err) {
                                if (err) res.send(500, 'Mongo Error');
                                else res.send(200, message);
                            })

        Receta.findById(message.receta_id, function(err, receta){
        if (!receta){
            res.send(404, 'Receta not found');
        }
        else{

                console.log(receta.Comments);
                var comentario = receta.Comments;
                comentario.findById(message.receta_id, function(err, receta){});

        }});

                        
                    }
                });
            }
        });
    };

    deleteMessage = function (req, res) {

    Receta.findOne({"Comments._id": req.params.id}, function(err, receta) {
        
            var array = receta.Comments;
            console.log(array.length);
            for (var i = 0; i < array.length; i++){
                if (array[i]._id == req.params.id){
                    array.splice(i, 1);
                    break;
                }
            }

            receta.Comments = array;
            receta.save(function(err){
            if(!err){
                    console.log('saved');
            }
            else{
                console.log('ERROR: ' + err);
            }
        })
    }); 

    Comment.findById(req.params.id, function(err, comment){
        comment.remove(function(err){
            if(!err){
                console.log("ok");
            }
            else{
                console.log(err);
            }
        })
        res.send(200);
    })        
            //console.log(receta);
            //res.send(receta);

        //console.log(array);
        //console.log(200);
        //console.log(recetas._id);
        //res.send(recetas);
       //borramos en la base de datos
       // var array = recetas.Comments;
      /*
      array.forEach(function(receta) {
        console.log(receta);
      /*
      receta.remove(function(err){
        if(!err){
          console.log("OK");
        }
        else{
          console.log("error");
        }
      })
        */
      //});
        


        /*
        //var id = jwt.decode(req.body.UserID, Secret);
        var user_id = "58d7e478203964d90d000006";
        User.findOne({_id: user_id}, function (err, user) {
            if (!user) {
                res.send(404, 'User Not Found');
            } else {
                Comment.findOne({_id: req.params.id}, function (err, message) {
                    if (!message) {
                        res.send(404, 'Message Not Found');
                    } else {
                      
                            Receta.findOne({_id: message.receta_id}, function (err, receta) {
                                if (!receta) {
                                    res.send(404, 'Bad ParentID');
                                }
                                else {


                                    if (receta.user_id != user_id && message.user_id != user_id){
                                        res.send(400, 'Bad User');
                                    }
                                      else {
                                            message.remove(function (err) {
                                                if (err) res.send(500, 'Mongo Error');
                                                else res.send(200, 'Message Removed');
                                            });
                                        }

                                }
                            });                     

                    }
                });
            }
        });*/
    };

    deleteAnswer = function (req, res) {
        var id = jwt.decode(req.body.UserID, Secret);
        var answer = req.body.AnswerID;
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'User Not Found');
            } else {
                Message.findOne({_id: req.params.id, 'Answers._id': answer}, function (err, message) {
                    if (!message) {
                        res.send(404, 'Message Not Found');
                    } else {
                        Race.findOne({_id: message.ParentID}, function (err, race) {
                            Group.findOne({_id: message.ParentID}, function (err, group) {
                                if (!race) {
                                    if (message.UserID != id.iss && user.Username != group.Admin && user.Role != 'admin') {
                                        res.send(400, 'Bad User');
                                    } else {
                                        message.Answers.pull(answer);
                                        message.save(function (err) {
                                            if (err) res.send(500, 'Mongo Error');
                                            else res.send(200, 'Answer Removed');
                                        });
                                    }
                                } else if (!group) {
                                    if (message.UserID != id.iss && user.Username != race.Admin && user.Role != 'admin') {
                                        res.send(400, 'Bad User');
                                    } else {
                                        message.Answers.pull(answer);
                                        message.save(function (err) {
                                            if (err) res.send(500, 'Mongo Error');
                                            else res.send(200, 'Answer Removed');
                                        });
                                    }
                                } else {
                                    res.send(404, 'ParentID Not Found');
                                }
                            });
                        });
                    }
                });
            }
        });
    };





    //Link routes and functions

    app.post('/comment/receta/:id', addComment);
     app.put('/comment/:id', addAnswer);
    //app.get('/comment/:id', findMessageByID);
     app.get('/comment', findAllMessage);
     app.delete('/comment/:id', deleteMessage);

};



