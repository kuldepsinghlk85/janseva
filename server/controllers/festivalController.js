// server/controllers/festivalController.js
const festivalService = require('../services/festivalService');
const { logAudit } = require('../utils/db');

function getAll(req, res) {
  try {
    const festivals = festivalService.getAll();
    const activeCampaign = festivalService.getFestivalSettings();
    res.json({ success: true, activeFestival: activeCampaign, festivals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getSettings(req, res) {
  try {
    const data = festivalService.getFestivalSettings();
    const festivals = festivalService.getAll();
    res.json({ success: true, data, festivals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function create(req, res) {
  try {
    const user = req.body.user || 'Admin (Super Admin)';
    const item = festivalService.create(req.body);
    logAudit(user, 'CREATE_FESTIVAL', 'Festival Manager', { id: item.id, title: item.title });
    res.json({ success: true, message: 'त्यौहार अभियान डेटाबेस में सफलतापूर्वक दर्ज हुआ!', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function updateItem(req, res) {
  try {
    const { id } = req.params;
    const user = req.body.user || 'Admin (Super Admin)';
    const item = festivalService.update(id, req.body);
    logAudit(user, 'UPDATE_FESTIVAL', 'Festival Manager', { id, title: item.title });
    res.json({ success: true, message: 'त्यौहार अभियान अपडेट हो गया!', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const user = req.body.user || 'Admin (Super Admin)';
    festivalService.delete(id);
    logAudit(user, 'DELETE_FESTIVAL', 'Festival Manager', { id });
    res.json({ success: true, message: 'त्यौहार अभियान हटाया गया।' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function activate(req, res) {
  try {
    const { id } = req.params;
    const user = req.body.user || 'Admin (Super Admin)';
    const item = festivalService.activate(id);
    logAudit(user, 'ACTIVATE_FESTIVAL', 'Festival Manager', { id, title: item.title });
    res.json({ success: true, message: `"${item.title}" होमपेज पर सक्रिय हो गया!`, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function update(req, res) {
  try {
    const user = req.body.user || 'Admin (Super Admin)';
    const data = festivalService.updateFestivalSettings(req.body);
    logAudit(user, 'UPDATE_FESTIVAL_SETTINGS', 'Festival Manager', { title: data.title });
    res.json({ success: true, message: 'Festival campaign updated', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function toggle(req, res) {
  try {
    const { isEnabled, user = 'Admin (Super Admin)' } = req.body;
    const data = festivalService.toggleFestival(isEnabled);
    logAudit(user, isEnabled ? 'ACTIVATE_FESTIVAL_BANNER' : 'DEACTIVATE_FESTIVAL_BANNER', 'Festival Manager');
    res.json({ success: true, message: `Festival campaign ${isEnabled ? 'activated' : 'deactivated'}`, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAll,
  getSettings,
  create,
  updateItem,
  deleteItem,
  activate,
  update,
  toggle
};
