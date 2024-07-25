const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");


exports.signUpNewUser = catchAsync(async (req, res, next) => {

    const { firstName, lastName, userName, email, password, phoneNumber, country, state } = req.body; 

    const newUser = User.create({
        firstName,
        lastName,
        userName,
        email,
        password,
        phoneNumber,
        country,
        state
    })
    
    res.status(201).json({
        status: "success",
        message: "successfully signed up",
        data: {
            newUser
        }
    })

})