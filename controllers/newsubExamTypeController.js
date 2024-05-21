const SubExamType = require("../models/newSubExamType");

// Create a new sub exam type
const createSubExamType = async (req, res) => {
  try {
    const { subCatName, catId } = req.body;
    const newSubExamType = new SubExamType({ subCatName, catId });
    const savedSubExamType = await newSubExamType.save();
    res.status(201).json(savedSubExamType);
  } catch (error) {
    res.status(400).json({ error: "Error creating sub exam type" });
  }
};

// Get sub exam types by category ID
const getSubExamTypesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subExamTypes = await SubExamType.find({ catId: categoryId });
    res.status(200).json(subExamTypes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sub exam types" });
  }
};

// Update an existing sub exam type
const updateSubExamType = async (req, res) => {
  try {
    const { id } = req.params;
    const { subCatName, catId } = req.body;
    const updatedSubExamType = await SubExamType.findByIdAndUpdate(
      id,
      { subCatName, catId },
      { new: true }
    );
    res.status(200).json(updatedSubExamType);
  } catch (error) {
    res.status(400).json({ error: "Error updating sub exam type" });
  }
};

// Delete a sub exam type
const deleteSubExamType = async (req, res) => {
  try {
    const { id } = req.params;
    await SubExamType.findByIdAndDelete(id);
    res.status(200).json({ message: "Sub exam type deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting sub exam type" });
  }
};

module.exports = {
  createSubExamType,
  getSubExamTypesByCategoryId,
  updateSubExamType,
  deleteSubExamType,
};
