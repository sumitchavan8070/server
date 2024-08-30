const mongoose = require("mongoose");

const globalPlanSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Active", "Disable"],
    default: "Disable",
  },
});

module.exports = mongoose.model("GlobalPlan", globalPlanSchema);
