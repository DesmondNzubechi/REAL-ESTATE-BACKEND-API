const express = require('express');
const { createAReview, getAllReviews, getPropertyReview } = require('../controllers/reviewController');

const router = express.Router();

////ROUTE FOR CREATING A REVIEW
router.post('/addReview', createAReview)

////ROUTE FOR FETCHING ALL THE REVIEW
router.get("/", getAllReviews)

////ROUTE FOR FETCHING A PROPERTY REVIEW USING ITS ID
router.get("/property/:property/reviews", getPropertyReview)

module.exports = router;