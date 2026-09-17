const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');
const { festivalCampaign } = require('../data/festivals');

const DEFAULT_THEME = {
  preset: 'saffron',
  primaryColor: '#ea580c',
  secondaryColor: '#16a34a',
  accentColor: '#f59e0b',
  navbarBg: '#ffffff',
  navbarText: '#0f172a',
  footerBg: '#0f172a',
  bodyBg: '#f8fafc',
  cardRadius: 'rounded-xl',
  fontFamily: 'Inter',
  headerStyle: 'standard'
};

const DEFAULT_HEADER = {
  siteTitle: 'जनसेवा इटावा',
  highlightWord: 'इटावा',
  subtitle: 'People • Development • Trust',
  tagline: '“मजबूत नेतृत्व, विकसित इटावा, समृद्ध भारत”',
  constituency: 'जनसेवा इटावा (विधानसभा 200)',
  logoType: 'icon',
  logoIcon: '🪷',
  logoImage: '',
  logoWidth: 44,
  headerLayout: 'standard',
  showRibbon: true,
  showMobileAppBtn: true,
  showLoginBtn: true,
  showLangBtn: true
};

const DEFAULT_MODULES = {
  topRibbon: true,
  headerMobileAppBtn: true,
  headerLoginBtn: true,
  headerLangBtn: true,
  festivalBanner: true,
  officialMlaBanner: true,
  heroSlider: true,
  janSamvadSpotlight: true,
  metricsBar: true,
  featuredActivity: true,
  updatesAndSchemes: true,
  socialAndConstituency: true,
  knowYourConstituency: true,
  latestActivitiesAndMinisters: true,
  timelineAndTeam: true,
  citizenTestimonial: true,
  footerPanorama: true,
  floatingMobileSimulator: true,
  floatingQrModal: true
};

const THEME_PRESETS = [
  {
    id: 'saffron',
    name: 'भगवा एवं राष्ट्रभक्ति',
    nameEn: 'Saffron Patriot',
    desc: 'पारंपरिक ऊर्जावान भगवा व समृद्ध हरित रंग का सामंजस्य',
    primaryColor: '#ea580c',
    secondaryColor: '#16a34a',
    accentColor: '#f59e0b',
    navbarBg: '#ffffff',
    navbarText: '#0f172a',
    footerBg: '#0f172a',
    bodyBg: '#f8fafc',
    cardRadius: 'rounded-xl',
    fontFamily: 'Inter'
  },
  {
    id: 'royal_blue',
    name: 'शाही नीला / डिजिटल भारत',
    nameEn: 'Royal Blue & Gold',
    desc: 'गंभीर, आधुनिक प्रशासनिक नीला एवं स्वर्णिम आभा',
    primaryColor: '#1d4ed8',
    secondaryColor: '#0284c7',
    accentColor: '#f59e0b',
    navbarBg: '#0f172a',
    navbarText: '#ffffff',
    footerBg: '#020617',
    bodyBg: '#f1f5f9',
    cardRadius: 'rounded-xl',
    fontFamily: 'Inter'
  },
  {
    id: 'emerald',
    name: 'समृद्धि हरित / विकास एवं प्रकृति',
    nameEn: 'Emerald Prosperity',
    desc: 'विकास, पर्यावरण, ग्रामीण उन्नति और ताज़गी का प्रतीक',
    primaryColor: '#059669',
    secondaryColor: '#0d9488',
    accentColor: '#ea580c',
    navbarBg: '#ffffff',
    navbarText: '#064e3b',
    footerBg: '#064e3b',
    bodyBg: '#f0fdf4',
    cardRadius: 'rounded-2xl',
    fontFamily: 'Inter'
  },
  {
    id: 'tricolor',
    name: 'राष्ट्रीय तिरंगा गौरव',
    nameEn: 'National Tricolor',
    desc: 'केसरिया, श्वेत व हरा — पूर्ण राष्ट्रभक्ति और जनसेवा भावना',
    primaryColor: '#ea580c',
    secondaryColor: '#15803d',
    accentColor: '#1e3a8a',
    navbarBg: '#ffffff',
    navbarText: '#1e293b',
    footerBg: '#111827',
    bodyBg: '#fafaf9',
    cardRadius: 'rounded-lg',
    fontFamily: 'Inter'
  },
  {
    id: 'maroon_gold',
    name: 'शाही मैरून एवं स्वर्णिम',
    nameEn: 'Imperial Maroon & Amber',
    desc: 'गरिमापूर्ण ऐतिहासिक मैरून व एम्बर स्वर्णिम चमक',
    primaryColor: '#991b1b',
    secondaryColor: '#b45309',
    accentColor: '#d97706',
    navbarBg: '#ffffff',
    navbarText: '#450a0a',
    footerBg: '#450a0a',
    bodyBg: '#fef2f2',
    cardRadius: 'rounded-xl',
    fontFamily: 'Rozha One'
  },
  {
    id: 'dark_modern',
    name: 'डार्क मॉडर्न एलीट',
    nameEn: 'Dark Modern Elite',
    desc: 'प्रीमियम हाई-टेक डार्क लुक व वाइब्रेंट पर्पल हाइलाइट्स',
    primaryColor: '#8b5cf6',
    secondaryColor: '#06b6d4',
    accentColor: '#ec4899',
    navbarBg: '#090d16',
    navbarText: '#f8fafc',
    footerBg: '#030712',
    bodyBg: '#0b0f19',
    cardRadius: 'rounded-2xl',
    fontFamily: 'Inter'
  }
];

