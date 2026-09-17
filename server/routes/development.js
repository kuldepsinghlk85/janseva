const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');

// GET all development works with filtering and statistics
router.get('/', (req, res) => {
  const db = readDb();
  let works = db.developmentWorks || [];
  const { village, category, status, search, year } = req.query;

  if (village && village !== 'All') {
    works = works.filter(w => (w.village || '').toLowerCase() === village.toLowerCase());
  }
  if (category && category !== 'All') {
    works = works.filter(w => (w.category || '').toLowerCase() === category.toLowerCase());
  }
  if (status && status !== 'All') {
    works = works.filter(w => (w.status || '').toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    works = works.filter(w =>
      (w.title || '').toLowerCase().includes(q) ||
      (w.description || '').toLowerCase().includes(q) ||
      (w.village || '').toLowerCase().includes(q) ||
      (w.department || '').toLowerCase().includes(q)
    );
  }

  // Calculate statistics
  const allWorks = db.developmentWorks || [];
  const stats = {
    total: allWorks.length,
    completed: allWorks.filter(w => w.status === 'Completed').length,
    inProgress: allWorks.filter(w => w.status === 'In Progress').length,
    approved: allWorks.filter(w => w.status === 'Approved').length,
    notStarted: allWorks.filter(w => w.status === 'Not Started').length
  };

  res.json({
    success: true,
    count: works.length,
    stats,
    works
  });
});

// GET single work
router.get('/:id', (req, res) => {
  const db = readDb();
  const work = (db.developmentWorks || []).find(w => w.id === req.params.id);
  if (!work) {
    return res.status(404).json({ success: false, message: 'Work not found' });
  }
  res.json({ success: true, work });
});

// CREATE new development work
router.post('/', (req, res) => {
  const db = readDb();
  if (!db.developmentWorks) db.developmentWorks = [];

  const newWork = {
    id: 'work-' + Date.now(),
    title: req.body.title || 'नया विकास कार्य',
    village: req.body.village || 'इटावा सदर',
    block: req.body.block || 'इटावा',
    category: req.body.category || 'सड़क एवं परिवहन',
    department: req.body.department || 'लोक निर्माण विभाग (PWD)',
    budget: req.body.budget || '₹ 50 लाख',
    status: req.body.status || 'In Progress',
    date: req.body.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    coordinates: req.body.coordinates || { lat: 26.77 + Math.random() * 0.15, lng: 79.0 + Math.random() * 0.15 },
    description: req.body.description || '',
    beforeImage: req.body.beforeImage || '/images/poli3.png',
    afterImage: req.body.afterImage || '/images/poli4.png',
    photos: req.body.photos || ['/images/poli3.png'],
    impact: req.body.impact || 'ग्रामीणों को सीधा लाभ'
  };

  db.developmentWorks.unshift(newWork);
  writeDb(db);
  logAudit(req.body.user, `Created Development Work: ${newWork.title}`, 'Development Works', newWork);

  res.json({ success: true, work: newWork });
});

// UPDATE development work
router.put('/:id', (req, res) => {
  const db = readDb();
  const index = (db.developmentWorks || []).findIndex(w => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Work not found' });
  }

  db.developmentWorks[index] = { ...db.developmentWorks[index], ...req.body };
  writeDb(db);
  logAudit(req.body.user, `Updated Development Work: ${db.developmentWorks[index].title}`, 'Development Works', db.developmentWorks[index]);

  res.json({ success: true, work: db.developmentWorks[index] });
});

// DELETE development work
router.delete('/:id', (req, res) => {
  const db = readDb();
  const work = (db.developmentWorks || []).find(w => w.id === req.params.id);
  db.developmentWorks = (db.developmentWorks || []).filter(w => w.id !== req.params.id);
  writeDb(db);
  logAudit(req.query.user, `Deleted Development Work: ${work ? work.title : req.params.id}`, 'Development Works', { id: req.params.id });

  res.json({ success: true, message: 'Work deleted successfully' });
});

module.exports = router;
