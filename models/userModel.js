const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      min: 6,
      max: 64,
    },
    role: {
      type: String,
      default: "user",
    },

    fcmToken: {
      type: String,
      default: null,
    },
    location: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },

    //Profile Pic Uploaded on Clodinary Default profile folder
    profilePic: {
      type: String,
      default: "DefaultProfile/bg3savsjjwbtn7dhkrub",
    },
    isSubscriptionActive: {
      type: Boolean,
      default: false, // Default to false if subscription is not active
    },
    subscriptionPlanID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan", // Reference to the Plan model
      default: null, // Default to null if no plan is assigned initially
    },

    purchasePaymentId: {
      type: String,
      default: null,
    },

    subscriptionStartDate: {
      type: Date,
      default: null, // Default to null if not set
    },
    subscriptionExpiryDate: {
      type: Date,
      default: null, // Default to null if not set
    },
  },
  { timestamps: true }
);

userSchema.methods.enableFreePlan = function (freePlanId) {
  this.isSubscriptionActive = true;
  this.subscriptionPlanID = freePlanId;
  this.subscriptionStartDate = new Date();
  // Assuming the free plan duration is 30 days
  this.subscriptionExpiryDate = new Date(
    this.subscriptionStartDate.getTime() + 30 * 24 * 60 * 60 * 1000
  );
};

userSchema.methods.disableSubscription = function () {
  this.isSubscriptionActive = false;
  this.subscriptionPlanID = null;
  this.subscriptionStartDate = null;
  this.subscriptionExpiryDate = null;
};

module.exports = mongoose.model("User", userSchema);
