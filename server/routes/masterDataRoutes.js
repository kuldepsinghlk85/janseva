const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/masterDataController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Villages
router.get('/villages', controller.getVillages);
router.post('/villages', controller.addVillage);
router.put('/villages/:id', controller.updateVillage);
router.delete('/villages/all', controller.clearAllVillages);
router.delete('/villages/:id', controller.deleteVillage);

// Bulk Import (Excel or JSON)
router.post('/bulk-import', upload.single('file'), controller.bulkImport);

// Hierarchy & Tehsil-Blocks Mapping
router.get('/hierarchy', controller.getHierarchy);
router.get('/tehsil-blocks', controller.getTehsilBlocks);

// Categories
router.get('/categories', controller.getCategories);
router.post('/categories', controller.addCategory);
router.delete('/categories/:id', controller.deleteCategory);

// Tags
router.get('/tags', controller.getTags);
router.post('/tags', controller.addTag);
router.delete('/tags/:id', controller.deleteTag);

// Batch All
router.get('/all', controller.getAll);

module.exports = router;
