const express = require("express");
const router = express.Router();
const websiteBlogController = require("../controllers/websiteBlogController");

// ==================== Category Routes ====================
router.post("/categories", websiteBlogController.createCategory);
router.get("/categories", websiteBlogController.getCategories);
router.get("/categories/:id", websiteBlogController.getCategoryById);
router.put("/categories/:id", websiteBlogController.updateCategory);
router.delete("/categories/:id", websiteBlogController.deleteCategory);

// ==================== Tag Routes ====================
router.post("/tags", websiteBlogController.createTag);
router.get("/tags", websiteBlogController.getTags);
router.get("/tags/:id", websiteBlogController.getTagById);
router.put("/tags/:id", websiteBlogController.updateTag);
router.delete("/tags/:id", websiteBlogController.deleteTag);

// ==================== Blog Routes ====================
router.post("/blogs", websiteBlogController.createBlog);
router.get("/blogs", websiteBlogController.getBlogs);
router.get("/blogs/:id", websiteBlogController.getBlogById);
router.put("/blogs/:id", websiteBlogController.updateBlog);
router.delete("/blogs/:id", websiteBlogController.deleteBlog);

router.get("/blog-data", websiteBlogController.getBlogAndCategoryData);
// Get a single blog by slug
router.get("/:slug", websiteBlogController.getBlogBySlug);

// Get blogs by category
router.get("/category/:slug", websiteBlogController.getBlogsByCategory);

module.exports = router;
