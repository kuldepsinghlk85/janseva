const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');

// GET all media gallery items
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    gallery: db.mediaGallery || [],
    siteImages: {
      saritaHero: db.settings?.hero?.saritaImage || '/images/assets/sarita_bhadauria_hero.jpg',
      modiPortrait: db.settings?.hero?.modiImage || '/images/assets/modi_portrait.jpg',
      yogiPortrait: db.settings?.hero?.yogiImage || '/images/assets/yogi_portrait.jpg',
      festivalBanner: db.settings?.festival?.bannerImage || '/images/assets/work_women_shg.jpg',
      bgPanorama: db.settings?.hero?.bgPanorama || '/images/assets/bottom_leaders_trio.jpg'
    }
  });
});

// ADD media item to gallery
router.post('/', (req, res) => {
  const { title, url, type, category, user } = req.body;
  const db = readDb();
  if (!db.mediaGallery) db.mediaGallery = [];

  const newItem = {
    id: 'm-' + Date.now(),
    title: title || 'नई फोटो',
    url: url || '/images/assets/sarita_bhadauria_hero.jpg',
    type: type || 'Photo',
    category: category || 'सामान्य'
  };

  db.mediaGallery.unshift(newItem);
  writeDb(db);
  logAudit(user, `Uploaded Media Asset: ${newItem.title}`, 'Media Gallery', newItem);

  res.json({ success: true, item: newItem });
});

// SWAP Site Image (Image Changer Tool)
router.put('/swap-image', (req, res) => {
  const { targetKey, imageUrl, user } = req.body;
  const db = readDb();
  if (!db.settings) db.settings = {};

  if (targetKey === 'saritaHero') {
    if (!db.settings.hero) db.settings.hero = {};
    db.settings.hero.saritaImage = imageUrl;
  } else if (targetKey === 'modiPortrait') {
    if (!db.settings.hero) db.settings.hero = {};
    db.settings.hero.modiImage = imageUrl;
  } else if (targetKey === 'yogiPortrait') {
    if (!db.settings.hero) db.settings.hero = {};
    db.settings.hero.yogiImage = imageUrl;
  } else if (targetKey === 'festivalBanner') {
    if (!db.settings.festival) db.settings.festival = {};
    db.settings.festival.bannerImage = imageUrl;
  } else if (targetKey === 'bgPanorama') {
    if (!db.settings.hero) db.settings.hero = {};
    db.settings.hero.bgPanorama = imageUrl;
  }

  writeDb(db);
  logAudit(user, `Changed Site Image for ${targetKey}`, 'Media Gallery', { targetKey, imageUrl });

  res.json({
    success: true,
    message: `छवि (${targetKey}) सफलतापूर्वक बदल दी गई है!`,
    targetKey,
    imageUrl
  });
});

module.exports = router;
