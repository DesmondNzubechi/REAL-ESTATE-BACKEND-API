const express = require('express');
const { uploadPhoto, uploadImageToCloudinary } = require('../controllers/uploadController');
const { createLand, updateALand, deleteALand, getALand, getAllLand } = require('../controllers/landController');
const { protectedRoute, restrictTo } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/land/createLand:
 *   post:
 *     summary: Create a new land entry
 *     tags: [Land]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Land created successfully
 *       400:
 *         description: Bad request
 */
router
    .route('/createLand')
    .post(uploadPhoto, uploadImageToCloudinary, createLand);

/**
 * @swagger
 * /api/v1/land/fetchAllLand:
 *   get:
 *     summary: Fetch all land entries
 *     tags: [Land]
 *     responses:
 *       200:
 *         description: A list of all lands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *       500:
 *         description: Server error
 */
router
    .route("/fetchAllLand")
    .get(getAllLand);

/**
 * @swagger
 * /api/v1/land/updateLand/{id}:
 *   patch:
 *     summary: Update a specific land entry by ID
 *     tags: [Land]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the land to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Land updated successfully
 *       404:
 *         description: Land not found
 *       500:
 *         description: Server error
 */
router
    .route("/updateLand/:id")
    .patch(protectedRoute, restrictTo('admin'), updateALand);

/**
 * @swagger
 * /api/v1/land/deleteLand/{id}:
 *   delete:
 *     summary: Delete a specific land entry by ID
 *     tags: [Land]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the land to delete
 *     responses:
 *       200:
 *         description: Land deleted successfully
 *       404:
 *         description: Land not found
 *       500:
 *         description: Server error
 */
router
    .route("/deleteLand/:id")
    .delete( protectedRoute, restrictTo('admin'), deleteALand);

/**
 * @swagger
 * /api/v1/land/fetchALand/{id}:
 *   get:
 *     summary: Fetch a specific land entry by ID
 *     tags: [Land]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the land to fetch
 *     responses:
 *       200:
 *         description: Land details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 image:
 *                   type: string
 *       404:
 *         description: Land not found
 *       500:
 *         description: Server error
 */
router
    .route("/fetchALand/:id")
    .get(getALand);

module.exports = router;
