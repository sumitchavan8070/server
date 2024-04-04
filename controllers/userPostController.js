const userPostModel = require("../models/userPostModel");

const addUserPost = async (req, res) => {
  try {
    const { title, content, type, poll } = req.body;

    // Create a new UserPost instance based on the request body
    const newPost = new UserPost({
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

module.exports = { addUserPost };
