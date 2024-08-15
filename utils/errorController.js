// const AppError = require('../errors/appError');

// const handleCastErrorDB = err => {
//     const message = `invalid input ${err.value}`
//     return new AppError(message, 400)
// }

// const handleDuplicateFieldsDB = err => {
//     const value = err.errmsg(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
//     const message = `duplicate value ${value}, please try again`;
//     return new AppError(message, 404)
// }

// const handleValidationError = err => {
//     const error = Object.keys(err.error).map(el => el.message)
//     const message = `validation erro ${err}. try again`;
//     return new AppError(message, 404)
// }




// const sendDevError = (err, res) => {
    
//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//     })

// }

// const sendErrorProd = (err, res) => {
//     if (err.isOperational) {
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message
//         })
//     } else {
//         res.status(500).json({
//             status: 'fail',
//             message : "an error occur"
//         })
//     }
// }

// module.exports = (err, req, res, next) => {

   
//         let error = { ...err }
//         if (error.name === "CastError") error = handleCastErrorDB(error);
//         if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//         if (error.name === "ValidationError") error = handleValidationError(error)

//         sendDevError(err, res)
    
// }


//errorController

const AppError = require('../errors/appError');

const handleCastErrorDB = err => {
    const message = `Invalid input: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Validation error: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendDevError = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        error: err,
        stack: err.stack
    });
};

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
const handleJWTErr = () => new AppError("Invalid token. Please login again", 401)

const handleJWTExpiredError = () => new AppError("Your token already expired. Please login again", 401);
const { NODE_ENV } = process.env;


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

// module.exports = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     let error = { ...err };
//     if (err.name === 'CastError') error = handleCastErrorDB(error);
//     if (err.code === 11000) error = handleDuplicateFieldsDB(error);
//     if (err.name === 'ValidationError') error = handleValidationError(error);

//     if (NODE_ENV === 'development') {
//         sendDevError(err, res);
//     } else if (NODE_ENV === 'production') {
//         sendProdError(error, res);
//     }
// };
