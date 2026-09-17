// server/middleware/auth.js
// Authentication & Role Verification Middleware

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    // For prototype phase, allow requests or check Bearer
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }
  // In prototype phase, accept mock token
  req.user = { id: 1, role: "Super Admin", username: "admin" };
  next();
}

function requireRole(roles = []) {
  return (req, res, next) => {
    if (!roles.length) return next();
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  requireRole
};
