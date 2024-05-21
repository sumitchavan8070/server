const express = require("express");
const router = express.Router();
const {
  createExamYear,
  getExamYearsByCategoryAndSubType,
  updateExamYear,
  deleteExamYear,
  getExamYearsByCategory,
} = require("../controllers/newexamYearController");

router.post("/create", createExamYear);
router.get("/:categoryId/:subExamTypeId", getExamYearsByCategoryAndSubType);
router.get("/:categoryId", getExamYearsByCategory);

router.put("/:id", updateExamYear);
router.delete("/:id", deleteExamYear);

module.exports = router;
