const mongoose = require("mongoose");

const allPaperSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
      unique: true,
    },
    testName: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      // Not explicitly required
    },
    catID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamCategory",
      required: [true, "Please provide a category ID"],
    },
    QPYearID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamYear",
    },

    questions: [
      {
        questionId: {
          type: String,
          required: [true, "Please provide a question id"],
        },
        question: {
          type: String,
          required: [true, "Please provide a question"],
        },
        option1: {
          type: String,
          required: [true, "Please provide Option1"],
        },
        option2: {
          type: String,
          required: [true, "Please provide Option2"],
        },
        option3: {
          type: String,
          required: [true, "Please provide Option3"],
        },
        option4: {
          type: String,
          required: [true, "Please provide Option4"],
        },
        answer: {
          type: String,
          required: [true, "Please provide an answer"],
        },
      },
    ],
  },
  { timestamps: true }
);

const AllPaper = mongoose.model("AllPaper", allPaperSchema);

module.exports = AllPaper;
