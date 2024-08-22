const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Kindly input your first name"],
        minLength : 2,
    },
    lastName: {
        type: String,
        required: [true, "Kindly input your last name"],
        minLength : 2,
    },
    userName: {
        type: String,
        default : 'Update username'
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
    images: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: Number,
       default: 'update phone no'
    },
    country: {
        type: String,
        default: 'update country'
    },
    state: {
        type: String,
       default: ''
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
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date
});



userSchema.methods.correctPassword = async function (candidatepassword, originalUserPassword) {

    return await bcrypt.compare(candidatepassword, originalUserPassword);

}

userSchema.methods.verifyUserEmail = function () {
    
    const token = crypto.randomBytes(32).toString("hex");

    this.emailVerificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")
    
    this.emailVerificationTokenExpires = Date.now() + 60 * 60 * 1000;
    
    return token;
}



userSchema.methods.createPasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.
        createHash("sha256")
        .update(resetToken)
        .digest('hex')
    
   
    this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
}

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    
    if (this.passwordChangeat) {
        const changeTimestamp = parseInt(
            this.passwordChangeat.getTime() / 1000,
            10
        )

        return JWTTimestamp < changeTimestamp
    }

    return false;

}
 
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    next();
});
 
const User = mongoose.model("User", userSchema);
  
module.exports = User;
