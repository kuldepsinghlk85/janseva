const xlsx = require('xlsx');

// Import all 8 masters
const { assemblies, saveAssemblies } = require('../data/assemblyMaster');
const { tehsils, saveTehsils } = require('../data/tehsilMaster');
const { blocks, saveBlocks } = require('../data/blockMaster');
const { gramPanchayats, saveGramPanchayats } = require('../data/gramPanchayatMaster');
const { villages, saveVillages } = require('../data/villageMaster');
const { booths, saveBooths } = require('../data/boothMaster');
const { gpsPoints, saveGpsPoints } = require('../data/gpsMaster');
const { developments, saveDevelopments } = require('../data/developmentMapping');

// ======================== DASHBOARD KPIS ========================
function getDashboardKPIs() {
  const totalVillages = villages.length;
  const totalBooths = booths.length;
  const totalGps = gpsPoints.length;
  const totalDevs = developments.length;
  const totalBlocks = blocks.length;
  const totalTehsils = tehsils.length;
  const totalGPs = gramPanchayats.length;

  const totalVoters = booths.reduce((acc, b) => acc + (parseInt(b.totalVoters, 10) || 0), 0);

  const statusCounts = {
    completed: developments.filter(d => (d.status || '').toLowerCase() === 'completed').length,
    inProgress: developments.filter(d => (d.status || '').toLowerCase().includes('progress')).length,
    sanctioned: developments.filter(d => (d.status || '').toLowerCase().includes('sanctioned')).length
  };

  return {
    totalAssemblies: assemblies.length,
    totalTehsils,
    totalBlocks,
    totalGramPanchayats: totalGPs,
    totalVillages,
    totalBooths,
    totalGpsPoints: totalGps,
    totalDevelopments: totalDevs,
    totalVoters,
    developmentStatusCounts: statusCounts
  };
}

// ======================== HIERARCHY TREE ========================
function getHierarchy() {
  const result = assemblies.map(asm => {
    const asmTehsils = tehsils.filter(t => 
      t.assemblyId === asm.id || 
      (t.assembly && t.assembly.toLowerCase().includes((asm.assemblyName || '').toLowerCase())) || 
      (!t.assemblyId && (t.district || 'Etawah').toLowerCase() === (asm.district || 'Etawah').toLowerCase())
    );

    return {
      id: asm.id,
      name: asm.assemblyName,
      number: asm.assemblyCode || asm.assemblyNumber || 200,
      district: asm.district,
      state: asm.state,
      tehsils: asmTehsils.map(t => {
        const tBlocks = blocks.filter(b => 
          b.tehsilId === t.id || 
          (b.tehsil && b.tehsil.toLowerCase() === t.name.toLowerCase())
        );

        return {
          id: t.id,
          name: t.name,
          nameHi: t.nameHi || t.name,
          blocks: tBlocks.map(b => {
            const bName = b.blockName || b.name;
            const bGPs = gramPanchayats.filter(gp => 
              gp.blockId === b.id || 
              (gp.block && gp.block.toLowerCase() === bName.toLowerCase())
            );
            const bVillages = villages.filter(v => 
              (v.block || '').toLowerCase() === bName.toLowerCase()
            );

            return {
              id: b.id,
              name: bName,
              nameHi: b.blockNameHi || bName,
              gramPanchayats: bGPs.map(gp => {
                const gpVillages = villages.filter(v => 
                  (v.gramPanchayat || '').toLowerCase().includes(gp.name.toLowerCase())
                );
                return {
                  id: gp.id,
                  name: gp.name,
                  nameHi: gp.nameHi || gp.name,
                  villagesCount: gpVillages.length
                };
              }),
              villagesCount: bVillages.length
            };
          })
        };
      })
    };
  });
  return result;
}

