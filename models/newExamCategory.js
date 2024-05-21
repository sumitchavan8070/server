const mongoose = require("mongoose");

const examCategorySchema = new mongoose.Schema({
  catName: { type: String, required: true, unique: true },
  catShortName: { type: String },

  description: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("ExamCategory", examCategorySchema);
