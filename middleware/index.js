var middlewareObj={};
// var Campgrounds=require("../models/campground")
// var Comment=require("../models/comment")
middlewareObj.isLoggedIn =function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be Logged In First hahahaah!!");
    res.redirect("/signup");
}
module.exports=middlewareObj;
