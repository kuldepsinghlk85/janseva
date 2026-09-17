const express = require('express');
const router = express.Router();
const multer = require('multer');
const locationController = require('../controllers/locationController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

// Dashboard & Overview
router.get('/dashboard-kpi', locationController.getDashboardKPIs);
router.get('/hierarchy', locationController.getHierarchy);
router.get('/search', locationController.searchLocation);

// Assembly
router.get('/assembly', locationController.getAssemblies);
router.post('/assembly', locationController.createAssembly);
router.put('/assembly/:id', locationController.updateAssembly);
router.delete('/assembly/:id', locationController.deleteAssembly);

// Tehsil
router.get('/tehsil', locationController.getTehsils);
router.post('/tehsil', locationController.createTehsil);
router.put('/tehsil/:id', locationController.updateTehsil);
router.delete('/tehsil/:id', locationController.deleteTehsil);

// Block
router.get('/block', locationController.getBlocks);
router.post('/block', locationController.createBlock);
router.put('/block/:id', locationController.updateBlock);
router.delete('/block/:id', locationController.deleteBlock);

// Gram Panchayat
router.get('/gram-panchayat', locationController.getGramPanchayats);
router.post('/gram-panchayat', locationController.createGramPanchayat);
router.put('/gram-panchayat/:id', locationController.updateGramPanchayat);
router.delete('/gram-panchayat/:id', locationController.deleteGramPanchayat);

// Village
router.get('/village', locationController.getVillages);
router.get('/village/:id', locationController.getVillageById);
router.post('/village', locationController.createVillage);
router.put('/village/:id', locationController.updateVillage);
router.delete('/village/:id', locationController.deleteVillage);

// Booth
router.get('/booth', locationController.getBooths);
router.post('/booth', locationController.createBooth);
router.put('/booth/:id', locationController.updateBooth);
router.delete('/booth/:id', locationController.deleteBooth);

// GPS
router.get('/gps', locationController.getGpsPoints);
router.post('/gps', locationController.createGpsPoint);
router.put('/gps/:id', locationController.updateGpsPoint);
router.delete('/gps/:id', locationController.deleteGpsPoint);

// Development
router.get('/development', locationController.getDevelopments);
router.post('/development', locationController.createDevelopment);
router.put('/development/:id', locationController.updateDevelopment);
router.delete('/development/:id', locationController.deleteDevelopment);

// Excel Import & Export
router.post('/import-excel', upload.single('file'), locationController.importExcel);
router.get('/export-excel', locationController.exportExcel);

module.exports = router;
