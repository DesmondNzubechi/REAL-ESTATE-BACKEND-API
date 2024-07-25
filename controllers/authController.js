const AppError = require("../errors/appError");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");


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