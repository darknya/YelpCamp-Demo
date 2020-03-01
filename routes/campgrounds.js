const express = require("express");
const router = express.Router();
const Campground = require("../models/campground"),
      Comment = require("../models/comment");
const middleware = require("../middleware");

//INDEX - show all campground
router.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgroungs) => {
        if(err){
            console.log(err);
        }else{
            res.render("./campgrounds/index", {campgrounds: allCampgroungs, page: "campgrounds"});
        }
    });
});

//CREATE - add new campground
router.post("/campgrounds", (req, res) =>{
    //取得表單資料之後加到資料庫裡

    let newCampground = { name: req.body.name, 
                          price: req.body.price,
                          image: req.body.image, 
                          description: req.body.description, 
                          author: {
                              id: req.user._id,
                              username: req.user.username
                          } 
    };
    Campground.create(newCampground,
        (err, newlyCreated) => {
            if(err){
                console.log(err);
            } else {
                console.log("NEWLY CREATED CAMPGROUND: ");
                console.log(newlyCreated);
                //redirect back to campgrounds page
                req.flash("success", "Success create new campground!")
                res.redirect("/campgrounds");
            }
    });
});

//NEW - show form to create campground
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
    
    res.render("./campgrounds/new");
});

//SHOW - show more info about one campground
router.get("/campgrounds/:id", (req, res) => {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        }else {
            //render show template with that campground
            res.render("./campgrounds/show", { campground: foundCampground });
        }
    });
});

// EDIT Campground route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        }else{    
            res.render("campgrounds/edit", {campground: foundCampground});  
        }      
    });
    
});

// update campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatacampground) => {
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Successfully Edit campground!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, campgroundRemoved) => {
        if(err){
            res.redirect("/campgrounds");
        }else{
            // 刪除該Campground底下的Comment(網路參考得來的不太懂"$in"其原理)
            Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
                if(err){
                    console.log(err);
                }
                req.flash("success", "Successfully deleted campground!");
                res.redirect("/campgrounds");
            });
        }
    });
});



module.exports = router;