const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose

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
        unique: [true, "This username already exist."]
    },
    email: {
        type: String,
        required: [true, "Kindly input your email"],
        unique: [true, 'email already exist'],
        validate: [validator.isEmail, 'please chose a valid email']
    },
    password: {
        type: String,
        required: [true, "Kindly input your password"],
        minLength: 10
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm email"],
        validator: function (el) {
            return el === this.password
        },
        message: "Password must be the same",
    },
    profilePic: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: Number, 
        require: [true, "please insert your phone number"]
    },
    country: {
        type: String,
        require: [true, "please input your country name"]
    },
    state: {
        type: String,
        require: [true, "Kindly input your state"]
    },
    active: {
        type: Boolean,
        default: true, 
        select : false
    }
})

userSchema.pre("save", async (next) => {
    
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    next()


})


const User = mongoose.model("user", userSchema)

module.exports = User;