// GET full settings & MLA profile
router.get('/', (req, res) => {
  const db = readDb();
  if (!db.settings) db.settings = {};

  const currentTheme = { ...DEFAULT_THEME, ...(db.settings.theme || {}) };
  const currentHeader = { ...DEFAULT_HEADER, ...(db.settings.header || {}) };
  const currentModules = { ...DEFAULT_MODULES, ...(db.settings.modules || {}) };
  const currentFestival = { ...db.settings.festival, ...festivalCampaign };

  res.json({
    success: true,
    settings: {
      ...db.settings,
      theme: currentTheme,
      header: currentHeader,
      modules: currentModules,
      themePresets: THEME_PRESETS,
      festival: currentFestival
    },
    mla: db.mla || {}
  });
});

// UPDATE Hero Section
router.put('/hero', (req, res) => {
  const db = readDb();
  db.settings.hero = { ...db.settings.hero, ...req.body };
  writeDb(db);
  logAudit(req.body.user, 'Update Hero Section', 'Website Builder', db.settings.hero);
  res.json({ success: true, hero: db.settings.hero });
});

// Template Section Order Presets
const TEMPLATE_ORDERS = {
  'development-focus': [
    'hero-banner', 'development-highlights', 'latest-news', 'upcoming-events',
    'citizen-services', 'about-mla', 'social-feed', 'leader-network', 'testimonial', 'blogs', 'gallery'
  ],
  'public-connect': [
    'hero-banner', 'citizen-services', 'social-feed', 'upcoming-events',
    'development-highlights', 'about-mla', 'latest-news', 'testimonial', 'leader-network', 'blogs', 'gallery'
  ],
  'media-news': [
    'hero-banner', 'latest-news', 'social-feed', 'development-highlights',
    'leader-network', 'upcoming-events', 'about-mla', 'citizen-services', 'testimonial', 'blogs', 'gallery'
  ],
  'political-leadership': [
    'about-mla', 'hero-banner', 'leader-network', 'latest-news',
    'development-highlights', 'upcoming-events', 'social-feed', 'citizen-services', 'testimonial', 'blogs', 'gallery'
  ],
  'complete-intelligence': [
    'about-mla', 'hero-banner', 'development-highlights', 'latest-news',
    'social-feed', 'citizen-services', 'upcoming-events', 'leader-network', 'blogs', 'gallery', 'testimonial'
  ]
};

// ACTIVATE Template (1-click template switch)
router.put('/template', (req, res) => {
  const { templateId, user } = req.body;
  const db = readDb();
  const template = db.settings.templates.find(t => t.id === templateId);
  if (!template) {
    return res.status(404).json({ success: false, message: 'Template not found' });
  }
  db.settings.activeTemplate = templateId;

  // Apply template section order if defined
  const orderPreset = TEMPLATE_ORDERS[templateId];
  if (orderPreset && Array.isArray(db.settings.sections)) {
    const existing = [...db.settings.sections];
    const ordered = [];
    orderPreset.forEach((secId, idx) => {
      const found = existing.find(s => s.id === secId);
      if (found) {
        ordered.push({ ...found, order: idx + 1, enabled: true });
      }
    });
    // Add any remaining sections not in preset
    existing.forEach(s => {
      if (!orderPreset.includes(s.id)) {
        ordered.push({ ...s, order: ordered.length + 1 });
      }
    });
    db.settings.sections = ordered;
  }

  writeDb(db);
  logAudit(user, `Activated Template: ${template.name}`, 'Website Builder', { templateId });
  res.json({ success: true, activeTemplate: templateId, template, sections: db.settings.sections });
});

// UPDATE Sections (Order & Toggles)
router.put('/sections', (req, res) => {
  const { sections, user } = req.body;
  const db = readDb();
  if (Array.isArray(sections)) {
    db.settings.sections = sections;
    writeDb(db);
    logAudit(user, 'Updated Website Sections Reordering/Toggles', 'Section Manager', { count: sections.length });
  }
  res.json({ success: true, sections: db.settings.sections });
});

