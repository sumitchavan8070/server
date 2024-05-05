const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE,
});

//DELETE /api/v1/auth/delete-image?imageId=s0taagba71vfcvoafm58 200 2724.443 ms - 76
const deleteImageFromCloudinary = async (req, res) => {
  const imageId = req.query.imageId;
  // console.log("Image url " + imageId);
  try {
    // Delete the image from Cloudinary
    const deletionResult = await cloudinary.uploader.destroy(imageId);

    res.json({ message: "Image deleted from Cloudinary", deletionResult });
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    res.status(500).json({ error: "Failed to delete image from Cloudinary" });
  }
};

module.exports = {
  deleteImageFromCloudinary,
};
