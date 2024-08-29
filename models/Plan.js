const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  features: [String],
  popular: {
    type: Boolean,
    default: false,
  },
  durationInDays: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Plan", planSchema);
