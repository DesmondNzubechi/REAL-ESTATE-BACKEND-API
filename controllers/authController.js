const AppError = require("../errors/appError");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const {promisify} = require('util')

const {JWT_EXPIRES_IN, JWT_SECRET} = process.env

const signToken = (id) => {
    return jwt.sign({ id: id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

exports.signUpNewUser = catchAsync(async (req, res, next) => {

    //destructure user information from req.body
    const { firstName, lastName, userName, email, password, phoneNumber, country, state, confirmPassword } = req.body; 

    //find user by email
    const userExistWithEmail = await User.findOne({ email })
    //find user with username
    const userExistWithUsername = await User.findOne({ userName })
    
    //if user already exist with the provided email, return an error message
    if (userExistWithEmail) {
        return next(new AppError("user already exist with email", 400))
    }
   //if user already exist with the provided username, return an error message
    if (userExistWithUsername) {
        return next(new AppError("username already exist", 400))
    }


    //create new user if there is no user with the email and username
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

    const verifyUser = await newUser.verifyUserEmail();
    await newUser.save({ validateBeforeSave: false });

    const verifyTokenUrl = `${req.protocol}://${req.get("host")}/api/v1/user/${verifyUser}`;
    const message = `please verify your email by clicking on the following email: ${verifyTokenUrl}. This token expires immediately after 1hr.`;

    sendEmail({
        email: newUser.email,
        subject: "Email verification",
        message
    })
    
    //remove the password from the newUser properties before returning the success response
    newUser.password = undefined;
      
    //the success response
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

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/user/resetPassword/${resetToken}`;
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



exports.protectedRoute = catchAsync(async (req, res, next) => {
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new AppError("You are not authorized", 401))
    }

    let decode;

    try {
        decode = await promisify(jwt.verify)(token, JWT_SECRET)
    } catch (error) {
        return next(new AppError("Token verification failed", 401))
    }

    const freshUser = await User.findById(decode.id);

    if (!freshUser) {
        return next(new AppError("User does not exist", 401))
    }

    if (freshUser.changePasswordAfter(decode.iat)) {
        return next(new AppError("User recently changed password, please try again", 401))
    }

    req.user = freshUser;

    next();
})


exports.restrictTo = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new AppError('you are restricted from accessing this route', 401))
        }
    }
}

exports.resetPassword = catchAsync(async (req, res, next) => {

    const { token } = req.params;

    const theResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
    
    const user = await User.findOne({
        passwordResetToken: theResetToken,
        passwordResetTokenExpires: {$gt : Date.now()}
    })

    
    if (!user) {
        return next(new AppError("Invalid token or expired", 400))
    }

    const { password, confirmPassword } = req.body;
    

    user.password = password;
    user.confirmPassword = confirmPassword
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save();

    const newSigninToken = signToken(user._id);

    res.status(200).json({
        status: 'success',
        message: "reset password successful",
        token : newSigninToken
})

    
})


exports.changePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, password, confirmPassword } = req.body;
    

    if (password !== confirmPassword) {
        return next(new AppError("confirm password and password not the same", 401))
    }

    if (currentPassword == password) {
        return next(new AppError("Old password and new password can not be the same", 401))
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
       return  next(new AppError("User does not exist", 400))
    }

    const isCorrectPassword = await user.correctPassword(currentPassword, user.password);

    if (!isCorrectPassword) {
      return  next(new AppError("incorrect current password", 400))
    }

    user.password = password;
    user.confirmPassword = confirmPassword;

    await user.save();

    const newSigninToken = signToken(user._id);

    res.status(200).json({
        status: "success",
        message: "password change successful",
        token: newSigninToken,
        data: {
            user
        }
    })

})

exports.verifyTheUserEmail = catchAsync(async (req, res, next) => {
    
    const { theToken } = req.params;

    const token = crypto
        .createHash(sha256)
        .update(theToken)
        .digest('hex');
    
    const theUser = await User.findOne({
        emailVerificationToken: token,
        emailVerified: false,
        passwordResetTokenExpires: {$gt : Date.now()}
    });;

    if (!theUser) {
        return next(new AppError("user does not exist or token already expired"));
    }

    theUser.emailVerificationToken = undefined,
        theUser.emailVerified = true;
    await theUser.save({
        validateBeforeSave: false
    });

    res.status(200).json({
        status: "success",
        message: "email verification successful",
    })




})