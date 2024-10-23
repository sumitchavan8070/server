const express = require("express");
const {
  checkSubscription,
  checkSubscriptionThroughApp,
} = require("../controllers/subscriptionController");
const router = express.Router();

// Route to check subscription status
router.get("/check-subscription/:userId", checkSubscription);
router.get("/checksub", checkSubscriptionThroughApp);

module.exports = router;
