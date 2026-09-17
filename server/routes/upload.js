const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadSubdir = 'images';
    if (file.mimetype.startsWith('video/')) {
      uploadSubdir = 'videos';
    } else if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) {
      uploadSubdir = 'docs';
    }
    const destDir = path.join(__dirname, '../uploads', uploadSubdir);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    cb(null, destDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// POST /api/upload - Single File
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const relativeSubdir = req.file.mimetype.startsWith('video/') ? 'videos' : (req.file.mimetype.includes('pdf') ? 'docs' : 'images');
    const fileUrl = `/uploads/${relativeSubdir}/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/upload/multiple - Multiple Files
router.post('/multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const uploadedFiles = req.files.map(file => {
      const relativeSubdir = file.mimetype.startsWith('video/') ? 'videos' : (file.mimetype.includes('pdf') ? 'docs' : 'images');
      return {
        url: `/uploads/${relativeSubdir}/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    res.json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles,
      urls: uploadedFiles.map(f => f.url)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
