const AppError = require("../errors/appError");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");





exports.getAllUser = catchAsync(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        status: "success",
        message: "fetching users succesful",
        data: {
            users
        }
    })
})


exports.getAUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const theUser = await User.findById(id)

    res.status(200).json({
        status: "success",
        message: "fetching user succesful",
        data: {
            theUser
        }
    })
})


exports.createAUser = catchAsync(async (req, res, next) => {
    
    const { firstName, lastName, userName, email, password, phoneNumber, country, state, confirmPassword, role } = req.body;
    

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

    if (!role) {
        return next(new AppError("please select user role", 400))
    }

    let imageUrl;

    if (req.file) {
        imageUrl = req.file.cloudinaryUrl
    }
    
    const theNewUser = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password,
        phoneNumber,
        country,
        state,
        confirmPassword,
        role,
        profilePic: imageUrl? imageUrl : ''
    })

    return res.status(201).json({
        status: "success",
        message: "user successfully created",
        data: {
            theNewUser
        }
    })

})
 

exports.updateMe = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userUpdateInfo = req.body;

    if (userUpdateInfo.password || userUpdateInfo.confirmPassword) {
        return next(new AppError("This is not route for updating password", 401))
    }

    if (req.file) {
        userUpdateInfo.profilePic = req.file.cloudinaryUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(id, {...userUpdateInfo, images:req.file.cloudinaryUrl? req.file.cloudinaryUrl : '' }, {
        new: true,
        runValidators: true,

    })

    if (!updatedUser) {
        return next(new AppError("User does not exist", 401))
    }

    res.status(200).json({
        status: "success",
        message: "User successfully updated",
        data: {
            user : updatedUser
        }
    })
})

exports.deleteAUser = catchAsync(async (req, res, next) => {
    const user = User.findByIdAndUpdate(req.user.id, { active: false })
    
    res.status(204).json({
        status: "success",
        message: "deleted successfully",
        data: {
            user : null
        }
    })
})


