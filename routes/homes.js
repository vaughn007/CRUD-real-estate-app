var express = require("express");
var router  = express.Router();
var Home = require("../models/home");
var middleware = require("../middleware"); //index.js file inside middleware folder


//INDEX - show all homes

// search logic /////////////////
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all homes from DB
        Home.find({city: regex}, function(err, allHomes){
           if(err){
               console.log(err);
           } else {
              if(allHomes.length < 1) {
                  noMatch = "No homes match that query, please try again.";
              }
              res.render("homes/index",{homes:allHomes, noMatch: noMatch});
           }
        });
    } else {
        // Get all homes from DB
        Home.find({}, function(err, allHomes){
           if(err){
               console.log(err);
           } else {
              res.render("homes/index",{homes:allHomes, noMatch: noMatch});
           }
        });
    }
});
router.get("/", function(req, res){
    // Get all homes from DB
    Home.find({}, function(err, allHomes){
       if(err){
           console.log(err);
       } else {
          res.render("homes/index",{homes:allHomes});
       }
    });
});





//CREATE - add new home to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to homes array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
	var address = req.body.address;
	var city = req.body.city;
	var bedrooms = req.body.bedrooms;
	var bathrooms = req.body.bathrooms;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newHome = {name: name, price: price, image: image, description: desc, address: address, city: city, bedrooms: bedrooms, bathrooms: bathrooms,  author:author}
    // Create a new home and save to DB
    Home.create(newHome, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to homes page
            console.log(newlyCreated);
            res.redirect("/homes");
        }
    });
});

//NEW - show form to create new home
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("homes/new"); 
});

// SHOW - shows more info about one home
router.get("/:id", function(req, res){
    //find the home with provided ID
    Home.findById(req.params.id).populate("comments").exec(function(err, foundHome){
        if(err || !foundHome){
            req.flash("error", "Home not found");
            res.redirect("back");
        } else {
            console.log(foundHome)
            //render show template with that home
            res.render("homes/show", {home: foundHome});
        }
    });
});

// EDIT home ROUTE
router.get("/:id/edit", middleware.checkHomeOwnership, function(req, res){
    Home.findById(req.params.id, function(err, foundHome){
        res.render("homes/edit", {home: foundHome});
    });
});

// UPDATE home ROUTE
router.put("/:id",middleware.checkHomeOwnership, function(req, res){
    // find and update the correct home
    Home.findByIdAndUpdate(req.params.id, req.body.home, function(err, updatedHome){
       if(err){
           res.redirect("/homes");
       } else {
           //redirect somewhere(show page)
           res.redirect("/homes/" + req.params.id);
       }
    });
});

// DESTROY home ROUTE
router.delete("/:id",middleware.checkHomeOwnership, function(req, res){
   Home.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/homes");
      } else {
          res.redirect("/homes");
      }
   });
});

// searching form /////////////////////////////////////
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;










// var express = require("express");
// var router  = express.Router();
// var Home = require("../models/home");
// var middleware = require("../middleware");


// //INDEX - show all homes
// router.get("/", function(req, res){
//     // Get all homes from DB
//     Home.find({}, function(err, allHomes){
//       if(err){
//           console.log(err);
//       } else {
//           res.render("homes/index",{homes:allHomes});
//       }
//     });
// });

// //CREATE - add new home to DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to homes array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newHome = {name: name, image: image, description: desc, author:author}
//     // Create a new home and save to DB
//     Home.create(newHome, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to homes page
//             console.log(newlyCreated);
//             res.redirect("/homes");
//         }
//     });
// });

// //NEW - show form to create new home
// router.get("/new", middleware.isLoggedIn, function(req, res){
//   res.render("homes/new"); 
// });

// // SHOW - shows more info about one home
// router.get("/:id", function(req, res){
//     //find the home with provided ID
//     Home.findById(req.params.id).populate("comments").exec(function(err, foundHome){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundHome)
//             //render show template with that home
//             res.render("homes/show", {home: foundHome});
//         }
//     });
// });