// TOGGLE single section ON/OFF
router.put('/sections/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const db = readDb();
  const section = db.settings.sections.find(s => s.id === id);
  if (!section) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  section.enabled = !section.enabled;
  writeDb(db);
  logAudit(user, `Toggled Section ${section.name}: ${section.enabled ? 'ON' : 'OFF'}`, 'Section Manager', { id, enabled: section.enabled });
  res.json({ success: true, section });
});

// FESTIVAL Campaign Manager
router.put('/festival', (req, res) => {
  const db = readDb();
  db.settings.festival = { ...db.settings.festival, ...req.body };
  Object.assign(festivalCampaign, db.settings.festival);
  writeDb(db);
  logAudit(req.body.user, `Festival Campaign ${db.settings.festival.active ? 'Activated' : 'Deactivated'}`, 'Festival Campaign', db.settings.festival);
  res.json({ success: true, festival: db.settings.festival });
});

// UPDATE Branding
router.put('/branding', (req, res) => {
  const db = readDb();
  db.settings.branding = { ...db.settings.branding, ...req.body };
  writeDb(db);
  logAudit(req.body.user, 'Updated Branding & Theme', 'Theme & Branding', db.settings.branding);
  res.json({ success: true, branding: db.settings.branding });
});

// UPDATE Theme & Color Scheme (WordPress Style)
router.put('/theme', (req, res) => {
  const { theme, user = 'Admin' } = req.body;
  const db = readDb();
  if (!db.settings) db.settings = {};
  
  db.settings.theme = {
    ...DEFAULT_THEME,
    ...(db.settings.theme || {}),
    ...theme
  };

  // Sync primary and secondary color with branding
  if (theme.primaryColor) {
    if (!db.settings.branding) db.settings.branding = {};
    db.settings.branding.primaryColor = theme.primaryColor;
  }
  if (theme.secondaryColor) {
    if (!db.settings.branding) db.settings.branding = {};
    db.settings.branding.secondaryColor = theme.secondaryColor;
  }

  writeDb(db);
  logAudit(user, `वेबसाइट थीम अपडेट की गई: ${db.settings.theme.preset || 'Custom'} (${db.settings.theme.primaryColor})`, 'Master Theme Manager', db.settings.theme);
  res.json({ success: true, theme: db.settings.theme, message: 'थीम सफलतापूर्वक अपडेट की गई!' });
});

// UPDATE Header & Logo Branding
router.put('/header', (req, res) => {
  const { header, user = 'Admin' } = req.body;
  const db = readDb();
  if (!db.settings) db.settings = {};

  db.settings.header = {
    ...DEFAULT_HEADER,
    ...(db.settings.header || {}),
    ...header
  };

  // Sync siteTitle and slogan with branding
  if (header.siteTitle) {
    if (!db.settings.branding) db.settings.branding = {};
    db.settings.branding.siteTitle = header.siteTitle;
  }
  if (header.tagline) {
    if (!db.settings.branding) db.settings.branding = {};
    db.settings.branding.slogan = header.tagline;
  }

  writeDb(db);
  logAudit(user, `वेबसाइट हेडर व लोगो अपडेट किया गया: ${db.settings.header.siteTitle}`, 'Header Branding', db.settings.header);
  res.json({ success: true, header: db.settings.header, message: 'हेडर एवं लोगो सेटिंग्स सफलतापूर्वक सहेजी गईं!' });
});

// UPDATE Module & Feature Visibility Matrix
router.put('/modules', (req, res) => {
  const { modules, user = 'Admin' } = req.body;
  const db = readDb();
  if (!db.settings) db.settings = {};

  db.settings.modules = {
    ...DEFAULT_MODULES,
    ...(db.settings.modules || {}),
    ...modules
  };

  writeDb(db);
  logAudit(user, 'वेबसाइट मॉड्यूल्स विजिबिलिटी सेटिंग्स अपडेट की गईं', 'Module Manager', db.settings.modules);
  res.json({ success: true, modules: db.settings.modules, message: 'मॉड्यूल विजिबिलिटी सेटिंग्स सहेजी गईं!' });
});

// TOGGLE single module
router.post('/modules/toggle', (req, res) => {
  const { moduleKey, user = 'Admin' } = req.body;
  const db = readDb();
  if (!db.settings) db.settings = {};
  if (!db.settings.modules) db.settings.modules = { ...DEFAULT_MODULES };

  if (!moduleKey) {
    return res.status(400).json({ success: false, message: 'moduleKey is required' });
  }

  const current = Boolean(db.settings.modules[moduleKey]);
  db.settings.modules[moduleKey] = !current;
  writeDb(db);

  logAudit(user, `मॉड्यूल [${moduleKey}] को ${!current ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'} किया गया`, 'Module Manager', { moduleKey, state: !current });
  res.json({ success: true, moduleKey, state: !current, modules: db.settings.modules });
});

