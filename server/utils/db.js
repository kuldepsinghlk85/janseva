const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

// Initialize db with fallback if not exists
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return {};
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return {};
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

function getCollection(key) {
  const db = readDb();
  return db[key] || [];
}

function saveCollection(key, items) {
  const db = readDb();
  db[key] = items;
  return writeDb(db);
}

function logAudit(user, action, module, details = {}) {
  const db = readDb();
  if (!db.auditLogs) db.auditLogs = [];
  const logEntry = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    user: user || 'Admin (Super Admin)',
    action,
    module,
    details,
    device: 'Desktop / Chrome Windows 11'
  };
  db.auditLogs.unshift(logEntry);
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  writeDb(db);
  return logEntry;
}

module.exports = {
  readDb,
  writeDb,
  getCollection,
  saveCollection,
  logAudit
};
