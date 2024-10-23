// const cron = require("node-cron");
// const User = require("../models/User");

// // Schedule the job to run every day at 6:10 PM
// cron.schedule("17 18 * * *", async () => {
//   console.log("Running the subscription check job at 6:15 PM");
//   try {
//     console.log("im here");

//     const currentDate = new Date();
//     const usersToUpdate = await User.find({
//       subscriptionExpiryDate: { $lt: currentDate },
//       isSubscriptionActive: true,
//     });

//     usersToUpdate.forEach(async (user) => {
//       user.isSubscriptionActive = false;
//       await user.save();
//     });

//     console.log(
//       `${usersToUpdate.length} users had their subscriptions marked inactive.`
//     );
//   } catch (error) {
//     console.error("Error checking subscription status:", error);
//   }
// });