// RESET Master Layout & Theme to defaults
router.post('/master-layout/reset', (req, res) => {
  const { user = 'Admin' } = req.body;
  const db = readDb();
  if (!db.settings) db.settings = {};

  db.settings.theme = { ...DEFAULT_THEME };
  db.settings.header = { ...DEFAULT_HEADER };
  db.settings.modules = { ...DEFAULT_MODULES };

  writeDb(db);
  logAudit(user, 'मास्टर लेआउट एवं थीम डिफ़ॉल्ट पर रीसेट किया गया', 'Master Theme Manager', {});
  res.json({
    success: true,
    theme: db.settings.theme,
    header: db.settings.header,
    modules: db.settings.modules,
    message: 'मास्टर लेआउट एवं थीम सफलतापूर्वक मूल स्थिति में रीसेट कर दिया गया!'
  });
});

// ============================================================================
// SUPER ADMIN: MULTI-LEADER PORTAL PROVISIONING & LEADER PROFILE MANAGEMENT
// ============================================================================

// GET all Leader Profiles (Super Admin Multi-Leader SaaS)
router.get('/leader-profiles', (req, res) => {
  const db = readDb();
  if (!db.leaderProfiles || !db.leaderProfiles.length) {
    db.leaderProfiles = [
      {
        id: 'sarita_bhadauria',
        name: db.mla?.name || 'श्रीमती सरिता भदौरिया',
        nameEn: 'Smt. Sarita Bhadauria',
        title: db.mla?.title || 'विधायक, इटावा विधानसभा (200)',
        constituency: db.mla?.constituency || 'इटावा (200)',
        district: db.mla?.district || 'इटावा',
        state: db.mla?.state || 'उत्तर प्रदेश',
        party: db.mla?.party || 'भारतीय जनता पार्टी (BJP)',
        photo: db.mla?.photo || '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
        siteTitle: db.settings?.header?.siteTitle || 'जनसेवा इटावा',
        highlightWord: db.settings?.header?.highlightWord || 'इटावा',
        tagline: '“मजबूत नेतृत्व, विकसित इटावा, समृद्ध भारत”',
        themePreset: db.settings?.theme?.preset || 'saffron',
        active: true,
        status: 'active'
      },
      {
        id: 'rajesh_kumar_lucknow',
        name: 'श्री राजेश कुमार सिंह',
        nameEn: 'Shri Rajesh Kumar Singh',
        title: 'विधायक, लखनऊ कैंट विधानसभा (175)',
        constituency: 'लखनऊ कैंट (175)',
        district: 'लखनऊ',
        state: 'उत्तर प्रदेश',
        party: 'भारतीय जनता पार्टी (BJP)',
        photo: '/images/assets/modi_portrait.jpg',
        siteTitle: 'जनसेवा लखनऊ कैंट',
        highlightWord: 'लखनऊ',
        tagline: '“स्मार्ट राजधानी, विकसित लखनऊ, सुशासन संकल्प”',
        themePreset: 'royal_blue',
        active: false,
        status: 'ready'
      },
      {
        id: 'anurag_dixit_kanpur',
        name: 'डॉ. अनुराग दीक्षित',
        nameEn: 'Dr. Anurag Dixit',
        title: 'जनप्रतिनिधि, कानपुर नगर (213)',
        constituency: 'कानपुर नगर (213)',
        district: 'कानपुर',
        state: 'उत्तर प्रदेश',
        party: 'सर्वजन विकास मोर्चा',
        photo: '/images/assets/yogi_portrait.jpg',
        siteTitle: 'जनसेवा कानपुर नगर',
        highlightWord: 'कानपुर',
        tagline: '“औद्योगिक क्रांति, युवा रोजगार, जनहित सर्वोपरि”',
        themePreset: 'emerald',
        active: false,
        status: 'ready'
      }
    ];
    db.activeLeaderId = 'sarita_bhadauria';
    writeDb(db);
  }

  const activeLeader = db.mla || db.leaderProfiles.find(l => l.active) || db.leaderProfiles[0];
  const activeLeaderId = db.activeLeaderId || db.leaderProfiles.find(l => l.active)?.id || db.leaderProfiles[0].id;

  res.json({
    success: true,
    profiles: db.leaderProfiles,
    leaderProfiles: db.leaderProfiles,
    activeLeaderId,
    activeLeader
  });
});

