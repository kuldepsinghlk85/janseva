const locationService = require('../services/locationService');

// Dashboard & Intelligence
exports.getDashboardKPIs = (req, res) => {
  try {
    const kpis = locationService.getDashboardKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHierarchy = (req, res) => {
  try {
    const tree = locationService.getHierarchy();
    res.json({ success: true, data: tree });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchLocation = (req, res) => {
  try {
    const query = req.query.q || '';
    const results = locationService.searchLocation(query);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Assembly
exports.getAssemblies = (req, res) => {
  try {
    const data = locationService.getAllAssemblies();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAssembly = (req, res) => {
  try {
    const item = locationService.createAssembly(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAssembly = (req, res) => {
  try {
    const item = locationService.updateAssembly(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Assembly not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAssembly = (req, res) => {
  try {
    const ok = locationService.deleteAssembly(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Assembly not found' });
    res.json({ success: true, message: 'Assembly deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Tehsil
exports.getTehsils = (req, res) => {
  try {
    const data = locationService.getAllTehsils();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTehsil = (req, res) => {
  try {
    const item = locationService.createTehsil(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTehsil = (req, res) => {
  try {
    const item = locationService.updateTehsil(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Tehsil not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTehsil = (req, res) => {
  try {
    const ok = locationService.deleteTehsil(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Tehsil not found' });
    res.json({ success: true, message: 'Tehsil deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Block
exports.getBlocks = (req, res) => {
  try {
    const data = locationService.getAllBlocks(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBlock = (req, res) => {
  try {
    const item = locationService.createBlock(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBlock = (req, res) => {
  try {
    const item = locationService.updateBlock(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Block not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBlock = (req, res) => {
  try {
    const ok = locationService.deleteBlock(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Block not found' });
    res.json({ success: true, message: 'Block deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Gram Panchayat
exports.getGramPanchayats = (req, res) => {
  try {
    const data = locationService.getAllGramPanchayats(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createGramPanchayat = (req, res) => {
  try {
    const item = locationService.createGramPanchayat(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateGramPanchayat = (req, res) => {
  try {
    const item = locationService.updateGramPanchayat(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Gram Panchayat not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteGramPanchayat = (req, res) => {
  try {
    const ok = locationService.deleteGramPanchayat(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Gram Panchayat not found' });
    res.json({ success: true, message: 'Gram Panchayat deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Village
exports.getVillages = (req, res) => {
  try {
    const data = locationService.getAllVillages(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVillageById = (req, res) => {
  try {
    const item = locationService.getVillageById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Village not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVillage = (req, res) => {
  try {
    const item = locationService.createVillage(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVillage = (req, res) => {
  try {
    const item = locationService.updateVillage(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Village not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteVillage = (req, res) => {
  try {
    const ok = locationService.deleteVillage(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Village not found' });
    res.json({ success: true, message: 'Village deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Booth
exports.getBooths = (req, res) => {
  try {
    const data = locationService.getAllBooths(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBooth = (req, res) => {
  try {
    const item = locationService.createBooth(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBooth = (req, res) => {
  try {
    const item = locationService.updateBooth(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Booth not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBooth = (req, res) => {
  try {
    const ok = locationService.deleteBooth(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Booth not found' });
    res.json({ success: true, message: 'Booth deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GPS
exports.getGpsPoints = (req, res) => {
  try {
    const data = locationService.getAllGpsPoints(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createGpsPoint = (req, res) => {
  try {
    const item = locationService.createGpsPoint(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateGpsPoint = (req, res) => {
  try {
    const item = locationService.updateGpsPoint(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'GPS point not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteGpsPoint = (req, res) => {
  try {
    const ok = locationService.deleteGpsPoint(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'GPS point not found' });
    res.json({ success: true, message: 'GPS point deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Development
exports.getDevelopments = (req, res) => {
  try {
    const data = locationService.getAllDevelopments(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDevelopment = (req, res) => {
  try {
    const item = locationService.createDevelopment(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDevelopment = (req, res) => {
  try {
    const item = locationService.updateDevelopment(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Development work not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDevelopment = (req, res) => {
  try {
    const ok = locationService.deleteDevelopment(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Development work not found' });
    res.json({ success: true, message: 'Development work deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Excel Import
exports.importExcel = (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'Please upload an Excel file (.xlsx or .xls)' });
    }
    const rows = locationService.parseExcelBuffer(req.file.buffer);
    const result = locationService.importLocationExcel(rows);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Excel Export
exports.exportExcel = (req, res) => {
  try {
    const buffer = locationService.generateExportExcel();
    res.setHeader('Content-Disposition', 'attachment; filename="Etawah_Constituency_Master.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
