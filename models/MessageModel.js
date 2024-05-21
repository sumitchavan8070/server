const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },

    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    button: {
      title: { type: String }, // Include button title field
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
