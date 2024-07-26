const AppError = require("../errors/appError");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail");


const {JWT_EXPIRES_IN, JWT_SECRET} = process.env

const signToken = (id) => {
    return jwt.sign({ id: id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

exports.signUpNewUser = catchAsync(async (req, res, next) => {

    const { firstName, lastName, userName, email, password, phoneNumber, country, state, confirmPassword } = req.body; 

    const userExistWithEmail = await User.findOne({ email })
    const userExistWithUsername = await User.findOne({ userName })
    
    if (userExistWithEmail) {
        return next(new AppError("user already exist with email", 400))
    }
    if (userExistWithUsername) {
        return next(new AppError("username already exist", 400))
    }

    const newUser = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password,
        phoneNumber,
        country,
        state,
        confirmPassword
    })
    
      

    return res.status(201).json({
        status: "success",
        message: "successfully signed up",
        data: {
            newUser
        }
    })

})


exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Please input your email or password"));
    }

    const theUser = await User.findOne({ email }).select("+password");

    if (!theUser || !(await theUser.correctPassword(password, theUser.password))) {
        return next(new AppError("incorrect password or email. please try again", 400))
    }

    const token = signToken(theUser._id);

    res.status(200).json({
        status: "success",
        message: "login successful",
        token,
        data: {
            theUser
        }
    })


})

exports.forgotPassword = catchAsync(async (req, res, next) => {

    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
        return next(new AppError('User does not exist', 400))
    }

    //generate reset token by calling the createResetToken function defined in the userModel

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/user/resetPassword/${resetToken}`;
    const message = `forgot your passowrd? kindly submit your new password to ${resetUrl}. if you did not request for this kindly ignore.`

    try {
        sendEmail({
            message,
            subject: "This password reset token is valid for only 30 minutes",
            email : user.email
        })

        res.status(200).json({
            status: "success",
            message : 'Token successfully sent to the user meail'
        })
    } catch (error) {
        console.log(error);
        return next(new AppError('an error occured while sending the reset password token'))
    }


})