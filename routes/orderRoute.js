const express = require('express');
const { protectedRoute } = require('../controllers/authController');
const { createOrder, getAllOrderByAUser, getOrder, getAllOrder, cancelOrder, approveOrder, rejectOrder } = require('../controllers/orderController');

const router = express.Router();
 
router.use(protectedRoute); 

//ROUTE FOR CREATING AN ORDER
router.post('/createOrder', createOrder)

//ROUTE FOR FETCHING ALL ORDER BY A USER
router.get('/getAllOrderByUser/:userId', getAllOrderByAUser);

//ROUTE FOR FETCHING ORDER USING ITS ID
router.get('/getAnOrder/:id', getOrder);

//ROUTE FOR FETCHING ALL ORDER
router.get('/getAllOrder', getAllOrder);

//ROUTE FOR CANCELLING ORDER 
router.patch("/cancelOrder/:orderId", cancelOrder);

//ROUTE FOR APPROVING ORDER
router.patch("/approveOrder/:orderId", approveOrder);

//ROUTE FOR REJECTING ORDER
router.patch("/rejectOrder/:orderId", rejectOrder);



module.exports = router;