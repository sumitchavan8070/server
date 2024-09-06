const express = require("express");
const router = express.Router();
const questionPaperController = require("../controllers/newQuestionPaperController");
const {
  getSubCategoryOfCategory,
} = require("../controllers/examSubCatController");

// Route to create a new question paper
router.post("/create-question", questionPaperController.createQuestionPaper);

router.post("/main-test", questionPaperController.createMainExamTestPaper);

// Route to update a question paper by ID
router.put("/:id", questionPaperController.updateQuestionPaper);

// Route to delete a question paper by ID
router.delete(
  "/delete-question/:id",
  questionPaperController.deleteQuestionPaper
);

// Route to fetch question papers based on selected dropdown values
router.post(
  "/getQuestionPapersByFilter",
  questionPaperController.getQuestionPapersByFilter
);

router.put(
  "/update-question/:questionId",
  questionPaperController.updateQuestion
);

// Route to delete a specific question by ID
router.delete("/delete-question/:id", questionPaperController.deleteQuestion);

router.get(
  "/get-paper-by-cat-subcat-year",
  questionPaperController.getPaperByCatIDSubCatIdAndYearId
);

module.exports = router;
