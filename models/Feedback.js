// const mongoose = require("mongoose");

// const feedbackSchema = new mongoose.Schema(
//   {
//     feedback: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },
//     userid: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["replied", "not replied", "not interested"],
//       default: "not replied",
//     },
//     reply: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const Feedback = mongoose.model("Feedback", feedbackSchema);

// module.exports = Feedback;
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["replied", "not replied", "not interested"],
      default: "not replied",
    },
    reply: {
      type: String,
    },
    isInterested: {
      type: Boolean,
      default: false, // Set default to true if you want to assume the user is interested unless specified otherwise
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
