// const mongoose = require("mongoose");

// const couponSchema = new mongoose.Schema({
//   code: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   discountPercentage: {
//     type: Number,
//     required: true,
//     min: 0,
//     max: 100,
//   },
//   maxDiscountAmount: {
//     type: Number,
//     default: null, // Optional: Cap the discount
//   },
//   expiryDate: {
//     type: Date,
//     required: true,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// });

// module.exports = mongoose.model("Coupon", couponSchema);

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
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
    ref: "Plan", // Reference to the Plan schema
    // required: true,
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
