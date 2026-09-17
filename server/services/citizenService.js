// server/services/citizenService.js
// Citizen Service Layer communicating with Node.js JavaScript data storage

const { citizens } = require('../data/citizens');

class CitizenService {
  getAllCitizens(filter = {}) {
    let list = [...citizens];
    if (filter.village && filter.village !== 'All') {
      list = list.filter(c => (c.village || '').toLowerCase() === filter.village.toLowerCase());
    }
    if (filter.category && filter.category !== 'All') {
      list = list.filter(c => (c.category || '').toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.mobile || '').includes(q) ||
        (c.village || '').toLowerCase().includes(q) ||
        (c.booth || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  getCitizenById(id) {
    return citizens.find(c => c.id === Number(id) || c.id === id);
  }

  createCitizen(data) {
    // Check duplicate mobile
    const existing = citizens.find(c => c.mobile === String(data.mobile).trim());
    if (existing) {
      const err = new Error(`Mobile number ${data.mobile} is already registered.`);
      err.isDuplicate = true;
      err.existing = existing;
      throw err;
    }

    const newCitizen = {
      id: citizens.length ? Math.max(...citizens.map(c => Number(c.id) || 0)) + 1 : 1,
      name: data.name ? data.name.trim() : 'नागरिक',
      mobile: String(data.mobile).trim(),
      village: data.village || 'इटावा सदर',
      booth: data.booth || 'वार्ड 01',
      category: data.category || 'Citizen',
      area: data.area || 'इटावा विधानसभा (200)',
      createdAt: new Date().toISOString().split('T')[0]
    };

    citizens.unshift(newCitizen);
    return newCitizen;
  }

  updateCitizen(id, data) {
    const idx = citizens.findIndex(c => c.id === Number(id) || c.id === id);
    if (idx === -1) return null;
    citizens[idx] = { ...citizens[idx], ...data };
    return citizens[idx];
  }

  deleteCitizen(id) {
    const idx = citizens.findIndex(c => c.id === Number(id) || c.id === id);
    if (idx === -1) return false;
    citizens.splice(idx, 1);
    return true;
  }

  searchCitizen(query) {
    return this.getAllCitizens({ search: query });
  }

  bulkImport(records) {
    let added = 0;
    let duplicates = 0;
    for (const r of records) {
      if (!r.mobile || !r.name) continue;
      const exists = citizens.some(c => c.mobile === String(r.mobile).trim());
      if (exists) {
        duplicates++;
        continue;
      }
      citizens.unshift({
        id: citizens.length + 1,
        name: r.name.trim(),
        mobile: String(r.mobile).trim(),
        village: r.village || 'इटावा',
        booth: r.booth || 'बूथ 01',
        category: r.category || 'Citizen',
        area: 'इटावा विधानसभा (200)',
        createdAt: new Date().toISOString().split('T')[0]
      });
      added++;
    }
    return { added, duplicates, total: citizens.length };
  }
}

module.exports = new CitizenService();
