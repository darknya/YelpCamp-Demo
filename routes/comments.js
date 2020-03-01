const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground"),
      Comment = require("../models/comment");
const middleware = require("../middleware");
    

//Comment new
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            res.render("./comments/new", {campground: campground});
        }
    });  
});
//Comment Create
router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                }else{
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err){
                    res.redirect("back");
                }else{
                    res.render("./comments/edit", {campground: campground, 
                                                   comment: foundComment});
                }
            });
        }
    });
});
//UPDATA COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updataComment) => {
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully Edit Comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        }else{
            req.flash("error", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;