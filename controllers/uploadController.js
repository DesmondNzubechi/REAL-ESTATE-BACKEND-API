//CONTROLLERS/UPLOADCONTROLLER.JS

const multer = require('multer');
const { uploadImgToCloudinary } = require('../utils/cloudinary');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPhoto = upload.single('images');

exports.uploadImageToCloudinary = catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError('No file uploaded', 400));

    const imageUrl = await uploadImgToCloudinary(req.file.buffer);
    req.file.cloudinaryUrl = imageUrl;
    next();
});
