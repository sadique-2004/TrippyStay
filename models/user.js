const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // passport-local-mongoose is a Mongoose plugin that simplifies building username and password login with Passport.

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        // unique: true,
    },
});

userSchema.plugin(passportLocalMongoose); // apply passport-local-mongoose to the UserSchema to add additional methods to the User model.   Passport Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value. use pkbdf2 hashing  algorithm

module.exports = mongoose.model("User", userSchema); // export the User model with passport-local-mongoose plugin applied to it.


