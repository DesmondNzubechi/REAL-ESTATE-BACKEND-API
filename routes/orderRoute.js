const express = require('express');
const { protectedRoute } = require('../controllers/authController');
const { createOrder, getAllOrderByAUser, getOrder, getAllOrder, cancelOrder, approveOrder, rejectOrder } = require('../controllers/orderController');

const router = express.Router();

// Apply the protectedRoute middleware to all routes
router.use(protectedRoute);

/**
 * @swagger
 *  /api/v1/order/createOrder:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product being ordered
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product
 *               totalPrice:
 *                 type: number
 *                 description: The total price for the order
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 */
router.post('/createOrder', createOrder);

/**
 * @swagger
 * /api/v1/order/getAllOrderByUser/{userId}:
 *   get:
 *     summary: Get all orders placed by a user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of all orders by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   totalPrice:
 *                     type: number
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/getAllOrderByUser/:userId', getAllOrderByAUser);

/**
 * @swagger
 * /api/v1/order/getAnOrder/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 totalPrice:
 *                   type: number
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/getAnOrder/:id', getOrder);

/**
 * @swagger
 * /api/v1/order/getAllOrder:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   totalPrice:
 *                     type: number
 *       500:
 *         description: Server error
 */
router.get('/getAllOrder', getAllOrder);

/**
 * @swagger
 * /api/v1/order/cancelOrder/{orderId}:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be canceled
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch("/cancelOrder/:orderId", cancelOrder);

/**
 * @swagger
 * /api/v1/order/approveOrder/{orderId}:
 *   patch:
 *     summary: Approve an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be approved
 *     responses:
 *       200:
 *         description: Order approved successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch("/approveOrder/:orderId", approveOrder);

/**
 * @swagger
 * /api/v1/order/rejectOrder/{orderId}:
 *   patch:
 *     summary: Reject an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be rejected
 *     responses:
 *       200:
 *         description: Order rejected successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch("/rejectOrder/:orderId", rejectOrder);

module.exports = router;
