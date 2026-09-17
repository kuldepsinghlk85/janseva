const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');

// GET all government schemes
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    schemes: db.schemes || []
  });
});

// ADD Scheme
router.post('/', (req, res) => {
  const db = readDb();
  if (!db.schemes) db.schemes = [];
  const newScheme = {
    id: 'sch-' + Date.now(),
    title: req.body.title || 'नई योजना',
    category: req.body.category || 'कल्याणकारी',
    icon: req.body.icon || 'Home',
    beneficiaries: req.body.beneficiaries || 'लाभार्थी',
    desc: req.body.desc || ''
  };
  db.schemes.push(newScheme);
  writeDb(db);
  logAudit(req.body.user, `Added Govt Scheme: ${newScheme.title}`, 'Website Settings', newScheme);
  res.json({ success: true, scheme: newScheme });
});

module.exports = router;
