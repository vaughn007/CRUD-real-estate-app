var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose); //plugin will add lot of package to UserSchema for login

module.exports = mongoose.model("User", UserSchema); //User name of model. made from UserSchema