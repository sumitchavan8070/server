const ExamCategory = require("../models/newExamCategory");

// Create a new exam category
// const createExamCategory = async (req, res) => {
//   try {
//     const { catName, description, image } = req.body;
//     const newCategory = new ExamCategory({ catName, description, image });
//     const savedCategory = await newCategory.save();
//     res.status(201).json(savedCategory);
//   } catch (error) {
//     res.status(400).json({ error: "Error creating exam category" });
//   }
// };

// Create a new exam category
const createExamCategory = async (req, res) => {
  try {
    const { catName, description, image, pdfFiles } = req.body;
    const newCategory = new ExamCategory({
      catName,
      description,
      image,
      pdfFiles, // Add this line to include pdfFiles
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ error: "Error creating exam category" });
  }
};

// Get all exam categories
const getExamCategories = async (req, res) => {
  try {
    const categories = await ExamCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching exam categories" });
  }
};

// Update an existing exam category
// const updateExamCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { catName, description, image } = req.body;
//     const updatedCategory = await ExamCategory.findByIdAndUpdate(
//       id,
//       { catName, description, image },
//       { new: true }
//     );
//     res.status(200).json(updatedCategory);
//   } catch (error) {
//     res.status(400).json({ error: "Error updating exam category" });
//   }
// };

// Update an existing exam category
const updateExamCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { catName, description, image, pdfFiles } = req.body; // Include pdfFiles here
    const updatedCategory = await ExamCategory.findByIdAndUpdate(
      id,
      { catName, description, image, pdfFiles }, // Add pdfFiles to update
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: "Error updating exam category" });
  }
};

// Delete an exam category
const deleteExamCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await ExamCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Exam category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting exam category" });
  }
};

module.exports = {
  createExamCategory,
  getExamCategories,
  updateExamCategory,
  deleteExamCategory,
};
