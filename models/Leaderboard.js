const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  name: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    // required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  // Add more fields as needed
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
