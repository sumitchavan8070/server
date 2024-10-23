const User = require("../models/userModel");

// Check and update subscription status when the user opens the app
exports.checkSubscription = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDate = new Date();

    if (
      user.subscriptionExpiryDate &&
      user.subscriptionExpiryDate < currentDate
    ) {
      user.isSubscriptionActive = false;
      await user.save();
    }

    return res.status(200).json({
      isSubscriptionActive: user.isSubscriptionActive,
      subscriptionExpiryDate: user.subscriptionExpiryDate,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
