const express = require("express");
const router = express.Router();
const {
  createExamYear,
  getExamYearsByCategoryAndSubType,
  updateExamYear,
  deleteExamYear,
} = require("../controllers/newexamYearController");

router.post("/create", createExamYear);
router.get("/:categoryId/:subExamTypeId", getExamYearsByCategoryAndSubType);
router.put("/:id", updateExamYear);
router.delete("/:id", deleteExamYear);

module.exports = router;
