// server/services/activityService.js
// Business Logic & Service Layer for MLA Daily Activity Publisher & Development Timeline Engine

const fs = require('fs');
const path = require('path');
const { activities, saveActivities } = require('../data/activityPosts');

const FEATURED_SLIDER_FILE = path.join(__dirname, '../data/featuredSlider.json');

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + Math.floor(1000 + Math.random() * 9000);
}

function getAllActivities({ search, category, village, tag, status } = {}) {
  let list = [...activities];

  if (status && status !== 'all') {
    list = list.filter(a => (a.status || 'published').toLowerCase() === status.toLowerCase());
  }

  if (category && category !== 'all') {
    list = list.filter(a => (a.category || '').toLowerCase() === category.toLowerCase());
  }

  if (village && village !== 'all') {
    list = list.filter(a => (a.location?.village || '').toLowerCase() === village.toLowerCase());
  }

  if (tag) {
    const cleanTag = tag.startsWith('#') ? tag.toLowerCase() : `#${tag.toLowerCase()}`;
    list = list.filter(a => (a.tags || []).some(t => t.toLowerCase() === cleanTag));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.shortDescription || '').toLowerCase().includes(q) ||
      (a.fullDescription || '').toLowerCase().includes(q) ||
      (a.location?.village || '').toLowerCase().includes(q) ||
      (a.category || '').toLowerCase().includes(q) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  // Sort by date descending
  list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  return list;
}

function getActivityById(id) {
  return activities.find(a => a.id === parseInt(id) || a.slug === id);
}

function getActivityBySlug(slug) {
  return activities.find(a => a.slug === slug || a.id === parseInt(slug));
}

function getFeaturedActivity() {
  const published = activities.filter(a => a.status === 'published');
  if (!published.length) return null;
  published.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  return published[0];
}

function getTimelineActivities() {
  const published = activities.filter(a => a.status === 'published');
  published.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  return published;
}

