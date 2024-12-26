const mongoose = require("mongoose");

const subExamTypeSchema = new mongoose.Schema({
  subCatName: {
    type: String,
    enum: ["PRE", "MAINS", "SARAL"],
    required: true,
  },
  catId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamCategory",
    required: true,
  },
  questionPaperName: {
    type: String,
  },
});

module.exports = mongoose.model("SubExamType", subExamTypeSchema);
