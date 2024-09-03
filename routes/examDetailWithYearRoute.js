const express = require("express");
const {
  getCategoriesWithYear,
} = require("../controllers/ExamDetailWithYearController");
const router = express.Router();

router.get("/cat", getCategoriesWithYear);

module.exports = router;
