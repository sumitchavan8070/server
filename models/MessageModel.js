const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  customTestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomTest",
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
