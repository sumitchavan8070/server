const UserPost = require("../models/userPostModel"); // API endpoint for admins to view and manage polls

const getPoll = async (req, res) => {
  try {
    const polls = await UserPost.find({
      type: "poll",
    });

    res.status(200).json({ polls });
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ error: "Error fetching polls" });
  }
};

// Endpoint to approve or reject a poll
// const isPostApproved = async (req, res) => {
//   const { postId } = req.params;
//   const { approved } = req.body;

//   try {
//     const poll = await UserPost.findByIdAndUpdate(
//       postId,
//       { approved },
//       { new: true }
//     );

//     if (!poll || poll.type !== "poll") {
//       return res.status(404).json({ message: "Poll not found" });
//     }

//     res.status(200).json({ message: "Poll updated successfully", poll });
//   } catch (error) {
//     console.error("Error updating poll:", error);
//     res.status(500).json({ error: "Error updating poll" });
//   }
// };

const isPostApproved = async (req, res) => {
  const { postId } = req.params;
  const { approved, rejected } = req.body;

  try {
    const poll = await UserPost.findByIdAndUpdate(
      postId,
      { approved, rejected },
      { new: true }
    );

    if (!poll || poll.type !== "poll") {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json({ message: "Poll updated successfully", poll });
  } catch (error) {
    console.error("Error updating poll:", error);
    res.status(500).json({ error: "Error updating poll" });
  }
};

// Server-side code to handle deletion of polls

// Endpoint to delete a poll
const deletePoll = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPoll = await UserPost.findByIdAndDelete(id);
    if (!deletedPoll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    res.json({ message: "Poll deleted successfully" });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ error: "Error deleting poll" });
  }
};

module.exports = { getPoll, isPostApproved, deletePoll };
