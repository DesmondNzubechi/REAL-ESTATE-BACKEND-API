const express = require('express');
const { protectedRoute } = require('../controllers/authController');
const { createOrder, getAllOrderByAUser, getOrder, getAllOrder, cancelOrder, approveOrder } = require('../controllers/orderController');

const router = express.Router();

router.use(protectedRoute);

router.post('/createOrder', createOrder)
router.get('/getAllOrderByUser/:userId', getAllOrderByAUser);
router.get('/getAnOrder/:id', getOrder);
router.get('/getAllOrder', getAllOrder);


router.patch("/cancelOrder/:orderId", cancelOrder);
router.patch("/approveOrder/:orderId", approveOrder);
router.patch("/rejectOrder/:orderId", cancelOrder);



module.exports = router;