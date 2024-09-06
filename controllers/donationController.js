// controllers/donationController.js
const Donation = require("../models/Donation");
const User = require("../models/userModel");

// Get donations by user email
exports.getDonationsByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const donations = await Donation.find({ userId: user._id });
    res.status(200).json({ success: true, donations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching donations." });
  }
};

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const { userId, donatePaymentId, amount } = req.body;
    const newDonation = new Donation({ userId, donatePaymentId, amount });
    await newDonation.save();
    res
      .status(201)
      .json({ success: true, message: "Donation recorded successfully." });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ success: false, message: "Error recording donation." });
  }
};

// Get all donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("userId", "name email");
    res.status(200).json({ success: true, donations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching donations." });
  }
};

// Get a donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!donation)
      return res
        .status(404)
        .json({ success: false, message: "Donation not found." });
    res.status(200).json({ success: true, donation });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching donation." });
  }
};

// Update a donation
exports.updateDonation = async (req, res) => {
  try {
    const { userId, donatePaymentId, amount } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { userId, donatePaymentId, amount },
      { new: true }
    );
    if (!donation)
      return res
        .status(404)
        .json({ success: false, message: "Donation not found." });
    res.status(200).json({ success: true, donation });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating donation." });
  }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation)
      return res
        .status(404)
        .json({ success: false, message: "Donation not found." });
    res
      .status(200)
      .json({ success: true, message: "Donation deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting donation." });
  }
};
