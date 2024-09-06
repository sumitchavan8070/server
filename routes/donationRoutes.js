// routes/donationRoutes.js
const express = require("express");
const router = express.Router();
const {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  getDonationsByUserEmail,
} = require("../controllers/donationController");

// Create a new donation
router.post("/donate", createDonation);

// Get all donations
router.get("/donations", getDonations);

// Get a donation by ID
router.get("/donations/:id", getDonationById);

// Update a donation
router.put("/donations/:id", updateDonation);

// Delete a donation
router.delete("/donations/:id", deleteDonation);

// Get donations by user email
router.get("/donations/user/:email", getDonationsByUserEmail);

module.exports = router;
