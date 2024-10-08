const AppError = require("../errors/appError");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const {promisify} = require('util')
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios"); // Import axios to make HTTP requests
const dotenv = require("dotenv");
dotenv.config({path : './config.env'})


//ENVIRONMENTAL VARIABLES
const {JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES_IN, NODE_ENV, SAME_SITE} = process.env

console.log("the secret key", JWT_SECRET)

//GENERATE JWT 
const signToken = (id) => {
    return jwt.sign({ id: id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}
 


const createAndSendToken = (user, statusCode, res) => {
    // Generate JWT token
    const token = signToken(user._id);

    // Configure cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + parseInt(JWT_COOKIE_EXPIRES_IN, 10) * 24 * 60 * 60 * 1000), // Ensure JWT_COOKIE_EXPIRES_IN is a number
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        sameSite : SAME_SITE, //
    };
    

    // In production, make sure the cookie is only sent over HTTPS
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true; // Cookies should only be sent over HTTPS
    }

    // Set the cookie with the JWT token
    res.cookie('jwt', token, cookieOptions);

    // Exclude the password from the response
    user.password = undefined;

    // Send the response
    res.status(statusCode).json({
        status: 'success',
        data: {
            user,
        },
    });
};



// Function to fetch user data from Google
const getUserData = async (accessToken) => {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};


// Route that generates Google OAuth URL
exports.signInWithGoogle = catchAsync(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.originUrl);
    res.header("Referrer-Policy", 'no-referrer-when-downgrade');

    const redirectUrl = `${process.env.backendUrl}/api/v1/user/googleAuth/signin`;

    const oAuth2Client = new OAuth2Client(
        process.env.googleClientId,
        process.env.googleClientSecret,
        redirectUrl
    );

    const authorizedUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile', 
            'https://www.googleapis.com/auth/userinfo.email',
            'openid'
        ],
        prompt: 'consent'
    });
    
});


// Route to handle Google OAuth callback
exports.theGoogleCallback = catchAsync(async (req, res, next) => {
    const code = req.query.code;
    const oAuth2Client = new OAuth2Client(
        process.env.googleClientId,
        process.env.googleClientSecret,
        `${process.env.backendUrl}/api/v1/user/googleAuth/signin`
    );

    // Exchange authorization code for tokens
    const tokenResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokenResponse.tokens);

    // Get user data from Google
    const userInfo = await getUserData(tokenResponse.tokens.access_token);

    if(!userInfo){
        return next(new AppError("User info from google does not exist", 404))
    }

    let user = await User.findOne({ googleId: userInfo.sub });

    if (!user) {
        user = await User.create({
            userName: `${userInfo.given_name}`,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            googleId: userInfo.sub,
            images: userInfo.picture,
            email: userInfo.email
        });
    }


    // Create token or session as needed
    createAndSendToken(user, 201, res);

});

 

