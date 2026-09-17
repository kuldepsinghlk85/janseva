// server/services/festivalService.js
// Node.js Native Object & File Storage for Festival Records

const { getCollection, saveCollection, readDb, writeDb } = require('../utils/db');
const { festivalCampaign, defaultFestivalRecords } = require('../data/festivals');

class FestivalService {
  initRecords() {
    let records = getCollection('festivals');
    if (!records || records.length === 0) {
      saveCollection('festivals', defaultFestivalRecords);
      records = defaultFestivalRecords;
    }
    return records;
  }

  getAll() {
    return this.initRecords();
  }

  getById(id) {
    const records = this.initRecords();
    return records.find(r => r.id === id);
  }

  create(data) {
    const records = this.initRecords();
    const newRecord = {
      id: data.id || 'fest_' + Date.now(),
      name: data.name || data.title || 'नया उत्सव अभियान',
      title: data.title || '',
      message: data.message || '',
      fullMessage: data.fullMessage || data.message || '',
      bannerImage: data.bannerImage || '/images/poli3.png',
      videoUrl: data.videoUrl || '',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      active: Boolean(data.active),
      category: data.category || 'विशेष पर्व',
      mlaSignature: data.mlaSignature || '— श्रीमती सरिता भदौरिया (विधायक, इटावा 200)',
      createdAt: new Date().toISOString()
    };

    if (newRecord.active) {
      // Deactivate others
      records.forEach(r => { r.active = false; });
      this.syncActiveCampaign(newRecord);
    }

    records.unshift(newRecord);
    saveCollection('festivals', records);
    return newRecord;
  }

  update(id, data) {
    const records = this.initRecords();
    const idx = records.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Festival record not found');

    if (data.active) {
      records.forEach(r => { r.active = false; });
    }

    records[idx] = {
      ...records[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (records[idx].active) {
      this.syncActiveCampaign(records[idx]);
    }

    saveCollection('festivals', records);
    return records[idx];
  }

  delete(id) {
    let records = this.initRecords();
    const toDelete = records.find(r => r.id === id);
    records = records.filter(r => r.id !== id);
    saveCollection('festivals', records);

    if (toDelete && toDelete.active) {
      this.toggleFestival(false);
    }
    return true;
  }

  activate(id) {
    const records = this.initRecords();
    const item = records.find(r => r.id === id);
    if (!item) throw new Error('Festival record not found');

    records.forEach(r => {
      r.active = r.id === id;
    });
    saveCollection('festivals', records);
    this.syncActiveCampaign(item);
    return item;
  }

  syncActiveCampaign(item) {
    Object.assign(festivalCampaign, {
      active: true,
      selectedFestival: item.id,
      title: item.title,
      message: item.message,
      fullMessage: item.fullMessage,
      bannerImage: item.bannerImage,
      videoUrl: item.videoUrl,
      startDate: item.startDate,
      endDate: item.endDate,
      mlaSignature: item.mlaSignature
    });

    try {
      const db = readDb();
      if (db && db.settings) {
        db.settings.festival = { ...db.settings.festival, ...festivalCampaign };
        writeDb(db);
      }
    } catch (e) {
      console.error('syncActiveCampaign error:', e);
    }
  }

  getFestivalSettings() {
    return festivalCampaign;
  }

  updateFestivalSettings(data) {
    Object.assign(festivalCampaign, data);
    try {
      const db = readDb();
      if (db && db.settings) {
        db.settings.festival = { ...db.settings.festival, ...festivalCampaign };
        writeDb(db);
      }
    } catch (e) {}
    return festivalCampaign;
  }

  toggleFestival(activeState) {
    festivalCampaign.active = activeState !== undefined ? activeState : !festivalCampaign.active;
    try {
      const db = readDb();
      if (db && db.settings) {
        db.settings.festival.active = festivalCampaign.active;
        writeDb(db);
      }
    } catch (e) {}
    return festivalCampaign;
  }
}

module.exports = new FestivalService();
