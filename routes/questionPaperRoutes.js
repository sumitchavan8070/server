const express = require("express");
const router = express.Router();
const questionPaperController = require("../controllers/newQuestionPaperController");

// Route to create a new question paper
router.post("/create-question", questionPaperController.createQuestionPaper);

// Route to update a question paper by ID
router.put("/:id", questionPaperController.updateQuestionPaper);

// Route to delete a question paper by ID
router.delete("/:id", questionPaperController.deleteQuestionPaper);

// Route to fetch question papers based on selected dropdown values
router.post(
  "/getQuestionPapersByFilter",
  questionPaperController.getQuestionPapersByFilter
);

module.exports = router;
