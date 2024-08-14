const express = require('express');
const { signUpNewUser, loginUser, forgotPassword, resetPassword, changePassword, protectedRoute, verifyTheUserEmail} = require('../controllers/authController');
const { getAllUser, createAUser, updateMe, getAUser, deleteAUser } = require('../controllers/userController');
const { uploadPhoto, uploadImageToCloudinary } = require('../controllers/uploadController');

const router = express.Router();

router
    .route('/signup')
    .post(signUpNewUser)

router 
    .route('/resetPassword/:token')
    .patch(resetPassword)

router
    .route('/forgotPassword')
    .post(forgotPassword)

router
    .route("/login")
    .post(loginUser)

router
    .route("/getAllUser")
    .get(getAllUser)
 
router 
    .route('/changePassword')
    .patch(protectedRoute, changePassword)
 
router
    .route("/createAUser")
    .post(createAUser)

router
    .route('/updateUser/:id')
    .patch(protectedRoute, uploadPhoto, uploadImageToCloudinary, updateMe)

    router
    .route('/deleteAUser')
    .patch(protectedRoute, deleteAUser)


router
    .route("/verifyTheUserEmail/:theToken")
    .patch(verifyTheUserEmail)

router
    .route('/getAUser/:id')
    .get(getAUser)



module.exports = router;