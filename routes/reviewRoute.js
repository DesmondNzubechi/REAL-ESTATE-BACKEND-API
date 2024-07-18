const express = require('express');
const { createAReview, getAllReviews, getPropertyReview } = require('../controllers/reviewController');

const router = express.Router();

router.post('/addReview', createAReview)
router.get("/", getAllReviews)
router.get("/property/:property/reviews", getPropertyReview)

module.exports = router;