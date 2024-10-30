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
    if (user.subscriptionExpiryDate < currentDate) {
      // user.isSubscriptionActive = false; // Mark subscription as inactive
      // await user.save(); // Save the updated user document
      // const student = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Student not found" });
      }

      user.testsTaken = 0;

      user.disableSubscription();

      await user.save();
    }

    // console.log("user in check ", user);

    // Respond with the user's subscription status and expiry date
    return res.status(200).json({
      isSubscriptionActive: user.isSubscriptionActive,
      subscriptionExpiryDate: user.subscriptionExpiryDate,
      maxTestsAllowed: user.maxTestsAllowed,
      testsTaken: user.testsTaken,
    });
  } catch (error) {
    console.error("Error checking subscription:", error); // Log the error for debugging
    return res.status(500).json({ error: "Server error" }); // Send a generic error response
  }
};

exports.checkHistoryViewCount = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from the request parameters
    const user = await User.findById(userId); // Find the user by ID

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's subscription status and expiry date
    return res.status(200).json({
      isSubscriptionActive: user.isSubscriptionActive,
      maxHistoryViewCountAllowed: user.maxHistoryViewCountAllowed,
      historyViewCount: user.historyViewCount,
    });
  } catch (error) {
    console.error("Error checking history count:", error); // Log the error for debugging
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

// Import the User model

exports.updateTestsCompleted = async (req, res) => {
  const { userId } = req.body; // Extract user ID from request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if testsTaken is less than maxTestsAllowed
    if (user.testsTaken < user.maxTestsAllowed) {
      // Increment the testsTaken count
      user.testsTaken += 1;
      await user.save(); // Save updated user data to the database

      return res.status(200).json({
        message: "Tests completed count updated successfully",
        testsTaken: user.testsTaken,
      });
    } else {
      // If maxTestsAllowed limit reached, return a message
      return res.status(400).json({
        message: "Maximum test attempts reached",
      });
    }
  } catch (error) {
    console.error("Error updating testsTaken:", error);
    return res.status(500).json({
      message: "Server error while updating testsTaken",
      error: error.message,
    });
  }
};

exports.updateHistoryViewed = async (req, res) => {
  const { userId } = req.body; // Extract user ID from request body
  console.log("------------------------", userId);

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if testsTaken is less than maxTestsAllowed
    if (user.historyViewCount < user.maxHistoryViewCountAllowed) {
      // Increment the testsTaken count
      user.historyViewCount += 1;
      await user.save(); // Save updated user data to the database

      return res.status(200).json({
        message: "History viewed count updated successfully",
        historyViewCount: user.historyViewCount,
        maxHistoryViewCountAllowed: user.maxHistoryViewCountAllowed,
      });
    } else {
      // If maxTestsAllowed limit reached, return a message
      return res.status(400).json({
        message: "Maximum history view attempts reached",
      });
    }
  } catch (error) {
    console.error("Error updating history viewed:", error);
    return res.status(500).json({
      message: "Server error while updating history viewed",
      error: error.message,
    });
  }
};
