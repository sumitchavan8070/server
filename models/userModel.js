// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "please add name"],
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: [true, "please add email"],
//       unique: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, "please add password"],
//       min: 6,
//       max: 64,
//     },
//     role: {
//       type: String,
//       default: "user",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

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
    profilePic: {
      type: String,
      default: "https://wallpapercave.com/wp/wp4172190.jpg",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
