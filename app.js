const express = require("express");
const app = express();
const bodyPaeser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      connectFlash = require("connect-flash");

const Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      seedDB = require("./seeds"),
      User = require("./models/user");

//requring routes
const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes = require("./routes/comments"),
      indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://admin1:PMV4vixUb6sPbCxD@cluster0-pi1xt.gcp.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

app.use(express.static("public"));
app.use(bodyPaeser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(connectFlash());

//seedDB(); //seed the db

// PASSPOST CONFIGURATION
app.use(require("express-session")({
    secret: "This is my secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser =req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", (req, res) => {
    console.log("The YelpCamp Sever is on!" + process.env.PORT);
});