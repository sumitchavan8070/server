const Subject = require("../models/newSubject");

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    const { subName } = req.body;
    const subject = new Subject({ subName });
    const newSubject = await subject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a subject by ID
exports.updateSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { subName } = req.body;
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { subName },
      { new: true }
    );
    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a subject by ID
exports.deleteSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(deletedSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
