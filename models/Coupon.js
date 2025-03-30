const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    // required: true,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  associatedPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
  },
  text: {
    type: String,
    // required: true,
  },
  link: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
