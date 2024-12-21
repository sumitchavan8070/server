// controllers/couponController.js
const Coupon = require("../models/Coupon"); // Import the Coupon model
const Plan = require("../models/Plan");

// Create a new coupon
// const createCoupon = async (req, res) => {
//   const { code, discountPercentage, maxDiscountAmount, expiryDate } = req.body;

//   try {
//     const existingCoupon = await Coupon.findOne({ code });
//     if (existingCoupon) {
//       return res.status(400).json({ message: "Coupon code already exists." });
//     }

//     const coupon = new Coupon({
//       code,
//       discountPercentage,
//       maxDiscountAmount,
//       expiryDate,
//     });

//     await coupon.save();
//     res.status(201).json({ message: "Coupon created successfully.", coupon });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "An error occurred while creating the coupon.", error });
//   }
// };

const createCoupon = async (req, res) => {
  const {
    code,
    discountPercentage,
    maxDiscountAmount,
    expiryDate,
    associatedPlan,
  } = req.body;

  try {
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists." });
    }

    // Check if the plan exists
    const planExists = await Plan.findById(associatedPlan);
    if (!planExists) {
      return res
        .status(400)
        .json({ message: "Associated plan does not exist." });
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      maxDiscountAmount,
      expiryDate,
      associatedPlan,
    });

    await coupon.save();
    res.status(201).json({ message: "Coupon created successfully.", coupon });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the coupon.", error });
  }
};

// Update an existing coupon
const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { code, discountPercentage, maxDiscountAmount, expiryDate, isActive } =
    req.body;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    coupon.code = code || coupon.code;
    coupon.discountPercentage = discountPercentage || coupon.discountPercentage;
    coupon.maxDiscountAmount = maxDiscountAmount || coupon.maxDiscountAmount;
    coupon.expiryDate = expiryDate || coupon.expiryDate;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully.", coupon });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the coupon.", error });
  }
};

// Delete a coupon
const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.status(200).json({ message: "Coupon deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the coupon.", error });
  }
};

// Get a coupon by code (for validation)
const getCouponByCode = async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon." });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon has expired." });
    }

    res.status(200).json({
      discountPercentage: coupon.discountPercentage,
      maxDiscountAmount: coupon.maxDiscountAmount,
      associatedPlan: coupon.associatedPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while validating the coupon.",
      error,
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching coupons.",
      error,
    });
  }
};

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponByCode,
  getAllCoupons,
};
