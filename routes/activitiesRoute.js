const express = require("express");
const { getAllActivities, getUserPropertyActivities, deleteAllTheactivities, getUserBlogActivities } = require("../controllers/activitiesController");
const { protectedRoute } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/activities/getAllActivities:
 *   get:
 *     summary: Get all activities
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   activity:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router
    .route("/getAllActivities")
    .get(getAllActivities);

/**
 * @swagger
 * /api/v1/activities/getUserPropertyActivities/{user}:
 *   get:
 *     summary: Get a user's property activities
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: A list of property-related activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   property:
 *                     type: string
 *                   activity:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
    .route("/getUserPropertyActivities/:user")
    .get(getUserPropertyActivities);

/**
 * @swagger
 * /api/v1/activities/getUserBlogActivities/{user}:
 *   get:
 *     summary: Get a user's blog activities
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: A list of blog-related activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   blogPost:
 *                     type: string
 *                   activity:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
    .route("/getUserBlogActivities/:user")
    .get(getUserBlogActivities);
 
/**
 * @swagger
 * /api/v1/activities/deleteAllActivities:
 *   delete:
 *     summary: Delete all activities
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All activities deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/deleteAllActivities", deleteAllTheactivities);

module.exports = router;
