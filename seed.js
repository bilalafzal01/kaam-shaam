var mongoose = require('mongoose');
var Job = require('./models/job');
var jobsdata = [{
    jobTitle: "Web Designer",
    jobCategory: "Computer Science",
    jobLevel: "Intermediate",
    budget: "10.5",
    description: "Job Description. A web designer creates the look, layout, and features of a website. The job involves understanding both graphic design and computer programming. ... They work with development teams or managers for keeping the site up-to-date and prioritizing needs, among other tasks",
    duration: 3,
    skills: "node , express ,mongo",


}, {
    jobTitle: "Android development",
    jobCategory: "Computer Science",
    jobLevel: "Beginner",
    budget: "150",
    description: "Designing and developing advanced applications for the Android platform. Unit-testing code for robustness, including edge cases, usability, and general reliability. Bug fixing and improving application performance.",
    duration: 3,
    skills: "android studio ,firebase ,",
}]


function seedDB() {
    Job.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            //  console.log("all Jobs removed!!")
            Job.create(jobsdata, function (err, newlycreatedjob) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully loaded all Jobs:" + newlycreatedjob);
                }
            })
        }
    });

}


module.exports = seedDB;