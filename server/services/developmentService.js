// server/services/developmentService.js
// Development Service Layer communicating with developmentWorks.js & timeline.js

const { developmentWorks } = require('../data/developmentWorks');
const { timeline } = require('../data/timeline');

class DevelopmentService {
  getAllWorks(filter = {}) {
    let list = [...developmentWorks];
    if (filter.village && filter.village !== 'All') {
      list = list.filter(w => (w.village || '').toLowerCase() === filter.village.toLowerCase());
    }
    if (filter.category && filter.category !== 'All') {
      list = list.filter(w => (w.category || '').toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      list = list.filter(w => (w.status || '').toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(w =>
        (w.title || '').toLowerCase().includes(q) ||
        (w.village || '').toLowerCase().includes(q) ||
        (w.department || '').toLowerCase().includes(q) ||
        (w.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  getWorkById(id) {
    return developmentWorks.find(w => w.id === Number(id) || w.id === id);
  }

  createWork(data) {
    const newWork = {
      id: developmentWorks.length ? Math.max(...developmentWorks.map(w => Number(w.id) || 0)) + 1 : 1,
      title: data.title || "नया विकास कार्य",
      village: data.village || "इटावा सदर",
      block: data.block || data.village || "इटावा",
      category: data.category || "सड़क एवं परिवहन",
      department: data.department || "लोक निर्माण विभाग (PWD)",
      budget: data.budget || "₹ 50 लाख",
      status: data.status || "In Progress",
      date: new Date().toISOString().split('T')[0],
      coordinates: data.coordinates || { lat: 26.78, lng: 79.02 },
      description: data.description || "",
      images: data.images || ["/images/assets/work_rampur_road.jpg"],
      videos: data.videos || [],
      tags: data.tags || [data.category || "विकास कार्य", data.village || "इटावा"],
      impact: data.impact || "क्षेत्रवासियों को सीधा लाभ"
    };

    developmentWorks.unshift(newWork);
    return newWork;
  }

  updateWork(id, data) {
    const idx = developmentWorks.findIndex(w => w.id === Number(id) || w.id === id);
    if (idx === -1) return null;
    developmentWorks[idx] = { ...developmentWorks[idx], ...data };
    return developmentWorks[idx];
  }

  deleteWork(id) {
    const idx = developmentWorks.findIndex(w => w.id === Number(id) || w.id === id);
    if (idx === -1) return false;
    developmentWorks.splice(idx, 1);
    return true;
  }

  getTimeline() {
    return timeline;
  }

  getStatusStats() {
    return {
      total: developmentWorks.length,
      completed: developmentWorks.filter(w => w.status === 'Completed').length,
      inProgress: developmentWorks.filter(w => w.status === 'In Progress').length,
      approved: developmentWorks.filter(w => w.status === 'Approved').length,
      notStarted: developmentWorks.filter(w => w.status === 'Not Started').length
    };
  }
}

module.exports = new DevelopmentService();
