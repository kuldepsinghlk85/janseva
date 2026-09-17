// server/services/teamService.js
// Service layer for MLA Team, Categories and User Types Management

const { teamData, saveTeamData } = require('../data/teams');

function getAllTeamMembers(category) {
  if (category && category.toLowerCase() !== 'all') {
    return teamData.teams.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }
  return teamData.teams;
}

function getMemberById(id) {
  return teamData.teams.find(t => t.id === parseInt(id));
}

function addTeamMember(memberData) {
  const newMember = {
    id: teamData.teams.length ? Math.max(...teamData.teams.map(t => t.id)) + 1 : 1,
    name: memberData.name || "अनाम सदस्य",
    role: memberData.role || "कार्यकर्ता",
    area: memberData.area || "इटावा सदर",
    booth: memberData.booth || "",
    mobile: memberData.mobile || "",
    email: memberData.email || "",
    category: memberData.category || "Volunteers",
    avatar: memberData.avatar || "/images/poli1.png",
    status: memberData.status || "Active",
    dateJoined: memberData.dateJoined || new Date().toISOString().split('T')[0]
  };
  teamData.teams.push(newMember);
  saveTeamData();
  return newMember;
}

function updateTeamMember(id, updateData) {
  const member = getMemberById(id);
  if (!member) return null;
  Object.assign(member, updateData);
  saveTeamData();
  return member;
}

function deleteTeamMember(id) {
  const index = teamData.teams.findIndex(t => t.id === parseInt(id));
  if (index === -1) return false;
  teamData.teams.splice(index, 1);
  saveTeamData();
  return true;
}

// Categories Management
function getCategories() {
  return teamData.categories || [];
}

function addCategory(data) {
  const name = data.name || data.nameHi;
  if (!name) return null;
  const raw = (data.name || name).toLowerCase().replace(/[^\w-]/g, '').replace(/-+/g, '-');
  const id = data.id || (raw && raw.length > 1 ? raw : `cat-${Date.now().toString(36)}`);
  const existing = teamData.categories.find(c => c.id === id || c.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  const newCat = {
    id: id,
    name: data.name || name,
    nameHi: data.nameHi || data.name || name
  };
  teamData.categories.push(newCat);
  saveTeamData();
  return newCat;
}

function deleteCategory(categoryId) {
  const index = teamData.categories.findIndex(c => c.id === categoryId || c.name === categoryId);
  if (index === -1) return false;
  teamData.categories.splice(index, 1);
  saveTeamData();
  return true;
}

// User Types Management
function getUserTypes() {
  return teamData.userTypes || [];
}

function addUserType(data) {
  const title = data.title || data.name;
  if (!title) return null;
  const raw = title.toLowerCase().replace(/[^\w-]/g, '').replace(/-+/g, '-');
  const id = data.id || (raw && raw.length > 1 ? raw : `role-${Date.now().toString(36)}`);
  const existing = teamData.userTypes.find(u => u.id === id || u.title === title);
  if (existing) return existing;

  const newType = {
    id: id,
    title: title
  };
  teamData.userTypes.push(newType);
  saveTeamData();
  return newType;
}

function deleteUserType(typeId) {
  const index = teamData.userTypes.findIndex(u => u.id === typeId || u.title === typeId);
  if (index === -1) return false;
  teamData.userTypes.splice(index, 1);
  saveTeamData();
  return true;
}

module.exports = {
  getAllTeamMembers,
  getMemberById,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getCategories,
  addCategory,
  deleteCategory,
  getUserTypes,
  addUserType,
  deleteUserType
};
