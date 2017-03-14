var express = require("express"), 
    cors = require('cors'), 
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    //var MongoClient = require('mongodb').MongoClient;
    mongoose = require('mongoose');;
var assert = require('assert');


app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {  
   res.send("Hello World!");
});

app.use(router);
app.use(cors());
/*
mongoose.connect('mongodb://localhost/receipt', function(err, res) {  
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  }
});*/

routes = require('./routes/user')(app);
routes = require('./routes/recetas')(app);

mongoose.connect('mongodb://localhost/usuarios', function(err, res){
  if(err){
    console.log('ERROR: connecting to database.' + err);
  }
  else{
    console.log('Connected to Database');
  }
});




app.listen(3008, function() {  
  console.log("Node server running on http://localhost:3000");
});

