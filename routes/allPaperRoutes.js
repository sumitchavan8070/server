const express = require("express");
const router = express.Router();
const {
  createPaper,
  getAllPapers,
  getPaperByCategory,
} = require("../controllers/allPaperController");

// Create a new paper
router.post("/", createPaper);

// Get all papers
router.get("/", getAllPapers);

router.get("/:categoryId", getPaperByCategory);

module.exports = router;
