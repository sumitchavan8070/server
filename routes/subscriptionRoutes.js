const express = require("express");
const {
  checkSubscription,
  checkSubscriptionThroughApp,
  updateTestsCompleted,
  checkHistoryViewCount,
  updateHistoryViewed,
} = require("../controllers/subscriptionController");
const router = express.Router();

// Route to check subscription status
router.get("/check-subscription/:userId", checkSubscription);
router.get("/checksub", checkSubscriptionThroughApp);
router.put(
  "/update-tests-completed-after-expiry-of-plan",
  updateTestsCompleted
);

//update subscription is added in user routes
router.get("/check-history-count/:userId", checkHistoryViewCount);
router.put("/update-history", updateHistoryViewed);

module.exports = router;
