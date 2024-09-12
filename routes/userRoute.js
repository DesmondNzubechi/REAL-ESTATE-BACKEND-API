const express = require('express');
const { signUpNewUser, signInWithGoogle, theGoogleCallback, loginUser, forgotPassword, resetPassword, changePassword, protectedRoute, verifyTheUserEmail, getMe, logoutUser, restrictTo} = require('../controllers/authController');
const { getAllUser, createAUser, updateMe, getAUser, deleteAUser, updateProfilePicture } = require('../controllers/userController');
const { uploadPhoto, uploadImageToCloudinary } = require('../controllers/uploadController');
//const { signInWithGoogle,  theGoogleCallback} = require('../controllers/googleAuthController');

const rateLimit = require("express-rate-limit");


const authRateLimiter = rateLimit({
    max: 10,
    windows : 60 * 60 * 1000,
    message : "Too many request from this IP. Please try again after 1 hour.",
    standardHeaders: true,
    legalHeaders: true,
})



 

const router = express.Router();



////ROUTE FOR SIGNING UP
/**
 * @swagger
 * /api/v1/user/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *                 format: password
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Invalid input or validation error
 */
router
    .route('/signup')
    .post(authRateLimiter, signUpNewUser);

    /**
 * @swagger
 * /api/v1/user/googleAuth:
 *   get:
 *     summary: Initiate Google authentication
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Redirect to Google authentication page
 */
router
.route('/googleAuth')
.get(authRateLimiter, signInWithGoogle);


    router
    .route('/googleAuth/signin')
    .get(authRateLimiter, theGoogleCallback)

    ////ROUTE FOR RESETING A PASSWORD
/**
 * @swagger
 * /api/v1/user/resetPassword/{token}:
 *   patch:
 *     summary: Reset user password using a token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the new password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or password mismatch
 */
router
    .route('/resetPassword/:token')
    .patch(resetPassword);

    ////ROUTE FOR FORGOT PASSWORD
/**
 * @swagger
 * /api/v1/user/forgotPassword:
 *   post:
 *     summary: Send a password reset email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router
    .route('/forgotPassword')
    .post(forgotPassword);

    ////ROUTE FOR LOGIN
/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router
    .route("/login")
    .post(authRateLimiter, loginUser);

    ////ROUTE FOR FETCHING ALL THE USER
/**
 * @swagger
 * /api/v1/user/getAllUser:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router
    .route("/getAllUser") 
    .get(protectedRoute, restrictTo('admin'), getAllUser);

router 
    .route('/changePassword')
    .patch(protectedRoute, authRateLimiter, changePassword)
 
router
    .route("/createAUser")
    .post(createAUser)

/**
 * @swagger
 * /api/v1/user/updateUser/{id}:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Validation error
 */
router
    .route('/updateUser/:id')
    .patch(protectedRoute, updateMe);

    router
    .route('/updateProfilePic/:id')
    .patch(protectedRoute, uploadPhoto, uploadImageToCloudinary, updateProfilePicture)
 
    //ROUTE FOR DELETING  A USER
  /**
 * @swagger
 * /api/v1/user/deleteAUser:
 *   patch:
 *     summary: Delete a user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router
.route('/deleteAUser')
.patch(protectedRoute, deleteAUser);


router
    .route("/verifyTheUserEmail/:theToken")
    .patch(verifyTheUserEmail)

router 
    .route('/getAUser/:id')
    .get(protectedRoute, getAUser)

router
    .route('/me')
    .get(getMe)

 /**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router
.route('/logout')
.post(logoutUser);


module.exports = router;


