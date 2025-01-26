// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const websiteBlogController = require("../controllers/websiteBlogController");

// Create a new blog
router.post("/blogs", websiteBlogController.createBlog);

// Get all blogs
router.get("/blogs", websiteBlogController.getAllBlogs);

// Get a single blog by ID
router.get("/blogs/:id", websiteBlogController.getBlogById);

// Update a blog by ID
router.put("/blogs/:id", websiteBlogController.updateBlog);

// Delete a blog by ID
router.delete("/blogs/:id", websiteBlogController.deleteBlog);

module.exports = router;
