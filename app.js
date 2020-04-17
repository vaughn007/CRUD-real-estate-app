var express = require("express");
var app = express();
const port = 3000;
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Home = require("./models/home");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedsDB =require("./seeds");
var dateFormat = require('dateformat');
var now = new Date();

var commentRoutes = require("./routes/comments"),
    homeRoutes = require("./routes/homes"),
    indexRoutes = require("./routes/index");
    


//seedsDB(); //it will run when server is stared. seed the database
app.use(flash()); //for err mesages
//passport Config
app.use(require("express-session")({
    secret: "I love cats",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); //need for passport
app.use(passport.session()); //need for passport
passport.use(new LocalStrategy(User.authenticate())); //get passport-local, and passportLocalMongoose form user.ejs. this is the middleware
passport.serializeUser(User.serializeUser());  //responable for reading session. it incode sessions
passport.deserializeUser(User.deserializeUser()); //responable for reading session. it decode sessions

//this will be called on every route. middleware
app.use(function (req, res, next) {
    res.locals.currentUser = req.user; //avlible inside temlets
    res.locals.error = req.flash("error"); //for err display
    res.locals.success = req.flash("success"); //for err display success
    next(); //next will move on to next middleware. Without it, it stop
});


app.use(methodOverride("_method")); //Place before routs to pages


//get the pages. It tell app to use the 3 files we required
app.use(indexRoutes);
app.use("/homes", homeRoutes); //all home routes should start with homes. it put homes in font of route
app.use("/homes/:id/comments", commentRoutes);


var url = process.env.DATABASEURL || ""; //back url to DB
mongoose.connect(url);

//#### for cloud mongo DB Alas
mongoose.connect('', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
}); //database connecting mongo DB atlas in cloud

app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //css __dirname is fold scrip ran in


 
app.listen(port, () => console.log(`Home app listening on port ${port}!`));
































