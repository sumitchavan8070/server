// const mongoose = require("mongoose");

// const questionPaperSchema = new mongoose.Schema(
//   {
//     qpName: {
//       type: String,
//       required: [true, "Please Provide Question Paper Name"],
//     },

//     QPYearID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ExamYear",
//       required: [true, "Please Provide Exam Year"],
//     },

//     catID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ExamCategory",
//       required: [true, "Please Provide Category Name"],
//     },
//     subCatID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubExamCategory",
//       required: [true, "Please Provide Sub Category Name"],
//     },
//     questionSubjectCatID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Subject",
//       required: [
//         true,
//         "Please Provide Subject Name for which subject question belongs",
//       ],
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
