var express = require("express"), 
    cors = require('cors'), 
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongo = require('mongodb');
    path = require('path');
    serveStatic = require('serve-static')
    mongoose = require('mongoose');
var assert = require('assert');
var multipart = require('connect-multiparty');


app.use(serveStatic(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false, uploadDir: __dirname + '/public/img'  }))
app.use(bodyParser.json());  
app.use(methodOverride());


var router = express.Router();

app.use(router);
app.use(cors());
app.use(multipart());


routes = require('./routes/user')(app);
routes = require('./routes/recetas')(app);
routes = require('./routes/comment')(app);


var db = mongoose.connect('mongodb://localhost/usuarios', function(err, res){
  if(err){
    console.log('ERROR: connecting to database.' + err);
  }
  else{
    console.log('Connected to Database');
  }
});


app.listen(3008, function() {  
  console.log("Node server running on http://localhost:3008");
});

