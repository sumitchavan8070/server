// const mongoose = require("mongoose");

// const questionPaperSchema = new mongoose.Schema(
//   {
//     qpName: {
//       type: String,
//       required: [true, "Please Provide Question Paper Name"],
//     },
//     catID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ExamCategory",
//       required: [true, "Please Provide Category ID"],
//     },
//     yearID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ExamYear",
//       required: [true, "Please Provide Year ID"],
//     },
//     subCatID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubExamCategory",
//       required: [true, "Please Provide Subcategory ID"],
//     },
//     questionSubjectID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Subject",
//       required: [true, "Please Provide Subject ID"],
//     },
//     question: {
//       type: String,
//       required: [true, "Please Provide Question"],
//     },
//     option1: {
//       type: String,
//       required: [true, "Please Provide Option1"],
//     },
//     option2: {
//       type: String,
//       required: [true, "Please Provide Option2"],
//     },
//     option3: {
//       type: String,
//       required: [true, "Please Provide Option3"],
//     },
//     option4: {
//       type: String,
//       required: [true, "Please Provide Option4"],
//     },
//     answer: {
//       type: String,
//       required: [true, "Please Provide Answer"],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("QuestionPaper", questionPaperSchema);

const mongoose = require("mongoose");

const questionPaperSchema = new mongoose.Schema(
  {
    catID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamCategory",
      required: [true, "Please provide a category ID"],
    },
    subCatID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubExamCategory",
      required: [true, "Please provide a subcategory ID"],
    },
    QPYearID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamYear",
      required: [true, "Please provide a year ID"],
    },

    question: {
      type: String,
      required: [true, "Please provide a question"],
    },

    option1: {
      type: String,
      required: [true, "Please Provide Option1"],
    },
    option2: {
      type: String,
      required: [true, "Please Provide Option2"],
    },
    option3: {
      type: String,
      required: [true, "Please Provide Option3"],
    },
    option4: {
      type: String,
      required: [true, "Please Provide Option4"],
    },
    answer: {
      type: String,
      required: [true, "Please provide an answer"],
    },
    subjectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    topicID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionPaper", questionPaperSchema);
