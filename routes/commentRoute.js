const express = require("express");
const { createComment, getAllTheBlogComment, deleteComment, updateComment, getABlogComment } = require("../controllers/commentController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/comments/createComment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               blogId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 */
router
    .route("/createComment")
    .post(createComment);

/**
 * @swagger
 * /api/v1/comments/getAllComment:
 *   get:
 *     summary: Fetch all comments for all blog posts
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: A list of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                   blogId:
 *                     type: string
 *                   userId:
 *                     type: string
 *       500:
 *         description: Server error
 */
router
    .route("/getAllComment")
    .get(getAllTheBlogComment);

/**
 * @swagger
 * /api/v1/comments/getABlogComment/{blogId}:
 *   get:
 *     summary: Fetch comments for a specific blog post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post
 *     responses:
 *       200:
 *         description: A list of comments for the blog post
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router
    .route("/getABlogComment/:blogId")
    .get(getABlogComment);

/**
 * @swagger
 * /api/v1/comments/deleteComment/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router
    .route("/deleteComment/:commentId")
    .delete(deleteComment);

/**
 * @swagger
 * /api/v1/comments/updateComment/{commentId}:
 *   patch:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router
    .route("/updateComment/:commentId")
    .patch(updateComment);

module.exports = router;
