

//Catchasync : This simplifies error handling on the asyncronous function

const catchAsync = (fn) => {

    return ((req, res, next) => {

        fn(req, res, next).catch(next)

    })

}

module.exports = catchAsync;