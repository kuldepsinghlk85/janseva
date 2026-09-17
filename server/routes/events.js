const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');

// GET all events
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    events: db.events || []
  });
});

// ADD Event
router.post('/', (req, res) => {
  const db = readDb();
  if (!db.events) db.events = [];

  const newEvent = {
    id: 'ev-' + Date.now(),
    dateDay: req.body.dateDay || '20',
    dateMonth: req.body.dateMonth || 'Sep',
    title: req.body.title || 'जन संवाद',
    location: req.body.location || 'इटावा',
    time: req.body.time || '11:00 AM',
    type: req.body.type || 'Public Visit'
  };

  db.events.push(newEvent);
  writeDb(db);
  logAudit(req.body.user, `Created Event: ${newEvent.title} at ${newEvent.location}`, 'Events & Visits', newEvent);

  res.json({ success: true, event: newEvent });
});

// DELETE Event
router.delete('/:id', (req, res) => {
  const db = readDb();
  db.events = (db.events || []).filter(e => e.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Event deleted.' });
});

module.exports = router;
