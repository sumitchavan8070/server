// // models/Group.js
// const mongoose = require("mongoose");

// const groupSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     description: { type: String },
//     members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
//     creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     role: { type: String, default: "admin" }, // Default role for creator
//   },
//   { timestamps: true }
// );

// const Group = mongoose.model("Group", groupSchema);

// module.exports = Group;
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    GroupShareId: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String }, // Add the name field for member name
        username: { type: String }, // Add the name field for member username
      },
    ],
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, default: "admin" }, // Default role for creator
    latestMessage: { type: {}, ref: "User" },
    lastMessageAt: { type: Date, default: Date.now }, // Add lastMessageAt field
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
