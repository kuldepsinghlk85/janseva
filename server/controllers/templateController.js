// server/controllers/templateController.js
const templateService = require('../services/templateService');

function getTemplates(req, res) {
  try {
    const data = templateService.getTemplates();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function activate(req, res) {
  try {
    const updated = templateService.activateTemplate(req.params.id);
    if (!updated) return res.status(404).json({ success: false, message: "Template not found" });
    res.json({ success: true, message: "Template activated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getSections(req, res) {
  try {
    const data = templateService.getSections();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function updateSections(req, res) {
  try {
    const data = templateService.updateSections(req.body.sections);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function toggleSection(req, res) {
  try {
    const { isEnabled } = req.body;
    const data = templateService.toggleSection(req.params.key, isEnabled);
    if (!data) return res.status(404).json({ success: false, message: "Section not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getTemplates,
  activate,
  getSections,
  updateSections,
  toggleSection
};