// ======================== GLOBAL SEARCH ========================
function searchLocation(query) {
  if (!query || typeof query !== 'string') return { villages: [], booths: [], developments: [], gps: [] };
  const q = query.trim().toLowerCase();

  const matchedVillages = villages.filter(v =>
    (v.villageName && v.villageName.toLowerCase().includes(q)) ||
    (v.villageCode && v.villageCode.toLowerCase().includes(q)) ||
    (v.block && v.block.toLowerCase().includes(q)) ||
    (v.tehsil && v.tehsil.toLowerCase().includes(q)) ||
    (v.gramPanchayat && v.gramPanchayat.toLowerCase().includes(q)) ||
    (Array.isArray(v.tags) && v.tags.some(tag => tag.toLowerCase().includes(q)))
  );

  const matchedBooths = booths.filter(b =>
    (b.boothNumber && String(b.boothNumber).includes(q)) ||
    (b.pollingStationName && b.pollingStationName.toLowerCase().includes(q)) ||
    (b.villageName && b.villageName.toLowerCase().includes(q)) ||
    (b.address && b.address.toLowerCase().includes(q)) ||
    (b.sectorOfficer && b.sectorOfficer.toLowerCase().includes(q)) ||
    (b.bloName && b.bloName.toLowerCase().includes(q))
  );

  const matchedDevs = developments.filter(d =>
    (d.title && d.title.toLowerCase().includes(q)) ||
    (d.villageName && d.villageName.toLowerCase().includes(q)) ||
    (d.category && d.category.toLowerCase().includes(q)) ||
    (d.status && d.status.toLowerCase().includes(q)) ||
    (d.contractor && d.contractor.toLowerCase().includes(q)) ||
    (d.description && d.description.toLowerCase().includes(q)) ||
    (Array.isArray(d.tags) && d.tags.some(tag => tag.toLowerCase().includes(q)))
  );

  const matchedGps = gpsPoints.filter(g =>
    (g.title && g.title.toLowerCase().includes(q)) ||
    (g.category && g.category.toLowerCase().includes(q)) ||
    (g.locationType && g.locationType.toLowerCase().includes(q)) ||
    (g.address && g.address.toLowerCase().includes(q))
  );

  return {
    query,
    totalMatches: matchedVillages.length + matchedBooths.length + matchedDevs.length + matchedGps.length,
    villages: matchedVillages,
    booths: matchedBooths,
    developments: matchedDevs,
    gpsPoints: matchedGps
  };
}

// ======================== ASSEMBLY CRUD ========================
function getAllAssemblies() {
  return assemblies;
}

function getAssemblyById(id) {
  return assemblies.find(a => a.id === Number(id));
}

function createAssembly(data) {
  const newId = assemblies.length > 0 ? Math.max(...assemblies.map(a => a.id)) + 1 : 1;
  const newAssembly = {
    id: newId,
    assemblyName: data.assemblyName || 'Etawah',
    assemblyNumber: data.assemblyNumber || 200,
    state: data.state || 'Uttar Pradesh',
    district: data.district || 'Etawah',
    totalVoters: data.totalVoters || 0,
    totalBooths: data.totalBooths || 0,
    totalVillages: data.totalVillages || 0,
    currentMla: data.currentMla || 'Sarita Bhadauria'
  };
  assemblies.push(newAssembly);
  saveAssemblies();
  return newAssembly;
}

function updateAssembly(id, data) {
  const index = assemblies.findIndex(a => a.id === Number(id));
  if (index === -1) return null;
  assemblies[index] = { ...assemblies[index], ...data, id: Number(id) };
  saveAssemblies();
  return assemblies[index];
}

function deleteAssembly(id) {
  const index = assemblies.findIndex(a => a.id === Number(id));
  if (index === -1) return false;
  assemblies.splice(index, 1);
  saveAssemblies();
  return true;
}

// ======================== TEHSIL CRUD ========================
function getAllTehsils() {
  return tehsils;
}

function createTehsil(data) {
  const newId = tehsils.length > 0 ? Math.max(...tehsils.map(t => t.id)) + 1 : 1;
  const newTehsil = {
    id: newId,
    name: data.name,
    assemblyId: data.assemblyId || 1,
    assembly: data.assembly || 'Etawah',
    district: data.district || 'Etawah',
    state: data.state || 'Uttar Pradesh'
  };
  tehsils.push(newTehsil);
  saveTehsils();
  return newTehsil;
}

function updateTehsil(id, data) {
  const idx = tehsils.findIndex(t => t.id === Number(id));
  if (idx === -1) return null;
  tehsils[idx] = { ...tehsils[idx], ...data, id: Number(id) };
  saveTehsils();
  return tehsils[idx];
}

