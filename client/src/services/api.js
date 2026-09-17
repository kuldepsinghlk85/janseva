const API_BASE = '/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    return { success: false, message: err.message };
  }
}

export const api = {
  // Settings & Homepage
  getSettings: () => fetchJson('/settings'),
  updateHero: (hero, user = 'Admin') => fetchJson('/settings/hero', { method: 'PUT', body: JSON.stringify({ ...hero, user }) }),
  setTemplate: (templateId, user = 'Admin') => fetchJson('/settings/template', { method: 'PUT', body: JSON.stringify({ templateId, user }) }),
  updateSections: (sections, user = 'Admin') => fetchJson('/settings/sections', { method: 'PUT', body: JSON.stringify({ sections, user }) }),
  toggleSection: (id, user = 'Admin') => fetchJson(`/settings/sections/${id}/toggle`, { method: 'PUT', body: JSON.stringify({ user }) }),
  updateFestival: (festival, user = 'Admin') => fetchJson('/settings/festival', { method: 'PUT', body: JSON.stringify({ ...festival, user }) }),
  getFestivals: () => fetchJson('/festivals'),
  createFestival: (festival, user = 'Admin') => fetchJson('/festivals', { method: 'POST', body: JSON.stringify({ ...festival, user }) }),
  updateFestivalItem: (id, festival, user = 'Admin') => fetchJson(`/festivals/${id}`, { method: 'PUT', body: JSON.stringify({ ...festival, user }) }),
  deleteFestivalItem: (id, user = 'Admin') => fetchJson(`/festivals/${id}`, { method: 'DELETE', body: JSON.stringify({ user }) }),
  activateFestival: (id, user = 'Admin') => fetchJson(`/festivals/activate/${id}`, { method: 'POST', body: JSON.stringify({ user }) }),
  updateBranding: (branding, user = 'Admin') => fetchJson('/settings/branding', { method: 'PUT', body: JSON.stringify({ ...branding, user }) }),
  getMlaPhotos: () => fetchJson('/settings/mla-photos'),
  updateMlaPhoto: (data, user = 'Admin') => fetchJson('/settings/mla-photo', { method: 'PUT', body: JSON.stringify({ ...data, user }) }),
  setActiveMlaPhoto: (id, user = 'Admin') => fetchJson(`/settings/mla-photos/set-active/${id}`, { method: 'POST', body: JSON.stringify({ user }) }),
  addMlaPhotoArchive: (data, user = 'Admin') => fetchJson('/settings/mla-photos/add-archive', { method: 'POST', body: JSON.stringify({ ...data, user }) }),
  deleteMlaPhotoArchive: (id, user = 'Admin') => fetchJson(`/settings/mla-photos/${id}?user=${encodeURIComponent(user)}`, { method: 'DELETE' }),
  updateSeo: (seo, user = 'Admin') => fetchJson('/settings/seo', { method: 'PUT', body: JSON.stringify({ ...seo, user }) }),
  updateBlogSettings: (blogSettings, user = 'Admin') => fetchJson('/settings/blog-settings', { method: 'PUT', body: JSON.stringify({ ...blogSettings, user }) }),

  // Mobile Web App CMS & Feature Controls
  getMobileSettings: () => fetchJson('/settings/mobile'),
  updateMobileSettings: (settings, user = 'Admin') => fetchJson('/settings/mobile', { method: 'PUT', body: JSON.stringify({ settings, user }) }),
  toggleMobileFeature: (payload, user = 'Admin') => fetchJson('/settings/mobile/toggle', { method: 'POST', body: JSON.stringify({ ...payload, user }) }),

  // Hero Posters Slider
  getHeroPosters: () => fetchJson('/hero-posters'),
  getAllHeroPosters: () => fetchJson('/hero-posters/all'),
  createHeroPoster: (data, user = 'Admin') => fetchJson('/hero-posters', { method: 'POST', body: JSON.stringify({ ...data, user }) }),
  updateHeroPoster: (id, data, user = 'Admin') => fetchJson(`/hero-posters/${id}`, { method: 'PUT', body: JSON.stringify({ ...data, user }) }),
  toggleHeroPoster: (id, user = 'Admin') => fetchJson(`/hero-posters/${id}/toggle`, { method: 'POST', body: JSON.stringify({ user }) }),
  updateHeroPostersOrder: (posterIds, user = 'Admin') => fetchJson('/hero-posters/order/update', { method: 'PUT', body: JSON.stringify({ posterIds, user }) }),
  deleteHeroPoster: (id, user = 'Admin') => fetchJson(`/hero-posters/${id}?user=${encodeURIComponent(user)}`, { method: 'DELETE' }),
  updateHeroPostersSettings: (settings, user = 'Admin') => fetchJson('/hero-posters/settings/config', { method: 'PUT', body: JSON.stringify({ ...settings, user }) }),

  // Development Works
  getDevelopmentWorks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/development${query ? '?' + query : ''}`);
  },
  getDevelopmentWorkById: (id) => fetchJson(`/development/${id}`),
  createDevelopmentWork: (work, user = 'Admin') => fetchJson('/development', { method: 'POST', body: JSON.stringify({ ...work, user }) }),
  updateDevelopmentWork: (id, work, user = 'Admin') => fetchJson(`/development/${id}`, { method: 'PUT', body: JSON.stringify({ ...work, user }) }),
  deleteDevelopmentWork: (id, user = 'Admin') => fetchJson(`/development/${id}?user=${encodeURIComponent(user)}`, { method: 'DELETE' }),

  // Citizens CRM
  getCitizens: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/citizens${query ? '?' + query : ''}`);
  },
  registerCitizen: (citizen) => fetchJson('/citizens', { method: 'POST', body: JSON.stringify(citizen) }),
  bulkImportCitizens: (records, source = 'Excel Upload', user = 'Admin') => fetchJson('/citizens/bulk-import', { method: 'POST', body: JSON.stringify({ records, source, user }) }),
  deleteCitizen: (id) => fetchJson(`/citizens/${id}`, { method: 'DELETE' }),

  // Social Media
  getSocialPosts: () => fetchJson('/social'),
  syncSocial: (profileId = null, user = 'Admin') => fetchJson('/social/sync', { method: 'POST', body: JSON.stringify({ profileId, user }) }),
  convertSocialToWork: (postId, user = 'Admin') => fetchJson('/social/convert-to-work', { method: 'POST', body: JSON.stringify({ postId, user }) }),
  convertSocialToActivity: (postId, user = 'Admin') => fetchJson('/social/convert-to-activity', { method: 'POST', body: JSON.stringify({ postId, user }) }),
  createSocialPost: (postData, user = 'Admin') => fetchJson('/social/create-post', { method: 'POST', body: JSON.stringify({ ...postData, user }) }),
  updateSocialProfile: (id, updateData, user = 'Admin') => fetchJson(`/social/profiles/${id}`, { method: 'PUT', body: JSON.stringify({ ...updateData, user }) }),
  deleteSocialPost: (postId, user = 'Admin') => fetchJson(`/social/posts/${postId}?user=${encodeURIComponent(user)}`, { method: 'DELETE' }),

  // News RSS
  getNews: () => fetchJson('/news'),
  convertNewsToBlog: (newsId, user = 'Admin') => fetchJson('/news/convert-to-blog', { method: 'POST', body: JSON.stringify({ newsId, user }) }),
  addNewsSource: (source, user = 'Admin') => fetchJson('/news/add-source', { method: 'POST', body: JSON.stringify({ ...source, user }) }),

  // Blogs
  getBlogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/blogs${query ? '?' + query : ''}`);
  },
  getBlogById: (id) => fetchJson(`/blogs/${id}`),
  createBlog: (blog, user = 'Admin') => fetchJson('/blogs', { method: 'POST', body: JSON.stringify({ ...blog, user }) }),
  updateBlog: (id, blog, user = 'Admin') => fetchJson(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify({ ...blog, user }) }),
  deleteBlog: (id, user = 'Admin') => fetchJson(`/blogs/${id}?user=${encodeURIComponent(user)}`, { method: 'DELETE' }),

  // Leaders & Mentions
  getLeaders: () => fetchJson('/leaders'),
  addLeader: (leader, user = 'Admin') => fetchJson('/leaders', { method: 'POST', body: JSON.stringify({ ...leader, user }) }),
  deleteLeader: (id) => fetchJson(`/leaders/${id}`, { method: 'DELETE' }),

  // Team
  getTeam: () => fetchJson('/team'),
  addTeamMember: (member, user = 'Admin') => fetchJson('/team', { method: 'POST', body: JSON.stringify({ ...member, user }) }),
  deleteTeamMember: (id) => fetchJson(`/team/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: () => fetchJson('/events'),
  addEvent: (event, user = 'Admin') => fetchJson('/events', { method: 'POST', body: JSON.stringify({ ...event, user }) }),
  deleteEvent: (id) => fetchJson(`/events/${id}`, { method: 'DELETE' }),

  // AI Assistant
  aiQuery: (question, user = 'Admin') => fetchJson('/ai/query', { method: 'POST', body: JSON.stringify({ question, user }) }),
  aiClassify: (text) => fetchJson('/ai/classify', { method: 'POST', body: JSON.stringify({ text }) }),
  aiGenerateArticle: (params, user = 'Admin') => fetchJson('/ai/generate-article', { method: 'POST', body: JSON.stringify({ ...params, user }) }),

  // Analytics & Audit
  getAnalytics: () => fetchJson('/analytics'),
  trackShare: (channel, entityType, entityId) => fetchJson('/analytics/track-share', { method: 'POST', body: JSON.stringify({ channel, entityType, entityId }) }),
  getAuditLogs: () => fetchJson('/audit'),

  // Schemes
  getSchemes: () => fetchJson('/schemes'),
  addScheme: (scheme, user = 'Admin') => fetchJson('/schemes', { method: 'POST', body: JSON.stringify({ ...scheme, user }) }),

  // Communication & Alerts
  getCommunication: () => fetchJson('/communication'),
  sendAlert: (alertData, user = 'Admin') => fetchJson('/communication/alerts', { method: 'POST', body: JSON.stringify({ ...alertData, user }) }),
  getCommunicationContacts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/communication/contacts${q ? '?' + q : ''}`);
  },
  logDirectMessage: (data) => fetchJson('/communication/log-direct-message', { method: 'POST', body: JSON.stringify(data) }),
  submitQuery: (queryData) => fetchJson('/communication/queries', { method: 'POST', body: JSON.stringify(queryData) }),
  updateQueryStatus: (id, status, user = 'Admin') => fetchJson(`/communication/queries/${id}`, { method: 'PUT', body: JSON.stringify({ status, user }) }),

  // Jan Samvad (Citizen Grievance Redressal & RBAC Suite)
  getJanSamvadGrievances: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/communication/jan-samvad${q ? '?' + q : ''}`);
  },
  trackJanSamvadGrievance: (tokenOrMobile) => fetchJson(`/communication/jan-samvad/track/${encodeURIComponent(tokenOrMobile)}`),
  registerJanSamvadGrievance: (data) => fetchJson('/communication/jan-samvad/register', { method: 'POST', body: JSON.stringify(data) }),
  updateJanSamvadAction: (id, actionData) => fetchJson(`/communication/jan-samvad/action/${id}`, { method: 'PUT', body: JSON.stringify(actionData) }),
  getJanSamvadRoles: () => fetchJson('/communication/jan-samvad/roles'),
  updateJanSamvadRoles: (rolePermissions, user = 'Admin') => fetchJson('/communication/jan-samvad/roles', { method: 'PUT', body: JSON.stringify({ rolePermissions, user }) }),

  // Member Management
  getMembers: () => fetchJson('/members'),
  addMember: (member, user = 'Admin') => fetchJson('/members', { method: 'POST', body: JSON.stringify({ ...member, user }) }),
  toggleIdCard: (id, user = 'Admin') => fetchJson(`/members/${id}/id-card`, { method: 'PUT', body: JSON.stringify({ user }) }),

  // Media Gallery & Image Changer
  getGallery: () => fetchJson('/gallery'),
  addMediaItem: (item, user = 'Admin') => fetchJson('/gallery', { method: 'POST', body: JSON.stringify({ ...item, user }) }),
  swapSiteImage: (targetKey, imageUrl, user = 'Admin') => fetchJson('/gallery/swap-image', { method: 'PUT', body: JSON.stringify({ targetKey, imageUrl, user }) }),

  // MLA Daily Activity Publisher & Development Timeline Engine
  getActivities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/activity/all${query ? '?' + query : ''}`);
  },
  getActivityById: (id) => fetchJson(`/activity/${id}`),
  getFeaturedActivity: () => fetchJson('/activity/featured'),
  getFeaturedSliderActivities: () => fetchJson('/activity/featured-slider'),
  updateFeaturedSliderOrder: (activityIds) => fetchJson('/activity/featured-slider/order', { method: 'POST', body: JSON.stringify({ activityIds }) }),
  toggleFeaturedSliderActivity: (id) => fetchJson(`/activity/featured-slider/toggle/${id}`, { method: 'POST' }),
  getTimelineActivities: () => fetchJson('/activity/timeline'),
  createActivity: (data) => fetchJson('/activity/create', { method: 'POST', body: JSON.stringify(data) }),
  updateActivity: (id, data) => fetchJson(`/activity/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteActivity: (id) => fetchJson(`/activity/delete/${id}`, { method: 'DELETE' }),
  shareActivity: (id) => fetchJson(`/activity/share/${id}`, { method: 'POST' }),

  // Team, Categories & User Types Management
  getTeamCategories: () => fetchJson('/team/categories'),
  addTeamCategory: (category) => fetchJson('/team/categories', { method: 'POST', body: JSON.stringify(category) }),
  deleteTeamCategory: (id) => fetchJson(`/team/categories/${id}`, { method: 'DELETE' }),
  getUserTypes: () => fetchJson('/team/user-types'),
  addUserType: (userType) => fetchJson('/team/user-types', { method: 'POST', body: JSON.stringify(userType) }),
  deleteUserType: (id) => fetchJson(`/team/user-types/${id}`, { method: 'DELETE' }),

  // Master Data (Villages, Categories, Tags)
  getVillages: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/master/villages${query ? '?' + query : ''}`);
  },
  addVillage: (village) => fetchJson('/master/villages', { method: 'POST', body: JSON.stringify(village) }),
  updateVillage: (id, village) => fetchJson(`/master/villages/${id}`, { method: 'PUT', body: JSON.stringify(village) }),
  deleteVillage: (id) => fetchJson(`/master/villages/${id}`, { method: 'DELETE' }),
  clearAllVillages: () => fetchJson('/master/villages/all', { method: 'DELETE' }),
  bulkImportMasterData: (rows) => fetchJson('/master/bulk-import', { method: 'POST', body: JSON.stringify({ rows }) }),
  getMasterHierarchy: () => fetchJson('/master/hierarchy'),
  getTehsilBlocks: () => fetchJson('/master/tehsil-blocks'),

  getMasterCategories: (type = 'all') => fetchJson(`/master/categories?type=${type}`),
  addMasterCategory: (cat) => fetchJson('/master/categories', { method: 'POST', body: JSON.stringify(cat) }),
  deleteMasterCategory: (id) => fetchJson(`/master/categories/${id}`, { method: 'DELETE' }),

  getTags: () => fetchJson('/master/tags'),
  addTag: (tag) => fetchJson('/master/tags', { method: 'POST', body: JSON.stringify(tag) }),
  deleteTag: (id) => fetchJson(`/master/tags/${id}`, { method: 'DELETE' }),

  getAllMasterData: () => fetchJson('/master/all'),

  // Central Media Library
  getMediaAll: () => fetchJson('/media/all'),
  deleteMediaFile: (filename) => fetchJson(`/media/${encodeURIComponent(filename)}`, { method: 'DELETE' }),
  getMediaDownloadUrl: (filename) => `/api/media/download/${encodeURIComponent(filename)}`,

  // Location Intelligence & Constituency Mapping
  getLocationKPIs: () => fetchJson('/location/dashboard-kpi'),
  getLocationHierarchy: () => fetchJson('/location/hierarchy'),
  searchLocation: (q) => fetchJson(`/location/search?q=${encodeURIComponent(q)}`),
  
  getLocationAssemblies: () => fetchJson('/location/assembly'),
  createLocationAssembly: (data) => fetchJson('/location/assembly', { method: 'POST', body: JSON.stringify(data) }),
  updateLocationAssembly: (id, data) => fetchJson(`/location/assembly/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocationAssembly: (id) => fetchJson(`/location/assembly/${id}`, { method: 'DELETE' }),

  getLocationTehsils: () => fetchJson('/location/tehsil'),
  createLocationTehsil: (data) => fetchJson('/location/tehsil', { method: 'POST', body: JSON.stringify(data) }),
  updateLocationTehsil: (id, data) => fetchJson(`/location/tehsil/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocationTehsil: (id) => fetchJson(`/location/tehsil/${id}`, { method: 'DELETE' }),

  getLocationBlocks: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/location/block${q ? '?' + q : ''}`);
  },
  createLocationBlock: (data) => fetchJson('/location/block', { method: 'POST', body: JSON.stringify(data) }),
  updateLocationBlock: (id, data) => fetchJson(`/location/block/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocationBlock: (id) => fetchJson(`/location/block/${id}`, { method: 'DELETE' }),

  getLocationGPs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/location/gram-panchayat${q ? '?' + q : ''}`);
  },
  createLocationGP: (data) => fetchJson('/location/gram-panchayat', { method: 'POST', body: JSON.stringify(data) }),
  updateLocationGP: (id, data) => fetchJson(`/location/gram-panchayat/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocationGP: (id) => fetchJson(`/location/gram-panchayat/${id}`, { method: 'DELETE' }),

  getLocationVillages: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/location/village${q ? '?' + q : ''}`);
  },
  getLocationVillageById: (id) => fetchJson(`/location/village/${id}`),
  createLocationVillage: (data) => fetchJson('/location/village', { method: 'POST', body: JSON.stringify(data) }),
  updateLocationVillage: (id, data) => fetchJson(`/location/village/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocationVillage: (id) => fetchJson(`/location/village/${id}`, { method: 'DELETE' }),

  getLocationBooths: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/location/booth${q ? '?' + q : ''}`);
  },
  createLocationBooth: (data) => fetchJson('/location/booth', { method: 'POST', body: JSON.stringify(data) }),
  updateLocationBooth: (id, data) => fetchJson(`/location/booth/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocationBooth: (id) => fetchJson(`/location/booth/${id}`, { method: 'DELETE' }),

  getLocationGpsPoints: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/location/gps${q ? '?' + q : ''}`);
  },
  createLocationGpsPoint: (data) => fetchJson('/location/gps', { method: 'POST', body: JSON.stringify(data) }),
  updateLocationGpsPoint: (id, data) => fetchJson(`/location/gps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocationGpsPoint: (id) => fetchJson(`/location/gps/${id}`, { method: 'DELETE' }),

  getLocationDevelopments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/location/development${q ? '?' + q : ''}`);
  },
  createLocationDevelopment: (data) => fetchJson('/location/development', { method: 'POST', body: JSON.stringify(data) }),
  updateLocationDevelopment: (id, data) => fetchJson(`/location/development/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocationDevelopment: (id) => fetchJson(`/location/development/${id}`, { method: 'DELETE' }),

  importLocationExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/location/import-excel`, {
        method: 'POST',
        body: formData
      });
      return await res.json();
    } catch (err) {
      console.error('Import Excel Error:', err);
      return { success: false, message: err.message };
    }
  },
  getLocationExportUrl: () => `${API_BASE}/location/export-excel`,

  // Readership Tracking & News Sharing
  trackRead: (data) => fetchJson('/analytics/track-read', { method: 'POST', body: JSON.stringify(data) }),
  getReadLogs: () => fetchJson('/analytics/read-logs'),
  trackShare: (channel, entityType, entityId, title) => fetchJson('/analytics/track-share', { method: 'POST', body: JSON.stringify({ channel, entityType, entityId, title }) }),

  // User & Citizen Authentication
  userLogin: (credentials) => fetchJson('/users/login', { method: 'POST', body: JSON.stringify(credentials) }),
  citizenLogin: (data) => fetchJson('/users/citizen-login', { method: 'POST', body: JSON.stringify(data) }),
  citizenRegisterAuth: (data) => fetchJson('/users/citizen-register', { method: 'POST', body: JSON.stringify(data) }),
  getCitizenGrievances: (mobile) => fetchJson(`/users/citizen-grievances/${encodeURIComponent(mobile)}`),

  // Unified People Directory & Search Engine
  getDirectoryAll: (params = {}) => {
    const qry = new URLSearchParams(params).toString();
    return fetchJson(`/directory/all${qry ? '?' + qry : ''}`);
  },
  createDirectoryPerson: (personData) => fetchJson('/directory/person', { method: 'POST', body: JSON.stringify(personData) }),
  deleteDirectoryPerson: (type, id) => fetchJson(`/directory/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // System Admin & Staff Users Management
  getSystemUsers: () => fetchJson('/users'),
  createSystemUser: (data) => fetchJson('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateSystemUser: (id, data) => fetchJson(`/users/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSystemUser: (id) => fetchJson(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' })
};

