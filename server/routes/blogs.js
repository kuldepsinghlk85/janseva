const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');

// GET blogs (filter by status: published, hidden, archived, scheduled)
router.get('/', (req, res) => {
  const db = readDb();
  let blogs = db.blogs || [];
  const { status, publicOnly } = req.query;

  if (publicOnly === 'true') {
    blogs = blogs.filter(b => b.status === 'published');
  } else if (status && status !== 'All') {
    blogs = blogs.filter(b => b.status === status);
  }

  res.json({
    success: true,
    count: blogs.length,
    blogs
  });
});

// GET single blog
router.get('/:id', (req, res) => {
  const db = readDb();
  const blog = (db.blogs || []).find(b => b.id === req.params.id || b.slug === req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  // Increment views
  blog.views = (blog.views || 0) + 1;
  writeDb(db);

  res.json({ success: true, blog });
});

// CREATE blog
router.post('/', (req, res) => {
  const db = readDb();
  if (!db.blogs) db.blogs = [];

  const newBlog = {
    id: 'blog-' + Date.now(),
    title: req.body.title || 'शीर्षक रहित ब्लॉग',
    slug: (req.body.title || 'blog').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
    category: req.body.category || 'विकास कार्य',
    village: req.body.village || 'इटावा सदर',
    date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: req.body.author || 'कार्यालय श्रीमती सरिता भदौरिया (विधायक, इटावा)',
    image: req.body.image || '/images/poli3.png',
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    status: req.body.status || 'published', // published, hidden, archived, scheduled
    scheduledDate: req.body.scheduledDate || null,
    views: 0,
    shares: 0
  };

  db.blogs.unshift(newBlog);
  writeDb(db);
  logAudit(req.body.user, `Created Blog Post: ${newBlog.title} [Status: ${newBlog.status}]`, 'Blog Manager', newBlog);

  res.json({ success: true, blog: newBlog });
});

// UPDATE blog & status
router.put('/:id', (req, res) => {
  const db = readDb();
  const index = (db.blogs || []).findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  db.blogs[index] = { ...db.blogs[index], ...req.body };
  writeDb(db);
  logAudit(req.body.user, `Updated Blog Post: ${db.blogs[index].title} [Status: ${db.blogs[index].status}]`, 'Blog Manager', db.blogs[index]);

  res.json({ success: true, blog: db.blogs[index] });
});

// DELETE blog
router.delete('/:id', (req, res) => {
  const db = readDb();
  const blog = (db.blogs || []).find(b => b.id === req.params.id);
  db.blogs = (db.blogs || []).filter(b => b.id !== req.params.id);
  writeDb(db);
  logAudit(req.query.user, `Deleted Blog: ${blog ? blog.title : req.params.id}`, 'Blog Manager', { id: req.params.id });

  res.json({ success: true, message: 'Blog deleted' });
});

module.exports = router;
