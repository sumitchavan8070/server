const Coupon = require("../models/Coupon"); // Import the Coupon model
const Plan = require("../models/Plan");

// Create a new coupon
const createCoupon = async (req, res) => {
  const {
    code,
    discountPercentage,
    maxDiscountAmount,
    expiryDate,
    associatedPlan,
    text, // New required field
    link, // New required field
  } = req.body;

  try {
    // Validate required fields
    if (!text || !link) {
      return res.status(400).json({
        message: "Both 'text' and 'link' fields are required.",
      });
    }

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists." });
    }

    // Check if the associated plan exists
    const planExists = await Plan.findById(associatedPlan);
    if (!planExists) {
      return res
        .status(400)
        .json({ message: "Associated plan does not exist." });
    }

    // Create the coupon object
    const coupon = new Coupon({
      code,
      discountPercentage,
      maxDiscountAmount,
      expiryDate,
      associatedPlan,
      text,
      link,
    });

    await coupon.save();
    res.status(201).json({ message: "Coupon created successfully.", coupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while creating the coupon.",
      error,
    });
  }
};

// Update an existing coupon
const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const {
    code,
    discountPercentage,
    maxDiscountAmount,
    expiryDate,
    isActive, // Allow manual toggling of isActive
    text,
    link,
  } = req.body;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    // Validate required fields
    if (!text || !link) {
      return res.status(400).json({
        message: "Both 'text' and 'link' fields are required.",
      });
    }

    // Update fields
    coupon.code = code || coupon.code;
    coupon.discountPercentage =
      discountPercentage !== undefined
        ? discountPercentage
        : coupon.discountPercentage;
    coupon.maxDiscountAmount =
      maxDiscountAmount !== undefined
        ? maxDiscountAmount
        : coupon.maxDiscountAmount;
    coupon.expiryDate = expiryDate || coupon.expiryDate;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive; // Allow manual toggling
    coupon.text = text; // Update the text field
    coupon.link = link; // Update the link field

    // Automatically set isActive to false if expired
    if (new Date(coupon.expiryDate) < new Date()) {
      coupon.isActive = false;
    }

    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully.", coupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the coupon.",
      error,
    });
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
    res.status(500).json({
      message: "An error occurred while deleting the coupon.",
      error,
    });
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

    // Automatically set isActive to false if expired
    if (new Date(coupon.expiryDate) < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon has expired." });
    }

    res.status(200).json({
      discountPercentage: coupon.discountPercentage,
      maxDiscountAmount: coupon.maxDiscountAmount,
      associatedPlan: coupon.associatedPlan,
      text: coupon.text, // Include the text field
      link: coupon.link, // Include the link field
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while validating the coupon.",
      error,
    });
  }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    // Update isActive based on expiryDate
    const updatedCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        if (new Date(coupon.expiryDate) < new Date()) {
          coupon.isActive = false; // Set isActive to false if expired
          await coupon.save(); // Save the updated coupon
        }
        return coupon;
      })
    );

    res.status(200).json(updatedCoupons);
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
