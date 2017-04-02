
var express = require("express"), 
    cors = require('cors'), 
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    fs = require("fs");
    mongo = require('mongodb');
    Grid = require('gridfs-stream');
    //var MongoClient = require('mongodb').MongoClient;
    mongoose = require('mongoose');;
var assert = require('assert');
var multipart = require('connect-multiparty');
/*
var db = mongoose.connect('mongodb://localhost/usuarios', function(err, res){
  if(err){
    console.log('ERROR: connecting to database.' + err);
  }
  else{
    console.log('Connected to Database');
  }
});*/


