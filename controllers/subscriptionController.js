// const User = require("../models/User");
// const Subscription = require("../models/Subscription");
// const Payment = require("../models/Payment");
// const cron = require("node-cron");
// const sendEmail = require("../utils/sendEmail"); // Assume you have a utility to send emails

// // Create a new subscription plan (Admin only)
// exports.createSubscription = async (req, res) => {
//   try {
//     const { name, durationInMonths, price, features } = req.body;

//     const subscription = new Subscription({
//       name,
//       durationInMonths,
//       price,
//       features,
//     });

//     await subscription.save();
//     res.status(201).json(subscription);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create subscription plan." });
//   }
// };

// // Get all subscription plans
// exports.getSubscriptions = async (req, res) => {
//   try {
//     const subscriptions = await Subscription.find();
//     res.json(subscriptions);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch subscriptions." });
//   }
// };

// // Subscribe a user to a plan
// exports.subscribeUser = async (req, res) => {
//   try {
//     const { userId, subscriptionId } = req.body;

//     const subscription = await Subscription.findById(subscriptionId);
//     if (!subscription)
//       return res.status(404).json({ error: "Subscription not found." });

//     const user = await User.findById(userId);
//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setMonth(endDate.getMonth() + subscription.durationInMonths);

//     user.subscription = subscriptionId;
//     user.subscriptionStartDate = startDate;
//     user.subscriptionEndDate = endDate;

//     await user.save();

//     const payment = new Payment({
//       user: user._id,
//       subscription: subscription._id,
//       amount: subscription.price,
//     });
//     await payment.save();

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to subscribe user." });
//   }
// };

// // Check subscription status middleware
// exports.checkSubscription = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).populate("subscription");
//     const now = new Date();

//     if (!user.subscription || now > user.subscriptionEndDate) {
//       return res.status(403).json({ error: "Your subscription has expired." });
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({ error: "Failed to check subscription status." });
//   }
// };

// // Renew subscription
// exports.renewSubscription = async (req, res) => {
//   try {
//     const { userId, subscriptionId } = req.body;

//     const subscription = await Subscription.findById(subscriptionId);
//     if (!subscription)
//       return res.status(404).json({ error: "Subscription not found." });

//     const user = await User.findById(userId);

//     const now = new Date();
//     const endDate =
//       user.subscriptionEndDate > now ? user.subscriptionEndDate : now;
//     endDate.setMonth(endDate.getMonth() + subscription.durationInMonths);

//     user.subscription = subscriptionId;
//     user.subscriptionStartDate = now;
//     user.subscriptionEndDate = endDate;

//     await user.save();

//     const payment = new Payment({
//       user: user._id,
//       subscription: subscription._id,
//       amount: subscription.price,
//     });
//     await payment.save();

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to renew subscription." });
//   }
// };

// // Send expiry notifications
// exports.sendExpiryNotification = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     const expiryWarningDate = new Date(user.subscriptionEndDate);
//     expiryWarningDate.setDate(expiryWarningDate.getDate() - 3); // 3 days before expiry

//     const now = new Date();
//     if (now >= expiryWarningDate && now <= user.subscriptionEndDate) {
//       // Send email or in-app notification
//       sendEmail(
//         user.email,
//         "Your subscription is about to expire!",
//         "Please renew your subscription..."
//       );
//     }

//     res.json({ message: "Notification sent if applicable." });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to send expiry notification." });
//   }
// };

// // CRON job to handle subscription expiry
// cron.schedule("0 0 * * *", async () => {
//   try {
//     const now = new Date();
//     const users = await User.find({ subscriptionEndDate: { $lt: now } });

//     for (const user of users) {
//       user.subscription = null;
//       user.subscriptionStartDate = null;
//       user.subscriptionEndDate = null;
//       await user.save();
//     }

//     console.log(
//       `Subscription expiry check completed. ${users.length} users updated.`
//     );
//   } catch (error) {
//     console.error("Error checking for expired subscriptions:", error);
//   }
// });

// // // CRON job to handle subscription expiry
// // const job = new CronJob('0 0 * * *', async () => {
// //     try {
// //        const now = new Date();
// //        const users = await User.find({ subscriptionEndDate: { $lt: now } });

// //        for (const user of users) {
// //           user.subscription = null;
// //           user.subscriptionStartDate = null;
// //           user.subscriptionEndDate = null;
// //           await user.save();
// //        }

// //        console.log(`Subscription expiry check completed. ${users.length} users updated.`);
// //     } catch (error) {
// //        console.error('Error checking for expired subscriptions:', error);
// //     }
// //  });

