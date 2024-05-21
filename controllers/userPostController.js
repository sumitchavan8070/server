const userPostModel = require("../models/userPostModel");

const addUserPost = async (req, res) => {
  try {
    const { title, content, type, postedBy, poll } = req.body;

    // Create a new UserPost instance based on the request body
    const newPost = new userPostModel({
      title,
      content,
      type,
      postedBy,
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
const getApprovedPolls = async (req, res) => {
  try {
    const approvedPolls = await userPostModel.find({ approved: true });

    res.status(200).json({ success: true, polls: approvedPolls });
  } catch (error) {
    console.error("Error fetching approved posts:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch approved posts" });
  }
};

// const updateVote = async (req, res) => {
//   const { pollId } = req.params;
//   const { option, userId } = req.body;

//   try {
//     // Check if the user has already voted on this poll
//     const poll = await userPostModel.findById(pollId);
//     if (!poll) {
//       return res.status(404).json({ error: "Poll not found" });
//     }

//     if (poll.poll.votes[userId]) {
//       return res
//         .status(400)
//         .json({ error: "User has already voted on this poll" });
//     }

//     // Update the vote count based on the selected option
//     const selectedOption = poll.poll.options.find((opt) => opt === option);
//     if (!selectedOption) {
//       return res.status(400).json({ error: "Invalid option" });
//     }

//     selectedOption.votes += 1;
//     poll.poll.votes[userId] = option;

//     // Save the updated poll
//     await poll.save();

//     // Send the updated poll with total votes back as response
//     const updatedPoll = await userPostModel.findById(pollId);
//     const totalVotes = updatedPoll.poll.options.reduce(
//       (total, opt) => total + opt.votes,
//       0
//     );
//     res.json({ poll: updatedPoll.poll, totalVotes });
//   } catch (error) {
//     console.error("Error updating vote:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const updateVote = async (req, res) => {
  const { pollId } = req.params;
  const { option, userId } = req.body;

  try {
    // Find the poll by ID
    const poll = await userPostModel.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Check if the user has already voted on this poll
    if (poll.poll.votes[userId]) {
      return res
        .status(400)
        .json({ error: "User has already voted on this poll" });
    }

    // Find the selected option in the poll
    const selectedOption = poll.poll.options.find((opt) => opt === option);
    if (!selectedOption) {
      return res.status(400).json({ error: "Invalid option" });
    }

    // Update the vote count for the selected option
    poll.poll.votes.set(userId, option); // Set the user's vote in the Map
    await poll.save(); // Save the updated poll

    // Send the updated poll back as response
    const updatedPoll = await userPostModel.findById(pollId);
    res.json({ poll: updatedPoll.poll });
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addUserPost, getApprovedPolls, updateVote };
