// server/controllers/newsController.js
const newsService = require('../services/newsService');

function getAll(req, res) {
  try {
    const { category, sentiment } = req.query;
    const data = newsService.getAllNews({ category, sentiment });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function addSource(req, res) {
  try {
    const source = newsService.addNewsSource(req.body);
    res.status(201).json({ success: true, data: source });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function convertToBlog(req, res) {
  try {
    const blog = newsService.convertNewsToBlog(req.params.newsId);
    if (!blog) return res.status(404).json({ success: false, message: "News item not found" });
    res.json({ success: true, message: "Converted news to blog post", data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAll,
  addSource,
  convertToBlog
};
