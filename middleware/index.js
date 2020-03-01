const Campground = require("../models/campground"),
      Comment = require("../models/comment");

//all the middleare goes here
const middleware = {};


middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "you moust login frist!");
    res.redirect("/login");
} 

middleware.checkCommentOwnership = function(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                console.log(err);
                return res.redirect("back");
            }
            //does user own the comment?
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("eror", "You don't have permission todo that!");
                res.redirect("back");
            }
        });
    }else{
        req.flash("error", "You need to be logged in todo that");
        res.redirect("back");
    }
}

middleware.checkCampgroundOwnership = function(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err){
                req.flash("error", "Campground not found");
                return res.redirect("back");
            }
            //does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You don't have permisson todo that!");
                res.redirect("back");
            }
        });
    }else{
        console.log("isAuth");
        req.flash("error", "you moust login frist!");
        res.redirect("back");
    }
}




module.exports = middleware;
