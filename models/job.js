mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
   jobdetail:{
    jobTitle: String,
    jobCategory: String,
    jobLevel: String,
    budget: String,
    description: String,
    duration: Number,
    skills: String,
    
   },
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        username:String,
    },
        posted_At:{
            type: Date,
            default: Date.now
        }

})
module.exports = mongoose.model("Job", jobSchema);