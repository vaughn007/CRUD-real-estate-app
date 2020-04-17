var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.use(express.urlencoded());   //To extract info from form
//app.use(express.urlencoded())
router.get("/", function(req, res){
    //res.render("landing");
	res.redirect("/homes"); 
});




// =============================================

// AUTH ROUTES

// ==============================================

//show regester form
router.get("/register", function(req, res) {
    res.render("register");
});

//will handle sign up/register logic
// show register form
router.get("/register", function(req, res){
  res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
            
        }
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome your home " + user.username);
          res.redirect("/homes"); 
        });
    });
});


//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handling login logic, passport.authenticate is the middleware
router.post("/login", passport.authenticate("local",
{successRedirect: "/homes",
failureRedirect: "/login"
    
}), function(req, res) {
    
});

//logout Route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/homes");
});

// //middleware
// function isLoggedIn(req, res, next) { //check if loged in
//     if(req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login"); //if not loged in go to login page
// }


module.exports = router;  //export router from this file




//nice