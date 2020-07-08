var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  profileImage:String,
  username: String,
  email: String,
  password: String,
  isHirer:Boolean,
  userDetail:{
    phoneNo: {
      countrycode:String,
      phoneNo:String,
    },
    address:{
      location:String,
      city:String,
      country:String,
    },
    hirerDetail:{
      posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
      }]
    },
    freelancerDetail:{
      proposals:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Proposal",
      }]
    },
  },
  
      
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);