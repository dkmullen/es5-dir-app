
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  //token: { type: String },
  admin: {
    type: Boolean,
    default: false
  }
});

// User.plugin(passportLocalMongoose);

// Make the model, call it UserSchema, pass in the Schema
module.exports = mongoose.model('User', UserSchema);
