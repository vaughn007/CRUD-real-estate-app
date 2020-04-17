var Home = require("../models/home");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkHomeOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Home.findById(req.params.id, function(err, foundHome){
           if(err || !foundHome){
               req.flash("error", "Home not found");
               res.redirect("back");
           }  else {
               // does user own the home?
            if(foundHome.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that"); //do for next request. do before redirect
    res.redirect("/login");
}

module.exports = middlewareObj;