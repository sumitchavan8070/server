const Plan = require("../models/Plan");
const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");
const GlobalPlan = require("../models/GlobalPlan");

// //middleware
// const requireSingIn = jwt({
//   secret: process.env.JWT_SECRET,
//   algorithms: ["HS256"],
// });

//register

const registerController = async (req, res) => {
  try {
    const { name, username, email, password, fcmToken } = req.body;
    //validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "name is required",
      });
    }

    if (!username) {
      return res.status(400).send({
        success: false,
        message: "username is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "password is required and 6 character long",
      });
    }
    //exisiting user
    const exisitingUsername = await userModel.findOne({ username });
    if (exisitingUsername) {
      return res.status(500).send({
        success: false,
        message: "Username is Already Taken",
      });
    }

    const exisitingEmail = await userModel.findOne({ email });
    if (exisitingEmail) {
      return res.status(500).send({
        success: false,
        message: "Email is Already Taken",
      });
    }

    // //hashed pasword
    // const hashedPassword = await hashPassword(password);

    // //save user
    const user = await userModel({
      name,
      username,
      email,
      password,
      fcmToken,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Registeration Successfull Please Login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

const updateUserBasicInfo = async (req, res) => {
  const { userId } = req.params; // Assuming you pass the userId in the URL params
  const { name, username, email, location, mobileNumber } = req.body;

  try {
    // Find the user by userId
    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const existingUsername = await userModel.findOne({
      username,
      _id: { $ne: userId },
    });
    if (existingUsername) {
      return res.status(500).send({
        success: false,
        message: "Username is Already Taken",
      });
    }

    const exisitingEmail = await userModel.findOne({
      email,
      _id: { $ne: userId },
    });
    if (exisitingEmail) {
      return res.status(500).send({
        success: false,
        message: "Email is Already Taken",
      });
    }

    // Update user info fields
    user.name = name;
    user.username = username;
    user.email = email;
    user.location = location;
    user.mobileNumber = mobileNumber;

    // Save the updated user info
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateProfilePicture = async (req, res) => {
  const userId = req.params.userId; // Assuming the user ID is passed as a URL parameter
  const { profilePic } = req.body; // Assuming the profile picture URL or data is sent in the request body

  // console.log("=======profilePic====" + profilePic);

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the profile picture URL or data
    user.profilePic = profilePic;

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ message: "Profile picture updated successfully", user });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Assuming you're using Node.js with Express
const updateUserFCMToken = async (req, res) => {
  const { userId } = req.params;
  const { fcmToken } = req.body;

  try {
    // Find user by ID and update the FCM token
    const user = await userModel.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating FCM token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//login
// const loginController = async (req, res) => {
//   try {
//     const { email, password, fcmToken } = req.body;
//     //validation
//     if (!email || !password) {
//       return res.status(500).send({
//         success: false,
//         message: "Please Provide Email Or Password",
//       });
//     }
//     // find user
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(500).send({
//         success: false,
//         message: "User Not Found",
//       });
//     }
//     //match password
//     // const match = await comparePassword(password, user.password);
//     // if (!match) {
//     //   return res.status(500).send({
//     //     success: false,
//     //     message: "Invalid usrname or password",
//     //   });
//     // }
//     //TOKEN JWT
//     const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // undeinfed password
//     user.password = undefined;
//     res.status(200).send({
//       success: true,
//       message: "login successfully",
//       token,
//       user,
//       fcmToken,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "error in login api",
//       error,
//     });
//   }
// };

const loginController = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email Or Password",
      });
    }
    // find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch global free plan status
    const globalPlan = await GlobalPlan.findOne({});
    const freePlan = await Plan.findOne({ name: "FREE" });

    // Set subscription dates based on globalPlan or default to new dates
    if (globalPlan.status === "Active" && !user.subscriptionPlanID) {
      user.subscriptionPlanID = freePlan._id;
      user.isSubscriptionActive = true;

      // Use globalPlan dates if available, otherwise set new dates
      user.subscriptionStartDate =
        globalPlan.subscriptionStartDate || new Date();
      user.subscriptionExpiryDate =
        globalPlan.subscriptionExpiryDate ||
        new Date(
          user.subscriptionStartDate.getTime() + 30 * 24 * 60 * 60 * 1000
        );

      await user.save();
    }

    // TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // undefined password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
      user,
      fcmToken,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in login api",
      error,
    });
  }
};

//update user
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    //user find
    const user = await userModel.findOne({ email });
    //password validate
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //updated useer
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile Updated Please Login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In User Update Api",
      error,
    });
  }
};

// Controller function to get a user by ID
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// const updateUserSubscription = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { newPlanId } = req.body;

//     // Validate newPlanId
//     if (!newPlanId) {
//       return res.status(400).json({ message: "New plan ID is required" });
//     }

//     // Find the new plan
//     const plan = await Plan.findById(newPlanId);
//     if (!plan) {
//       return res.status(404).json({ message: "Plan not found" });
//     }

