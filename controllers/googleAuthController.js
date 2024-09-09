const {OAuth2Client} = require("google-auth-library");
const catchAsync = require("../utils/catchAsync");

console.log("the credentials", process.env.googleClientId, process.env.originUrl)
 
// Route that generates Google OAuth URL
exports.signInWithGoogle = catchAsync(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.originUrl);
    res.header("Referrer-Policy", 'no-referrer-when-downgrade');

    const redirectUrl = `${process.env.backendUrl}`;

    const oAuth2Client = new OAuth2Client(
        process.env.googleClientId,
        process.env.googleClientSecret,
        redirectUrl
    );

    const authorizedUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'openid'],
        prompt: 'consent'
    });

    // Send URL back to frontend
    res.json({ url: authorizedUrl });
});



// Route to handle Google OAuth callback
exports.googleCallback = catchAsync(async (req, res, next) => {
    const code = req.query.code;

    const oAuth2Client = new OAuth2Client(
        process.env.googleClientId,
        process.env.googleClientSecret,
        `${process.env.originUrl}/signin`
    );

    // Exchange authorization code for tokens
    const tokenResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokenResponse.tokens);

    // Get user data from Google
    const userInfo = await getUserData(tokenResponse.tokens.access_token);

    // Handle the user data (e.g., create a session, issue JWT)
    res.json({ user: userInfo });
});
 