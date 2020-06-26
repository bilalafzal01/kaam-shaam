let express = require("express"),
    router = express.Router(),
    Job = require('../../models/job');
    var middleware=require("../../middleware");

    
router.get("/",middleware.isLoggedIn, function (req, res) {
    Job.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("Browsejob", {
                jobs: data
            })
        }
    })
});

router.get("/job/:jobID", middleware.isLoggedIn, async (req, res) => {
    try {
      let job = await Job.findOne({ _id: req.params.jobID });
      res.render('ApplyNow', {job: job});
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;