// UPDATE Active Leader Profile (Super Admin)
router.put('/leader-profile', (req, res) => {
  const { profile, user = 'Admin' } = req.body;
  const db = readDb();
  if (!db.mla) db.mla = {};
  
  db.mla = {
    ...db.mla,
    ...profile
  };

  // Sync with active item in leaderProfiles
  if (db.leaderProfiles && db.leaderProfiles.length) {
    const activeIdx = db.leaderProfiles.findIndex(l => l.active || l.id === db.activeLeaderId);
    if (activeIdx >= 0) {
      db.leaderProfiles[activeIdx] = {
        ...db.leaderProfiles[activeIdx],
        ...profile
      };
    }
  }

  writeDb(db);
  logAudit(user, `सुपर एडमिन ने जननेता प्रोफाइल अपडेट की: ${db.mla.name}`, 'Super Admin Multi-Leader', db.mla);
  res.json({
    success: true,
    mla: db.mla,
    activeLeader: db.mla,
    profiles: db.leaderProfiles,
    leaderProfiles: db.leaderProfiles,
    message: 'जननेता प्रोफाइल सफलतापूर्वक अपडेट की गई!'
  });
});

// CREATE New Leader Portal Profile (Super Admin)
router.post('/leader-profiles', (req, res) => {
  const { profile, user = 'Admin' } = req.body;
  const db = readDb();
  if (!db.leaderProfiles) db.leaderProfiles = [];

  const newProfile = {
    id: profile.id || 'leader-' + Date.now(),
    name: profile.name || 'नया जननेता',
    nameEn: profile.nameEn || profile.name || '',
    title: profile.title || `विधायक, ${profile.constituency || 'क्षेत्र'}`,
    constituency: profile.constituency || 'विधानसभा क्षेत्र',
    district: profile.district || 'जिला',
    state: profile.state || 'उत्तर प्रदेश',
    party: profile.party || 'भारतीय जनता पार्टी (BJP)',
    photo: profile.photo || '/uploads/images/default_leader.png',
    siteTitle: profile.siteTitle || `जनसेवा ${profile.constituency || 'पोर्टल'}`,
    highlightWord: profile.highlightWord || profile.constituency || 'सेवा',
    tagline: profile.tagline || '“जनसेवा ही सच्चा संकल्प है”',
    subtitle: profile.subtitle || 'People • Development • Trust',
    primaryColor: profile.primaryColor || '#ea580c',
    secondaryColor: profile.secondaryColor || '#16a34a',
    preset: profile.preset || 'saffron',
    themePreset: profile.themePreset || profile.preset || 'saffron',
    active: false,
    status: 'ready',
    createdAt: new Date().toISOString()
  };

  db.leaderProfiles.push(newProfile);
  writeDb(db);
  logAudit(user, `सुपर एडमिन ने नया जननेता पोर्टल प्रोफाइल बनाया: ${newProfile.name}`, 'Super Admin Multi-Leader', newProfile);
  res.json({
    success: true,
    profile: newProfile,
    profiles: db.leaderProfiles,
    leaderProfiles: db.leaderProfiles,
    message: `नया जननेता पोर्टल [${newProfile.name}] सफलतापूर्वक बनाया गया!`
  });
});

// SWITCH Active Leader Portal (Super Admin 1-Click Provisioning)
router.post('/leader-profiles/activate/:id', (req, res) => {
  const { id } = req.params;
  const { user = 'Admin' } = req.body;
  const db = readDb();
  if (!db.leaderProfiles) db.leaderProfiles = [];

  const target = db.leaderProfiles.find(l => l.id === id || l.id.includes(id) || (id.includes(l.id)));
  if (!target) {
    return res.status(404).json({ success: false, message: 'Leader profile not found' });
  }

  db.leaderProfiles.forEach(l => {
    l.active = (l.id === target.id);
    l.status = (l.id === target.id) ? 'active' : 'ready';
  });
  db.activeLeaderId = target.id;
  
  // Apply this leader's data to active portal
  db.mla = {
    ...(db.mla || {}),
    name: target.name,
    nameEn: target.nameEn || target.name,
    title: target.title,
    constituency: target.constituency,
    district: target.district || db.mla?.district || '',
    state: target.state || db.mla?.state || 'उत्तर प्रदेश',
    party: target.party || db.mla?.party || '',
    photo: target.photo || db.mla?.photo,
    image: target.photo || db.mla?.image
  };

  if (!db.settings) db.settings = {};
  if (!db.settings.header) db.settings.header = {};
  if (target.siteTitle) db.settings.header.siteTitle = target.siteTitle;
  if (target.highlightWord) db.settings.header.highlightWord = target.highlightWord;
  if (target.constituency) db.settings.header.constituency = `${target.siteTitle} (${target.constituency})`;
  if (target.tagline) db.settings.header.tagline = target.tagline;
  if (target.photo && db.settings.hero) db.settings.hero.saritaImage = target.photo;
  if (target.name && db.settings.hero) {
    db.settings.hero.signature = target.name;
    db.settings.hero.designation = target.title;
  }
  if (target.themePreset && db.settings.theme) {
    db.settings.theme.preset = target.themePreset;
  }

  writeDb(db);
  logAudit(user, `सुपर एडमिन ने सक्रिय जननेता पोर्टल बदला: ${target.name} (${target.constituency})`, 'Super Admin Multi-Leader', { id, target });
  res.json({
    success: true,
    message: `सक्रिय पोर्टल सफलतापूर्वक "${target.name} (${target.constituency})" पर स्विच किया गया!`,
    activeLeaderId: target.id,
    activeLeader: db.mla,
    profiles: db.leaderProfiles,
    leaderProfiles: db.leaderProfiles,
    header: db.settings.header,
    settings: db.settings
  });
});

