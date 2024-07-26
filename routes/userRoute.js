const express = require('express');
const { signUpNewUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router
    .route('/signup')
    .post(signUpNewUser)

    router.route("/login").post(loginUser)


module.exports = router;