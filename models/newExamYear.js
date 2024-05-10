const mongoose = require("mongoose");

const examYearSchema = new mongoose.Schema({
  QPYear: { type: String, required: true },
  catId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamCategory",
    required: true,
  },
  subCatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubExamType",
    required: true,
  },
});

module.exports = mongoose.model("ExamYear", examYearSchema);
