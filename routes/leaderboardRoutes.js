const express = require("express");
const router = express.Router();
const {
  createLeaderboardEntry,
  getAllLeaderboardEntries,
  getLeaderboardEntryByUsername,
  updateLeaderboardEntry,
  deleteLeaderboardEntry,
} = require("../controllers/leaderboardController");

// Create a leaderboard entry
router.post("/create", createLeaderboardEntry);

// Get all leaderboard entries
router.get("/getall", getAllLeaderboardEntries);

// Get a specific leaderboard entry by username
router.get("/:username", getLeaderboardEntryByUsername);

// Update a leaderboard entry by username
router.put("/:username", updateLeaderboardEntry);

// Delete a leaderboard entry by username
router.delete("/:username", deleteLeaderboardEntry);

module.exports = router;
