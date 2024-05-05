const express = require("express");
const router = express.Router();
const {
  createSubExamType,
  getSubExamTypesByCategoryId,
  updateSubExamType,
  deleteSubExamType,
} = require("../controllers/newsubExamTypeController");

router.post("/create", createSubExamType);
router.get("/:categoryId", getSubExamTypesByCategoryId);
router.put("/:id", updateSubExamType);
router.delete("/:id", deleteSubExamType);

module.exports = router;
