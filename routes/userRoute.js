const express = require('express');
const { signUpNewUser } = require('../controllers/authController');

const router = express.Router();

router
    .route('/signup')
    .post(signUpNewUser)


module.exports = router;