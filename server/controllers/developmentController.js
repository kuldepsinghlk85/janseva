// server/controllers/developmentController.js
const developmentService = require('../services/developmentService');

function getAll(req, res) {
  try {
    const { status, category, village } = req.query;
    const data = developmentService.getAllWorks({ status, category, village });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getById(req, res) {
  try {
    const item = developmentService.getWorkById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Work not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function create(req, res) {
  try {
    const newWork = developmentService.createWork(req.body);
    res.status(201).json({ success: true, data: newWork });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function update(req, res) {
  try {
    const updated = developmentService.updateWork(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Work not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function remove(req, res) {
  try {
    const deleted = developmentService.deleteWork(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Work not found" });
    res.json({ success: true, message: "Work deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getTimeline(req, res) {
  try {
    const timeline = developmentService.getTimeline();
    res.json({ success: true, data: timeline });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getStats(req, res) {
  try {
    const stats = developmentService.getStatusStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getTimeline,
  getStats
};
