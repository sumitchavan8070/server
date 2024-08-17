// // controllers/bannerController.js

// const Banner = require("../models/Banner");
// const cloudinary = require("cloudinary").v2;

// // controllers/bannerController.js

// exports.createBanner = async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "banners",
//     });

//     const banner = new Banner({
//       coverImageUri: result.secure_url,
//       cornerLabelText: req.body.cornerLabelText || "", // Optional field
//       cornerLabelColor: req.body.cornerLabelColor || "", // Optional field
//     });

//     await banner.save();
//     res.status(201).json(banner);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Get All Banners
// exports.getBanners = async (req, res) => {
//   try {
//     const banners = await Banner.find();
//     console.log(banners);

//     res.status(200).json(banners);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Delete Banner
// exports.deleteBanner = async (req, res) => {
//   try {
//     const banner = await Banner.findById(req.params.id);

//     if (!banner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }

//     // Delete image from Cloudinary
//     const publicId = banner.coverImageUri
//       .split("/")
//       .slice(-2)
//       .join("/")
//       .split(".")[0];
//     await cloudinary.uploader.destroy(publicId);

//     // Delete banner from database
//     await banner.remove();
//     res.status(200).json({ message: "Banner deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// controllers/bannerController.js

const Banner = require("../models/Banner");
const cloudinary = require("cloudinary").v2;

// const createBanner = async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "banners",
//     });

//     const banner = new Banner({
//       coverImageUri: result.secure_url,
//       cornerLabelText: req.body.cornerLabelText || "", // Optional field
//       cornerLabelColor: req.body.cornerLabelColor || "", // Optional field
//     });

//     await banner.save();
//     res.status(201).json(banner);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

const createBanner = async (req, res) => {
  try {
    // Ensure the file is uploaded to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "banners",
    });

    // Parse and validate the index field from the request body
    const index = parseInt(req.body.index, 10); // Convert index to integer

    if (isNaN(index) && req.body.index) {
      return res.status(400).json({ message: "Invalid index value" });
    }

    // Create a new banner with the provided data
    const banner = new Banner({
      coverImageUri: result.secure_url,
      cornerLabelText: req.body.cornerLabelText || "", // Optional field
      cornerLabelColor: req.body.cornerLabelColor || "", // Optional field
      index: !isNaN(index) ? index : undefined, // Set index if valid
    });

    // Save the banner to the database
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const deleteBanner = async (req, res) => {
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
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error", error });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverImageUri, cornerLabelText, cornerLabelColor, index } =
      req.body;

    // Check if the new index is already used by another banner
    if (index !== undefined) {
      // Ensure index is provided
      const existingBannerWithIndex = await Banner.findOne({
        index,
        _id: { $ne: id },
      });
      if (existingBannerWithIndex) {
        return res
          .status(400)
          .json({ error: "Index already exists for another banner" });
      }
    }

    // Find the Banner by ID and update it with the new values
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { coverImageUri, cornerLabelText, cornerLabelColor, index },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(400).json({ error: "Error updating banner" });
  }
};

module.exports = {
  createBanner,
  getBanners,
  deleteBanner,
  updateBanner,
};
