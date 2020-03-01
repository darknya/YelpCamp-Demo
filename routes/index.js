const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Routes
router.get("/", (req, res) =>{
    res.render("landing");
});


//=============
// AUTH ROUTES
//=============

//show register form
router.get("/register", (req, res) => {
    res.render("register", {page: "register"});
});
//handle sign up logic
router.post("/register", (req, res) => {
    let newUser =new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success","Success Register");
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("login", {page: "login"});
});
// login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), (req, res) => {}
);

//logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;