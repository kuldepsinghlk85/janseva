// server/controllers/blogController.js
const blogService = require('../services/blogService');

function getAll(req, res) {
  try {
    const { category, status } = req.query;
    const data = blogService.getAllBlogs({ category, status });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getById(req, res) {
  try {
    const blog = blogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function create(req, res) {
  try {
    const newBlog = blogService.createBlog(req.body);
    res.status(201).json({ success: true, data: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function update(req, res) {
  try {
    const updated = blogService.updateBlog(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function remove(req, res) {
  try {
    const deleted = blogService.deleteBlog(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
