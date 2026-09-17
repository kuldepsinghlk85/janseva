// server/controllers/userController.js
const userService = require('../services/userService');

function getAll(req, res) {
  try {
    const data = userService.getAllUsers();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getById(req, res) {
  try {
    const user = userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function login(req, res) {
  try {
    const { username, password } = req.body;
    const authResult = userService.authenticate(username, password);
    if (!authResult) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    res.json({ success: true, message: "Authentication successful", ...authResult });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function citizenLogin(req, res) {
  try {
    const { mobile, name } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "मोबाइल नंबर आवश्यक है।" });
    }
    const result = userService.citizenLogin(mobile, name);
    if (!result) {
      return res.status(400).json({ success: false, message: "लॉगिन असफल रहा।" });
    }
    res.json({ success: true, message: "लॉगिन सफल रहा! स्वागत है।", user: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function citizenRegister(req, res) {
  try {
    const result = userService.citizenRegister(req.body);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }
    res.json({
      success: true,
      message: result.isExisting ? "आप पहले से पंजीकृत हैं! स्वतः लॉगिन कर दिया गया है।" : "सफलतापूर्वक पंजीकरण हो गया है!",
      user: result.user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function getCitizenGrievances(req, res) {
  try {
    const { mobile } = req.params;
    const grievances = userService.getCitizenGrievances(mobile);
    res.json({ success: true, count: grievances.length, grievances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function create(req, res) {
  try {
    const user = userService.createUser(req.body, req.body.actor || 'Super Admin');
    res.status(201).json({ success: true, message: 'नया सिस्टम यूजर सफलतापूर्वक बनाया गया!', user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

function update(req, res) {
  try {
    const updated = userService.updateUser(req.params.id, req.body, req.body.actor || 'Super Admin');
    if (!updated) return res.status(404).json({ success: false, message: 'यूजर नहीं मिला' });
    res.json({ success: true, message: 'यूजर विवरण अपडेट कर दिया गया है।', user: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

function remove(req, res) {
  try {
    const deleted = userService.deleteUser(req.params.id, req.query.actor || 'Super Admin');
    if (!deleted) return res.status(404).json({ success: false, message: 'यूजर नहीं मिला' });
    res.json({ success: true, message: 'सिस्टम यूजर सफलतापूर्वक हटा दिया गया है।' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  login,
  citizenLogin,
  citizenRegister,
  getCitizenGrievances
};

