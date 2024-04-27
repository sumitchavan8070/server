const mongoose = require("mongoose");

const examCategorySchema = new mongoose.Schema({
  catName: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("ExamCategory", examCategorySchema);
