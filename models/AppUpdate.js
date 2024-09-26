const mongoose = require("mongoose");

const appUpdateSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      required: [true, "App name is required"],
      trim: true,
    },
    buildNo: {
      type: Number,
      required: [true, "Build number is required"],
    },
    iosBuildNo: {
      type: Number, // iOS build number is optional
    },
    version: {
      type: String,
      required: [true, "Version is required"],
      trim: true,
    },
    softUpdate: {
      type: Number,
      required: true,
      default: 0,
    },
    forceUpdate: {
      type: Number,
      required: true,
      default: 1,
    },
    playIcon: {
      type: String,
      trim: true, // Optional field for an icon URL
    },
    downloadUrl: {
      type: String,
      required: true, // Download URL required, without validation for now
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const AppUpdate = mongoose.model("AppUpdate", appUpdateSchema);

module.exports = AppUpdate;
