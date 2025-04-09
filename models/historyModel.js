const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  paperMeta: {
    name: { type: String, required: true },
    logo: String,
    year: String,
    category: String,
  },
  results: {
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    unattempted: { type: Number, required: true },
    markedForReview: { type: Number, default: 0 },
    totalMarks: { type: Number, required: true },
    timeTaken: { type: Number, required: true }, // in minutes
    selectedAnswers: { type: Object, required: true },
    percentage: { type: Number },
    accuracy: { type: Number },
  },
  questions: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);

module.exports = History;
