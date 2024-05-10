const ExamYear = require("../models/newExamYear");

// Create a new exam year
const createExamYear = async (req, res) => {
  try {
    const { QPYear, catId, subCatId } = req.body;
    const newExamYear = new ExamYear({ QPYear, catId, subCatId });
    const savedExamYear = await newExamYear.save();
    res.status(201).json(savedExamYear);
  } catch (error) {
    res.status(400).json({ error: "Error creating exam year" });
  }
};

// Get exam years by category ID and sub exam type ID
const getExamYearsByCategoryAndSubType = async (req, res) => {
  try {
    const { categoryId, subExamTypeId } = req.params;
    const examYears = await ExamYear.find({
      catId: categoryId,
      subCatId: subExamTypeId,
    });
    res.status(200).json(examYears);
  } catch (error) {
    res.status(500).json({ error: "Error fetching exam years" });
  }
};

const getExamYearsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const examYears = await ExamYear.find({
      catId: categoryId,
    });
    res.status(200).json(examYears);
  } catch (error) {
    res.status(500).json({ error: "Error fetching exam years" });
  }
};

// Update an existing exam year
const updateExamYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { QPYear, catId, subCatId } = req.body;
    const updatedExamYear = await ExamYear.findByIdAndUpdate(
      id,
      { QPYear, catId, subCatId },
      { new: true }
    );
    res.status(200).json(updatedExamYear);
  } catch (error) {
    res.status(400).json({ error: "Error updating exam year" });
  }
};

// Delete an exam year
const deleteExamYear = async (req, res) => {
  try {
    const { id } = req.params;
    await ExamYear.findByIdAndDelete(id);
    res.status(200).json({ message: "Exam year deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting exam year" });
  }
};

module.exports = {
  createExamYear,
  getExamYearsByCategoryAndSubType,
  updateExamYear,
  deleteExamYear,
  getExamYearsByCategory,
};
