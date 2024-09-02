const mongoose = require("mongoose");

// Define the schema for user posts
const userPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "poll"],
      default: "text",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    rejected: { type: Boolean, default: false }, // New field to track rejection

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    poll: {
      question: {
        type: String,
        required: function () {
          return this.type === "poll";
        },
      },
      options: {
        type: [String],
        required: function () {
          return this.type === "poll";
        },
      },
      answer: {
        type: String,
        required: function () {
          return this.type === "poll";
        },
      },
      votes: {
        type: Map, // Change this to Map or Object as per your preference
        of: String, // Change this to String or Number as per your preference
        default: {},
      },
    },
  },
  { timestamps: true }
);

// Create the UserPost model based on the schema
const UserPost = mongoose.model("UserPost", userPostSchema);

module.exports = UserPost;
