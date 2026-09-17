// server/controllers/postController.js
const socialSyncService = require('../services/socialSyncService');
const { posts } = require('../data/posts');

function getAll(req, res) {
  try {
    const { platform } = req.query;
    let data = posts;
    if (platform) {
      data = posts.filter(p => p.platform.toLowerCase() === platform.toLowerCase());
    }
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function syncAll(req, res) {
  try {
    const results = socialSyncService.syncAllChannels();
    res.json({ success: true, message: "Social posts synced successfully", count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function convertToWork(req, res) {
  try {
    const { postId } = req.params;
    const work = socialSyncService.convertPostToWork(postId);
    if (!work) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, message: "Post converted to Development Work", data: work });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAll,
  syncAll,
  convertToWork
};
