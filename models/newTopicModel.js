const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: [true, "Please Provide TopicName"],
    },
    subjectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Please provide a subject ID"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", topicSchema);
