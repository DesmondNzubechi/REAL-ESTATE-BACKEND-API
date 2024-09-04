const AppError = require("../errors/appError");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/sendEmail");
const { propertyActivitiesController } = require("./activitiesController");
const jwt = require('jsonwebtoken');
const { promisify } = require("util");


// exports.createOrder = catchAsync(async (req, res, next) => {
//     const { property } = req.body;

//     const userToken = req.cookies.jwt;

//     let theUserId;

//     if (userToken) {
//         theUserId = await promisify(jwt.verify)(userToken, process.env.JWT_SECRET);
//     }

//     if (!property || !theUserId) {
//         return next(new AppError('Property and user are required', 400));
//     }

//     const theUser = await User.findById(theUserId);

//     if (!theUser) {
//         return next(new AppError("User does not exist", 401))
//     }

//     const order = await Order.create({
//         property,
//         user : theUserId.id
//     });

   
  
//     const username = `${theUser.firstName} ${theUser.lastName}`;

//     const orderUrl = `${process.env.originUrl}/my-order/${order._id}`;
//     const message = `Your order for a property was successful. Kindly take a look at the order here: ${orderUrl}`

//     sendEmail({
//         subject: "Your property Order was successful",
//         message,
//         email: theUser.email,
//         name: username
//     })

//     try {
//         propertyActivitiesController(
//             user, // Pass the user ID directly
//             property, // Use order._id for relatedId
//             'order_placed', // Activity type
//             'properties'
//         );
//     } catch (err) {
//         return next(new AppError('Failed to log activity', 500));
//     }

//     res.status(201).json({
//         status: "success",
//         message: "Order successful",
//         data: {
//             order
//         }
//     });
// });
exports.createOrder = catchAsync(async (req, res, next) => {
    const { property } = req.body;

    const userToken = req.cookies.jwt;

    let theUserId;

    //IF THE JWT EXIST, THEN
    if (userToken) {
        const decodedToken = await promisify(jwt.verify)(userToken, process.env.JWT_SECRET);
        theUserId = decodedToken.id; // Extract the `id` from the decoded token
    }
    console.log("user id", theUserId)
    
    //CHECK IF THE USER AND PROPERTY ID
    if (!property || !theUserId) {
        return next(new AppError('Property and user are required', 400));
    }
 
    //FIND A USER USING HIS/HER ID
    const theUser = await User.findById(theUserId);

    //RETURN ERROR MESSAGE IF USER DOES NOT EXIST
    if (!theUser) {
        return next(new AppError("User does not exist", 401));
    }

    //CREATE THE ORDER USING THE PROPERTY AND THE USER ID
    const order = await Order.create({
        property, 
        user: theUserId // Corrected the user ID assignment
    });

    const username = `${theUser.firstName} ${theUser.lastName}`;

    //GET THE URL OF THE WEBSITE
    const orderUrl = `${process.env.originUrl}/my-order/${order._id}`;
    const message = `Your order for a property was successful. Kindly take a look at the order here: ${orderUrl}`;

    //SEND MESSAGE TO THE USER'S EMAIL WHEN ORDERED A PROPERTY
    sendEmail({ 
        subject: "Your property Order was successful",
        message,
        email: theUser.email,
        name: username 
    }); 

    //LOG IT TO THE USER ACTIVITIES
    try {
      propertyActivitiesController(
            theUserId, // Pass the user ID directly
            property,  // Pass the property ID
            'order_placed', // Activity type
        );
    } catch (err) {
        return next(new AppError('Failed to log activity', 500));
    }
 
    //SUCCESS RESPONSE
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

    //FINDB ALL THE PROPERTY ORDER PLACED BY A PARTICULAR USER
    const orders = await Order.find({ user: userId }).populate("property");


    //FILTER THE ORDER THAT THEIR PROPERTY IS DELETED
    const filterOrder = orders.filter(order => order.property !== null)
    console.log('Orders:', orders); // Log the fetched orders



    //RETURN SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "orders successfully fetched",
        data: {
            orders : filterOrder
        }
    })
})
 


exports.getOrder = catchAsync(async (req, res, next) => {

    //EXTRACT THE ID FROM URL PARAMS
    const { id } = req.params;

    //FIND THE PROPERTY ORDERED BY USERS
    const orderedProperty = await Order.findById(id).populate('property').populate('user');

    //RETURN ERROR MESSAGE IF PROPERTY DOES NOT EXIST
    if (!orderedProperty) {
        return next(new AppError("Property does not exist", 404));
    }

//SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: 'order fetched successful',
        data: {
            orderedProperty
        }
    })
})


exports.getAllOrder = catchAsync(async (req, res, next) => {
    
    //FIND ALL ORDER CREATED BY USER
    const allOrder = await Order.find().populate("property").populate("user");

    //FILTER OUT THE ORDER THAT THE USER AND PROPERTY ARE DELETED
    const filterOrder = allOrder.filter(orders => orders.property !== null && orders.user !== null)

    //RETURN SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        length: allOrder.length,
        message: "order successfully fetched",
        data: {
            allOrder : filterOrder
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
    
    //FIND THE USER BY ID
    const user = await User.findById(theOrder.user);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const username = `${user.firstName} ${user.lastName}`;

    const orderUrl = `${req.protocol}://${req.get("host")}/api/v1/order/getAnOrder/${orderId}`;
    const message = `Your order for a property has been rejected. Kindly take a look at the order here: ${orderUrl}`

    sendEmail({
        subject: "Your property Order is approved",
        message,
        email: user.email,
        name: username
    })


    try {
        propertyActivitiesController(
            theOrder.user, // Pass the user ID directly
            orderId, // Use order._id for relatedId
            'order_approved', // Activity type
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
    const user = await User.findById(theOrder.user);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const username = `${user.firstName} ${user.lastName}`;

    const orderUrl = `${req.protocol}://${req.get("host")}/api/v1/order/getAnOrder/${orderId}`;
    const message = `Your order for a property has been rejected. Kindly take a look at the order here: ${orderUrl}`

    sendEmail({
        subject: "Your property Order is cancelled",
        message,
        email: user.email,
        name: username
    })

    try {
        propertyActivitiesController(
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
        propertyActivitiesController(
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