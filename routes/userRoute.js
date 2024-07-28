const express = require('express');
const { signUpNewUser, loginUser, forgotPassword, resetPassword, changePassword, protectedRoute} = require('../controllers/authController');
const { getAllUser } = require('../controllers/userController');

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


module.exports = router;