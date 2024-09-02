// controllers/studentController.js

const User = require("../models/userModel");
const Plan = require("../models/Plan");
const GlobalPlan = require("../models/GlobalPlan"); // Assuming you have a model for GlobalPlan

// Enable Free Plan for a Single Student
exports.enableFreePlanForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const freePlan = await Plan.findOne({ name: "Free" });

    if (!freePlan) {
      return res.status(404).json({ message: "Free plan not found" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.enableFreePlan(freePlan._id);
    await student.save();

    res.status(200).json({ message: "Free plan enabled for student", student });
  } catch (error) {
    res.status(500).json({ message: "Error enabling free plan", error });
  }
};

// Disable Plan for a Single Student
exports.disablePlanForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.disableSubscription();
    await student.save();

    res
      .status(200)
      .json({ message: "Subscription disabled for student", student });
  } catch (error) {
    res.status(500).json({ message: "Error disabling subscription", error });
  }
};

// // Enable Free Plan for Multiple Students
// exports.enableFreePlanForMultipleStudents = async (req, res) => {
//   try {
//     const { studentIds } = req.body;
//     // console.log(studentIds);

//     const freePlan = await Plan.findOne({ name: "FREE" });

//     if (!freePlan) {
//       return res.status(404).json({ message: "Free plan not found" });
//     }

//     const students = await User.find({ _id: { $in: studentIds } });

//     await Promise.all(
//       students.map(async (student) => {
//         student.enableFreePlan(freePlan._id);
//         await student.save();
//       })
//     );

//     res
//       .status(200)
//       .json({ message: "Free plan enabled for selected students" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error enabling free plan for students", error });
//   }
// };

// // Disable Plan for Multiple Students
// exports.disablePlanForMultipleStudents = async (req, res) => {
//   try {
//     const { studentIds } = req.body;

//     const students = await User.find({ _id: { $in: studentIds } });

//     await Promise.all(
//       students.map(async (student) => {
//         student.disableSubscription();
//         await student.save();
//       })
//     );

//     res
//       .status(200)
//       .json({ message: "Subscriptions disabled for selected students" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error disabling subscriptions for students", error });
//   }
// };

exports.enableFreePlanForMultipleStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    const freePlan = await Plan.findOne({ name: "FREE" });

    if (!freePlan) {
      return res.status(404).json({ message: "Free plan not found" });
    }

    const students = await User.find({ _id: { $in: studentIds } });
    const errors = [];

    await Promise.all(
      students.map(async (student) => {
        // Check if the student already has an active plan that's not the FREE plan
        if (
          student.subscriptionPlanID &&
          student.subscriptionPlanID.toString() !== freePlan._id.toString()
        ) {
          const activePlan = await Plan.findById(student.subscriptionPlanID);
          errors.push({
            studentId: student._id,
            message: "Another active plan already purchased",
            plan: activePlan,
          });
        } else {
          student.enableFreePlan(freePlan._id);
          await student.save();
        }
      })
    );

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Some students already have other active plans",
        errors,
      });
    }

    res
      .status(200)
      .json({ message: "Free plan enabled for selected students" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error enabling free plan for students", error });
  }
};

exports.disablePlanForMultipleStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    const students = await User.find({ _id: { $in: studentIds } });

    const errors = [];

    await Promise.all(
      students.map(async (student) => {
        // If the student has an active subscription, disable it
        if (student.isSubscriptionActive) {
          student.disableSubscription();
          await student.save();
        } else {
          errors.push({
            studentId: student._id,
            message: "No active subscription to disable",
          });
        }
      })
    );

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Some students do not have active subscriptions to disable",
        errors,
      });
    }

    res
      .status(200)
      .json({ message: "Subscriptions disabled for selected students" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error disabling subscriptions for students", error });
  }
};

// exports.getGlobalFreePlanStatus = async (req, res) => {
//   try {
//     let globalPlan = await GlobalPlan.findOne({});

//     if (!globalPlan) {
//       // Create a default entry if none exists
//       globalPlan = new GlobalPlan({ status: "Disable" }); // Or any other default status
//       await globalPlan.save();
//     }

//     res.status(200).json({ status: globalPlan.status });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "Error fetching global free plan status", error });
//   }
// };

// // Update Global Free Plan Status
// exports.updateGlobalFreePlan = async (req, res) => {
//   try {
//     const { status } = req.body;
//     await GlobalPlan.findOneAndUpdate({}, { status });
//     res.status(200).json({ message: `Global Free Plan ${status}` });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating global free plan status", error });
//   }
// };

// Get Global Free Plan Status
exports.getGlobalFreePlanStatus = async (req, res) => {
  try {
    let globalPlan = await GlobalPlan.findOne({});

    if (!globalPlan) {
      // Create a default entry if none exists
      globalPlan = new GlobalPlan({ status: "Disable" });
      await globalPlan.save();
    }

    res.status(200).json({
      status: globalPlan.status,
      subscriptionStartDate: globalPlan.subscriptionStartDate,
      subscriptionExpiryDate: globalPlan.subscriptionExpiryDate,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching global free plan status", error });
  }
};

exports.updateGlobalFreePlan = async (req, res) => {
  try {
    const { status, subscriptionStartDate, subscriptionExpiryDate } = req.body;

    const updatedPlan = await GlobalPlan.findOneAndUpdate(
      {},
      {
        status,
        subscriptionStartDate,
        subscriptionExpiryDate,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error updating global free plan status", error);
    res.status(500).json({ message: "Error updating global free plan status" });
  }
};
