const Leaderboard = require("../models/Leaderboard");

const createLeaderboardEntry = async (req, res) => {
  try {
    const { username, name, location, score } = req.body;
    const leaderboardEntry = await Leaderboard.create({
      username,
      name,
      location,
      score,
    });
    res.status(201).json({
      status: "success",
      message: "Leaderboard entry created successfully",
      data: leaderboardEntry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

const getAllLeaderboardEntries = async (req, res) => {
  try {
    const leaderboardEntries = await Leaderboard.find();
    res.json(leaderboardEntries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leaderboard entries" });
  }
};

const updateLeaderboardEntry = async (req, res) => {
  try {
    const { username } = req.params;
    const newData = req.body;
    const updatedEntry = await Leaderboard.findOneAndUpdate(
      { username },
      { $set: newData },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ error: "Leaderboard entry not found" });
    }
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: "Error updating leaderboard entry" });
  }
};
const deleteLeaderboardEntry = async (req, res) => {
  try {
    const { username } = req.params;
    const deletedEntry = await Leaderboard.deleteOne({ username });
    if (deletedEntry.deletedCount === 0) {
      return res.status(404).json({ error: "Leaderboard entry not found" });
    }
    res.json({ message: "Leaderboard entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting leaderboard entry" });
  }
};

const getLeaderboardEntryByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const leaderboardEntry = await Leaderboard.findOne({ username }).select(
      "-score"
    );
    if (!leaderboardEntry) {
      return res.status(404).json({ error: "Leaderboard entry not found" });
    }
    res.json(leaderboardEntry);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createLeaderboardEntry,
  getAllLeaderboardEntries,
  updateLeaderboardEntry,
  deleteLeaderboardEntry,
  getLeaderboardEntryByUsername,
};
