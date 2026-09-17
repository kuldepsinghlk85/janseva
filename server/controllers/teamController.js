// server/controllers/teamController.js
const teamService = require('../services/teamService');

function getAll(req, res) {
  try {
    const { category } = req.query;
    const data = teamService.getAllTeamMembers(category);
    const categories = teamService.getCategories();
    const userTypes = teamService.getUserTypes();
    res.json({ success: true, count: data.length, members: data, categories, userTypes, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getById(req, res) {
  try {
    const member = teamService.getMemberById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function create(req, res) {
  try {
    const newMember = teamService.addTeamMember(req.body);
    res.status(201).json({ success: true, message: "Member added successfully", data: newMember, member: newMember });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function update(req, res) {
  try {
    const updated = teamService.updateTeamMember(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Team member not found" });
    res.json({ success: true, message: "Member updated successfully", data: updated, member: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function remove(req, res) {
  try {
    const deleted = teamService.deleteTeamMember(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Team member not found" });
    res.json({ success: true, message: "Team member deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Categories
function getCategories(req, res) {
  try {
    const data = teamService.getCategories();
    res.json({ success: true, categories: data, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function addCategory(req, res) {
  try {
    const cat = teamService.addCategory(req.body);
    res.status(201).json({ success: true, message: "Category added", category: cat, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function deleteCategory(req, res) {
  try {
    const deleted = teamService.deleteCategory(req.params.id);
    res.json({ success: deleted, message: deleted ? "Category deleted" : "Category not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// User Types
function getUserTypes(req, res) {
  try {
    const data = teamService.getUserTypes();
    res.json({ success: true, userTypes: data, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function addUserType(req, res) {
  try {
    const item = teamService.addUserType(req.body);
    res.status(201).json({ success: true, message: "User type added", userType: item, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function deleteUserType(req, res) {
  try {
    const deleted = teamService.deleteUserType(req.params.id);
    res.json({ success: deleted, message: deleted ? "User type deleted" : "User type not found" });
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
  getCategories,
  addCategory,
  deleteCategory,
  getUserTypes,
  addUserType,
  deleteUserType
};
