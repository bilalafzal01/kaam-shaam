var mongoose = require('mongoose');
var proposalSchema = new mongoose.Schema({
  resume:String,
  timeLength:String,
  bidAmount:Number,
  coverLetter:String,
  additionalAttachment:String,
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
  });
module.exports = mongoose.model("Proposal", proposalSchema);