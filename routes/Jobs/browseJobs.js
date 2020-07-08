const user = require("../../models/user");
const job = require("../../models/job");

let express = require("express"),
  router = express.Router(),
  Job = require("../../models/job"),
  Proposal = require('../../models/proposal'),
  multer = require('multer'),
  middleware = require("../../middleware");


var fs = require('fs'),
dir = './attachmentUploads',
path = require('path');


//For profile image path generator
var attachmentUpload = multer(

  {
    storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './attachmentUploads');
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
router.get("/", middleware.isLoggedIn, function (req, res) {
  Job.find({}, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("Browsejob", {
        jobs: data,
      });
    }
  });
});

router.get("/job/:jobID", middleware.isLoggedIn, async (req, res) => {
  try {
    let job = await Job.findOne({ _id: req.params.jobID });
    res.render("ApplyNow", { job: job });
  } catch (err) {
    console.error(err);
  }
});

router.get("/job/:jobID/proposal", middleware.isLoggedIn, async (req, res) => {
  try {
    let job = await Job.findOne({ _id: req.params.jobID });
    res.render("JobProposal", { job: job });
  } catch (err) {
    console.error(err);
  }
});
router.post("/job/:jobID/proposal/:id",attachmentUpload.any(), function (req, res) {

  if(!req.body && !req.files){
    res.json({success: false});
  } else { 
      console.log("Succesfully submitted a file!!!!!!");
      user.findById(req.params.id,function(err,userfound){
        if(userfound){
          var applicantDetail={
            id:req.params.id,
            // username:userfound.username,
          };
        }
       
        Proposal.create({
          resume:req.files[0] && req.files[0].filename ? req.files[0].filename : '',
          additionalAttachment:req.files[1] && req.files[1].filename ? req.files[1].filename : '',
          bidAmount:req.body.bidAmount,
          coverLetter:req.body.quilltext,
          timeLength:req.body.time.one+" "+req.body.time.two,
          author:applicantDetail,
        },function(err,newProposal){
          if(err){
            console.log(err);
          }
          else{
            
            job.updateOne({_id:req.params.jobID},{ $push: { 'proposals.id': newProposal._id }},function(err,updateditem){
              console.log(updateditem.proposals);
              if(!err)
              {
                user.updateOne({_id:req.user._id},{ $push: { 'userDetail.freelancerDetail.proposals': newProposal._id }},function(err,updateditem){
                  try{
                    req.flash("success","Succesfully submitted Your Proposal!!")
                    res.redirect("/browsejobs");       
                  }
                  catch(err){

                  }
                  
                })
             
              }
            })

          
          }
        })
      })
       
       

   }
});

module.exports = router;