// UPDATE SEO & Meta Settings
router.put('/seo', (req, res) => {
  const db = readDb();
  if (!db.settings) db.settings = {};
  db.settings.seo = { ...(db.settings.seo || {}), ...req.body };
  writeDb(db);
  logAudit(req.body.user, 'Updated SEO & Meta Tags', 'Website Builder', db.settings.seo);
  res.json({ success: true, seo: db.settings.seo });
});

// UPDATE Custom CSS & JS
router.put('/custom-code', (req, res) => {
  const db = readDb();
  if (!db.settings) db.settings = {};
  db.settings.customCode = { ...(db.settings.customCode || {}), ...req.body };
  writeDb(db);
  logAudit(req.body.user, 'Updated Custom CSS & JS', 'Website Builder', db.settings.customCode);
  res.json({ success: true, customCode: db.settings.customCode });
});

// UPDATE Blog Section Settings
router.put('/blog-settings', (req, res) => {
  const db = readDb();
  if (!db.settings) db.settings = {};
  db.settings.blogSettings = { ...(db.settings.blogSettings || {}), ...req.body };
  writeDb(db);
  logAudit(req.body.user, 'Updated Blog Settings', 'Website Builder', db.settings.blogSettings);
  res.json({ success: true, blogSettings: db.settings.blogSettings });
});

// Helper: compute interval days
function getIntervalDays(interval) {
  switch (interval) {
    case 'weekly': return 7;
    case 'biweekly': return 15;
    case 'monthly': return 30;
    case 'quarterly': return 90;
    default: return 7;
  }
}

// GET MLA Photo & Schedule Details
router.get('/mla-photos', (req, res) => {
  const db = readDb();
  const currentPhoto = db.settings?.hero?.saritaImage || '/images/assets/sarita_bhadauria_hero.jpg';
  const officialBanner = db.settings?.mlaPhotoSchedule?.officialBanner || db.settings?.hero?.officialBanner || '/images/assets/official_bjp_mla_banner.jpg';
  const schedule = db.settings?.mlaPhotoSchedule || {
    updateInterval: 'weekly',
    intervalDays: 7,
    autoRotate: false,
    lastUpdated: new Date().toISOString(),
    nextScheduledUpdate: new Date(Date.now() + 7 * 86400000).toISOString(),
    showOfficialBanner: true,
    officialBanner: '/images/assets/official_bjp_mla_banner.jpg'
  };

  const defaultHistory = [
    {
      id: 'photo-1',
      title: 'आधिकारिक सदन व विधायी सत्र पोर्ट्रेट (सफेद साड़ी)',
      url: '/images/assets/sarita_bhadauria_hero.jpg',
      category: 'आधिकारिक',
      date: '2026-09-15',
      active: true
    },
    {
      id: 'photo-2',
      title: 'जनसंवाद एवं चौपाल कार्यक्रम (पारंपरिक परिधान)',
      url: '/images/poli4.png',
      category: 'जनसंवाद',
      date: '2026-09-08',
      active: false
    },
    {
      id: 'photo-3',
      title: 'विधानसभा क्षेत्र भ्रमण एवं विकास निरीक्षण',
      url: '/images/poli1.png',
      category: 'क्षेत्रीय दौरा',
      date: '2026-09-01',
      active: false
    },
    {
      id: 'photo-4',
      title: 'पर्व एवं विशेष दिवस औपचारिक भेंट',
      url: '/images/poli3.png',
      category: 'त्यौहार',
      date: '2026-08-25',
      active: false
    }
  ];

  const history = (db.mlaPhotoHistory && db.mlaPhotoHistory.length) ? db.mlaPhotoHistory : defaultHistory;

  res.json({
    success: true,
    currentPhoto,
    officialBanner,
    schedule,
    history
  });
});

