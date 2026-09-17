// server/controllers/citizenController.js
const citizenService = require('../services/citizenService');

function getAll(req, res) {
  try {
    const { village, category, search } = req.query;
    if (search) {
      const results = citizenService.searchCitizen(search);
      return res.json({ success: true, count: results.length, data: results });
    }
    const data = citizenService.getAllCitizens({ village, category });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getById(req, res) {
  try {
    const item = citizenService.getCitizenById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Citizen not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function create(req, res) {
  try {
    const newItem = citizenService.createCitizen(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function update(req, res) {
  try {
    const updated = citizenService.updateCitizen(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Citizen not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function remove(req, res) {
  try {
    const deleted = citizenService.deleteCitizen(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Citizen not found" });
    res.json({ success: true, message: "Citizen deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function bulkImport(req, res) {
  try {
    const citizensArray = req.body.citizens;
    if (!Array.isArray(citizensArray)) {
      return res.status(400).json({ success: false, message: "citizens must be an array" });
    }
    const imported = citizenService.bulkImport(citizensArray);
    res.json({ success: true, count: imported.length, data: imported });
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
  bulkImport
};