function deleteTehsil(id) {
  const idx = tehsils.findIndex(t => t.id === Number(id));
  if (idx === -1) return false;
  tehsils.splice(idx, 1);
  saveTehsils();
  return true;
}

// ======================== BLOCK CRUD ========================
function getAllBlocks(filters = {}) {
  let list = blocks;
  if (filters.tehsil && filters.tehsil !== 'All') {
    list = list.filter(b => (b.tehsil || '').toLowerCase() === filters.tehsil.toLowerCase());
  }
  return list;
}

function createBlock(data) {
  const newId = blocks.length > 0 ? Math.max(...blocks.map(b => b.id)) + 1 : 1;
  const newBlock = {
    id: newId,
    name: data.name,
    tehsilId: data.tehsilId || 1,
    tehsil: data.tehsil || 'Etawah',
    assembly: data.assembly || 'Etawah',
    district: data.district || 'Etawah',
    state: data.state || 'Uttar Pradesh'
  };
  blocks.push(newBlock);
  saveBlocks();
  return newBlock;
}

function updateBlock(id, data) {
  const idx = blocks.findIndex(b => b.id === Number(id));
  if (idx === -1) return null;
  blocks[idx] = { ...blocks[idx], ...data, id: Number(id) };
  saveBlocks();
  return blocks[idx];
}

function deleteBlock(id) {
  const idx = blocks.findIndex(b => b.id === Number(id));
  if (idx === -1) return false;
  blocks.splice(idx, 1);
  saveBlocks();
  return true;
}

// ======================== GRAM PANCHAYAT CRUD ========================
function getAllGramPanchayats(filters = {}) {
  let list = gramPanchayats;
  if (filters.block && filters.block !== 'All') {
    list = list.filter(gp => (gp.block || '').toLowerCase() === filters.block.toLowerCase());
  }
  if (filters.tehsil && filters.tehsil !== 'All') {
    list = list.filter(gp => (gp.tehsil || '').toLowerCase() === filters.tehsil.toLowerCase());
  }
  return list;
}

function createGramPanchayat(data) {
  const newId = gramPanchayats.length > 0 ? Math.max(...gramPanchayats.map(g => g.id)) + 1 : 1;
  const newGP = {
    id: newId,
    name: data.name,
    blockId: data.blockId || 1,
    block: data.block || 'Barhpura',
    tehsil: data.tehsil || 'Etawah',
    district: data.district || 'Etawah',
    state: data.state || 'Uttar Pradesh',
    pradhanName: data.pradhanName || '',
    pradhanPhone: data.pradhanPhone || '',
    sachivName: data.sachivName || '',
    sachivPhone: data.sachivPhone || ''
  };
  gramPanchayats.push(newGP);
  saveGramPanchayats();
  return newGP;
}

function updateGramPanchayat(id, data) {
  const idx = gramPanchayats.findIndex(g => g.id === Number(id));
  if (idx === -1) return null;
  gramPanchayats[idx] = { ...gramPanchayats[idx], ...data, id: Number(id) };
  saveGramPanchayats();
  return gramPanchayats[idx];
}

function deleteGramPanchayat(id) {
  const idx = gramPanchayats.findIndex(g => g.id === Number(id));
  if (idx === -1) return false;
  gramPanchayats.splice(idx, 1);
  saveGramPanchayats();
  return true;
}

// ======================== VILLAGE CRUD ========================
function getAllVillages(filters = {}) {
  let list = villages;
  if (filters.block && filters.block !== 'All') {
    list = list.filter(v => (v.block || '').toLowerCase() === filters.block.toLowerCase());
  }
  if (filters.tehsil && filters.tehsil !== 'All') {
    list = list.filter(v => (v.tehsil || '').toLowerCase() === filters.tehsil.toLowerCase());
  }
  if (filters.gramPanchayat && filters.gramPanchayat !== 'All') {
    list = list.filter(v => (v.gramPanchayat || '').toLowerCase().includes(filters.gramPanchayat.toLowerCase()));
  }
  return list;
}

