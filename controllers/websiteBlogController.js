const WebsiteCategory = require("../models/WebsiteCategory");
const WebsiteBlogTag = require("../models/WebsiteBlogTag");
const WebsiteBlog = require("../models/WebsiteBlog");

// ==================== Category Controllers ====================

// Create a Category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = new WebsiteCategory({ name, slug });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await WebsiteCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a Single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await WebsiteCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Category
exports.updateCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await WebsiteCategory.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await WebsiteCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== Tag Controllers ====================

// Create a Tag
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = new WebsiteBlogTag({ name });
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Tags
exports.getTags = async (req, res) => {
  try {
    const tags = await WebsiteBlogTag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a Single Tag by ID
exports.getTagById = async (req, res) => {
  try {
    const tag = await WebsiteBlogTag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Tag
exports.updateTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await WebsiteBlogTag.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Tag
exports.deleteTag = async (req, res) => {
  try {
    const tag = await WebsiteBlogTag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== Blog Controllers ====================

// Create a Blog
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      slug,
      date,
      category,
      tags,
      image,
      author,
      readingTime,
      content,
    } = req.body;

    const blog = new WebsiteBlog({
      title,
      description,
      slug,
      date,
      category,
      tags,
      image,
      author,
      readingTime,
      content,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await WebsiteBlog.find()
      .populate("category")
      .populate("tags");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a Single Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await WebsiteBlog.findById(req.params.id)
      .populate("category")
      .populate("tags");
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Blog
exports.updateBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      slug,
      date,
      category,
      tags,
      image,
      author,
      readingTime,
      content,
    } = req.body;

    const blog = await WebsiteBlog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        slug,
        date,
        category,
        tags,
        image,
        author,
        readingTime,
        content,
      },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await WebsiteBlog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlogAndCategoryData = async (req, res) => {
  try {
    const categories = await WebsiteCategory.find();
    const blogs = await WebsiteBlog.find()
      .populate("category")
      .populate("tags");

    const formattedCategories = categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    }));

    const formattedBlogs = blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      description: blog.description,
      slug: blog.slug,
      date: blog.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      category: blog.category.name,
      tags: blog.tags.map((tag) => tag.name),
      image: blog.image,
      author: blog.author,
      readingTime: blog.readingTime,
      content: blog.content,
    }));

    res
      .status(200)
      .json({ categories: formattedCategories, blogs: formattedBlogs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the blog by slug and populate related fields
    const blog = await WebsiteBlog.findOne({ slug })
      .populate("category")
      .populate("tags");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Fetch popular blogs (for the sidebar)
    const popularBlogs = await WebsiteBlog.find({ _id: { $ne: blog._id } })
      .sort({ popularity: -1 })
      .limit(3)
      .populate("category");

    res.status(200).json({ ...blog.toObject(), popularBlogs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blog", error: error.message });
  }
};

// Fetch blogs by category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the category by slug
    const category = await WebsiteCategory.findOne({ slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find blogs belonging to this category
    const blogs = await WebsiteBlog.find({ category: category._id }).populate(
      "category tags"
    );

    if (blogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No blogs found for this category" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching blogs by category",
        error: error.message,
      });
  }
};
