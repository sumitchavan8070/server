const User = require("../models/userModel");

// Check and update subscription status when the user opens the app
// exports.checkSubscription = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const currentDate = new Date();

//     if (
//       user.subscriptionExpiryDate &&
//       user.subscriptionExpiryDate < currentDate
//     ) {
//       user.isSubscriptionActive = false;
//       await user.save();
//     }

//     return res.status(200).json({
//       isSubscriptionActive: user.isSubscriptionActive,
//       subscriptionExpiryDate: user.subscriptionExpiryDate,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: "Server error" });
//   }
// };

exports.checkSubscription = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from the request parameters
    const user = await User.findById(userId); // Find the user by ID

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDate = new Date(); // Get the current date

    // Check if the subscription has expired
    if (
      user.subscriptionExpiryDate &&
      user.subscriptionExpiryDate < currentDate
    ) {
      user.isSubscriptionActive = false; // Mark subscription as inactive
      await user.save(); // Save the updated user document
    }

    // Respond with the user's subscription status and expiry date
    return res.status(200).json({
      isSubscriptionActive: user.isSubscriptionActive,
      subscriptionExpiryDate: user.subscriptionExpiryDate,
    });
  } catch (error) {
    console.error("Error checking subscription:", error); // Log the error for debugging
    return res.status(500).json({ error: "Server error" }); // Send a generic error response
  }
};

exports.checkSubscriptionThroughApp = async (req, res) => {
  try {
    const currentDate = new Date();

    const usersToUpdate = await User.find({
      subscriptionExpiryDate: { $lt: currentDate },
      isSubscriptionActive: true,
    });

    usersToUpdate.forEach(async (user) => {
      user.isSubscriptionActive = false;
      await user.save();
    });

    console.log(
      `${usersToUpdate.length} users had their subscriptions marked inactive.`
    );
  } catch (error) {
    console.error("Error checking subscription status:", error);
  }
};