exports.signUpNewUser = catchAsync(async (req, res, next) => {

    //destructure user information from req.body
    const { firstName, lastName,  email, password, confirmPassword } = req.body; 

    //find user by email
    const userExistWithEmail = await User.findOne({ email })
  
    //if user already exist with the provided email, return an error message
    if (userExistWithEmail) {
        return next(new AppError("user already exist with email", 400))
    }


  

    //create new user if there is no user with the email and username
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        userName: firstName,
    })

    //generate the verification token
    const verifyUser = await newUser.verifyUserEmail();

    //save it to the database
    await newUser.save({ validateBeforeSave: false });

    //verification token url
    const verifyTokenUrl = `${process.env.originUrl}/${verifyUser}`;

    //message to be sent to the user
    const message = `please verify your email by clicking on the following email: ${verifyTokenUrl}. This token expires immediately after 1hr.`;


    //call the nodemailer function to send the message to the user's email
    sendEmail({
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        subject: "EMAIL VERIFICATION",
        message
    })

      
    createAndSendToken(newUser, 201, res)

})

 
exports.loginUser = catchAsync(async (req, res, next) => {
    
    const { email, password } = req.body;

    //RETURN ERROR MESSAGE IF USER DID NOT INPUT HIS/HER EMAIL
    if (!email || !password) {
        return next(new AppError("Please input your email or password"));
    }

    //FIND USER USING PROVIDED EMAIL
    const theUser = await User.findOne({ email }).select("+password");

    //RETURN ERROR IF THE USER DOES NOT EXIST OR THE PASSWORD IS INCORRECT
    if (!theUser || !(await theUser.correctPassword(password, theUser.password))) {
        return next(new AppError("incorrect password or email. please try again", 400))
    }


    createAndSendToken(theUser, 200, res)


})
 

 
exports.forgotPassword = catchAsync(async (req, res, next) => {
//destructure user email from the body
    const { email } = req.body;
 
    //find user using the provided email
    const user = await User.findOne({ email });
    
    //if the user does not exist, return an error message
    if (!user) {
        return next(new AppError('User does not exist', 400)) 
    }

    //generate reset token by calling the createResetToken function defined in the userModel
    const resetToken = user.createPasswordResetToken();

    //save it back to the database 
    await user.save({ validateBeforeSave: false });

    //URL FOR RESETING PASSWORD
    const resetUrl = `${process.env.originUrl}/reset-password/${resetToken}`;
    const message = `forgot your passowrd? kindly submit your new password to ${resetUrl}. if you did not request for this kindly ignore.`
 
    try {
        sendEmail({
            message,
            subject: "THIS PASSWORD RESET TOKEN IS ONLY VALID FOR 30 MINUTES",
            email : user.email,
            name : user.firstName
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
    // Get token from HttpOnly cookie
    const token = req.cookies.jwt;

    if (!token) {
        return next(new AppError("You are not authorized", 401));
    }

    let decoded;

    try {
        // Verify the token
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new AppError("Token verification failed", 401));
    }

    // Check if user exists
    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        return next(new AppError("User does not exist", 401));
    }

    // Check if the user has changed the password after the token was issued
    if (freshUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password, please log in again", 401));
    }

    // Store the user in the request object
    req.user = freshUser;

    next();
});
 

exports.restrictTo = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new AppError('you are restricted from accessing this route', 401))
        }
    }
} 


//FETCH AUNTHENTICATED USER INFORMATION
exports.getMe = catchAsync(async (req, res, next) => {

    //get token from cookie
    const token = req.cookies.jwt;

//check if token exist, if not return error message.
    if (!token) {
        return next(new AppError("You are not authorized to access this route", 401));
    }
 
    //verify the token
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    } catch (error) {
        return next(new AppError("Token verification failed", 400));
    }
//find the user, using the id attached to the token
    const user = await User.findById(decoded.id);

    //check if the user exist, if not return an error message
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    //check if the password was changed recently, if it was changed then return an error message telling the user to login again
    if (user.changePasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password, kindly login again", 400));
    }

    //if everything is successful, return a success response with the user data.
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});



exports.resetPassword = catchAsync(async (req, res, next) => {

    //destructure the the token from the param
    const { token } = req.params;

    //hash the token using crypto, a nodejs inbuilt libary for hashing
    const theResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
    
    //find the user from the database using the hashed token and the password reset token expire
    const user = await User.findOne({
        passwordResetToken: theResetToken,
        passwordResetTokenExpires: {$gt : Date.now()} 
    })

    //check if the user exist
    if (!user) {
        return next(new AppError("Invalid token or expired", 400))
    }

    //destructure the the new password provided by the user from the body
    const { password, confirmPassword } = req.body;
     
//update the password
    user.password = password;
    user.confirmPassword = confirmPassword
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    //Finally save the change to the database
    await user.save();

    //issue a new token to the user
    const newSigninToken = signToken(user._id);


        sendEmail({
            message: "You have successfully reset your password",
            subject: "PASSWORD RESET SUCCESSFUL.",
            email : user.email,
            name : user.firstName
        })


    //success response
    res.status(200).json({
        status: 'success',
        message: "reset password successful",
        token : newSigninToken
})

     
})




//CHANGE PASSWORD
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

    // const newSigninToken = signToken(user._id);

    createAndSendToken(user, 200, res)

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

exports.logoutUser = catchAsync(async (req, res, next) => {
    const cookieOptions = {
        expires: new Date(Date.now() + 1 * 1000), // Expire in a second
        httpOnly: true, // Prevents client-side scripts from accessing the cookie
        sameSite : SAME_SITE
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true; // Cookies should only be sent over HTTPS
    }

    // Set the JWT to a dummy value and expire the cookie immediately
    res.cookie("jwt", "logged out", cookieOptions);

    res.status(200).json({
        status: "success",
        message: "Logout successful"
    });
});






