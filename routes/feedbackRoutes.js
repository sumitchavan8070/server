// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Create a new feedback entry
router.post("/create", feedbackController.createFeedback);

// Get all feedback entries
router.get("/", feedbackController.getAllFeedback);

// Get a specific feedback entry by ID
router.get("/:id", feedbackController.getFeedbackById);

// Update a feedback entry by ID
router.put("/:id", feedbackController.updateFeedbackById);

// Delete a feedback entry by ID
router.delete("/:id", feedbackController.deleteFeedbackById);

module.exports = router;