//     // Find and update the user
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.subscriptionPlanID = newPlanId;
//     user.isSubscriptionActive = true; // Assuming you want to activate the subscription on update

//     await user.save();

//     res
//       .status(200)
//       .json({ message: "Subscription updated successfully", user });
//   } catch (error) {
//     console.error("Error updating subscription:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const updateUserSubscription = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { newPlanId, purchasePaymentId } = req.body; // Include purchasePaymentId

//     // Validate newPlanId
//     if (!newPlanId) {
//       return res.status(400).json({ message: "New plan ID is required" });
//     }

//     // Find the new plan
//     const plan = await Plan.findById(newPlanId);
//     if (!plan) {
//       return res.status(404).json({ message: "Plan not found" });
//     }

//     // Find and update the user
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.subscriptionPlanID = newPlanId;
//     user.isSubscriptionActive = true; // Assuming you want to activate the subscription on update
//     user.purchasePaymentId = purchasePaymentId; // Update purchasePaymentId

//     await user.save();

//     res
//       .status(200)
//       .json({ message: "Subscription updated successfully", user });
//   } catch (error) {
//     console.error("Error updating subscription:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const checkSubscriptionStatus = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    if (user.subscriptionExpiryDate && now > user.subscriptionExpiryDate) {
      user.isSubscriptionActive = false;
      user.subscriptionPlanID = null;
      user.purchasePaymentId = null;
      user.subscriptionStartDate = null;
      user.subscriptionExpiryDate = null;

      await user.save();
    }

    return user.isSubscriptionActive;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw new Error("Internal server error");
  }
};

// const updateUserSubscription = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { newPlanId, purchasePaymentId } = req.body;

//     if (!newPlanId) {
//       return res.status(400).json({ message: "New plan ID is required" });
//     }

//     const plan = await Plan.findById(newPlanId);
//     if (!plan) {
//       return res.status(404).json({ message: "Plan not found" });
//     }

//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.subscriptionPlanID = newPlanId;
//     user.isSubscriptionActive = true;
//     user.purchasePaymentId = purchasePaymentId;
//     user.subscriptionStartDate = new Date(); // Set to current date

//     // Calculate expiry date based on plan duration (in months)
//     console.log("Plan" + plan);
//     console.log("Plan durationInMonths" + plan.durationInMonths);

//     const planDurationInMonths = plan.durationInMonths || 1; // Default to 1 month if not specified
//     const expiryDate = new Date();
//     expiryDate.setMonth(expiryDate.getMonth() + planDurationInMonths);
//     user.subscriptionExpiryDate = expiryDate;

//     await user.save();

//     res
//       .status(200)
//       .json({ message: "Subscription updated successfully", user });
//   } catch (error) {
//     console.error("Error updating subscription:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const updateUserSubscription = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { newPlanId, purchasePaymentId } = req.body;

//     if (!newPlanId) {
//       return res.status(400).json({ message: "New plan ID is required" });
//     }

//     const plan = await Plan.findById(newPlanId);
//     if (!plan) {
//       return res.status(404).json({ message: "Plan not found" });
//     }

//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.subscriptionPlanID = newPlanId;
//     user.isSubscriptionActive = true;
//     user.purchasePaymentId = purchasePaymentId;
//     user.subscriptionStartDate = new Date(); // Set to current date

//     // Calculate expiry date based on plan duration (in days)
//     const planDurationInDays = plan.durationInDays || 30; // Default to 30 days if not specified
//     const expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + planDurationInDays);
//     user.subscriptionExpiryDate = expiryDate;

//     await user.save();

//     res
//       .status(200)
//       .json({ message: "Subscription updated successfully", user });
//   } catch (error) {
//     console.error("Error updating subscription:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const updateUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPlanId, purchasePaymentId } = req.body;

    // Validate newPlanId
    if (!newPlanId) {
      return res.status(400).json({ message: "New plan ID is required" });
    }

    // Fetch the plan by ID
    const plan = await Plan.findById(newPlanId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Fetch the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user subscription details
    user.subscriptionPlanID = newPlanId;
    user.isSubscriptionActive = true;
    user.purchasePaymentId = purchasePaymentId;
    user.subscriptionStartDate = new Date(); // Set the start date to the current date

    // Calculate the expiry date based on the plan duration
    const planDurationInDays = plan.durationInDays || 30; // Default to 30 days if not specified
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + planDurationInDays);
    user.subscriptionExpiryDate = expiryDate;

    // Save the updated user details
    await user.save();

    // Return updated subscription details in the response
    res.status(200).json({
      message: "Subscription updated successfully",
      user: {
        subscriptionPlanID: user.subscriptionPlanID,
        isSubscriptionActive: user.isSubscriptionActive,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
        purchasePaymentId: user.purchasePaymentId,
      },
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  //requireSingIn,
  registerController,
  loginController,
  updateUserController,
  getUserById,
  updateUserFCMToken,
  updateUserBasicInfo,
  updateProfilePicture,
  updateUserSubscription,
};
