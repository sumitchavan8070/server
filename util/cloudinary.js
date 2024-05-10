// const cloudinary = require("cloudinary").v2;
// // import fs from "fs";
// const fs = require("fs");

// cloudinary.config({
//   cloud_name: "sdchavan",
//   api_key: "266271131794154",
//   api_secret: "1Xcz9fLmBQXtuRYYPStqeQvX94M",
// });

// const uploadFileOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return console.log("File path not found");
//     const responce = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     console.log("File uploaded on cloud");
//     responce.url;
//     console.log("Responce Url" + responce.url);

//     return responce;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//     console.log("Error in File Upload");
//     return null;
//   }
// };

// const deleteImageByUrl = async (req, res) => {
//   try {
//     const { imageUrl } = req.body;

//     // Extract public ID from the image URL
//     const publicId = cloudinary
//       .url(imageUrl, { secure: true })
//       .split("/")
//       .pop()
//       .split(".")[0];

//     // Delete the image using the public ID
//     const result = await cloudinary.uploader.destroy(publicId);

//     // Log the deletion result
//     console.log(result);

//     res.json(result);
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     res.status(500).json({ error: "Error deleting image" });
//   }
// };

// module.exports = { uploadFileOnCloudinary, deleteImageByUrl };
