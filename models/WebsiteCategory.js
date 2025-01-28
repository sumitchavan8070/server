const mongoose = require("mongoose");

const websiteCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("WebsiteCategory", websiteCategorySchema);
