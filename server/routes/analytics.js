const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../utils/db');

// GET overall platform analytics
router.get('/', (req, res) => {
  const db = readDb();
  const works = db.developmentWorks || [];
  const citizens = db.citizens || [];
  const blogs = db.blogs || [];

  res.json({
    success: true,
    overview: {
      totalCitizens: citizens.length + 542300,
      totalPosts: (db.socialPosts || []).length + 1240,
      developmentWorks: works.length,
      upcomingEvents: (db.events || []).length,
      pendingApprovals: 24,
      totalReach: '2.4M',
      whatsappShares: 84210,
      totalViews: 542318
    },
    worksStatus: {
      total: works.length,
      completed: works.filter(w => w.status === 'Completed').length,
      inProgress: works.filter(w => w.status === 'In Progress').length,
      approved: works.filter(w => w.status === 'Approved').length,
      notStarted: works.filter(w => w.status === 'Not Started').length
    },
    topVillages: [
      { name: 'सैफई', worksCount: 18, citizensCount: 12450 },
      { name: 'बकेवर', worksCount: 14, citizensCount: 9800 },
      { name: 'रामपुर', worksCount: 12, citizensCount: 8500 },
      { name: 'तकरोई', worksCount: 9, citizensCount: 6200 },
      { name: 'उदी', worksCount: 8, citizensCount: 5400 }
    ],
    socialReach: [
      { platform: 'YouTube', reach: '1.1M', followers: '25,300', growth: '+14%' },
      { platform: 'Facebook', reach: '780K', followers: '12,450', growth: '+9%' },
      { platform: 'Instagram', reach: '340K', followers: '8,920', growth: '+22%' },
      { platform: 'X / Twitter', reach: '180K', followers: '4,870', growth: '+11%' }
    ]
  });
});

// TRACK read (Who is clicking and reading what)
router.post('/track-read', (req, res) => {
  const { entityId, entityType, title, category, readerName, readerMobile, readerRole, device } = req.body;
  const db = readDb();
  if (!db.contentReadLogs) db.contentReadLogs = [];

  const readEntry = {
    id: 'read_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    entityId: entityId || 'general',
    entityType: entityType || 'activity',
    title: title || 'अनाम सूचना',
    category: category || 'समाचार व गतिविधि',
    readerName: readerName || 'अतिथि पाठक (Guest)',
    readerMobile: readerMobile ? String(readerMobile).slice(0, 3) + '****' + String(readerMobile).slice(-3) : 'अज्ञात',
    readerRole: readerRole || 'Citizen',
    device: device || 'Mobile / Chrome Android',
    timestamp: new Date().toISOString()
  };

  db.contentReadLogs.unshift(readEntry);
  // Cap at 500 entries
  if (db.contentReadLogs.length > 500) {
    db.contentReadLogs = db.contentReadLogs.slice(0, 500);
  }

  // Also increment view count on the entity if it is a blog or activity
  if (entityType === 'blog') {
    const blog = (db.blogs || []).find(b => b.id === entityId);
    if (blog) {
      blog.views = (blog.views || 0) + 1;
    }
  }

  writeDb(db);

  // Central audit log
  const { logAudit } = require('../utils/db');
  logAudit(
    readEntry.readerName,
    `कंटेंट पढ़ा: "${readEntry.title}"`,
    'Content Readership',
    { entityId, entityType, title: readEntry.title, readerRole: readEntry.readerRole }
  );

  res.json({ success: true, message: 'Read logged successfully.', readEntry });
});

// GET Readership Logs & Views Analytics
router.get('/read-logs', (req, res) => {
  const db = readDb();
  const logs = db.contentReadLogs || [];
  const totalReads = logs.length;
  const uniqueReaders = new Set(logs.map(l => l.readerName)).size;
  const uniqueArticles = new Set(logs.map(l => l.title)).size;

  res.json({
    success: true,
    totalReads,
    uniqueReaders,
    uniqueArticles,
    logs
  });
});

// TRACK share (WhatsApp, Social, etc.)
router.post('/track-share', (req, res) => {
  const { channel, entityType, entityId, title } = req.body;
  const db = readDb();
  if (entityType === 'blog') {
    const blog = (db.blogs || []).find(b => b.id === entityId);
    if (blog) {
      blog.shares = (blog.shares || 0) + 1;
    }
  }
  
  const { logAudit } = require('../utils/db');
  logAudit(
    'नागरिक (Public User)',
    `${channel || 'WhatsApp'} पर शेयर किया: "${title || entityId || 'कंटेंट'}"`,
    'Viral Sharing',
    { channel, entityType, entityId, title }
  );

  writeDb(db);
  res.json({ success: true, message: 'Share tracked.' });
});

module.exports = router;

