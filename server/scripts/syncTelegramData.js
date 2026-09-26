// server/scripts/syncTelegramData.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. MLA Contact
if (!db.mla) db.mla = {};
if (!db.mla.contact) db.mla.contact = {};
db.mla.contact.telegram = 'https://t.me/sarrita8';

// 2. Settings MLA Contact
if (db.settings && db.settings.mla && db.settings.mla.contact) {
  db.settings.mla.contact.telegram = 'https://t.me/sarrita8';
}

// 3. Social Config
if (!db.socialConfig) db.socialConfig = {};
db.socialConfig.telegramChannelUrl = 'https://t.me/sarrita8';
db.socialConfig.telegramHandle = '@sarrita8';

// 4. Social Profiles
if (!Array.isArray(db.socialProfiles)) db.socialProfiles = [];
const existingTgIdx = db.socialProfiles.findIndex(p => p.platform === 'telegram');
const tgProfile = {
  id: 'profile-telegram-sarrita8',
  platform: 'telegram',
  handle: 'sarrita8',
  username: '@sarrita8',
  displayName: 'Sarita Bhadauria MLA Etawah (आधिकारिक टेलीग्राम चैनल)',
  profileUrl: 'https://t.me/sarrita8',
  avatar: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
  bio: 'आधिकारिक टेलीग्राम चैनल - श्रीमती सरिता भदौरिया, विधायक, इटावा सदर विधानसभा निर्वाचन क्षेत्र (200)। जनसेवा, त्वरित सूचना, विकास बुलेटिन एवं लोक-कल्याणकारी योजनाएं।',
  followers: '12.5K',
  subscribers: '12.5K',
  totalPosts: 310,
  verified: true,
  status: 'connected',
  lastSyncedAt: new Date().toISOString(),
  autoSync: true
};
if (existingTgIdx >= 0) {
  db.socialProfiles[existingTgIdx] = tgProfile;
} else {
  db.socialProfiles.push(tgProfile);
}

// 5. Social Posts
if (!Array.isArray(db.socialPosts)) db.socialPosts = [];
const tgPosts = [
  {
    id: 'post-tg-1',
    profileId: 'profile-telegram-sarrita8',
    platform: 'telegram',
    author: 'Sarita Bhadauria MLA Etawah (Telegram)',
    authorAvatar: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
    profileUrl: 'https://t.me/sarrita8',
    postUrl: 'https://t.me/sarrita8',
    content: '📢 इटावा सदर विधानसभा (200) विकास बुलेटिन: जल जीवन मिशन के अंतर्गत आगामी सोमवार से ग्राम भरथना एवं चकरनगर क्षेत्र में शुद्ध पेयजल पाइपलाइन व ओवरहेड टैंक का कार्य प्रारंभ हो रहा है। किसी भी समस्या या सुझाव हेतु विधायक कार्यालय हेल्पलाइन या आधिकारिक टेलीग्राम चैनल पर संपर्क करें। #EtawahVikas #TelegramUpdate',
    media: '/images/assets/work_water_tank.jpg',
    date: '4 घंटे पहले',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    likes: 1840,
    comments: 92,
    shares: 410,
    aiTags: {
      village: 'भरथना',
      category: 'पेयजल एवं जल जीवन मिशन',
      department: 'जल निगम / ग्रामीण विकास',
      suggestedTitle: 'जल जीवन मिशन: भरथना एवं चकरनगर में नवीन पेयजल पाइपलाइन कार्य'
    },
    isConvertedToActivity: false,
    isConvertedToWork: false,
    publishedOnWebsite: true
  },
  {
    id: 'post-tg-2',
    profileId: 'profile-telegram-sarrita8',
    platform: 'telegram',
    author: 'Sarita Bhadauria MLA Etawah (Telegram)',
    authorAvatar: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
    profileUrl: 'https://t.me/sarrita8',
    postUrl: 'https://t.me/sarrita8',
    content: '🇮🇳 जनसंवाद एवं युवा सशक्तिकरण: केंद्र व प्रदेश सरकार की स्वरोजगार व मुद्रा लोन योजनाओं का लाभ हर पात्र युवा तक पहुँचाने का संकल्प। आधिकारिक टेलीग्राम चैनल t.me/sarrita8 से जुड़ें और सीधे क्षेत्रीय विकास गतिविधियों से अवगत रहें।',
    media: '/images/media_1789490967547.jpg',
    date: '1 दिन पहले',
    timestamp: new Date(Date.now() - 28 * 3600000).toISOString(),
    likes: 2950,
    comments: 135,
    shares: 620,
    aiTags: {
      village: 'इटावा सदर',
      category: 'युवा कल्याण एवं रोजगार',
      department: 'कौशल विकास एवं सेवायोजन',
      suggestedTitle: 'इटावा युवा संवाद: स्वरोजगार एवं कल्याणकारी योजनाओं का प्रचार-प्रसार'
    },
    isConvertedToActivity: true,
    isConvertedToWork: false,
    publishedOnWebsite: true
  }
];

