let express = require("express"),
    router = express.Router(),
    Job = require('../../models/job');
    User = require('../../models/user');
    var middleware=require("../../middleware");

// Edit Job Routes
router.get("/:id/edit",function(req,res){
    Job.findById(req.params.id,function(err,job){
        res.render("jobEdit");
     })
})
//Update Job Route
router.put("/:id",function(req,res){

    Job.findByIdAndUpdate(req.params.id,req.body.jobdetails,function(err,updatedJob){
        if(err){
            req.flash("error","error in updating job!!!!");
           res.redirect("/viewprofile/"+updatedJob._id); 
        }
        else
        {
            res.redirect("/viewprofile/"+updatedJob.author.id);
        }
     })
})
router.delete("/:id",middleware.isLoggedIn,function(req,res){
 
    Job.findByIdAndDelete(req.params.id,function(err){
        if(err){
            req.flash("error","error in deleting your post pls try again");
            res.redirect("/");
        }
        else
        {
            User.updateOne({_id:req.user._id},{ $pull: { 'posts': req.params.id }},function(err,updateditem){

                if(!err)
                {
                    return res.redirect("back");        
                    req.flash("error","Successfully deleted Your post");
                    return res.redirect("back"); 
                }
            })
                  
        }
    })
})
module.exports = router;