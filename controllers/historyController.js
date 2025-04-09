const History = require("../models/historyModel");

// @desc    Create new test history
// @route   POST /api/history
// @access  Private
const createHistory = async (req, res) => {
  try {
    const { userId, paperMeta, results, questions } = req.body;

    // Calculate derived fields
    const percentage = (
      (results.correctAnswers / results.totalQuestions) *
      100
    ).toFixed(2);
    const accuracy =
      results.correctAnswers + results.wrongAnswers > 0
        ? (results.correctAnswers /
            (results.correctAnswers + results.wrongAnswers)) *
          100
        : 0;

    const historyData = {
      userId,
      paperMeta,
      results: {
        ...results,
        percentage,
        accuracy,
      },
      questions,
    };

    const newHistory = await History.create(historyData);

    res.status(201).json({
      success: true,
      message: "Test history saved successfully",
      data: newHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save test history",
      error: error.message,
    });
  }
};

// @desc    Get user's test history
// @route   GET /api/history/:userId
// @access  Private
const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, page } = req.query;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { createdAt: -1 },
    };

    const history = await History.paginate({ userId }, options);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test history",
      error: error.message,
    });
  }
};

// @desc    Update test history
// @route   PUT /api/history/:id
// @access  Private
const updateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedHistory = await History.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHistory) {
      return res.status(404).json({
        success: false,
        message: "History record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "History updated successfully",
      data: updatedHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update history",
      error: error.message,
    });
  }
};

// @desc    Delete test history
// @route   DELETE /api/history/:id
// @access  Private
const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHistory = await History.findByIdAndDelete(id);

    if (!deletedHistory) {
      return res.status(404).json({
        success: false,
        message: "History record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete history",
      error: error.message,
    });
  }
};

const getUserHistoryAll = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .lean(); // Using lean() for faster queries when not needing Mongoose documents

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test history",
      error: error.message,
    });
  }
};

module.exports = {
  createHistory,
  getHistory,
  updateHistory,
  deleteHistory,
  getUserHistoryAll,
};
