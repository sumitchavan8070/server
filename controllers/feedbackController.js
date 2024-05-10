// controllers/feedbackController.js
const Feedback = require("../models/Feedback");

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
    // console.log("===>" + JSON.stringify(newFeedback));
    res.status(201).json(newFeedback);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all feedback entries
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().populate(
      "userid",
      "name username"
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
      "name username"
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
  const { feedback, rating } = req.body;
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { feedback, rating },
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