// // EDIT home ROUTE
// router.get("/:id/edit", middleware.checkHomeOwnership, function(req, res){
//     Home.findById(req.params.id, function(err, foundHome){
//         res.render("homes/edit", {home: foundHome});
//     });
// });

// // UPDATE home ROUTE
// router.put("/:id",middleware.checkHomeOwnership, function(req, res){
//     // find and update the correct home
//     Home.findByIdAndUpdate(req.params.id, req.body.home, function(err, updatedHome){
//       if(err){
//           res.redirect("/homes");
//       } else {
//           //redirect somewhere(show page)
//           res.redirect("/homes/" + req.params.id);
//       }
//     });
// });

// // DESTROY home ROUTE
// router.delete("/:id",middleware.checkHomeOwnership, function(req, res){
//   Home.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/homes");
//       } else {
//           res.redirect("/homes");
//       }
//   });
// });


// module.exports = router;












// var express = require("express");
// var router  = express.Router();
// var Home = require("../models/home");   //add in the right model.  yelpCamp/models/home

// //index show all homes 
// router.get("/", function(req, res){  // only "/" because app.use("/homes", homeRoutes) All  home Routes are homes
//     //console.log(req.user); it have username ID
//     //Get all campgrunds from DB
//     Home.find({}, function(err, allHomes ) {
//         if (err) {
//             console.log(err);
            
//         } else {
//             res.render("homes/index", {homes: allHomes}); //res.render("filer name", { we call it homes:  sorce of homes}); index inside homes folder
//             //res.render("homes/index", {homes: allHomes, currentUser: req.user});
            
//         }
//     });
    
// });

// //Create add new homes to database
// router.post("/", isLoggedIn, function(req, res){
//     //get data from form and add to array, and redirect back to homes page
    
//     //get data from form
//     var name = req.body.name;
//     var image = req.body.image; 
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
    
//     var newHome = {name: name, image: image, description: desc, author:author};
//     //console.log(req.user);
    
//     //create a new home and save to database
//     Home.create(newHome, function(err, newlyCreated) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(newlyCreated);
//             res.redirect("/homes");
//         }
//     })
    
    
// });


// //New show form to add homes. You need to routes for POST, One to show form and submit to another page. Must be first to ge id //page for form
// router.get("/new", isLoggedIn, function(req, res){ //add isLoggedIn to check if loggedin
//     res.render("homes/new.ejs"); //new.ejs inside homes folder
// });

// //Show- show more info about home
// router.get("/:id", function(req, res){
//     //Find home with provid ID, and than render show templet with that home
//     Home.findById(req.params.id).populate("comments").exec( function(err, foundHome) { //finding home populate comments on home. exec will  do query we made
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(foundHome);
//             //render show templet
//             res.render("homes/show", {home: foundHome}); //homes folder show.ejs file
            
//         }
//     })
//     //req.params.id //this get the id
    
//     //res.send("This will be the show page!!")
// });

// //Edit Home Route. we need a form on edit
// router.get("/:id/edit", function(req, res) {
//     Home.findById(req.params.id, function (err, foundHome) {
//         if (err) {
//             res.redirect("/homes")
//         } else {
//             res.render("homes/edit", {home: foundHome}); 
//         }
//     });
//       //render form. pass in home being edited
//     //res.send("<h1>Edit Route</h1>");
// });


// router.put("/:id", function (req, res) {
//     // find and update the right campgrond
//     Home.findByIdAndUpdate(req.params.id, req.body.home, function (err, updatedHome) {
//         if (err) {
//             res.redirect("/homes");
//         } else {
//             res.redirect("/homes/" + req.params.id);   //if it work
//         }
//     }); 
//     //redirect to show page
// });
// //Update home Route

// //middleware
// function isLoggedIn(req, res, next) { //check if loged in
//     if(req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login"); //if not loged in go to login page
// }





// module.exports = router;  //export router from this file



//nice