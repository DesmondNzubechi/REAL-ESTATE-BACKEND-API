//CONTROLLERS/UPLOADCONTROLLER.JS

const multer = require('multer');
const { uploadImgToCloudinary } = require('../utils/cloudinary');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');

//UPLOADING OF FILE USING MULTER

//initiate a multer storage
const multerStorage = multer.memoryStorage();

//filter only images by checking if the file the user is trying to upload is an image
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

//upload image function
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

//execute the image upload and export it where it will be used in any route that requires image upload
exports.uploadPhoto = upload.single('images');

//Upload the image to the cloudinary
exports.uploadImageToCloudinary = catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError('No file uploaded', 400));

    const imageUrl = await uploadImgToCloudinary(req.file.buffer);
    req.file.cloudinaryUrl = imageUrl;
    next();
});
