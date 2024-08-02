const AppError = require("../errors/appError");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/sendEmail");
const { logActivitiesController } = require("./activitiesController");

exports.createOrder = catchAsync(async (req, res, next) => {
    const { property, user } = req.body;

    if (!property || !user) {
        return next(new AppError('Property and user are required', 400));
    }

    const order = await Order.create({
        property, 
        user
    });

    const theUser = await User.findById(theOrder.user);

    if (!theUser) {
        return next(new AppError("User does not exist", 401))
    }

    const username = `${user.firstName} ${user.lastName}`;

    const orderUrl = `${req.protocol}://${req.get("host")}/api/v1/order/getAnOrder/${order._id}`;
    const message = `Your order for a property was successful. Kindly take a look at the order here: ${orderUrl}`

    sendEmail({
        subject: "Your property Order was successful",
        message,
        email: user.email,
        name: username
    })

    try {
        logActivitiesController(
            user, // Pass the user ID directly
            property, // Use order._id for relatedId
            'order_placed', // Activity type
        );
    } catch (err) {
        return next(new AppError('Failed to log activity', 500));
    }

    res.status(201).json({
        status: "success",
        message: "Order successful",
        data: {
            order
        }
    });
});


exports.getAllOrderByAUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId }).populate("property");

    console.log('Orders:', orders); // Log the fetched orders

    if (!orders || orders.length === 0) {
        return next(new AppError('No orders found for this user', 404));
    }
 
    if (!findAUser) {
        return next(new AppError('User not found', 404));
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

    if (!orderedProperty) {
        return next(new AppError("Property does not exist", 404));
    }

    if (!findAUser) {
        return next(new AppError('User not found', 404));
    }


    res.status(200).json({
        status: "success",
        message: 'order fetched successful',
        data: {
            orderedProperty
        }
    })
})


exports.getAllOrder = catchAsync(async (req, res, next) => {
    
    const allOrder = await Order.find().populate("property").populate("user");

    res.status(200).json({
        status: "success",
        length: allOrder.length,
        message: "order successfully fetched",
        data: {
            allOrder
        }
    })
})


//APPROVE ORDER
exports.approveOrder = catchAsync(async (req, res, next) => {
    //destructure the id of the order to be approved from the url parameter
    const  { orderId } = req.params;
 
    //find the order from the database using its id an update it, in this case the status of the order will be updated to approved
     const theOrder = await Order.findByIdAndUpdate(orderId, { status: 'approved' }, { new: true });
 
     //if order does not exist return an error message
     if (!theOrder) {
         return next(new AppError("order does not exist", 400))
    }
    
    if (!findAUser) {
        return next(new AppError('User not found', 404));
    }

    try {
        logActivitiesController(
            theOrder.user, // Pass the user ID directly
            orderId, // Use order._id for relatedId
            'order_placed', // Activity type
        );
    } catch (err) {
        return next(new AppError('Failed to log activity', 500));
    }
 
     //if successful return a success response
     res.status(200).json({
         status: 'success',
         message: "order approved successfully",
         data: {
             theOrder
         }
     })
 
})

//CANCEL ORDER
exports.cancelOrder = catchAsync(async (req, res, next) => {
    //extract the id of the order to be cancelled from the url
   const  { orderId } = req.params;

    //find the order from the database using its id an update it, in this case the status of the order will be updated to canceled
    const theOrder = await Order.findByIdAndUpdate(orderId, { status: 'canceled' }, { new: true });

    //if order does not exist return an error message
    if (!theOrder) {
        return next(new AppError("order does not exist", 400))
    }


    if (!findAUser) {
        return next(new AppError('User not found', 404));
    }

    try {
        logActivitiesController(
            theOrder.user, // Pass the user ID directly
            orderId, // Use order._id for relatedId
            'order_canceled', // Activity type
        );
    } catch (err) {
        return next(new AppError('Failed to log activity', 500));
    }
    //if successful return a success response
    res.status(200).json({
        status: 'success',
        message: "order canceled successfully",
        data: {
            theOrder
        }
    })

})
 
//REJECT ORDER
exports.rejectOrder = catchAsync(async (req, res, next) => {
    
     //destructure the id of the order to be cancelled from the url
    const  { orderId } = req.params;
 



      //find the order from the database using its id an update it, in this case the status of the order will be updated to rejected
     const theOrder = await Order.findByIdAndUpdate(orderId, { status: 'rejected' }, { new: true });
 
     //if order does not exist return an error message
     if (!theOrder) {
         return next(new AppError("order does not exist", 400))
     }
 
    
     try {
        logActivitiesController(
            theOrder.user, // Pass the user ID directly
            orderId, // Use order._id for relatedId
            'order_rejected', // Activity type
        );
    } catch (err) {
        return next(new AppError('Failed to log activity', 500));
    }

    const user = await User.findById(theOrder.user);

    if (!user) {
        return next(new AppError("User does not exist", 401))
    }

    const username = `${user.firstName} ${user.lastName}`;

    const orderUrl = `${req.protocol}://${req.get("host")}/api/v1/order/getAnOrder/${orderId}`;
    const message = `Your order for a property has been rejected. Kindly take a look at the order here: ${orderUrl}`

    sendEmail({
        subject: "Your property Order is rejected",
        message,
        email: user.email,
        name: username
    })
     //if successful return a success response
     res.status(200).json({
         status: 'success',
         message: "order rejected successfully",
         data: {
             theOrder
         } 
     })
 
 })