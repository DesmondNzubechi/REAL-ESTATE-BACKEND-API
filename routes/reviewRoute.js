const express = require('express');
const { createAReview, getAllReviews, getPropertyReview } = require('../controllers/reviewController');

const router = express.Router();

/**
 * @swagger
 *  /api/v1/reviews/addReview:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: The rating given by the user
 *               comment:
 *                 type: string
 *                 description: The comment from the user
 *               propertyId:
 *                 type: string
 *                 description: The ID of the property being reviewed
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request
 */
router.post('/addReview', createAReview);

/**
 * @swagger
 * /api/v1/reviews/:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *                   propertyId:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/", getAllReviews);

/**
 * @swagger
 *  /api/v1/reviews/property/{property}/reviews:
 *   get:
 *     summary: Get reviews for a specific property
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: property
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the property
 *     responses:
 *       200:
 *         description: Reviews for the specified property
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *                   propertyId:
 *                     type: string
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.get("/property/:property/reviews", getPropertyReview);

module.exports = router;
