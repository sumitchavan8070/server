const express = require("express");
const router = express.Router();
const {
  createExamCategory,
  getExamCategories,
  updateExamCategory,
  deleteExamCategory,
  getAllCatWithYear,
} = require("../controllers/newexamCategoryController");

router.post("/create", createExamCategory);
router.get("/get-all-exam-category", getExamCategories);
router.put("/:id", updateExamCategory);
router.delete("/:id", deleteExamCategory);

module.exports = router;