// //  // Start the cron job
// //  job.start();

const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");
const Razorpay = require("razorpay");
const CronJob = require("cron").CronJob;
const sendEmail = require("../utils/sendEmail"); // Assuming you have this utility

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: "your_razorpay_key_id", // Replace with your Razorpay key id
  key_secret: "your_razorpay_secret", // Replace with your Razorpay secret
});

// Create a new subscription plan (Admin only)
exports.createSubscription = async (req, res) => {
  try {
    const { name, durationInMonths, price, features } = req.body;

    const subscription = new Subscription({
      name,
      durationInMonths,
      price,
      features,
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription plan." });
  }
};

// Get all subscription plans
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscriptions." });
  }
};

// Subscribe a user to a plan with Razorpay payment
exports.subscribeUser = async (req, res) => {
  try {
    const { userId, subscriptionId, paymentDetails } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription)
      return res.status(404).json({ error: "Subscription not found." });

    // Validate Razorpay payment
    const payment = await razorpay.payments.fetch(
      paymentDetails.razorpay_payment_id
    );
    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    const user = await User.findById(userId);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscription.durationInMonths);

    user.subscription = subscriptionId;
    user.subscriptionStartDate = startDate;
    user.subscriptionEndDate = endDate;

    await user.save();

    const paymentRecord = new Payment({
      user: user._id,
      subscription: subscription._id,
      amount: subscription.price,
      paymentId: payment.id,
      paymentStatus: payment.status,
    });
    await paymentRecord.save();

    res.json(user);

    // Send confirmation email
    sendEmail(
      user.email,
      "Subscription Confirmation",
      `Thank you for subscribing to ${
        subscription.name
      }. Your subscription is active until ${endDate.toDateString()}.`
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to subscribe user." });
  }
};

// Check subscription status middleware
exports.checkSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("subscription");
    const now = new Date();

    if (!user.subscription || now > user.subscriptionEndDate) {
      return res.status(403).json({ error: "Your subscription has expired." });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to check subscription status." });
  }
};

// Renew subscription with Razorpay payment
exports.renewSubscription = async (req, res) => {
  try {
    const { userId, subscriptionId, paymentDetails } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription)
      return res.status(404).json({ error: "Subscription not found." });

    // Validate Razorpay payment
    const payment = await razorpay.payments.fetch(
      paymentDetails.razorpay_payment_id
    );
    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    const user = await User.findById(userId);

    const now = new Date();
    const endDate =
      user.subscriptionEndDate > now ? user.subscriptionEndDate : now;
    endDate.setMonth(endDate.getMonth() + subscription.durationInMonths);

    user.subscription = subscriptionId;
    user.subscriptionStartDate = now;
    user.subscriptionEndDate = endDate;

    await user.save();

    const paymentRecord = new Payment({
      user: user._id,
      subscription: subscription._id,
      amount: subscription.price,
      paymentId: payment.id,
      paymentStatus: payment.status,
    });
    await paymentRecord.save();

    res.json(user);

    // Send renewal confirmation email
    sendEmail(
      user.email,
      "Subscription Renewal Confirmation",
      `Your subscription to ${
        subscription.name
      } has been renewed. Your new expiry date is ${endDate.toDateString()}.`
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to renew subscription." });
  }
};

// Send expiry notifications
exports.sendExpiryNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const expiryWarningDate = new Date(user.subscriptionEndDate);
    expiryWarningDate.setDate(expiryWarningDate.getDate() - 3); // 3 days before expiry

    const now = new Date();
    if (now >= expiryWarningDate && now <= user.subscriptionEndDate) {
      // Send email or in-app notification
      sendEmail(
        user.email,
        "Your subscription is about to expire!",
        "Please renew your subscription..."
      );
    }

    res.json({ message: "Notification sent if applicable." });
  } catch (error) {
    res.status(500).json({ error: "Failed to send expiry notification." });
  }
};

// CRON job to handle subscription expiry
const job = new CronJob("0 0 * * *", async () => {
  try {
    const now = new Date();
    const users = await User.find({ subscriptionEndDate: { $lt: now } });

    for (const user of users) {
      user.subscription = null;
      user.subscriptionStartDate = null;
      user.subscriptionEndDate = null;
      await user.save();

      // Notify user about expired subscription
      sendEmail(
        user.email,
        "Subscription Expired",
        "Your subscription has expired. Please renew to continue using our services."
      );
    }

    console.log(
      `Subscription expiry check completed. ${users.length} users updated.`
    );
  } catch (error) {
    console.error("Error checking for expired subscriptions:", error);
  }
});

// Start the cron job
// job.start();
