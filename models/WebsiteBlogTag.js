const mongoose = require("mongoose");

const websiteBlogTagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("WebsiteBlogTag", websiteBlogTagSchema);
