// server/controllers/leaderController.js
const leaderService = require('../services/leaderService');

function getAll(req, res) {
  try {
    const { category } = req.query;
    const data = leaderService.getAllLeaders(category);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function add(req, res) {
  try {
    const newLeader = leaderService.addLeader(req.body);
    res.status(201).json({ success: true, data: newLeader });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function remove(req, res) {
  try {
    const deleted = leaderService.deleteLeader(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Leader not found" });
    res.json({ success: true, message: "Leader removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAll,
  add,
  remove
};
