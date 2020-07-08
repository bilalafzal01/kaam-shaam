let express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require('../../models/user');
    var middleware=require("../../middleware"),
    path = require('path');
const user = require("../../models/user");
const { ObjectID } = require("mongodb");
const { isLoggedIn } = require("../../middleware");
    var fs = require('fs'),
    dir = './uploads',
    fs = require('fs'),
    multer = require('multer');



//For profile image path generator
var upload = multer(
  
      {
        storage: multer.diskStorage({

        destination: function (req, file, callback) {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          callback(null, './uploads');
        },
        
        filename: function (req, file, callback) 
        {
           
          callback(null, file.fieldname +'-' + Date.now() +path.extname(file.originalname));
        }
      
      }),
     
      // fileFilter: function(req, file, callback) {
      //   var ext = path.extname(file.originalname)
      //   if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      //     return callback(/*res.end('Only images are allowed')*/ null, false)
      //   }
      //   callback(null, true)
      // }
});

var updateimg = multer(
  
  {
    storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) 
    {
      callback(null,req.user.profileImage);
    }
  })
  // fileFilter: function(req, file, callback) {
  //   var ext = path.extname(file.originalname)
  //   if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
  //     return callback(/*res.end('Only images are allowed')*/ null, false)
  //   }
  //   callback(null, true)
  // }
});

//User Sign up page get request.
router.get("/signup",middleware.alreadylogged, function (req, res) {
  
    res.render("signup");
});

//User Sign up Logic for registering users.
router.post("/signup",upload.any(), function (req, res) {
      var userDetail={
        phoneNo:{},
        address:{},
      }
    if(!req.body && !req.files){
      res.json({success: false});
    } else {   
        userDetail.phoneNo=req.body.phoneNo; 
        userDetail.address=req.body.address;
        
        User.register(new User({
          username: req.body.username,
          firstName:req.body.firstName,
          lastName:req.body.lastName,
          email:req.body.email,
          profileImage:req.files[0] && req.files[0].filename ? req.files[0].filename : '',
          userDetail: userDetail,
          isHirer:req.body.isHirer,
      }), req.body.password, function (err, user) {
            if (err) {
                console.log(err.message);
                req.flash("error",err.message);
                return res.redirect("back")
            } else {
                console.log(user);
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/")
                });
            }
      }) 
    }
});

//User Login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signup",
}), function (req, res) {
});

//User Logout logic
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success","Logged you out!!")
    res.redirect("/");
});

//User basic info update request
router.post("/userbasicinfo/:id",updateimg.any(),function(req,res){
  console.log(req.files); //form files
  User.findByIdAndUpdate(req.params.id,{
    firstName:req.body.firstName,
    lastName:req.body.lastName,
  },function(err,updateduser){    
    console.log(updateduser);
    res.redirect("/viewprofile/"+updateduser._id);
  })
});
//User contact info update request
router.post("/usercontactinfo/:id",function(req,res){
  User.findByIdAndUpdate(req.params.id,{
    email:req.body.email,
    "userDetail.phoneNo":req.body.phoneNo,
    "userDetail.address":req.body.address,
  },function(err,updateduser){    
    console.log(updateduser);
        res.redirect("/viewprofile/"+updateduser._id);
  })
});

module.exports = router;