// UPDATE MLA Active Photo & Regular Interval Schedule
router.put('/mla-photo', (req, res) => {
  const { photoUrl, officialBanner, updateInterval, autoRotate, photoTitle, showOfficialBanner, user } = req.body;
  const db = readDb();
  if (!db.settings) db.settings = {};
  if (!db.settings.hero) db.settings.hero = {};
  if (!db.mla) db.mla = {};

  const days = getIntervalDays(updateInterval || 'weekly');
  const now = new Date();
  const nextDate = new Date(now.getTime() + days * 86400000);

  // Update photo if provided
  if (photoUrl) {
    db.settings.hero.saritaImage = photoUrl;
    db.mla.photo = photoUrl;
    db.mla.image = photoUrl;
  }

  // Update official banner if provided
  if (officialBanner) {
    db.settings.hero.officialBanner = officialBanner;
    db.mla.banner = officialBanner;
  }

  // Update schedule
  db.settings.mlaPhotoSchedule = {
    updateInterval: updateInterval || 'weekly',
    intervalDays: days,
    autoRotate: Boolean(autoRotate),
    lastUpdated: now.toISOString(),
    nextScheduledUpdate: nextDate.toISOString(),
    showOfficialBanner: showOfficialBanner !== undefined ? Boolean(showOfficialBanner) : true,
    officialBanner: officialBanner || db.settings.hero.officialBanner || '/images/assets/official_bjp_mla_banner.jpg'
  };

  // Update history
  if (!db.mlaPhotoHistory) db.mlaPhotoHistory = [];
  
  if (photoUrl) {
    db.mlaPhotoHistory.forEach(h => { h.active = false; });
    const existingIndex = db.mlaPhotoHistory.findIndex(h => h.url === photoUrl);
    if (existingIndex >= 0) {
      db.mlaPhotoHistory[existingIndex].active = true;
      if (photoTitle) db.mlaPhotoHistory[existingIndex].title = photoTitle;
    } else {
      db.mlaPhotoHistory.unshift({
        id: 'photo-' + Date.now(),
        title: photoTitle || 'विधायक अद्यतित पोर्ट्रेट',
        url: photoUrl,
        category: 'आधिकारिक',
        date: now.toISOString().split('T')[0],
        active: true
      });
    }
  }

  writeDb(db);
  logAudit(user, `Updated MLA Photo & Schedule (${updateInterval}, Auto-rotate: ${autoRotate})`, 'MLA Media Manager', {
    photoUrl,
    updateInterval,
    nextScheduledUpdate: nextDate.toISOString()
  });

  res.json({
    success: true,
    message: 'विधायक फोटो एवं शेड्यूलिंग सफलतापूर्वक अपडेट की गई!',
    currentPhoto: db.settings.hero.saritaImage,
    schedule: db.settings.mlaPhotoSchedule,
    history: db.mlaPhotoHistory
  });
});

// SET ACTIVE MLA PHOTO from History
router.post('/mla-photos/set-active/:id', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const db = readDb();
  if (!db.mlaPhotoHistory) db.mlaPhotoHistory = [];

  const photo = db.mlaPhotoHistory.find(p => p.id === id);
  if (!photo) {
    return res.status(404).json({ success: false, message: 'फोटो नहीं मिली।' });
  }

  db.mlaPhotoHistory.forEach(p => { p.active = (p.id === id); });
  if (!db.settings) db.settings = {};
  if (!db.settings.hero) db.settings.hero = {};
  if (!db.mla) db.mla = {};

  db.settings.hero.saritaImage = photo.url;
  db.mla.photo = photo.url;
  db.mla.image = photo.url;

  if (db.settings.mlaPhotoSchedule) {
    db.settings.mlaPhotoSchedule.lastUpdated = new Date().toISOString();
    const days = db.settings.mlaPhotoSchedule.intervalDays || 7;
    db.settings.mlaPhotoSchedule.nextScheduledUpdate = new Date(Date.now() + days * 86400000).toISOString();
  }

  writeDb(db);
  logAudit(user, `Set Active MLA Photo: ${photo.title}`, 'MLA Media Manager', { photoId: id, url: photo.url });

  res.json({
    success: true,
    message: `"${photo.title}" अब वेबसाइट पर सक्रिय है!`,
    currentPhoto: photo.url,
    history: db.mlaPhotoHistory
  });
});

// ADD to Photo History
router.post('/mla-photos/add-archive', (req, res) => {
  const { title, url, category, setAsActive, user } = req.body;
  const db = readDb();
  if (!db.mlaPhotoHistory) db.mlaPhotoHistory = [];

  const newPhoto = {
    id: 'photo-' + Date.now(),
    title: title || 'विधायक नया चित्र',
    url: url || '/images/poli4.png',
    category: category || 'आधिकारिक',
    date: new Date().toISOString().split('T')[0],
    active: Boolean(setAsActive)
  };

  if (setAsActive) {
    db.mlaPhotoHistory.forEach(p => { p.active = false; });
    if (!db.settings) db.settings = {};
    if (!db.settings.hero) db.settings.hero = {};
    if (!db.mla) db.mla = {};
    db.settings.hero.saritaImage = newPhoto.url;
    db.mla.photo = newPhoto.url;
    db.mla.image = newPhoto.url;
  }

  db.mlaPhotoHistory.unshift(newPhoto);
  writeDb(db);
  logAudit(user, `Added Photo to MLA Archive: ${newPhoto.title}`, 'MLA Media Manager', newPhoto);

  res.json({
    success: true,
    message: 'फोटो आर्काइव में सफलतापूर्वक जोड़ी गई!',
    photo: newPhoto,
    history: db.mlaPhotoHistory
  });
});

