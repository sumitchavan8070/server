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

    maxTestsAllowed: {
      type: Number,
      default: 5, // Default for non-subscribers
    },
    testsTaken: {
      type: Number,
      default: 0, // Number of tests user has taken
    },

    maxHistoryViewCountAllowed: {
      type: Number,
      default: 3, // Default for non-subscribers
    },
    historyViewCount: {
      type: Number,
      default: 0, // Number of tests user has taken
    },

    // New fields for storing device information
    deviceId: {
      type: String,
      unique: true, // Ensures one unique device per user
      sparse: true, // Allows null values for users who haven't registered a device yet
    },
    deviceModel: {
      type: String,
    },
    deviceOS: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    registeredThrough: {
      type: String,
      default: null, // Default to null if not provided
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
  this.testsTaken = 0;
  this.historyViewCount = 0;
};

userSchema.methods.updateTestTakenToZero = function () {
  this.testsTaken = 0;
  this.historyViewCount = 0;
};

userSchema.methods.disableSubscription = function () {
  this.isSubscriptionActive = false;
  this.subscriptionPlanID = null;
  // this.subscriptionStartDate = null;
  // this.subscriptionExpiryDate = null;
  this.testsTaken = 0;
  this.historyViewCount = 0;
  this.couponCode = null;
};

module.exports = mongoose.model("User", userSchema);
