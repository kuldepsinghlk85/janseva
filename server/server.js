const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploaded media and client images
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'JanSeva Backend Active', time: new Date().toISOString() }));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/development', require('./routes/development'));
app.use('/api/citizens', require('./routes/citizens'));
app.use('/api/social', require('./routes/social'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/news', require('./routes/news'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/leaders', require('./routes/leaders'));
app.use('/api/team', require('./routes/team'));
app.use('/api/events', require('./routes/events'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/export', require('./routes/export'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/communication', require('./routes/communication'));
app.use('/api/members', require('./routes/members'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/festivals', require('./routes/festivals'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/master', require('./routes/masterDataRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/hero-posters', require('./routes/heroPosters'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/directory', require('./routes/directoryRoutes'));

// Serve static built frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/images') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(__dirname, '../client/dist/index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  JanSeva Backend Server running on port ${PORT}`);
  console.log(`  Constituency: Etawah (200) | Smt. Sarita Bhadauria`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
