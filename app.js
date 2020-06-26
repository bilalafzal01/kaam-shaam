let express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    User = require('./models/user'),
    flash =require("connect-flash"),
    seedDB = require("./seed"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride =require("method-override"),
    passportLocalMongoose = require('passport-local-mongoose'),
    authRoutes = require('./routes/auth/userAuth'),
    hireRoutes = require('./routes/hire/hire'),
    profileRoutes=require('./routes/profile/userprofile'),
    browseJobsRoutes = require('./routes/Jobs/browsejobs');
    jobRoutes=require('./routes/Jobs/jobs');

// This connect string is for connecting to cloud dbs
mongoose.connect("mongodb+srv://admin:admin@rexia-database-rwwvm.mongodb.net/Seekh?retryWrites=true&w=majority");


// local dbs
// mongoose.connect('mongodb://localhost/Seekh');
let app = express();    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(flash());

// seedDB();

//passport config
//passport configoration
app.use(require("express-session")({
    secret: "I am best football player ever",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This passes the req.user to every route no need to manually write currentUser:req.user in each route
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.get("/", function (req, res) {
    res.render("main");
})

app.use(authRoutes);
app.use('/hire', hireRoutes);
app.use('/viewprofile', profileRoutes);
app.use('/browseJobs', browseJobsRoutes);
app.use('/job',jobRoutes);


app.listen("8080", function () {
    console.log("Server has Started")
});
