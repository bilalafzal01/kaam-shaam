var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  profileImage:String,
  username: String,
  email: String,
  password: String,
  isHirer:Boolean,
  userDetail :{
    hirerDetail: {
      firstName: String,
      lastName: String,
      phoneNo: {
        countrycode:String,
        phoneNo:String,
      },
      address:{
        location:String,
        city:String,
        country:String,
      },
    },
    freelancerDetail : {
      firstName: String,
      lastName: String,
      phoneNo: Number,
    }
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Job",
  }]
      
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);