// const express = require("express");
// const router = express.Router();
// const postController = require("../controllers/postController.js");

// // Create a new post
// router.post("/create-post", postController.createPost);

// // Get all posts
// router.get("/get-all-posts", postController.getAllPosts);

// // Get a specific post by ID
// router.get("/:id", postController.getPostById);

// // Update a post by ID
// router.put("/:id", postController.updatePost);

// // Delete a post by ID
// router.delete("/:id", postController.deletePost);

// router.put("/:postId/like", postController.likePost);

// // Reject a post by ID
// router.put("/:id/reject", postController.rejectPost);

// module.exports = router;

// routes/posts.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController.js");

// Create a new post
router.post("/create-post", postController.createPost);

// Get all posts
router.get("/get-all-posts", postController.getAllPosts);

// Get a specific post by ID
router.get("/:id", postController.getPostById);

// Update a post by ID
router.put("/:id", postController.updatePost);

// Delete a post by ID
router.delete("/:id", postController.deletePost);

// Like a post
router.put("/:postId/like", postController.likePost);

// Reject a post by ID
router.put("/:id/reject", postController.rejectPost);

// Approve a post by ID
router.put("/:id/approve", postController.approvePost);

// Undo approve a post by ID
router.put("/:id/undo-approve", postController.undoApprovePost);

// Undo reject a post by ID
router.put("/:id/undo-reject", postController.undoRejectPost);

module.exports = router;