function createActivity(data) {
  const newId = activities.length ? Math.max(...activities.map(a => a.id || 0)) + 1 : 1;
  const slug = data.slug || generateSlug(data.title || 'activity');

  const newActivity = {
    id: newId,
    slug: slug,
    title: data.title || 'नई जन-गतिविधि',
    category: data.category || 'Development Work',
    categoryHi: data.categoryHi || data.category || 'विकास कार्य',
    date: data.date || new Date().toISOString().split('T')[0],
    time: data.time || '10:00 AM',
    location: {
      village: data.location?.village || data.village || 'इटावा सदर',
      block: data.location?.block || data.block || 'इटावा',
      district: data.location?.district || data.district || 'इटावा'
    },
    shortDescription: data.shortDescription || (data.fullDescription ? data.fullDescription.slice(0, 150) + '...' : ''),
    fullDescription: data.fullDescription || data.description || '',
    images: Array.isArray(data.images) && data.images.length ? data.images : ['/images/assets/work_rampur_road.jpg'],
    videoUrl: data.videoUrl || '',
    documents: Array.isArray(data.documents) ? data.documents : [],
    externalLinks: Array.isArray(data.externalLinks) ? data.externalLinks : [],
    facebookUrl: data.facebookUrl || 'https://www.facebook.com/mlaetawah',
    socialUrl: data.socialUrl || data.facebookUrl || (data.externalLinks && data.externalLinks[0]?.url) || 'https://www.facebook.com/mlaetawah',
    authorPhoto: data.authorPhoto || '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
    shareEnabled: data.shareEnabled !== undefined ? Boolean(data.shareEnabled) : true,
    status: data.status || 'published',
    views: 0,
    shares: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  activities.unshift(newActivity);
  saveActivities();
  return newActivity;
}

function updateActivity(id, updateData) {
  const index = activities.findIndex(a => a.id === parseInt(id) || a.slug === id);
  if (index === -1) return null;

  const existing = activities[index];
  const updated = {
    ...existing,
    ...updateData,
    id: existing.id, // protect id
    location: {
      ...existing.location,
      ...(updateData.location || {})
    },
    updatedAt: new Date().toISOString()
  };

  if (updateData.village) updated.location.village = updateData.village;
  if (updateData.block) updated.location.block = updateData.block;
  if (updateData.district) updated.location.district = updateData.district;

  if (updateData.tags && Array.isArray(updateData.tags)) {
    updated.tags = updateData.tags.map(t => t.startsWith('#') ? t : `#${t}`);
  }

  activities[index] = updated;
  saveActivities();
  return updated;
}

function deleteActivity(id) {
  const index = activities.findIndex(a => a.id === parseInt(id) || a.slug === id);
  if (index === -1) return false;

  activities.splice(index, 1);
  saveActivities();
  return true;
}

function incrementViews(id) {
  const item = getActivityById(id);
  if (item) {
    item.views = (item.views || 0) + 1;
    saveActivities();
  }
  return item;
}

function incrementShares(id) {
  const item = getActivityById(id);
  if (item) {
    item.shares = (item.shares || 0) + 1;
    saveActivities();
  }
  return item;
}

// ----------------------------------------------------
// Top Homepage Featured Slider (2 to 4 activities in order)
// ----------------------------------------------------
function getFeaturedSliderConfig() {
  try {
    if (fs.existsSync(FEATURED_SLIDER_FILE)) {
      const raw = fs.readFileSync(FEATURED_SLIDER_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(n => parseInt(n)).filter(n => !isNaN(n));
      }
    }
  } catch (err) {
    console.error('Error reading featuredSlider.json:', err);
  }
  return [5, 1, 6, 2]; // default 4 activities
}

function saveFeaturedSliderConfig(ids) {
  try {
    fs.writeFileSync(FEATURED_SLIDER_FILE, JSON.stringify(ids, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving featuredSlider.json:', err);
  }
}

function getFeaturedSliderActivities() {
  const configIds = getFeaturedSliderConfig();
  const published = activities.filter(a => a.status === 'published');

  // Collect configured items in their exact specified order
  let result = [];
  configIds.forEach((id) => {
    const act = published.find(a => a.id === id);
    if (act && !result.some(r => r.id === act.id)) {
      result.push(act);
    }
  });

  // If fewer than 2, fill up from remaining published activities
  if (result.length < 2) {
    for (const act of published) {
      if (!result.some(r => r.id === act.id)) {
        result.push(act);
      }
      if (result.length >= 2) break;
    }
  }

  // Cap at 4 activities as requested (2 to 4 activities)
  if (result.length > 4) {
    result = result.slice(0, 4);
  }

  // Attach sliderOrder field (1, 2, 3, 4)
  return result.map((item, index) => ({
    ...item,
    sliderOrder: index + 1,
    featuredInSlider: true
  }));
}

function updateFeaturedSliderOrder(newIds) {
  if (!Array.isArray(newIds)) {
    throw new Error('activityIds must be an array');
  }

  const cleanIds = newIds.map(n => parseInt(n)).filter(n => !isNaN(n));
  if (cleanIds.length < 2) {
    throw new Error('स्लाइडर में कम से कम 2 गतिविधियां होनी चाहिए (Minimum 2 activities required)');
  }
  if (cleanIds.length > 4) {
    throw new Error('स्लाइडर में अधिकतम 4 गतिविधियां ही रखी जा सकती हैं (Maximum 4 activities allowed)');
  }

  // Verify that all IDs exist
  const missing = cleanIds.filter(id => !activities.some(a => a.id === id));
  if (missing.length > 0) {
    throw new Error(`गतिविधि आईडी ${missing.join(', ')} डेटाबेस में नहीं मिली`);
  }

  saveFeaturedSliderConfig(cleanIds);
  return getFeaturedSliderActivities();
}

function toggleFeaturedSlider(id) {
  const actId = parseInt(id);
  const act = getActivityById(actId);
  if (!act) {
    throw new Error('Activity not found');
  }

  const currentIds = getFeaturedSliderConfig();
  const index = currentIds.indexOf(actId);

  if (index !== -1) {
    // Attempting to remove
    if (currentIds.length <= 2) {
      throw new Error('स्लाइडर में कम से कम 2 गतिविधियां रहना अनिवार्य है।');
    }
    currentIds.splice(index, 1);
  } else {
    // Attempting to add
    if (currentIds.length >= 4) {
      throw new Error('स्लाइडर में अधिकतम 4 गतिविधियां ही रखी जा सकती हैं। पहले किसी एक को हटाएं।');
    }
    currentIds.push(actId);
  }

  saveFeaturedSliderConfig(currentIds);
  return getFeaturedSliderActivities();
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityBySlug,
  getFeaturedActivity,
  getTimelineActivities,
  getFeaturedSliderConfig,
  getFeaturedSliderActivities,
  updateFeaturedSliderOrder,
  toggleFeaturedSlider,
  createActivity,
  updateActivity,
  deleteActivity,
  incrementViews,
  incrementShares
};
