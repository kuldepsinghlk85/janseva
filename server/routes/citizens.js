const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');

// GET all citizens with search & filter
router.get('/', (req, res) => {
  const db = readDb();
  let citizens = db.citizens || [];
  const { village, type, search } = req.query;

  if (village && village !== 'All') {
    citizens = citizens.filter(c => (c.village || '').toLowerCase() === village.toLowerCase());
  }
  if (type && type !== 'All') {
    citizens = citizens.filter(c => (c.type || '').toLowerCase() === type.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    citizens = citizens.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.mobile || '').includes(q) ||
      (c.village || '').toLowerCase().includes(q) ||
      (c.booth || '').toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: citizens.length,
    citizens
  });
});

// REGISTER Citizen (QR / Public form or Admin)
router.post('/', (req, res) => {
  const { name, mobile, village, booth, type, category, area, source, photo, fatherSpouseName, notes } = req.body;
  if (!name || !mobile) {
    return res.status(400).json({ success: false, message: 'नाम और मोबाइल नंबर दोनों आवश्यक हैं।' });
  }

  const db = readDb();
  if (!db.citizens) db.citizens = [];

  // Duplicate Check
  const cleanMobile = String(mobile).trim();
  const existing = db.citizens.find(c => String(c.mobile).trim() === cleanMobile);
  if (existing) {
    return res.status(409).json({
      success: false,
      isDuplicate: true,
      message: `मोबाइल नंबर ${cleanMobile} पहले से ही ${existing.name} (${existing.village}) के नाम पर पंजीकृत है।`,
      existing
    });
  }

  const newCitizen = {
    id: 'cit-' + Date.now(),
    name: name.trim(),
    mobile: cleanMobile,
    village: village || 'इटावा सदर',
    booth: booth || 'सामान्य मतदाता',
    type: type || category || 'Citizen',
    area: area || 'इटावा विधानसभा (200)',
    photo: photo || '',
    fatherSpouseName: fatherSpouseName || '',
    notes: notes || '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    source: source || 'Admin Entry'
  };

  db.citizens.unshift(newCitizen);
  writeDb(db);
  logAudit(req.body.adminUser || 'Admin (Directory Manager)', `New Citizen Registered: ${newCitizen.name} (${newCitizen.mobile})`, 'Citizen Database', newCitizen);

  res.json({
    success: true,
    message: 'नागरिक / संपर्क सफलतापूर्वक जोड़ा गया!',
    citizen: newCitizen
  });
});

// BULK IMPORT (Excel / CSV upload)
router.post('/bulk-import', (req, res) => {
  const { source, user } = req.body || {};
  const records = Array.isArray(req.body) ? req.body : (req.body.records || req.body.citizens || []);
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ success: false, message: 'No records provided.' });
  }

  const db = readDb();
  if (!db.citizens) db.citizens = [];

  let added = 0;
  let duplicates = 0;

  for (const r of records) {
    if (!r.mobile || !r.name) continue;
    const cleanMobile = String(r.mobile).trim();
    const exists = db.citizens.some(c => String(c.mobile).trim() === cleanMobile);
    if (exists) {
      duplicates++;
      continue;
    }
    db.citizens.unshift({
      id: 'cit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: String(r.name).trim(),
      mobile: cleanMobile,
      village: r.village || 'इटावा सदर',
      booth: r.booth || 'वार्ड सूची',
      type: r.type || r.category || 'Citizen',
      photo: r.photo || '',
      fatherSpouseName: r.fatherSpouseName || '',
      notes: r.notes || '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      source: source || 'Excel Bulk Import'
    });
    added++;
  }

  writeDb(db);
  logAudit(user || 'Admin (Excel Importer)', `Bulk Imported ${added} Citizens from Excel (${duplicates} duplicates skipped)`, 'Citizen Database', { added, duplicates });

  res.json({
    success: true,
    added,
    duplicates,
    totalCitizens: db.citizens.length
  });
});

// DELETE Citizen
router.delete('/:id', (req, res) => {
  const db = readDb();
  db.citizens = (db.citizens || []).filter(c => c.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Citizen record removed.' });
});

module.exports = router;
