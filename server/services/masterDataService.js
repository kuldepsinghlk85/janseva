const { masterData, saveMasterData } = require('../data/masterData');
const xlsx = require('xlsx');

// Normalize any row keys from Excel, CSV, or manual JSON
function normalizeRow(row) {
  if (!row || typeof row !== 'object') return null;

  const normalized = {};
  for (const [key, val] of Object.entries(row)) {
    const cleanKey = String(key).trim().toLowerCase().replace(/[\s_-]+/g, '');
    normalized[cleanKey] = val !== undefined && val !== null ? String(val).trim() : '';
  }

  const state = normalized['state'] || normalized['राज्य'] || 'Uttar Pradesh';
  const district = normalized['district'] || normalized['जिला'] || 'Etawah';
  const assembly = normalized['assembly'] || normalized['विधानसभा'] || 'Etawah Assembly';
  const tehsil = normalized['tehsil'] || normalized['तहसील'] || 'Etawah';
  const block = normalized['block'] || normalized['विकासखंड'] || normalized['ब्लॉक'] || 'Barhpura';
  const village = normalized['village'] || normalized['particular'] || normalized['गाँव'] || normalized['ग्राम'] || normalized['क्षेत्र'] || normalized['वार्ड'] || '';
  const villageCategory = normalized['villagecategory'] || normalized['category'] || normalized['श्रेणी'] || 'Village';
  const sampleTag = normalized['sampletag'] || normalized['tag'] || normalized['टैग'] || 'Development';
  const pincode = normalized['pincode'] || normalized['पिनकोड'] || '';

  if (!village) return null;

  return {
    state,
    district,
    assembly,
    tehsil,
    block,
    village,
    villageCategory,
    sampleTag,
    pincode
  };
}

