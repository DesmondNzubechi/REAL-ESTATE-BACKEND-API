//errorController

const AppError = require('../errors/appError');

//GLOBAL ERROR HANDLER

//This handle cast error in the database
const handleCastErrorDB = err => {
    const message = `Invalid input: ${err.value}`;
    return new AppError(message, 400);
};

//for duplicate fields
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

//handle validation error
const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Validation error: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

//error message sent when in development
const sendDevError = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        error: err,
        stack: err.stack
    });
};

//error message sent when in production
const sendProdError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

//handles jwt error
const handleJWTErr = () => new AppError("Invalid token. Please login again", 401)

//jwt error when expires
const handleJWTExpiredError = () => new AppError("Your token already expired. Please login again", 401);
const { NODE_ENV } = process.env;


//export
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 404;
    err.status = err.status || 'error';

    if (NODE_ENV === 'development') {
        sendDevError(err, res)
    } else if (NODE_ENV === 'production') {
        let error = { ...err }
        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError") error = handleValidationError(error) 
        if (error.name === 'JsonWebTokenError') error = handleJWTErr();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
        sendProdError(error, res)
    }
}