// server/controllers/activityController.js
// REST Controller for MLA Daily Activity Publisher & Development Timeline Engine

const activityService = require('../services/activityService');

function getAll(req, res) {
  try {
    const { search, category, village, tag, status } = req.query;
    const data = activityService.getAllActivities({ search, category, village, tag, status });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getById(req, res) {
  try {
    const item = activityService.getActivityById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    // Increment view count
    activityService.incrementViews(item.id);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getFeatured(req, res) {
  try {
    const item = activityService.getFeaturedActivity();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getTimeline(req, res) {
  try {
    const items = activityService.getTimelineActivities();
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function create(req, res) {
  try {
    if (!req.body.title) {
      return res.status(400).json({ success: false, message: 'Activity Title is required' });
    }
    const newActivity = activityService.createActivity(req.body);
    res.status(201).json({
      success: true,
      message: 'Activity published successfully across all website sections',
      data: newActivity
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function update(req, res) {
  try {
    const updated = activityService.updateActivity(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({
      success: true,
      message: 'Activity updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function remove(req, res) {
  try {
    const deleted = activityService.deleteActivity(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function share(req, res) {
  try {
    const item = activityService.incrementShares(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({
      success: true,
      shares: item.shares,
      message: 'Share recorded'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getFeaturedSlider(req, res) {
  try {
    const items = activityService.getFeaturedSliderActivities();
    const config = activityService.getFeaturedSliderConfig();
    res.json({
      success: true,
      count: items.length,
      config,
      data: items
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function updateFeaturedSliderOrder(req, res) {
  try {
    const { activityIds } = req.body;
    if (!activityIds) {
      return res.status(400).json({ success: false, message: 'activityIds array is required' });
    }
    const updatedItems = activityService.updateFeaturedSliderOrder(activityIds);
    res.json({
      success: true,
      message: 'शीर्ष स्लाइडर में 2-4 एक्टिविटी का क्रम सफलतापूर्वक सुरक्षित हो गया!',
      data: updatedItems
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

function toggleFeaturedSlider(req, res) {
  try {
    const { id } = req.params;
    const updatedItems = activityService.toggleFeaturedSlider(id);
    res.json({
      success: true,
      message: 'स्लाइडर स्थिति सफलतापूर्वक अपडेट की गई',
      data: updatedItems
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  getFeatured,
  getTimeline,
  getFeaturedSlider,
  updateFeaturedSliderOrder,
  toggleFeaturedSlider,
  create,
  update,
  remove,
  share
};