function getVillageById(id) {
  const village = villages.find(v => v.id === Number(id));
  if (!village) return null;
  const villageBooths = booths.filter(b => b.villageId === Number(id));
  const villageDevs = developments.filter(d => d.villageId === Number(id));
  const villageGps = gpsPoints.filter(g => g.villageId === Number(id));
  return {
    ...village,
    booths: villageBooths,
    developmentWorks: villageDevs,
    gpsPoints: villageGps
  };
}

function createVillage(data) {
  const newId = villages.length > 0 ? Math.max(...villages.map(v => v.id)) + 1 : 1;
  const newVillage = {
    id: newId,
    state: data.state || 'Uttar Pradesh',
    district: data.district || 'Etawah',
    assembly: data.assembly || 'Etawah',
    tehsil: data.tehsil || 'Etawah',
    block: data.block || 'Barhpura',
    gramPanchayat: data.gramPanchayat || '',
    villageName: data.villageName,
    villageCode: data.villageCode || `UP${123450 + newId}`,
    latitude: data.latitude || '26.7850',
    longitude: data.longitude || '79.0210',
    population: data.population || '1000',
    tags: Array.isArray(data.tags) ? data.tags : ['Village', 'Development']
  };
  villages.push(newVillage);
  saveVillages();

  // Also auto-add GPS point
  if (newVillage.latitude && newVillage.longitude) {
    const gpsId = gpsPoints.length > 0 ? Math.max(...gpsPoints.map(g => g.id)) + 1 : 1;
    gpsPoints.push({
      id: gpsId,
      locationType: 'village',
      title: `${newVillage.villageName} Village Center`,
      category: 'Village',
      address: `${newVillage.villageName}, ${newVillage.block}, Etawah`,
      latitude: newVillage.latitude,
      longitude: newVillage.longitude,
      villageId: newId,
      icon: 'village'
    });
    saveGpsPoints();
  }

  return newVillage;
}

function updateVillage(id, data) {
  const idx = villages.findIndex(v => v.id === Number(id));
  if (idx === -1) return null;
  villages[idx] = { ...villages[idx], ...data, id: Number(id) };
  saveVillages();
  return villages[idx];
}

function deleteVillage(id) {
  const idx = villages.findIndex(v => v.id === Number(id));
  if (idx === -1) return false;
  villages.splice(idx, 1);
  saveVillages();
  return true;
}

// ======================== BOOTH CRUD ========================
function getAllBooths(filters = {}) {
  let list = booths;
  if (filters.villageId) {
    list = list.filter(b => b.villageId === Number(filters.villageId));
  }
  if (filters.boothNumber) {
    list = list.filter(b => String(b.boothNumber) === String(filters.boothNumber));
  }
  return list;
}

function createBooth(data) {
  const newId = booths.length > 0 ? Math.max(...booths.map(b => b.id)) + 1 : 1;
  const newBooth = {
    id: newId,
    assemblyId: data.assemblyId || 1,
    assembly: data.assembly || 'Etawah',
    boothNumber: String(data.boothNumber || newId + 100),
    pollingStationName: data.pollingStationName || `Primary School Booth ${newId}`,
    villageId: data.villageId ? Number(data.villageId) : null,
    villageName: data.villageName || '',
    address: data.address || '',
    latitude: data.latitude || '26.7850',
    longitude: data.longitude || '79.0210',
    totalVoters: Number(data.totalVoters) || 0,
    maleVoters: Number(data.maleVoters) || 0,
    femaleVoters: Number(data.femaleVoters) || 0,
    sectorOfficer: data.sectorOfficer || '',
    bloName: data.bloName || ''
  };
  booths.push(newBooth);
  saveBooths();

  // Auto add to GPS points
  if (newBooth.latitude && newBooth.longitude) {
    const gpsId = gpsPoints.length > 0 ? Math.max(...gpsPoints.map(g => g.id)) + 1 : 1;
    gpsPoints.push({
      id: gpsId,
      locationType: 'booth',
      title: `Booth ${newBooth.boothNumber} - ${newBooth.pollingStationName}`,
      category: 'Polling Station',
      address: newBooth.address || newBooth.pollingStationName,
      latitude: newBooth.latitude,
      longitude: newBooth.longitude,
      boothNumber: newBooth.boothNumber,
      villageId: newBooth.villageId,
      icon: 'booth'
    });
    saveGpsPoints();
  }

  return newBooth;
}

