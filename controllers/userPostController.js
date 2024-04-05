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

    // Check if poll.options is an array before iterating
    if (!Array.isArray(poll.options)) {
      return res.status(500).json({ error: "Poll options are not valid" });
    }

    // Update the vote count based on the selected option
    poll.options.forEach((opt) => {
      if (opt.option === option) {
        opt.votes += 1;
      }
    });

    // Save the updated poll
    await poll.save();

    // Send the updated poll with total votes back as response
    const updatedPoll = await userPostModel.findById(pollId);
    const totalVotes = updatedPoll.options.reduce(
      (total, opt) => total + opt.votes,
      0
    );
    res.json({ poll: updatedPoll, totalVotes });
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addUserPost, getApprovedPosts, updateVote };
