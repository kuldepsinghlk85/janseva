const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '../uploads/images');
const assetsDir = path.join(__dirname, '../../client/public/images/assets');
const publicImagesDir = path.join(__dirname, '../../client/public/images');

// Ensure uploads dir exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage for Media Library
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^\w.-]/g, '_');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e5);
    cb(null, `${path.parse(cleanName).name}-${unique}${path.extname(cleanName)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// GET /api/media/all - Get all media images (uploads + system assets)
router.get('/all', (req, res) => {
  try {
    const items = [];

    // 1. Scan server uploads
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const fullPath = path.join(uploadsDir, file);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isFile()) {
            items.push({
              id: 'upload-' + file,
              filename: file,
              name: file,
              url: `/uploads/images/${file}`,
              size: stat.size,
              sizeFormatted: formatBytes(stat.size),
              uploadedAt: stat.mtime.toISOString(),
              source: 'uploaded',
              canDelete: true
            });
          }
        } catch (e) {
          // ignore unreadable
        }
      }
    }

    // 2. Scan assets directory
    if (fs.existsSync(assetsDir)) {
      const assetFiles = fs.readdirSync(assetsDir);
      for (const file of assetFiles) {
        const fullPath = path.join(assetsDir, file);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isFile() && /\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
            items.push({
              id: 'asset-' + file,
              filename: file,
              name: file,
              url: `/images/assets/${file}`,
              size: stat.size,
              sizeFormatted: formatBytes(stat.size),
              uploadedAt: stat.mtime.toISOString(),
              source: 'system_asset',
              canDelete: false
            });
          }
        } catch (e) {}
      }
    }

    // 3. Scan public images directory
    if (fs.existsSync(publicImagesDir)) {
      const pubFiles = fs.readdirSync(publicImagesDir);
      for (const file of pubFiles) {
        const fullPath = path.join(publicImagesDir, file);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isFile() && /\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
            items.push({
              id: 'pub-' + file,
              filename: file,
              name: file,
              url: `/images/${file}`,
              size: stat.size,
              sizeFormatted: formatBytes(stat.size),
              uploadedAt: stat.mtime.toISOString(),
              source: 'system_asset',
              canDelete: false
            });
          }
        } catch (e) {}
      }
    }

    // Sort newest first
    items.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    console.error('Error scanning media directory:', err);
    res.status(500).json({ success: false, message: 'Failed to scan media directory' });
  }
});

// POST /api/media/upload - Upload single or multiple images
router.post('/upload', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const uploadedItems = req.files.map(file => ({
    id: 'upload-' + file.filename,
    filename: file.filename,
    name: file.originalname,
    url: `/uploads/images/${file.filename}`,
    size: file.size,
    sizeFormatted: formatBytes(file.size),
    uploadedAt: new Date().toISOString(),
    source: 'uploaded',
    canDelete: true
  }));

  res.status(201).json({
    success: true,
    message: `${uploadedItems.length} file(s) uploaded successfully`,
    data: uploadedItems,
    file: uploadedItems[0]
  });
});

// GET /api/media/download/:filename - Trigger file download
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  if (fs.existsSync(filePath)) {
    return res.download(filePath, filename);
  }

  // Check assets fallback
  const assetPath = path.join(assetsDir, filename);
  if (fs.existsSync(assetPath)) {
    return res.download(assetPath, filename);
  }

  return res.status(404).json({ success: false, message: 'File not found' });
});

// DELETE /api/media/:filename - Delete uploaded image
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found in uploaded media' });
  }

  try {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete media error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete file' });
  }
});

module.exports = router;
