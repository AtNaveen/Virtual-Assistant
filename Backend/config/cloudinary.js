const dotenv =require('dotenv');
dotenv.config(); 
const cloudinary = require("cloudinary").v2;
const fs = require('fs');

   cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY

});


exports.uploadOnCloudinary = async(filePath) => {

   try {
      const uploadResult = await cloudinary.uploader
      .upload(filePath)
      fs.unlinkSync(filePath);
      return uploadResult.secure_url;   
   } catch (error) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      throw new Error(error.message);
   }
}
