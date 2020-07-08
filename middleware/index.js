User = require('../models/user');
var middlewareObj={};

middlewareObj.isLoggedIn =function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be Logged In First!!");
    res.redirect("/signup");
}
middlewareObj.alreadylogged=function(req,res,next){
    if(req.isAuthenticated()){
        req.flash("error","Logout first to do that!!");
        res.redirect("back");
    }
    else{
        return next();
    }
    
}
middlewareObj.checkCommentOwnership=function (req,res,next){
    if(req.isAuthenticated())
    {
        
        User.findById(req.params.id,function(err,user){
            if (err)
            {
                res.redirect("back")
            } 
            else
            {
              
                if(user._id.equals(req.user._id))
                {
                    next()
                    // res.render("campgrounds/edit",{campground:campground});
                }
                else
                {
                    req.flash("error","Permission Denied!!!")
                    res.redirect("back");
                }
            }
         })
    }
    else
    {
        req.flash("error","You need to be logged In to do that!!");
        res.redirect("back");
    }
   
}
module.exports=middlewareObj;
