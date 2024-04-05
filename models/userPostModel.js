const mongoose = require("mongoose");

// Define the schema for user posts
const userPostSchema = new mongoose.Schema({
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
    enum: ["text", "poll"], // Specify the types of posts, including 'poll'
    default: "text", // Default type is 'text'
  },
  approved: {
    type: Boolean,
    default: false, // Default status is not approved
  },
  poll: {
    question: {
      type: String,
      required: function () {
        return this.type === "poll"; // Make question required only for 'poll' type posts
      },
    },
    options: {
      type: [String], // Array of strings for options
      required: function () {
        return this.type === "poll"; // Make options required only for 'poll' type posts
      },
    },
    answer: {
      type: String, // Add answer field for polls
      required: function () {
        return this.type === "poll"; // Make answer required only for 'poll' type posts
      },
    },
    votes: {
      type: Map,
      of: {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
        },
        selectedOption: String,
      },
      default: {}, // Map to store votes for each option
    },
  },
  // Other fields as needed
});

// Create the UserPost model based on the schema
const UserPost = mongoose.model("UserPost", userPostSchema);

module.exports = UserPost;
