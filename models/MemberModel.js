// // models/Member.js
// const mongoose = require("mongoose");

// const memberSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
//     role: { type: String, default: "member" }, // Default role for new members
//   },
//   { timestamps: true }
// );

// const Member = mongoose.model("Member", memberSchema);

// module.exports = Member;
const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    name: { type: String }, // Add the name field for member name
    username: { type: String }, // Add the name field for member name
    role: { type: String, default: "member" }, // Default role for new members
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
