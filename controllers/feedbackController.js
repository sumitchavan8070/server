// // controllers/feedbackController.js
// const Feedback = require("../models/Feedback");

// // Create a new feedback entry
// exports.createFeedback = async (req, res) => {
//   const { feedback, rating, userid } = req.body;
//   try {
//     const newFeedback = new Feedback({
//       feedback,
//       rating,
//       userid,
//     });
//     await newFeedback.save();
//     // console.log("===>" + JSON.stringify(newFeedback));
//     res.status(201).json(newFeedback);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all feedback entries
// exports.getAllFeedback = async (req, res) => {
//   try {
//     const feedbackList = await Feedback.find().populate(
//       "userid",
//       "name username email mobileNumber"
//     );
//     res.status(200).json(feedbackList);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get a specific feedback entry by ID
// exports.getFeedbackById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const feedback = await Feedback.findById(id).populate(
//       "userid",
//       "name username email mobileNumber"
//     );
//     if (!feedback) {
//       return res.status(404).json({ message: "Feedback not found" });
//     }
//     res.status(200).json(feedback);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update a feedback entry by ID
// exports.updateFeedbackById = async (req, res) => {
//   const { id } = req.params;
//   const { feedback, rating } = req.body;
//   try {
//     const updatedFeedback = await Feedback.findByIdAndUpdate(
//       id,
//       { feedback, rating },
//       { new: true }
//     ).populate("userid", "name username");
//     if (!updatedFeedback) {
//       return res.status(404).json({ message: "Feedback not found" });
//     }
//     res.status(200).json(updatedFeedback);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Delete a feedback entry by ID
// exports.deleteFeedbackById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedFeedback = await Feedback.findByIdAndDelete(id).populate(
//       "userid",
//       "name username"
//     );
//     if (!deletedFeedback) {
//       return res.status(404).json({ message: "Feedback not found" });
//     }
//     res.status(200).json({ message: "Feedback deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// controllers/feedbackController.js
const Feedback = require("../models/Feedback");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email provider
  auth: {
    user: "your-email@gmail.com", // Your email
    pass: "your-email-password", // Your email password
  },
});

// Create a new feedback entry
exports.createFeedback = async (req, res) => {
  const { feedback, rating, userid } = req.body;
  try {
    const newFeedback = new Feedback({
      feedback,
      rating,
      userid,
    });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all feedback entries
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().populate(
      "userid",
      "name username email mobileNumber"
    );
    res.status(200).json(feedbackList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific feedback entry by ID
exports.getFeedbackById = async (req, res) => {
  const { id } = req.params;
  try {
    const feedback = await Feedback.findById(id).populate(
      "userid",
      "name username email mobileNumber"
    );
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a feedback entry by ID
exports.updateFeedbackById = async (req, res) => {
  const { id } = req.params;
  const { feedback, rating, status, reply } = req.body;
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { feedback, rating, status, reply },
      { new: true }
    ).populate("userid", "name username");
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(updatedFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a feedback entry by ID
exports.deleteFeedbackById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(id).populate(
      "userid",
      "name username"
    );
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reply to feedback
exports.replyToFeedback = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.status = "replied";
    feedback.reply = reply;
    await feedback.save();

    // Send email
    const user = await User.findById(feedback.userid);

    // console.log(reply);

    const mailOptions = {
      from: "your-email@gmail.com",
      to: user.email,
      subject: "Feedback Received",
      text: `Hello ${user.name},\n\nThank you for your feedback. We have reviewed your comments and will get back to you soon.\n\nBest Regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Feedback replied and email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark feedback as "not interested"
exports.markNotInterested = async (req, res) => {
  const { id } = req.params;
  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.status = "not interested";
    await feedback.save();

    res.status(200).json({ message: "Feedback marked as not interested" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFeedbackInterest = async (req, res) => {
  const { feedbackId } = req.params;
  const { isInterested } = req.body;

  try {
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      {
        isInterested: isInterested,
        status: isInterested ? "not replied" : "not interested",
      },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback interest updated", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
