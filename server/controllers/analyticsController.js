// server/controllers/analyticsController.js
const analyticsService = require('../services/analyticsService');

function getOverview(req, res) {
  try {
    const data = analyticsService.getOverviewStats();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getVillages(req, res) {
  try {
    const data = analyticsService.getVillageBreakdown();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getChannels(req, res) {
  try {
    const data = analyticsService.getChannelMetrics();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getOverview,
  getVillages,
  getChannels
};