function updateBooth(id, data) {
  const idx = booths.findIndex(b => b.id === Number(id));
  if (idx === -1) return null;
  booths[idx] = { ...booths[idx], ...data, id: Number(id) };
  saveBooths();
  return booths[idx];
}

function deleteBooth(id) {
  const idx = booths.findIndex(b => b.id === Number(id));
  if (idx === -1) return false;
  booths.splice(idx, 1);
  saveBooths();
  return true;
}

// ======================== GPS CRUD ========================
function getAllGpsPoints(filters = {}) {
  let list = gpsPoints;
  if (filters.locationType && filters.locationType !== 'All') {
    list = list.filter(g => g.locationType === filters.locationType);
  }
  return list;
}

function createGpsPoint(data) {
  const newId = gpsPoints.length > 0 ? Math.max(...gpsPoints.map(g => g.id)) + 1 : 1;
  const newPoint = {
    id: newId,
    locationType: data.locationType || 'custom',
    title: data.title,
    category: data.category || 'General',
    address: data.address || '',
    latitude: String(data.latitude),
    longitude: String(data.longitude),
    villageId: data.villageId ? Number(data.villageId) : null,
    boothNumber: data.boothNumber || null,
    status: data.status || '',
    budget: data.budget || '',
    description: data.description || '',
    icon: data.icon || data.locationType || 'marker'
  };
  gpsPoints.push(newPoint);
  saveGpsPoints();
  return newPoint;
}

function updateGpsPoint(id, data) {
  const idx = gpsPoints.findIndex(g => g.id === Number(id));
  if (idx === -1) return null;
  gpsPoints[idx] = { ...gpsPoints[idx], ...data, id: Number(id) };
  saveGpsPoints();
  return gpsPoints[idx];
}

function deleteGpsPoint(id) {
  const idx = gpsPoints.findIndex(g => g.id === Number(id));
  if (idx === -1) return false;
  gpsPoints.splice(idx, 1);
  saveGpsPoints();
  return true;
}

// ======================== DEVELOPMENT MAPPING CRUD ========================
function getAllDevelopments(filters = {}) {
  let list = developments;
  if (filters.villageId) {
    list = list.filter(d => d.villageId === Number(filters.villageId));
  }
  if (filters.status && filters.status !== 'All') {
    list = list.filter(d => (d.status || '').toLowerCase() === filters.status.toLowerCase());
  }
  if (filters.category && filters.category !== 'All') {
    list = list.filter(d => (d.category || '').toLowerCase() === filters.category.toLowerCase());
  }
  return list;
}

function createDevelopment(data) {
  const newId = developments.length > 0 ? Math.max(...developments.map(d => d.id)) + 1 : 1;
  const newDev = {
    id: newId,
    villageId: data.villageId ? Number(data.villageId) : 1,
    villageName: data.villageName || '',
    block: data.block || 'Barhpura',
    tehsil: data.tehsil || 'Etawah',
    title: data.title,
    category: data.category || 'Road & Drainage',
    budget: data.budget || '₹ 5.00 Lakhs',
    sanctionDate: data.sanctionDate || new Date().toISOString().split('T')[0],
    completionDate: data.completionDate || null,
    status: data.status || 'Sanctioned',
    contractor: data.contractor || '',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : ['Development'],
    latitude: data.latitude || '26.7850',
    longitude: data.longitude || '79.0210',
    photos: Array.isArray(data.photos) ? data.photos : []
  };
  developments.push(newDev);
  saveDevelopments();

  // Also add to GPS
  if (newDev.latitude && newDev.longitude) {
    const gpsId = gpsPoints.length > 0 ? Math.max(...gpsPoints.map(g => g.id)) + 1 : 1;
    gpsPoints.push({
      id: gpsId,
      locationType: 'development',
      title: newDev.title,
      category: newDev.category,
      address: `${newDev.villageName}, ${newDev.block}`,
      latitude: newDev.latitude,
      longitude: newDev.longitude,
      villageId: newDev.villageId,
      status: newDev.status,
      budget: newDev.budget,
      icon: 'development'
    });
    saveGpsPoints();
  }

  return newDev;
}

