const mongoose = require("mongoose");

const examCategorySchema = new mongoose.Schema({
  catName: { type: String, required: true, unique: true },
  catShortName: { type: String },

  description: { type: String },
  image: { type: String },
  pdfFiles: [
    {
      heading: { type: String },
      source: { type: String }, // URL to the PDF file
    },
  ],
  categoryNumber: {
    type: Number,
    required: true,
    unique: true, // Ensure the index is unique
  },
});

module.exports = mongoose.model("ExamCategory", examCategorySchema);
