const express = require('express');
const router = express.Router();
const { readDb } = require('../utils/db');

// GET user audit logs
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    count: (db.auditLogs || []).length,
    logs: db.auditLogs || []
  });
});

module.exports = router;
