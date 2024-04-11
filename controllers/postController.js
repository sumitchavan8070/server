const Post = require("../models/PostModel");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { imageUrl, description, postedBy, isSponsored, approved } = req.body;
    const post = new Post({
      imageUrl,
      description,
      postedBy,
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

// Get approved posts
exports.getApprovedPosts = async (req, res) => {
  try {
    const approvedPosts = await Post.find({ approved: true });
    res.status(200).json({ success: true, posts: approvedPosts });
  } catch (error) {
    res.status(500).json({ error: "Error fetching approved posts" });
  }
};

// exports.likePost = async (req, res) => {
//   const { postId } = req.params;
//   const { userId } = req.body;

//   try {
//     const post = await Post.findById(postId);

//     if (!post) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Post not found" });
//     }

//     // Check if the user has already liked the post
//     const isLiked = post.likes.some(
//       (like) => like.userId.toString() === userId
//     );

//     if (isLiked) {
//       // Unlike the post
//       post.likes = post.likes.filter(
//         (like) => like.userId.toString() !== userId
//       );
//     } else {
//       // Like the post
//       post.likes.push({ userId });
//     }

//     const updatedPost = await post.save();
//     res.status(200).json({ success: true, post: updatedPost });
//   } catch (error) {
//     console.error("Error updating likes:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.some(
      (like) => like.userId.toString() === userId
    );

    if (!isLiked) {
      // Like the post if not already liked
      post.likes.push({ userId });
    } else {
      // Remove the like if already liked
      post.likes = post.likes.filter(
        (like) => like.userId.toString() !== userId
      );
    }

    const updatedPost = await post.save();
    res.status(200).json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