function updateDevelopment(id, data) {
  const idx = developments.findIndex(d => d.id === Number(id));
  if (idx === -1) return null;
  developments[idx] = { ...developments[idx], ...data, id: Number(id) };
  saveDevelopments();
  return developments[idx];
}

function deleteDevelopment(id) {
  const idx = developments.findIndex(d => d.id === Number(id));
  if (idx === -1) return false;
  developments.splice(idx, 1);
  saveDevelopments();
  return true;
}

// ======================== 12-COLUMN EXCEL IMPORT SYSTEM ========================
// Template Columns:
// 1. State
// 2. District
// 3. Assembly
// 4. Tehsil
// 5. Block
// 6. Gram Panchayat
// 7. Village Name
// 8. Village Code
// 9. Booth Number
// 10. Polling Station
// 11. Latitude
// 12. Longitude

function parseExcelBuffer(fileBuffer) {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  return rawRows;
}

function importLocationExcel(rows) {
  let importedCount = 0;
  let skippedCount = 0;
  const errors = [];

  rows.forEach((row, index) => {
    try {
      // Normalize row keys
      const cleanRow = {};
      for (const [k, v] of Object.entries(row)) {
        const cleanKey = String(k).trim().toLowerCase().replace(/[\s_-]+/g, '');
        cleanRow[cleanKey] = v !== undefined && v !== null ? String(v).trim() : '';
      }

      const state = cleanRow['state'] || cleanRow['राज्य'] || 'Uttar Pradesh';
      const district = cleanRow['district'] || cleanRow['जिला'] || 'Etawah';
      const assembly = cleanRow['assembly'] || cleanRow['विधानसभा'] || 'Etawah';
      const tehsilName = cleanRow['tehsil'] || cleanRow['तहसील'] || 'Etawah';
      const blockName = cleanRow['block'] || cleanRow['विकासखंड'] || cleanRow['ब्लॉक'] || 'Barhpura';
      const gpName = cleanRow['grampanchayat'] || cleanRow['panchayat'] || cleanRow['ग्रामपंचायत'] || `${cleanRow['villagename'] || 'Gram'} GP`;
      const villageName = cleanRow['villagename'] || cleanRow['village'] || cleanRow['ग्राम'] || cleanRow['गाँव'] || '';
      const villageCode = cleanRow['villagecode'] || cleanRow['code'] || cleanRow['ग्रामकोड'] || `UP${Math.floor(100000 + Math.random() * 900000)}`;
      const boothNumber = cleanRow['boothnumber'] || cleanRow['booth'] || cleanRow['बूथ'] || cleanRow['बूथसंख्या'] || '';
      const pollingStation = cleanRow['pollingstation'] || cleanRow['station'] || cleanRow['मतदानकेंद्र'] || (boothNumber ? `Booth ${boothNumber} Polling Station` : '');
      const lat = cleanRow['latitude'] || cleanRow['lat'] || cleanRow['अक्षांश'] || '26.7850';
      const lng = cleanRow['longitude'] || cleanRow['lng'] || cleanRow['long'] || cleanRow['देशांतर'] || '79.0210';

      if (!villageName) {
        skippedCount++;
        return;
      }

      // 1. Ensure Tehsil exists
      let tehsilObj = tehsils.find(t => t.name.toLowerCase() === tehsilName.toLowerCase());
      if (!tehsilObj) {
        tehsilObj = createTehsil({ name: tehsilName, assembly, district, state });
      }

      // 2. Ensure Block exists
      let blockObj = blocks.find(b => b.name.toLowerCase() === blockName.toLowerCase());
      if (!blockObj) {
        blockObj = createBlock({ name: blockName, tehsilId: tehsilObj.id, tehsil: tehsilName, assembly, district, state });
      }

      // 3. Ensure Gram Panchayat exists
      let gpObj = gramPanchayats.find(gp => gp.name.toLowerCase() === gpName.toLowerCase());
      if (!gpObj && gpName) {
        gpObj = createGramPanchayat({ name: gpName, blockId: blockObj.id, block: blockName, tehsil: tehsilName, district, state });
      }

      // 4. Ensure Village exists
      let villageObj = villages.find(v => v.villageName.toLowerCase() === villageName.toLowerCase() || (v.villageCode && v.villageCode === villageCode));
      if (!villageObj) {
        villageObj = createVillage({
          state,
          district,
          assembly,
          tehsil: tehsilName,
          block: blockName,
          gramPanchayat: gpName,
          villageName,
          villageCode,
          latitude: lat,
          longitude: lng,
          population: cleanRow['population'] || '1500',
          tags: ['Village', 'Development', 'Excel_Imported']
        });
      } else {
        // Update coordinates if available
        if (lat && lng && (!villageObj.latitude || villageObj.latitude === '0')) {
          villageObj.latitude = lat;
          villageObj.longitude = lng;
          saveVillages();
        }
      }

      // 5. Ensure Booth exists if boothNumber provided
      if (boothNumber) {
        let boothObj = booths.find(b => String(b.boothNumber) === String(boothNumber));
        if (!boothObj) {
          createBooth({
            assembly: assembly,
            boothNumber: String(boothNumber),
            pollingStationName: pollingStation || `Primary School ${villageName}`,
            villageId: villageObj.id,
            villageName: villageObj.villageName,
            address: `${villageName}, ${blockName}, Etawah`,
            latitude: lat,
            longitude: lng,
            totalVoters: cleanRow['totalvoters'] || 800,
            maleVoters: cleanRow['malevoters'] || 420,
            femaleVoters: cleanRow['femalevoters'] || 380
          });
        }
      }

      importedCount++;
    } catch (err) {
      errors.push(`Row ${index + 2}: ${err.message}`);
      skippedCount++;
    }
  });

  return {
    success: true,
    importedCount,
    skippedCount,
    errors
  };
}

