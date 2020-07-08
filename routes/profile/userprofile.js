var express = require("express");
var router = express.Router();
var passport = require("passport"),
User = require('../../models/user');
Job = require('../../models/job');

var middleware=require("../../middleware");


router.get("/:id",middleware.isLoggedIn,middleware.checkCommentOwnership, function (req, res) {    
    User.findById(req.params.id).populate("userDetail.hirerDetail.posts").populate("userDetail.freelancerDetail.proposals").exec(function(err,User){
        if(err)
        {
            console.log(err)
        }
        else{
            if(User.isHirer)
            {
                res.render("hirerProfile",{currentUser:User})
            }
            else
            {
                res.render("freelancerProfile",{currentUser:User})
            }         
        }
    })
});

module.exports = router;