const express = require('express');
const { createAReview } = require('../controllers/reviewController');

const router = express.Router();

router.post('/addReview', createAReview)

module.exports = router;