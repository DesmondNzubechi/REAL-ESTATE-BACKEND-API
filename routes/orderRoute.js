const express = require('express');
const { protectedRoute } = require('../controllers/authController');
const { createOrder, getAllOrderByAUser, getOrder } = require('../controllers/orderController');

const router = express.Router();

router.use(protectedRoute);

router.post('/createOrder', createOrder)
router.get('/getAllOrderByUser/:userId', getAllOrderByAUser);
router.get('getAnOrder/:id', getOrder);


module.exports = router;