// ======================== EXPORT DATA SYSTEM ========================
function generateExportExcel() {
  // Join Village + Booth details into 12-column master format
  const exportRows = villages.map(v => {
    const vBooths = booths.filter(b => b.villageId === v.id);
    const boothNumbers = vBooths.map(b => b.boothNumber).join(', ');
    const stations = vBooths.map(b => b.pollingStationName).join('; ');

    return {
      'State': v.state || 'Uttar Pradesh',
      'District': v.district || 'Etawah',
      'Assembly': v.assembly || 'Etawah (200)',
      'Tehsil': v.tehsil || 'Etawah',
      'Block': v.block || 'Barhpura',
      'Gram Panchayat': v.gramPanchayat || '',
      'Village Name': v.villageName,
      'Village Code': v.villageCode || '',
      'Booth Number': boothNumbers || 'N/A',
      'Polling Station': stations || 'N/A',
      'Latitude': v.latitude || '',
      'Longitude': v.longitude || '',
      'Population': v.population || ''
    };
  });

  const worksheet = xlsx.utils.json_to_sheet(exportRows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Constituency_Master');
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

module.exports = {
  getDashboardKPIs,
  getHierarchy,
  searchLocation,
  // Assemblies
  getAllAssemblies,
  getAssemblyById,
  createAssembly,
  updateAssembly,
  deleteAssembly,
  // Tehsils
  getAllTehsils,
  createTehsil,
  updateTehsil,
  deleteTehsil,
  // Blocks
  getAllBlocks,
  createBlock,
  updateBlock,
  deleteBlock,
  // Gram Panchayats
  getAllGramPanchayats,
  createGramPanchayat,
  updateGramPanchayat,
  deleteGramPanchayat,
  // Villages
  getAllVillages,
  getVillageById,
  createVillage,
  updateVillage,
  deleteVillage,
  // Booths
  getAllBooths,
  createBooth,
  updateBooth,
  deleteBooth,
  // GPS
  getAllGpsPoints,
  createGpsPoint,
  updateGpsPoint,
  deleteGpsPoint,
  // Development
  getAllDevelopments,
  createDevelopment,
  updateDevelopment,
  deleteDevelopment,
  // Import/Export
  parseExcelBuffer,
  importLocationExcel,
  generateExportExcel
};
