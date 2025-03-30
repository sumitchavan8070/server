// routes/couponRoutes.js
const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");

router.get("/all", couponController.getAllCoupons);

// Create a new coupon
router.post("/create", couponController.createCoupon);

// Update a coupon by ID
router.put("/update/:id", couponController.updateCoupon);

// Delete a coupon by ID
router.delete("/delete/:id", couponController.deleteCoupon);

// Validate a coupon by code (for applying during checkout)
router.post("/validate", couponController.getCouponByCode);

module.exports = router;
