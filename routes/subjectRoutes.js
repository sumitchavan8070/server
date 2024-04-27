const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/newSubjectController");

// Routes
router.post("/subjects", subjectController.createSubject);
router.get("/subjects", subjectController.getAllSubjects);
router.get("/subjects/:id", subjectController.getSubjectById);
router.put("/subjects/:id", subjectController.updateSubjectById);
router.delete("/subjects/:id", subjectController.deleteSubjectById);

module.exports = router;
