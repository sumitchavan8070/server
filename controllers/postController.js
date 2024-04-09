const Post = require("../models/PostModel");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { imageUrl, description, userId, isSponsored, approved } = req.body;
    const post = new Post({
      imageUrl,
      description,
      userId,
      isSponsored,
      approved,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const { imageUrl, description, userId, isSponsored, approved } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.imageUrl = imageUrl;
    post.description = description;
    post.userId = userId;
    post.isSponsored = isSponsored;
    post.approved = approved;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
