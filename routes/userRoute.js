const express = require('express');
const { signUpNewUser, loginUser, forgotPassword } = require('../controllers/authController');

const router = express.Router();

router
    .route('/signup')
    .post(signUpNewUser)

    router.post('/forgotPassword', forgotPassword)

router
    .route("/login")
    .post(loginUser)


module.exports = router;