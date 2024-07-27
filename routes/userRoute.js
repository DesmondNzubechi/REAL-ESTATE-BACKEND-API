const express = require('express');
const { signUpNewUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
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


module.exports = router;