var express = require("express");
var router = express.Router();
var passport = require("passport"),
Job = require('../../models/job');
User = require('../../models/user');

var middleware=require("../../middleware");
router.get("/",middleware.isLoggedIn, function (req, res) {
    res.render("Hire");
});

router.post("/",middleware.isLoggedIn, function (req, res) {
    var author={
        id:req.user._id,
        username:req.user.username,
    }
    Job.create({
        jobdetail:req.body.Job,
        author:author,
    }, function (err, newlycreated) {
        if (err) {
            console.log("There was an issue in adding data!!!")
        } else {
            User.updateOne({_id:req.user._id},{ $push: { 'userDetail.hirerDetail.posts': newlycreated._id }},function(err,updateditem){
                console.log(updateditem);
                if (err)
                {
                }
                else{
                console.log("Succesfully created new JOB POST!!:" + newlycreated)
                res.redirect("browseJobs")
                }   
            })
        }
    })
});

module.exports = router;