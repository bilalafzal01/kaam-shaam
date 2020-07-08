let express = require("express"),
    router = express.Router(),
    Job = require('../../models/job');
    User = require('../../models/user');
    var middleware=require("../../middleware");
const job = require("../../models/job");
const { populate } = require("../../models/job");

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
                }
            })
                  
        }
    })
})

//get proposal on a job
router.get("/:id/viewproposals",middleware.isLoggedIn,function(req,res){

    //getting Job data and then populating  all proposals of this job and then populating author inside of proposals
    job.findById(req.params.id).populate({path :"proposals.id",populate:{path:"author.id"}}).exec(function(err,foundJob){
        try{
            console.log(foundJob);
            console.log(foundJob.proposals);
            res.render("viewProposal",{job:foundJob});
        }
        catch(err){
            console.log("There was an error in get proposal route!!!")
        }
    })

})

module.exports = router;