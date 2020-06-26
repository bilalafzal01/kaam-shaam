let express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require('../../models/user');
    var middleware=require("../../middleware"),
    path = require('path');
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
     
      fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return callback(/*res.end('Only images are allowed')*/ null, false)
        }
        callback(null, true)
      }
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
router.get("/signup", function (req, res) {
    res.render("signup");
});

//User Sign up Logic for registering users.
router.post("/signup",upload.any(), function (req, res) {
    console.log("req.body"); //form fields
    console.log(req.body);
    console.log("req.file");
    console.log(req.files); //form files
    var userDetail ={
      hirerDetail: {
        phoneNo:{
          countrycode:"",
          phoneNo:"",
        },
        address:{
          location:"",
          city:"",
          country:""
        }
      },
      freelancerDetail : {}
    };
    if(!req.body && !req.files){
      res.json({success: false});
    } else {   
        var isHirer=req.body.isHirer;
        console.log(req.body.user);
        if(isHirer=="true")
        {
          userDetail.hirerDetail= req.body.user;
          userDetail.hirerDetail.phoneNo=req.body.phoneNo;
          userDetail.hirerDetail.address=req.body.address;
        }
        else
        {
          userDetail.freelancerDetail=req.body.user;
        }
        User.register(new User({
          username: req.body.username,
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
  User.findOneAndUpdate(req.params.id,{
    "userDetail.hirerDetail.firstName":req.body.firstName,
    "userDetail.hirerDetail.lastName":req.body.lastName,
  },function(err,updateduser){    
    console.log(updateduser);
    res.redirect("/viewprofile/"+updateduser._id);
  })
});
//User contact info update request
router.post("/usercontactinfo/:id",function(req,res){
  User.findOneAndUpdate(req.params.id,{
    "email":req.body.email,
    "userDetail.hirerDetail.address":req.body.address,
    "userDetail.hirerDetail.phoneNo":req.body.phoneNo,
  },function(err,updateduser){    
    console.log(updateduser);
        res.redirect("/viewprofile/"+updateduser._id);
  })
});

module.exports = router;