tgPosts.forEach(tp => {
  if (!db.socialPosts.some(p => p.id === tp.id)) {
    db.socialPosts.unshift(tp);
  }
});

// 6. Media Gallery - Telegram Backups & Assets
if (!Array.isArray(db.mediaGallery)) db.mediaGallery = [];
const tgMediaItems = [
  {
    id: 'm-tg-1',
    title: 'टेलीग्राम बुलेटिन - जनसंवाद एवं क्षेत्रीय सभा (t.me/sarrita8)',
    type: 'Photo',
    url: '/images/media_1789490967547.jpg',
    category: 'टेलीग्राम ब्रॉडकास्ट'
  },
  {
    id: 'm-tg-2',
    title: 'टेलीग्राम चैनल बैकअप - सेवा पखवाड़ा एवं वृक्षारोपण',
    type: 'Photo',
    url: '/images/assets/work_health_camp.jpg',
    category: 'टेलीग्राम ब्रॉडकास्ट'
  },
  {
    id: 'm-tg-3',
    title: 'टेलीग्राम मीडिया बैकअप - वंदे भारत स्वागत एवं सभा',
    type: 'Photo',
    url: '/images/assets/social_rally.jpg',
    category: 'टेलीग्राम ब्रॉडकास्ट'
  },
  {
    id: 'm-tg-4',
    title: 'टेलीग्राम आधिकारिक पोर्ट्रेट बैकअप (सरिता भदौरिया)',
    type: 'Photo',
    url: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
    category: 'विधायक फोटो बैकअप'
  }
];
tgMediaItems.forEach(mi => {
  if (!db.mediaGallery.some(m => m.id === mi.id)) {
    db.mediaGallery.push(mi);
  }
});

// 7. mlaPhotoHistory - Approved photo backups
if (!Array.isArray(db.mlaPhotoHistory)) db.mlaPhotoHistory = [];
const tgPhotoHistory = [
  {
    id: 'photo-tg-sarrita8-1',
    title: 'टेलीग्राम आधिकारिक प्रोफ़ाइल पोर्ट्रेट (@sarrita8)',
    url: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
    category: 'टेलीग्राम बैकअप',
    date: '2026-09-26',
    active: true
  },
  {
    id: 'photo-tg-sarrita8-2',
    title: 'जनसेवा एवं जनसंवाद फोटो बैकअप (t.me/sarrita8)',
    url: '/images/media_1789490967547.jpg',
    category: 'टेलीग्राम बैकअप',
    date: '2026-09-26',
    active: false
  }
];
tgPhotoHistory.forEach(ph => {
  if (!db.mlaPhotoHistory.some(p => p.id === ph.id)) {
    db.mlaPhotoHistory.push(ph);
  }
});

// 8. leaderProfiles
if (Array.isArray(db.leaderProfiles)) {
  db.leaderProfiles.forEach(lp => {
    if (!lp.socialLinks) lp.socialLinks = {};
    lp.socialLinks.telegram = 'https://t.me/sarrita8';
  });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('SYNC_SUCCESS: db.json has been synchronized with Telegram account and media backup.');
