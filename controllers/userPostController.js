const userPostModel = require("../models/userPostModel");

const addUserPost = async (req, res) => {
  try {
    const { title, content, type, poll } = req.body;

    // Create a new UserPost instance based on the request body
    const newPost = new userPostModel({
      title,
      content,
      type,
      poll,
    });

    // Save the new post to the database
    await newPost.save();

    res
      .status(201)
      .json({ success: true, message: "User post added successfully" });
  } catch (error) {
    console.error("Error adding user post:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add user post" });
  }
};

// Controller to get approved posts
const getApprovedPosts = async (req, res) => {
  try {
    const approvedPosts = await userPostModel.find({ approved: true });

    res.status(200).json({ success: true, posts: approvedPosts });
  } catch (error) {
    console.error("Error fetching approved posts:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch approved posts" });
  }
};

const updateVote = async (req, res) => {
  const { pollId } = req.params;
  const { option } = req.body;

  try {
    const poll = await userPostModel.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Find the selected option and update its votes
    const selectedOption = poll.poll.options.find((opt) => opt === option);
    if (!selectedOption) {
      return res.status(400).json({ error: "Invalid option" });
    }
    selectedOption.votes += 1;

    // Save the updated poll
    await poll.save();

    // Send the updated poll back as response
    const updatedPoll = await userPostModel.findById(pollId);
    res.json({ poll: updatedPoll });
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addUserPost, getApprovedPosts, updateVote };
