const express = require('express');
const router = express.Router();
const { readDb } = require('../utils/db');

// EXPORT Database for MongoDB Migration (JSON Dump)
router.get('/mongodb', (req, res) => {
  const db = readDb();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=janseva_mongodb_dump.json');
  res.json({
    timestamp: new Date().toISOString(),
    collections: {
      mla: [db.mla],
      settings: [db.settings],
      developmentWorks: db.developmentWorks || [],
      socialPosts: db.socialPosts || [],
      news: db.news || [],
      blogs: db.blogs || [],
      citizens: db.citizens || [],
      team: db.team || [],
      leaders: db.leaders || [],
      events: db.events || [],
      auditLogs: db.auditLogs || []
    }
  });
});

// EXPORT SQL DDL & INSERT dump for PostgreSQL Migration
router.get('/postgresql', (req, res) => {
  const db = readDb();
  let sql = `-- JanSeva Dashboard PostgreSQL Migration Dump
-- Generated: ${new Date().toISOString()}

CREATE TABLE IF NOT EXISTS mla_profile (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  title VARCHAR(255),
  party VARCHAR(100),
  about TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS development_works (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  village VARCHAR(100),
  category VARCHAR(100),
  department VARCHAR(150),
  budget VARCHAR(50),
  status VARCHAR(50),
  date VARCHAR(50),
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  description TEXT
);

CREATE TABLE IF NOT EXISTS citizens (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) UNIQUE NOT NULL,
  village VARCHAR(100),
  booth VARCHAR(100),
  type VARCHAR(50),
  date VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS blogs (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(100),
  village VARCHAR(100),
  status VARCHAR(50),
  views INT DEFAULT 0,
  shares INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data Inserts
`;

  (db.developmentWorks || []).forEach(w => {
    sql += `INSERT INTO development_works (id, title, village, category, department, budget, status, date, lat, lng, description) VALUES ('${w.id}', '${(w.title || '').replace(/'/g, "''")}', '${w.village}', '${w.category}', '${(w.department || '').replace(/'/g, "''")}', '${w.budget}', '${w.status}', '${w.date}', ${w.coordinates ? w.coordinates.lat : 26.78}, ${w.coordinates ? w.coordinates.lng : 79.02}, '${(w.description || '').replace(/'/g, "''")}');\n`;
  });

  (db.citizens || []).forEach(c => {
    sql += `INSERT INTO citizens (id, name, mobile, village, booth, type, date) VALUES ('${c.id}', '${(c.name || '').replace(/'/g, "''")}', '${c.mobile}', '${c.village}', '${c.booth}', '${c.type}', '${c.date}');\n`;
  });

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename=janseva_postgresql_migration.sql');
  res.send(sql);
});

module.exports = router;