// =================== VILLAGES ===================
function getVillages(filters = {}) {
  let list = masterData.villages || [];

  if (filters.tehsil && filters.tehsil !== 'All') {
    list = list.filter(v => (v.tehsil || '').toLowerCase() === filters.tehsil.toLowerCase());
  }
  if (filters.block && filters.block !== 'All') {
    list = list.filter(v => (v.block || '').toLowerCase() === filters.block.toLowerCase());
  }
  if (filters.category && filters.category !== 'All') {
    list = list.filter(v => (v.villageCategory || '').toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(v => 
      (v.name && v.name.toLowerCase().includes(q)) ||
      (v.nameHi && v.nameHi.includes(q)) ||
      (v.block && v.block.toLowerCase().includes(q)) ||
      (v.tehsil && v.tehsil.toLowerCase().includes(q))
    );
  }

  return list;
}

function addVillage(data) {
  const nameHi = (data.nameHi || data.name || data.village || '').trim();
  if (!nameHi) return null;

  const rawSlug = (data.name || nameHi).toLowerCase().replace(/[^\w-]/g, '').replace(/-+/g, '-');
  const id = data.id || (rawSlug && rawSlug.length > 1 ? rawSlug : `vil-${Date.now().toString(36)}`);

  const existingIndex = (masterData.villages || []).findIndex(v => v.id === id || (v.nameHi === nameHi && v.block === data.block));
  if (existingIndex >= 0) {
    masterData.villages[existingIndex] = {
      ...masterData.villages[existingIndex],
      ...data,
      name: data.name || masterData.villages[existingIndex].name || nameHi,
      nameHi
    };
    saveMasterData();
    return masterData.villages[existingIndex];
  }

  const newVillage = {
    id,
    name: data.name || nameHi,
    nameHi,
    state: data.state || 'Uttar Pradesh',
    district: data.district || 'Etawah',
    assembly: data.assembly || 'Etawah Assembly',
    tehsil: data.tehsil || 'Etawah',
    block: data.block || 'Barhpura',
    villageCategory: data.villageCategory || 'Village',
    sampleTag: data.sampleTag || 'Development',
    pincode: data.pincode || '206001'
  };

  masterData.villages.push(newVillage);
  saveMasterData();
  return newVillage;
}

function updateVillage(villageId, data) {
  const index = (masterData.villages || []).findIndex(v => v.id === villageId || v.nameHi === villageId);
  if (index === -1) return null;

  masterData.villages[index] = {
    ...masterData.villages[index],
    name: data.name || data.village || masterData.villages[index].name,
    nameHi: data.nameHi || data.name || data.village || masterData.villages[index].nameHi,
    state: data.state || masterData.villages[index].state || 'Uttar Pradesh',
    district: data.district || masterData.villages[index].district || 'Etawah',
    assembly: data.assembly || masterData.villages[index].assembly || 'Etawah Assembly',
    tehsil: data.tehsil || masterData.villages[index].tehsil || 'Etawah',
    block: data.block || masterData.villages[index].block || 'Barhpura',
    villageCategory: data.villageCategory || masterData.villages[index].villageCategory || 'Village',
    sampleTag: data.sampleTag || masterData.villages[index].sampleTag || 'Development',
    pincode: data.pincode !== undefined ? data.pincode : masterData.villages[index].pincode
  };

  saveMasterData();
  return masterData.villages[index];
}

function deleteVillage(villageId) {
  const index = (masterData.villages || []).findIndex(v => v.id === villageId || v.nameHi === villageId);
  if (index === -1) return false;
  masterData.villages.splice(index, 1);
  saveMasterData();
  return true;
}

function clearAllVillages() {
  masterData.villages = [];
  saveMasterData();
  return true;
}

// =================== BULK IMPORT ===================
function bulkImport(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { success: false, message: 'No rows provided', added: 0, updated: 0 };
  }

  let added = 0;
  let updated = 0;

  rows.forEach(r => {
    const item = normalizeRow(r);
    if (!item) return;

    const slug = item.village.toLowerCase().replace(/[^\w-]/g, '').replace(/-+/g, '-');
    const blockSlug = item.block.toLowerCase().replace(/[^\w-]/g, '');
    const id = slug && slug.length > 1 ? `${slug}-${blockSlug}` : `vil-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;

    const existingIndex = (masterData.villages || []).findIndex(v => 
      v.id === id || 
      (v.name && v.name.toLowerCase() === item.village.toLowerCase() && v.block && v.block.toLowerCase() === item.block.toLowerCase())
    );

    const record = {
      id: existingIndex >= 0 ? masterData.villages[existingIndex].id : id,
      name: item.village,
      nameHi: item.village,
      state: item.state,
      district: item.district,
      assembly: item.assembly,
      tehsil: item.tehsil,
      block: item.block,
      villageCategory: item.villageCategory,
      sampleTag: item.sampleTag,
      pincode: item.pincode || (existingIndex >= 0 ? masterData.villages[existingIndex].pincode : '')
    };

    if (existingIndex >= 0) {
      masterData.villages[existingIndex] = { ...masterData.villages[existingIndex], ...record };
      updated++;
    } else {
      masterData.villages.push(record);
      added++;
    }

    // Auto-create category if new
    if (item.villageCategory) {
      const catExists = (masterData.categories || []).find(c => c.name.toLowerCase() === item.villageCategory.toLowerCase() || c.nameHi === item.villageCategory);
      if (!catExists) {
        masterData.categories.push({
          id: item.villageCategory.toLowerCase().replace(/[^\w-]/g, '-'),
          name: item.villageCategory,
          nameHi: item.villageCategory,
          type: 'both',
          color: 'blue'
        });
      }
    }

    // Auto-create tag if new
    if (item.sampleTag) {
      const tagExists = (masterData.tags || []).find(t => t.name.toLowerCase() === item.sampleTag.toLowerCase());
      if (!tagExists) {
        masterData.tags.push({
          id: item.sampleTag.toLowerCase().replace(/[^\w-]/g, '-'),
          name: item.sampleTag,
          count: 1
        });
      } else {
        tagExists.count = (tagExists.count || 0) + 1;
      }
    }
  });

  saveMasterData();
  const hierarchy = getHierarchy();

  return {
    success: true,
    added,
    updated,
    totalVillages: (masterData.villages || []).length,
    hierarchy
  };
}

// Parse Excel buffer directly
function parseExcelBuffer(buffer) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
  return rows;
}

// =================== HIERARCHY ===================
function getTehsilBlocks() {
  return masterData.tehsilBlocks || [];
}

function getHierarchy() {
  const tehsilsMap = {};
  const blocksMap = {};
  const statesSet = new Set(['Uttar Pradesh']);
  const districtsSet = new Set(['Etawah']);
  const assembliesSet = new Set(['Etawah Assembly']);
  const categoriesSet = new Set();
  const tagsSet = new Set();

  // 1. Seed with official Tehsil-Block master mapping
  (masterData.tehsilBlocks || []).forEach(tb => {
    districtsSet.add(tb.district || 'Etawah');

    if (!tehsilsMap[tb.tehsil]) {
      tehsilsMap[tb.tehsil] = {
        name: tb.tehsil,
        nameHi: tb.tehsilHi || tb.tehsil,
        district: tb.district || 'Etawah',
        blocks: {},
        villageCount: 0
      };
    }
    if (!tehsilsMap[tb.tehsil].blocks[tb.block]) {
      tehsilsMap[tb.tehsil].blocks[tb.block] = {
        name: tb.block,
        nameHi: tb.blockHi || tb.block,
        tehsil: tb.tehsil,
        villageCount: 0
      };
    }

    if (!blocksMap[tb.block]) {
      blocksMap[tb.block] = {
        name: tb.block,
        nameHi: tb.blockHi || tb.block,
        tehsil: tb.tehsil,
        district: tb.district || 'Etawah',
        villageCount: 0
      };
    }
  });

  // 2. Aggregate actual villages counts
  (masterData.villages || []).forEach(v => {
    const state = v.state || 'Uttar Pradesh';
    const district = v.district || 'Etawah';
    const assembly = v.assembly || 'Etawah Assembly';
    const tehsil = v.tehsil || 'Etawah';
    const block = v.block || 'Barhpura';
    const cat = v.villageCategory || 'Village';
    const tag = v.sampleTag || 'Development';

    statesSet.add(state);
    districtsSet.add(district);
    assembliesSet.add(assembly);
    categoriesSet.add(cat);
    tagsSet.add(tag);

    if (!tehsilsMap[tehsil]) {
      tehsilsMap[tehsil] = {
        name: tehsil,
        district,
        blocks: {},
        villageCount: 0
      };
    }
    tehsilsMap[tehsil].villageCount++;

    if (!tehsilsMap[tehsil].blocks[block]) {
      tehsilsMap[tehsil].blocks[block] = {
        name: block,
        tehsil,
        villageCount: 0
      };
    }
    tehsilsMap[tehsil].blocks[block].villageCount++;

    if (!blocksMap[block]) {
      blocksMap[block] = {
        name: block,
        tehsil,
        district,
        villageCount: 0
      };
    }
    blocksMap[block].villageCount++;
  });

  const tehsils = Object.values(tehsilsMap).map(t => ({
    name: t.name,
    district: t.district,
    villageCount: t.villageCount,
    blocks: Object.values(t.blocks)
  }));

  const blocks = Object.values(blocksMap);

  return {
    states: Array.from(statesSet),
    districts: Array.from(districtsSet),
    assemblies: Array.from(assembliesSet),
    tehsils,
    blocks,
    categories: Array.from(categoriesSet),
    tags: Array.from(tagsSet),
    totalVillages: (masterData.villages || []).length
  };
}

// =================== CATEGORIES ===================
function getCategories(type = 'all') {
  if (type === 'all') return masterData.categories || [];
  return (masterData.categories || []).filter(c => c.type === type || c.type === 'both');
}

function addCategory(data) {
  const nameHi = (data.nameHi || data.name || '').trim();
  if (!nameHi) return null;

  const rawSlug = (data.id || data.name || nameHi).replace(/[^\w-]/g, '').replace(/-+/g, '-');
  const id = data.id || (rawSlug && rawSlug.length > 1 ? rawSlug : `cat-${Date.now().toString(36)}`);

  const existing = (masterData.categories || []).find(c => c.id === id || c.nameHi === nameHi);
  if (existing) return existing;

  const newCategory = {
    id,
    name: data.name || nameHi,
    nameHi,
    type: data.type || 'both',
    color: data.color || 'orange'
  };

  masterData.categories.push(newCategory);
  saveMasterData();
  return newCategory;
}

function deleteCategory(categoryId) {
  const index = (masterData.categories || []).findIndex(c => c.id === categoryId || c.nameHi === categoryId);
  if (index === -1) return false;
  masterData.categories.splice(index, 1);
  saveMasterData();
  return true;
}

// =================== TAGS ===================
function getTags() {
  return masterData.tags || [];
}

function addTag(data) {
  const rawName = typeof data === 'string' ? data : (data.name || '');
  const name = rawName.replace(/^#/, '').trim();
  if (!name) return null;

  const rawSlug = name.toLowerCase().replace(/[^\w-]/g, '').replace(/-+/g, '-');
  const id = (rawSlug && rawSlug.length > 1 ? rawSlug : `tag-${Date.now().toString(36)}`);

  const existing = (masterData.tags || []).find(t => t.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.count = (existing.count || 0) + 1;
    saveMasterData();
    return existing;
  }

  const newTag = {
    id,
    name,
    count: 1
  };

  masterData.tags.push(newTag);
  saveMasterData();
  return newTag;
}

function deleteTag(tagId) {
  const index = (masterData.tags || []).findIndex(t => t.id === tagId || t.name.toLowerCase() === tagId.toLowerCase());
  if (index === -1) return false;
  masterData.tags.splice(index, 1);
  saveMasterData();
  return true;
}

function getAllMasterData() {
  return {
    ...masterData,
    hierarchy: getHierarchy()
  };
}

module.exports = {
  getVillages,
  addVillage,
  updateVillage,
  deleteVillage,
  clearAllVillages,
  bulkImport,
  parseExcelBuffer,
  getHierarchy,
  getTehsilBlocks,
  getCategories,
  addCategory,
  deleteCategory,
  getTags,
  addTag,
  deleteTag,
  getAllMasterData
};
