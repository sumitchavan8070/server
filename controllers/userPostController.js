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

module.exports = { addUserPost, getApprovedPosts };
