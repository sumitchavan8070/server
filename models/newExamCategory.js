const mongoose = require("mongoose");

const examCategorySchema = new mongoose.Schema({
  catName: { type: String, required: true, unique: true },
  catShortName: { type: String },

  description: { type: String },
  image: { type: String },
  pdfFiles: [
    {
      heading: { type: String, required: true },
      url: { type: String, required: true }, // URL to the PDF file
    },
  ],
});

module.exports = mongoose.model("ExamCategory", examCategorySchema);
