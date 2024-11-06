const mongoose = require("mongoose");

const deletionRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

const DeletionRequest = mongoose.model(
  "DeletionRequest",
  deletionRequestSchema
);

module.exports = DeletionRequest;
