// models/Constant.js
const mongoose = require("mongoose");

const constantSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true, // Ensure keys are unique
  },
  value: {
    type: String,
    required: true,
  },
});

// Create the model
const Constant = mongoose.model("Constant", constantSchema);

module.exports = Constant;
