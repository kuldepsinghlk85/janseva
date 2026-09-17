const masterService = require('../services/masterDataService');

// Villages
function getVillages(req, res) {
  const { tehsil, block, category, search } = req.query;
  const villages = masterService.getVillages({ tehsil, block, category, search });
  res.json({ success: true, count: villages.length, data: villages, villages });
}

function addVillage(req, res) {
  const village = masterService.addVillage(req.body);
  if (!village) {
    return res.status(400).json({ success: false, message: 'Village name is required' });
  }
  res.status(201).json({ success: true, message: 'Village added successfully', data: village, village });
}

function updateVillage(req, res) {
  const village = masterService.updateVillage(req.params.id, req.body);
  if (!village) {
    return res.status(404).json({ success: false, message: 'Village not found' });
  }
  res.json({ success: true, message: 'Village updated successfully', data: village, village });
}

function deleteVillage(req, res) {
  const success = masterService.deleteVillage(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Village not found' });
  }
  res.json({ success: true, message: 'Village deleted successfully' });
}

function clearAllVillages(req, res) {
  masterService.clearAllVillages();
  res.json({ success: true, message: 'All villages cleared' });
}

// Bulk Import (JSON array or Excel File)
function bulkImport(req, res) {
  try {
    let rows = [];

    if (req.file) {
      rows = masterService.parseExcelBuffer(req.file.buffer);
    } else if (req.body && Array.isArray(req.body.rows)) {
      rows = req.body.rows;
    } else if (Array.isArray(req.body)) {
      rows = req.body;
    }

    if (!rows || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No rows detected in upload' });
    }

    const result = masterService.bulkImport(rows);
    res.json({
      success: true,
      message: `सफलतापूर्वक आयातित: ${result.added} नए जोड़े गए, ${result.updated} अपडेट किए गए।`,
      ...result
    });
  } catch (err) {
    console.error('Error in bulk import:', err);
    res.status(500).json({ success: false, message: 'Excel import failed: ' + err.message });
  }
}

// Hierarchy
function getHierarchy(req, res) {
  const hierarchy = masterService.getHierarchy();
  res.json({ success: true, data: hierarchy });
}

// Official Tehsil-Blocks Mapping
function getTehsilBlocks(req, res) {
  const tehsilBlocks = masterService.getTehsilBlocks();
  res.json({ success: true, count: tehsilBlocks.length, data: tehsilBlocks });
}

// Categories
function getCategories(req, res) {
  const type = req.query.type || 'all';
  const categories = masterService.getCategories(type);
  res.json({ success: true, count: categories.length, data: categories, categories });
}

function addCategory(req, res) {
  const category = masterService.addCategory(req.body);
  if (!category) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }
  res.status(201).json({ success: true, message: 'Category added successfully', data: category, category });
}

function deleteCategory(req, res) {
  const success = masterService.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, message: 'Category deleted successfully' });
}

// Tags
function getTags(req, res) {
  const tags = masterService.getTags();
  res.json({ success: true, count: tags.length, data: tags, tags });
}

function addTag(req, res) {
  const tag = masterService.addTag(req.body);
  if (!tag) {
    return res.status(400).json({ success: false, message: 'Tag name is required' });
  }
  res.status(201).json({ success: true, message: 'Tag added successfully', data: tag, tag });
}

function deleteTag(req, res) {
  const success = masterService.deleteTag(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Tag not found' });
  }
  res.json({ success: true, message: 'Tag deleted successfully' });
}

// Batch All
function getAll(req, res) {
  res.json({ success: true, data: masterService.getAllMasterData() });
}

module.exports = {
  getVillages,
  addVillage,
  updateVillage,
  deleteVillage,
  clearAllVillages,
  bulkImport,
  getHierarchy,
  getTehsilBlocks,
  getCategories,
  addCategory,
  deleteCategory,
  getTags,
  addTag,
  deleteTag,
  getAll
};
