// const { OAuth2Client } = require("google-auth-library");
// const axios = require("axios"); // Import axios to make HTTP requests
// const catchAsync = require("../utils/catchAsync");
// const User = require("../models/userModel");
// const { createAndSendToken } = require("./authController");
// const AppError = require("../errors/appError");

// // Function to fetch user data from Google
// const getUserData = async (accessToken) => {
//     const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//     return response.data;
// };

// // Route that generates Google OAuth URL
// exports.signInWithGoogle = catchAsync(async (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', process.env.originUrl);
//     res.header("Referrer-Policy", 'no-referrer-when-downgrade');

//     const redirectUrl = `${process.env.backendUrl}/api/v1/user/googleAuth/signin`;

//     const oAuth2Client = new OAuth2Client(
//         process.env.googleClientId,
//         process.env.googleClientSecret,
//         redirectUrl
//     );

//     const authorizedUrl = oAuth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: [
//             'https://www.googleapis.com/auth/userinfo.profile', 
//             'https://www.googleapis.com/auth/userinfo.email', // Include the email scope
//             'openid'
//         ],
//         prompt: 'consent'
//     });
    

//     // Send URL back to frontend
//     res.json({ url: authorizedUrl });
// });

// // Route to handle Google OAuth callback
// exports.theGoogleCallback = catchAsync(async (req, res, next) => {
//     const code = req.query.code;
//     const oAuth2Client = new OAuth2Client(
//         process.env.googleClientId,
//         process.env.googleClientSecret,
//         `${process.env.backendUrl}/api/v1/user/googleAuth/signin`
//     );

//     // Exchange authorization code for tokens
//     const tokenResponse = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokenResponse.tokens);

//     // Get user data from Google
//     const userInfo = await getUserData(tokenResponse.tokens.access_token);

//     if(!userInfo){
//         return next(new AppError("User info from google does not exist", 404))
//     }

//     let user = await User.findOne({ googleId: userInfo.sub });

//     if (!user) {
//         user = await User.create({
//             userName: `${userInfo.given_name}`,
//             firstName: userInfo.given_name,
//             lastName: userInfo.family_name,
//             googleId: userInfo.sub,
//             images: userInfo.picture,
//             email: userInfo.email
//         });
//     }


//     // Create token or session as needed
//     createAndSendToken(user, 201, res);

//     // Redirect to frontend dashboard or application URL
//     res.redirect(`${process.env.originUrl}/my-account`); // Update this URL as needed
// });


