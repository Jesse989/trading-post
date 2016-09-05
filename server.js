var express = require("express");
var session = require("express-session");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo")(session);
require("./models/models");


//require routes
var api = require('./routes/api');
var authenticate = require('./routes/auth')(passport);

var db = "mongodb://"+process.env.USER+":"+process.env.PW+"@ds139685.mlab.com:39685/trading-post";
//connect to db
mongoose.connect(db);

//assigng express instance to app
var app = express();

//logger and session
app.use(logger('dev'));


//initialize passport
var initPassport = require('./passport-init');
initPassport(passport);

//receive encoded body info from client
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: "dirty monkeys",
    store: new MongoStore({
      url: db,
      ttl: 0 * 0 * 60 * 60 // = 14 days. Default
    })
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//serve the angular front end
app.use(express.static(__dirname + '/public'));




//declare which routes to use
app.use('/api', api);
app.use('/auth', authenticate);



var port = (process.env.PORT || 3000);

app.listen(port, function(){
    console.log('I live!! (port ' +port+ ')');
})