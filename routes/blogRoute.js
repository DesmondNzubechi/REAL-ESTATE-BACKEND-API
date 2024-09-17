const express = require("express");
const { createBlogPost, updateBlogPost, publishABlogPost, unPublishABlogPost, deleteBlogPost, getAllBlogPost, getABlogPost } = require("../controllers/blogController");
const { uploadPhoto, uploadImageToCloudinary } = require("../controllers/uploadController");
const { restrictTo, protectedRoute } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/blog/createBlogPost:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       400:
 *         description: Bad request
 */
router
    .route("/createBlogPost")
    .post(uploadPhoto, uploadImageToCloudinary, createBlogPost);

/**
 * @swagger
 * /api/v1/blog/getAllBlogPost:
 *   get:
 *     summary: Fetch all blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   published:
 *                     type: boolean
 *       500:
 *         description: Server error
 */
router
    .route("/getAllBlogPost")
    .get(getAllBlogPost);

/**
 * @swagger
 * /api/v1/blog/getABlogPost/{id}:
 *   get:
 *     summary: Fetch a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post
 *     responses:
 *       200:
 *         description: Blog post details
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router
    .route("/getABlogPost/:id")
    .get(getABlogPost);

/**
 * @swagger
 * /api/v1/blog/updateBlogPost/{id}:
 *   patch:
 *     summary: Update a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */
router
    .route("/updateBlogPost/:id")
    .patch(protectedRoute, restrictTo('admin'), updateBlogPost);

/**
 * @swagger
 * /api/v1/blog/publishBlogPost/{id}:
 *   patch:
 *     summary: Publish a blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to publish
 *     responses:
 *       200:
 *         description: Blog post published successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */
router
    .route("/publishBlogPost/:id")
    .patch(protectedRoute, publishABlogPost);

/**
 * @swagger
 * /api/v1/blog/unpublishBlogPost/{id}:
 *   patch:
 *     summary: Unpublish a blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to unpublish
 *     responses:
 *       200:
 *         description: Blog post unpublished successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */
router
    .route("/unpublishBlogPost/:id")
    .patch(unPublishABlogPost);

/**
 * @swagger
 * /api/v1/blog/deleteBlogPost/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to delete
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */
router
    .route("/deleteBlogPost/:id")
    .delete(deleteBlogPost);

module.exports = router;
