const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');
const { generateBlogFromNews } = require('../utils/aiClassifier');

// GET regional news feeds
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    news: db.news || []
  });
});

// Convert News to Blog Draft (AI Blog Workflow)
router.post('/convert-to-blog', (req, res) => {
  const { newsId, user } = req.body;
  const db = readDb();
  const newsItem = (db.news || []).find(n => n.id === newsId);
  if (!newsItem) {
    return res.status(404).json({ success: false, message: 'News item not found.' });
  }

  const generatedBlog = generateBlogFromNews(newsItem);
  generatedBlog.id = 'blog-' + Date.now();
  generatedBlog.views = 0;
  generatedBlog.shares = 0;

  if (!db.blogs) db.blogs = [];
  db.blogs.unshift(generatedBlog);

  // Mark news as converted
  newsItem.status = 'converted';
  writeDb(db);

  logAudit(user, `Converted News to Blog Draft: ${generatedBlog.title}`, 'News RSS Manager', { newsId, blogId: generatedBlog.id });

  res.json({
    success: true,
    message: 'समाचार से AI आधारित ब्लॉग सफलतापूर्वक तैयार किया गया!',
    blog: generatedBlog
  });
});

// Add RSS Feed source
router.post('/add-source', (req, res) => {
  const { name, url, category, user } = req.body;
  const db = readDb();
  const newNews = {
    id: 'news-' + Date.now(),
    source: name || 'दैनिक अमर संदेश',
    title: `इटावा विकास समीक्षा: नवीन घोषणाएं`,
    location: 'इटावा',
    summary: 'विधानसभा क्षेत्र के सर्वांगीण विकास हेतु नई प्राथमिकताओं का निर्धारण।',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    category: category || 'विकास कार्य',
    image: '/images/poli1.png',
    status: 'unread',
    url: url || 'https://news.etawah.gov.in'
  };

  if (!db.news) db.news = [];
  db.news.unshift(newNews);
  writeDb(db);
  logAudit(user, `Added RSS Source: ${name}`, 'News RSS Manager', { url });

  res.json({ success: true, newsItem: newNews });
});

module.exports = router;
