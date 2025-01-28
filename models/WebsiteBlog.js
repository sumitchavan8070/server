const mongoose = require("mongoose");

const websiteBlogSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    mr: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    mr: { type: String, required: true },
  },
  slug: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WebsiteCategory",
    required: true,
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "WebsiteBlogTag" }],
  image: { type: String, required: true },
  author: { type: String, required: true },
  readingTime: { type: String, required: true },
  content: {
    en: { type: String, required: true },
    mr: { type: String, required: true },
  },
});

module.exports = mongoose.model("WebsiteBlog", websiteBlogSchema);
