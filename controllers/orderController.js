const AppError = require("../errors/appError");
const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");



exports.createOrder = catchAsync(async (req, res, next) => {
    
    const { property, user } = req.body;

    const order = await Order.create({
        property,
        user
    });

    res.status(201).json({
        status: "success",
        message: "order successful",
        data: {
            order
        }
    })
})

exports.getAllOrderByAUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId }).populate("property");

    console.log('Orders:', orders); // Log the fetched orders

    if (!orders || orders.length === 0) {
        return next(new AppError('No orders found for this user', 404));
    }
 
    res.status(200).json({
        status: "success",
        message: "orders successfully fetched",
        data: {
            orders
        }
    })
})

exports.getOrder = catchAsync(async (req, res, next) => {
    
    const { id } = req.params;

    const orderedProperty = await Order.findById(id).populate('property').populate('user');

    if (!orderProperty) {
        return next(new AppError("Property does not exist", 404));
    }
    res.status(200).json({
        status: "success",
        message: 'order fetched successful',
        data: {
            orderedProperty
        }
    })
})