//PROPERTY ROUTE

const { createProperty, getAllProperty, updateProperty, deleteAProperty, getAProperty } = require("../controllers/propertyController");
const {uploadImageToCloudinary, uploadPhoto} = require("../controllers/uploadController")

const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /api/v1/properties/createProperty:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the property
 *                 example: "Luxury Apartment"
 *               price:
 *                 type: number
 *                 description: The price of the property
 *                 example: 500000
 *               location:
 *                 type: string
 *                 description: The location of the property
 *                 example: "New York"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: An array of images for the property
 *               map:
 *                 type: string
 *                 description: The map location (URL or coordinates)
 *               description:
 *                 type: string
 *                 description: Property description
 *               developmentStatus:
 *                 type: string
 *                 description: Current development status
 *                 example: "Under Construction"
 *               amenities:
 *                 type: string
 *                 description: Available amenities
 *               interiorFeatures:
 *                 type: string
 *                 description: Interior features of the property
 *               exteriorFeatures:
 *                 type: string
 *                 description: Exterior features of the property
 *               bathroom:
 *                 type: number
 *                 description: Number of bathrooms
 *               bedroom:
 *                 type: number
 *                 description: Number of bedrooms
 *               garadge:
 *                 type: number
 *                 description: Number of parking spaces
 *               yearBuilt:
 *                 type: string
 *                 description: The year the property was built
 *               type:
 *                 type: string
 *                 description: Property type (e.g., apartment, house)
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Invalid input or validation error
 */
router
  .route('/createProperty')
  .post(uploadPhoto, uploadImageToCloudinary, createProperty);




    ////ROUTE FOR FETCHING ALL PROPERTIES
    /**
 * @swagger
 * /api/v1/properties:
 *   get:
 *     summary: Retrieve a list of properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: A list of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 */

    router.get("/", getAllProperty)

    ////ROUTE FOR  UPDATING A PROPERTY
/**
 * @swagger
 * /api/v1/properties/updateAProperty/{id}:
 *   patch:
 *     summary: Update a property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 */
router.patch("/updateAProperty/:id", updateProperty);
  


////ROUTE FOR DELETING AND FETCHING A PROPERTY USING ITS ID
/**
 * @swagger
 * /api/v1/properties/{id}:
 *   get:
 *     summary: Get a property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The property ID
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 *
 *   delete:
 *     summary: Delete a property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 */
router
  .route('/:id') 
  .delete(deleteAProperty)
  .get(getAProperty);

    
module.exports = router;
 