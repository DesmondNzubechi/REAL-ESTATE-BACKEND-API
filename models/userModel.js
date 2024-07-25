const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Kindly input your first name"]
    },
    lastName: {
        type: String,
        required: [true, "Kindly input your last name"]
    },
    userName: {
        type: String,
        required: [true, "Kindly input your username"],
        unique: [true, "This username already exists."]
    },
    email: {
        type: String,
        required: [true, "Kindly input your email"],
        unique: [true, 'Email already exists'],
        validate: [validator.isEmail, 'Please choose a valid email']
    },
    password: {
        type: String,
        required: [true, "Kindly input your password"],
        minLength: 10
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords must be the same"
        }
    },
    profilePic: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: Number,
        required: [true, "Please insert your phone number"]
    },
    country: {
        type: String,
        required: [true, "Please input your country name"]
    },
    state: {
        type: String,
        required: [true, "Kindly input your state"]
    },
    role: { 
        type: String,
        enum: ["user", "admin", "moderator"],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true, 
        select : false
    }
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    next();
});

const User = mongoose.model("User", userSchema);
  
module.exports = User;
