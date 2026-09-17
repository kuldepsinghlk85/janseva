const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');

// GET all leaders
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    leaders: db.leaders || []
  });
});

// ADD Leader
router.post('/', (req, res) => {
  const db = readDb();
  if (!db.leaders) db.leaders = [];

  const newLeader = {
    id: 'leader-' + Date.now(),
    name: req.body.name,
    nameEn: req.body.nameEn || req.body.name,
    position: req.body.position,
    party: req.body.party || 'BJP',
    quote: req.body.quote || '',
    posts: req.body.posts || 0,
    engagement: req.body.engagement || '5K',
    photo: req.body.photo || '/images/media_1789490967561.jpg'
  };

  db.leaders.push(newLeader);
  writeDb(db);
  logAudit(req.body.user, `Added Leader to Network: ${newLeader.name}`, 'Leader Management', newLeader);

  res.json({ success: true, leader: newLeader });
});

// DELETE Leader
router.delete('/:id', (req, res) => {
  const db = readDb();
  db.leaders = (db.leaders || []).filter(l => l.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Leader removed.' });
});

module.exports = router;
