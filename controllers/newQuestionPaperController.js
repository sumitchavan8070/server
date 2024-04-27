const QuestionPaper = require("../models/newQuestionPaper");
const { Error } = require("mongoose");

// Create Question Paper
const createQuestionPaper = async (req, res) => {
  try {
    const {
      catID,
      subCatID,
      QPYearID,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
      subjectID,
      topicID,
    } = req.body;

    const newQuestionPaper = new QuestionPaper({
      catID,
      subCatID,
      QPYearID,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
      subjectID,
      topicID,
    });

    await newQuestionPaper.save();

    res.status(201).json({
      success: true,
      data: newQuestionPaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getQuestionPapersByFilter = async (req, res, next) => {
  try {
    const { catID, subCatID, QPYearID } = req.body;

    // Construct the filter object based on selected dropdown values
    const filter = {};
    if (catID) filter.catID = catID;
    if (subCatID) filter.subCatID = subCatID;
    if (QPYearID) filter.QPYearID = QPYearID;

    const questionPapers = await QuestionPaper.find(filter);

    const count = questionPapers.length;

    if (count > 0) {
      res.status(200).json({
        success: true,
        count: count,
        data: questionPapers,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Question Paper Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Update Question Paper by ID
const updateQuestionPaper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedQuestionPaper = await QuestionPaper.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedQuestionPaper) {
      return res.status(404).json({
        success: false,
        error: "Question paper not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedQuestionPaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Delete Question Paper by ID
const deleteQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findByIdAndDelete(req.params.id);
    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        error: "Question paper not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper,
  getQuestionPapersByFilter,
};
