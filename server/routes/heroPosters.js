const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { logAudit } = require('../utils/db');

const DATA_FILE = path.join(__dirname, '../data/heroPosters.json');

function readHeroPosters() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { settings: { autoSlide: true, intervalSeconds: 4, maxVisible: 6, showOnHero: true }, posters: [] };
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading heroPosters.json:', e);
    return { settings: { autoSlide: true, intervalSeconds: 4, maxVisible: 6, showOnHero: true }, posters: [] };
  }
}

function writeHeroPosters(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing heroPosters.json:', e);
    return false;
  }
}

// GET active posters for public Hero Section
router.get('/', (req, res) => {
  const data = readHeroPosters();
  const max = Number(data.settings?.maxVisible) || 6;
  const activePosters = (data.posters || [])
    .filter(p => p.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, max);

  res.json({
    success: true,
    settings: data.settings,
    totalCount: data.posters.length,
    posters: activePosters
  });
});

// GET all posters for Admin Manager
router.get('/all', (req, res) => {
  const data = readHeroPosters();
  const sorted = (data.posters || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({
    success: true,
    settings: data.settings,
    posters: sorted
  });
});

// POST new poster
router.post('/', (req, res) => {
  const data = readHeroPosters();
  const { title, subtitle, category, image, caption, date, user } = req.body;

  if (!title || !image) {
    return res.status(400).json({ success: false, message: 'शीर्षक और पोस्टर इमेज आवश्यक हैं।' });
  }

  const newPoster = {
    id: 'poster-' + Date.now(),
    title,
    subtitle: subtitle || '',
    category: category || 'विशेष पोस्टर',
    image,
    caption: caption || '',
    date: date || new Date().toISOString().split('T')[0],
    active: true,
    order: (data.posters.length + 1),
    shares: 0,
    createdAt: new Date().toISOString()
  };

  data.posters.push(newPoster);
  writeHeroPosters(data);
  logAudit(user || 'Admin', 'नया हीरो पोस्टर जोड़ा: ' + newPoster.title, 'Hero Posters', newPoster);

  res.json({
    success: true,
    message: 'पोस्टर सफलतापूर्वक अपलोड किया गया!',
    poster: newPoster
  });
});

// PUT update poster
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const data = readHeroPosters();
  const idx = data.posters.findIndex(p => p.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'पोस्टर नहीं मिला।' });
  }

  const { title, subtitle, category, image, caption, date, active, user } = req.body;
  data.posters[idx] = {
    ...data.posters[idx],
    ...(title !== undefined && { title }),
    ...(subtitle !== undefined && { subtitle }),
    ...(category !== undefined && { category }),
    ...(image !== undefined && { image }),
    ...(caption !== undefined && { caption }),
    ...(date !== undefined && { date }),
    ...(active !== undefined && { active: Boolean(active) }),
    updatedAt: new Date().toISOString()
  };

  writeHeroPosters(data);
  logAudit(user || 'Admin', 'पोस्टर अपडेट किया: ' + data.posters[idx].title, 'Hero Posters', data.posters[idx]);

  res.json({
    success: true,
    message: 'पोस्टर विवरण सफलतापूर्वक अपडेट हुआ!',
    poster: data.posters[idx]
  });
});

// POST toggle active
router.post('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const data = readHeroPosters();
  const poster = data.posters.find(p => p.id === id);

  if (!poster) {
    return res.status(404).json({ success: false, message: 'पोस्टर नहीं मिला।' });
  }

  poster.active = !poster.active;
  writeHeroPosters(data);
  logAudit(user || 'Admin', 'पोस्टर सक्रियता बदली: ' + poster.title + ' (' + (poster.active ? 'सक्रिय' : 'निष्क्रिय') + ')', 'Hero Posters', { id, active: poster.active });

  res.json({
    success: true,
    message: 'पोस्टर ' + (poster.active ? 'सक्रिय किया गया' : 'निष्क्रिय किया गया') + '!',
    poster
  });
});

// PUT update ordering
router.put('/order/update', (req, res) => {
  const { posterIds, user } = req.body;
  if (!Array.isArray(posterIds)) {
    return res.status(400).json({ success: false, message: 'अमान्य डेटा सूची।' });
  }

  const data = readHeroPosters();
  const reordered = [];
  posterIds.forEach((id, idx) => {
    const found = data.posters.find(p => p.id === id);
    if (found) {
      found.order = idx + 1;
      reordered.push(found);
    }
  });

  data.posters.forEach(p => {
    if (!posterIds.includes(p.id)) {
      p.order = reordered.length + 1;
      reordered.push(p);
    }
  });

  data.posters = reordered;
  writeHeroPosters(data);
  logAudit(user || 'Admin', 'हीरो पोस्टर्स का क्रम बदला गया', 'Hero Posters', { count: posterIds.length });

  res.json({
    success: true,
    message: 'पोस्टर क्रम सफलतापूर्वक अपडेट किया गया!',
    posters: data.posters
  });
});

// DELETE poster
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { user } = req.query;
  const data = readHeroPosters();
  const initialLen = data.posters.length;
  data.posters = data.posters.filter(p => p.id !== id);

  if (data.posters.length === initialLen) {
    return res.status(404).json({ success: false, message: 'पोस्टर नहीं मिला।' });
  }

  data.posters.forEach((p, i) => { p.order = i + 1; });
  writeHeroPosters(data);
  logAudit(user || 'Admin', 'पोस्टर हटाया गया: ID ' + id, 'Hero Posters', { id });

  res.json({
    success: true,
    message: 'पोस्टर सफलतापूर्वक हटा दिया गया।'
  });
});

// PUT slider settings
router.put('/settings/config', (req, res) => {
  const { autoSlide, intervalSeconds, maxVisible, showOnHero, user } = req.body;
  const data = readHeroPosters();

  data.settings = {
    ...data.settings,
    ...(autoSlide !== undefined && { autoSlide: Boolean(autoSlide) }),
    ...(intervalSeconds !== undefined && { intervalSeconds: Number(intervalSeconds) }),
    ...(maxVisible !== undefined && { maxVisible: Number(maxVisible) }),
    ...(showOnHero !== undefined && { showOnHero: Boolean(showOnHero) })
  };

  writeHeroPosters(data);
  logAudit(user || 'Admin', 'हीरो पोस्टर स्लाइडर सेटिंग्स अपडेट की गईं', 'Hero Posters', data.settings);

  res.json({
    success: true,
    message: 'स्लाइडर सेटिंग्स सफलतापूर्वक सुरक्षित की गईं!',
    settings: data.settings
  });
});

module.exports = router;