// DELETE from Photo History
router.delete('/mla-photos/:id', (req, res) => {
  const { id } = req.params;
  const { user } = req.query;
  const db = readDb();
  if (!db.mlaPhotoHistory) db.mlaPhotoHistory = [];

  const initialLen = db.mlaPhotoHistory.length;
  db.mlaPhotoHistory = db.mlaPhotoHistory.filter(p => p.id !== id);

  if (db.mlaPhotoHistory.length !== initialLen) {
    writeDb(db);
    logAudit(user, `Deleted Photo ${id} from MLA Archive`, 'MLA Media Manager', { id });
    return res.json({ success: true, message: 'फोटो आर्काइव से हटा दी गई।' });
  }

  res.status(404).json({ success: false, message: 'फोटो नहीं मिली।' });
});

// Default Mobile Configuration
const DEFAULT_MOBILE_SETTINGS = {
  appName: "जनसेवा इटावा 200",
  appTagline: "श्रीमती सरिता भदौरिया • आधिकारिक मोबाइल पोर्टल",
  helplinePhone: "05688250000",
  officialWhatsapp: "9876543210",
  slogan: "“जनता का विश्वास, हमारी सेवा का संकल्प”",
  showTopRoleSwitcher: true,
  showRoleCredentialsBtn: true,
  features: {
    heroProfile: true,
    quickCounters: true,
    janSamvadSpotlight: true,
    whatsappRegBox: true,
    dailyActivities: true,
    guidanceLeaders: true,
    governmentSchemes: true,
    developmentWorks: true,
    peopleDirectory: true,
    constituencyMap: true,
    socialMediaFeed: true,
    latestNews: true,
    festivalBanner: true,
    leadershipQuotes: true,
    websiteDrawer: true
  },
  bottomTabs: {
    home: true,
    jansamvad: true,
    directory: true,
    works: true,
    websiteMenu: true,
    profile: true
  }
};

// GET Mobile Settings
router.get('/mobile', (req, res) => {
  try {
    const db = readDb();
    if (!db.settings.mobile) {
      db.settings.mobile = { ...DEFAULT_MOBILE_SETTINGS };
      writeDb(db);
    }
    res.json({
      success: true,
      mobile: db.settings.mobile
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE Mobile Settings
router.put('/mobile', (req, res) => {
  try {
    const db = readDb();
    const { settings: newSettings, user = 'Admin' } = req.body;
    db.settings.mobile = {
      ...DEFAULT_MOBILE_SETTINGS,
      ...(db.settings.mobile || {}),
      ...newSettings,
      features: {
        ...DEFAULT_MOBILE_SETTINGS.features,
        ...((db.settings.mobile && db.settings.mobile.features) || {}),
        ...(newSettings.features || {})
      },
      bottomTabs: {
        ...DEFAULT_MOBILE_SETTINGS.bottomTabs,
        ...((db.settings.mobile && db.settings.mobile.bottomTabs) || {}),
        ...(newSettings.bottomTabs || {})
      }
    };
    writeDb(db);
    logAudit(user, 'Updated Mobile App Features & Menu Controls', 'Mobile CMS', db.settings.mobile);
    res.json({
      success: true,
      message: 'मोबाइल ऐप व मेन्यू सेटिंग्स सफलतापूर्वक अपडेट की गईं!',
      mobile: db.settings.mobile
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// TOGGLE Mobile Feature
router.post('/mobile/toggle', (req, res) => {
  try {
    const { featureKey, tabKey, user = 'Admin' } = req.body;
    const db = readDb();
    if (!db.settings.mobile) {
      db.settings.mobile = { ...DEFAULT_MOBILE_SETTINGS };
    }

    if (featureKey) {
      const cur = Boolean(db.settings.mobile.features[featureKey]);
      db.settings.mobile.features[featureKey] = !cur;
      writeDb(db);
      logAudit(user, `Toggled mobile feature [${featureKey}]: ${!cur ? 'Enabled' : 'Disabled'}`, 'Mobile CMS', { featureKey, state: !cur });
      return res.json({ success: true, featureKey, state: !cur, mobile: db.settings.mobile });
    }

    if (tabKey) {
      const cur = Boolean(db.settings.mobile.bottomTabs[tabKey]);
      db.settings.mobile.bottomTabs[tabKey] = !cur;
      writeDb(db);
      logAudit(user, `Toggled mobile bottom tab [${tabKey}]: ${!cur ? 'Enabled' : 'Disabled'}`, 'Mobile CMS', { tabKey, state: !cur });
      return res.json({ success: true, tabKey, state: !cur, mobile: db.settings.mobile });
    }

    res.status(400).json({ success: false, message: 'featureKey or tabKey is required' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;




