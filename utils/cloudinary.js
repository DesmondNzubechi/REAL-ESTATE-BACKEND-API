//UTILS/CLOUDINARY.JS

const cloudinary = require('../cloudinary/Cloudinary');

//FUNCTION FOR UPLOADING OUR IMAGE TO THE CLOUDINARY

const uploadImgToCloudinary = async (imageBuffer) => {
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
            stream.end(imageBuffer);
        });
        return result.secure_url;
    } catch (error) {
        throw new Error('Failed to upload image to Cloudinary');
    }
};

module.exports = { 
    uploadImgToCloudinary
};
