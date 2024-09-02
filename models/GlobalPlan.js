const mongoose = require("mongoose");

const globalPlanSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Active", "Disable"],
    default: "Disable",
  },

  subscriptionStartDate: {
    type: Date,
    default: null,
  },
  subscriptionExpiryDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("GlobalPlan", globalPlanSchema);
