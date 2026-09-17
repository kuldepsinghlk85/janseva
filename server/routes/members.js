const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');

// GET all members
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    members: db.members || []
  });
});

// ADD Member
router.post('/', (req, res) => {
  const db = readDb();
  if (!db.members) db.members = [];

  const newMember = {
    id: 'mem-' + Date.now(),
    name: req.body.name,
    mobile: req.body.mobile,
    village: req.body.village || 'इटावा सदर',
    booth: req.body.booth || 'बूथ 01',
    role: req.body.role || 'सक्रिय सदस्य',
    idCard: req.body.idCard || 'Pending',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  db.members.unshift(newMember);
  writeDb(db);
  logAudit(req.body.user, `Added Member: ${newMember.name} (${newMember.role})`, 'Member Management', newMember);

  res.json({ success: true, member: newMember });
});

// TOGGLE ID CARD Status
router.put('/:id/id-card', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const db = readDb();
  const member = (db.members || []).find(m => m.id === id);
  if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

  member.idCard = member.idCard === 'Issued' ? 'Pending' : 'Issued';
  writeDb(db);
  logAudit(user, `ID Card status updated for ${member.name}: ${member.idCard}`, 'Member Management', { id, idCard: member.idCard });

  res.json({ success: true, member });
});

module.exports = router;
