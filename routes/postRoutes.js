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

module.exports = router;
