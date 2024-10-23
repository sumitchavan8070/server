const express = require("express");
const { checkSubscription } = require("../controllers/subscriptionController");
const router = express.Router();

// Route to check subscription status
router.get("/check-subscription/:userId", checkSubscription);

module.exports = router;
