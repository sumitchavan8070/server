// controllers/bannerController.js

const Banner = require("../models/Banner");
const cloudinary = require("cloudinary").v2;

// controllers/bannerController.js

exports.createBanner = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "banners",
    });

    const banner = new Banner({
      coverImageUri: result.secure_url,
      cornerLabelText: req.body.cornerLabelText || "", // Optional field
      cornerLabelColor: req.body.cornerLabelColor || "", // Optional field
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get All Banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete image from Cloudinary
    const publicId = banner.coverImageUri
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    // Delete banner from database
    await banner.remove();
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
