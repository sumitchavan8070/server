const mongoose = require("mongoose");

const subExamTypeSchema = new mongoose.Schema({
  subCatName: {
    type: String,
    enum: ["PRE", "MAINS", "SARAL-SEVA"],
    required: true,
  },
  catId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamCategory",
    required: true,
  },
});

module.exports = mongoose.model("SubExamType", subExamTypeSchema);
