const cloudinary = require('cloudinary').v2

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUD_NAME} = process.env

cloudinary.config({
    secure: true,
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});




exports.uploadImg = async (imagePath) => {

    //use default file name as the public id 
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true
    }

    try {
        const result = await cloudinary.uploader.upload(imagePath, options);

        console.log(result);

        return result.public_id;
    } catch (error) {
        console.log(error.message)
    }
}



exports.getUploadedImg = async (publicId) => {
    
    const options = {
        colors: true
    };

    try {
        const result = await cloudinary.api.resource(publicId, options);

        console.log(result);

        return result.colors;
    } catch (error) {
        
    }
}


exports.createImgtag = async (publicId, ...colors) => {
    const [effectColor, backgroundColor] = colors;

    const imgTag = cloudinary.image(publicId, {
        transformation: [
            { width: 300, height: 300, gravity: 'faces', crop: 'thumb' },
            { radius: "max" },
            { background: backgroundColor },
            {effect : 'outline:10', color : effectColor}
        ]
    })

    return imgTag
}