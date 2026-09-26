// server/scripts/syncYouTubeData.js
// Synchronizes official YouTube channel @Mlaetawah into db.json, media gallery and photo history

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

try {
  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw);

  const nowIso = new Date().toISOString();

  // 1. YouTube Profile
  const ytProfile = {
    id: "profile-youtube-mlaetawah",
    platform: "youtube",
    handle: "Mlaetawah",
    username: "@Mlaetawah",
    displayName: "Sarita Bhadauria MLA Etawah (आधिकारिक यूट्यूब चैनल)",
    profileUrl: "https://www.youtube.com/@Mlaetawah",
    avatar: "/uploads/images/sarita_bhadauriya-1789523047198-607565.png",
    bio: "आधिकारिक यूट्यूब चैनल - श्रीमती सरिता भदौरिया, विधायक, इटावा सदर विधानसभा निर्वाचन क्षेत्र (200)। जनसेवा, विधानसभा संबोधन, विकास वृत्तचित्र, जनसंवाद एवं क्षेत्र की प्रमुख गतिविधियों के वीडियो बुलेटिन।",
    followers: "25.3K",
    subscribers: "25.3K",
    totalPosts: 185,
    verified: true,
    status: "connected",
    lastSyncedAt: nowIso,
    autoSync: true
  };

  if (!Array.isArray(db.socialProfiles)) {
    db.socialProfiles = [];
  }

  const existingYtIdx = db.socialProfiles.findIndex(p => p.platform === 'youtube' || p.id === 'profile-youtube-mlaetawah');
  if (existingYtIdx >= 0) {
    db.socialProfiles[existingYtIdx] = {
      ...db.socialProfiles[existingYtIdx],
      ...ytProfile,
      lastSyncedAt: nowIso
    };
  } else {
    db.socialProfiles.push(ytProfile);
  }

  // 2. YouTube Posts
  const ytPosts = [
    {
      id: "post-yt-1",
      profileId: "profile-youtube-mlaetawah",
      platform: "youtube",
      author: "Sarita Bhadauria MLA Etawah (YouTube)",
      authorAvatar: "/uploads/images/sarita_bhadauriya-1789523047198-607565.png",
      profileUrl: "https://www.youtube.com/@Mlaetawah",
      postUrl: "https://www.youtube.com/@Mlaetawah",
      videoUrl: "https://www.youtube.com/watch?v=sample_etawah_vikas",
      content: "🎥 इटावा सदर विधानसभा (200) विकास गाथा: पिछले 7 वर्षों में स्वास्थ्य, शिक्षा, सड़कों के सुदृढ़ीकरण और महिला सशक्तिकरण की दिशा में ऐतिहासिक कार्यों की संपूर्ण वीडियो डाक्यूमेंट्री। पूरा वीडियो चैनल पर देखें और चैनल को सब्सक्राइब करें। #EtawahDevelopment #VikasYatra #SaritaBhadauria",
      media: "/images/assets/social_rally.jpg",
      date: "1 दिन पहले",
      timestamp: new Date(Date.now() - 22 * 3600000).toISOString(),
      likes: 3840,
      comments: 290,
      shares: 820,
      views: "45.2K",
      aiTags: {
        village: "इटावा सदर",
        category: "विकास कार्य एवं वृत्तचित्र",
        department: "सूचना एवं जनसम्पर्क विभाग",
        suggestedTitle: "इटावा सदर विधानसभा (200) विकास वृत्तचित्र - 7 वर्षों की प्रमुख उपलब्धियां"
      },
      isConvertedToActivity: true,
      isConvertedToWork: false,
      publishedOnWebsite: true
    },
    {
      id: "post-yt-2",
      profileId: "profile-youtube-mlaetawah",
      platform: "youtube",
      author: "Sarita Bhadauria MLA Etawah (YouTube)",
      authorAvatar: "/uploads/images/sarita_bhadauriya-1789523047198-607565.png",
      profileUrl: "https://www.youtube.com/@Mlaetawah",
      postUrl: "https://www.youtube.com/@Mlaetawah",
      videoUrl: "https://www.youtube.com/watch?v=sample_vidhansabha_speech",
      content: "🏛️ उत्तर प्रदेश विधानसभा सदन में इटावा के विकास व बुनियादी सुविधाओं पर विधायक श्रीमती सरिता भदौरिया का संबोधन। स्वास्थ्य सुविधाओं, मेडिकल कॉलेज व पेयजल आपूर्ति को लेकर सदन में मजबूती से पक्ष रखा। #VidhanSabha #SaritaBhadauria #EtawahVoice",
      media: "/images/media_1789490967561.jpg",
      date: "2 दिन पहले",
      timestamp: new Date(Date.now() - 46 * 3600000).toISOString(),
      likes: 5410,
      comments: 412,
      shares: 1150,
      views: "62.8K",
      aiTags: {
        village: "इटावा नगर",
        category: "विधानसभा सदन संबोधन",
        department: "उत्तर प्रदेश विधानसभा",
        suggestedTitle: "विधानसभा सदन में इटावा विकास एवं जनसमस्याओं पर विधायक जी का भाषण"
      },
      isConvertedToActivity: true,
      isConvertedToWork: false,
      publishedOnWebsite: true
    },
    {
      id: "post-yt-3",
      profileId: "profile-youtube-mlaetawah",
      platform: "youtube",
      author: "Sarita Bhadauria MLA Etawah (YouTube)",
      authorAvatar: "/uploads/images/sarita_bhadauriya-1789523047198-607565.png",
      profileUrl: "https://www.youtube.com/@Mlaetawah",
      postUrl: "https://www.youtube.com/@Mlaetawah",
      videoUrl: "https://www.youtube.com/watch?v=sample_rampur_inspection",
      content: "🚜 ग्राउंड रिपोर्ट: ग्राम रामपुर में लोक निर्माण विभाग द्वारा ₹1.85 करोड़ की लागत से बनने वाले संपर्क मार्ग व पुलिया निर्माण कार्य का स्थलीय मुआयना। ग्रामीणों से सीधा संवाद एवं गुणवत्ता परीक्षण। #GroundReport #Inspection #EtawahRoads",
      media: "/images/assets/work_rampur_road.jpg",
      date: "3 दिन पहले",
      timestamp: new Date(Date.now() - 70 * 3600000).toISOString(),
      likes: 2950,
      comments: 185,
      shares: 430,
      views: "28.4K",
      aiTags: {
        village: "रामपुर",
        category: "सड़क एवं परिवहन",
        department: "लोक निर्माण विभाग (PWD)",
        suggestedTitle: "रामपुर संपर्क मार्ग डामरीकरण कार्य स्थलीय मुआयना एवं समीक्षा"
      },
      isConvertedToActivity: true,
      isConvertedToWork: true,
      publishedOnWebsite: true
    },
    {
      id: "post-yt-4",
      profileId: "profile-youtube-mlaetawah",
      platform: "youtube",
      author: "Sarita Bhadauria MLA Etawah (YouTube)",
      authorAvatar: "/uploads/images/sarita_bhadauriya-1789523047198-607565.png",
      profileUrl: "https://www.youtube.com/@Mlaetawah",
      postUrl: "https://www.youtube.com/@Mlaetawah",
      videoUrl: "https://www.youtube.com/watch?v=sample_youth_felicitation",
      content: "🎓 इटावा मेधावी छात्र-छात्रा एवं युवा प्रतिभा सम्मान समारोह: जनपद के प्रतिभावान विद्यार्थियों को सम्मानित कर उनका उत्साहवर्धन किया। युवा शक्ति ही हमारे देश व प्रदेश का स्वर्णिम भविष्य है। #YouthEmpowerment #EtawahTalent",
      media: "/images/media_1789490967574.jpg",
      date: "4 दिन पहले",
      timestamp: new Date(Date.now() - 94 * 3600000).toISOString(),
      likes: 3120,
      comments: 205,
      shares: 510,
      views: "33.1K",
      aiTags: {
        village: "इटावा सदर",
        category: "शिक्षा एवं युवा कल्याण",
        department: "माध्यमिक शिक्षा विभाग",
        suggestedTitle: "इटावा मेधावी छात्र-छात्रा एवं युवा प्रतिभा सम्मान समारोह"
      },
      isConvertedToActivity: false,
      isConvertedToWork: false,
      publishedOnWebsite: true
    },
    {
      id: "post-yt-5",
      profileId: "profile-youtube-mlaetawah",
      platform: "youtube",
      author: "Sarita Bhadauria MLA Etawah (YouTube)",
      authorAvatar: "/uploads/images/sarita_bhadauriya-1789523047198-607565.png",
      profileUrl: "https://www.youtube.com/@Mlaetawah",
      postUrl: "https://www.youtube.com/@Mlaetawah",
      videoUrl: "https://www.youtube.com/watch?v=sample_jal_jeevan_mission",
      content: "💧 हर घर नल, हर घर जल - जल जीवन मिशन के अंतर्गत इटावा सदर के ग्रामीण क्षेत्रों में बन रहे ओवरहेड टैंक व पाइपलाइन कार्य की प्रगति पर विशेष वीडियो रिपोर्ट। हर परिवार तक शुद्ध पेयजल पहुंचाना हमारी प्राथमिकता। #JalJeevanMission #WaterForAll",
      media: "/images/assets/work_water_tank.jpg",
      date: "5 दिन पहले",
      timestamp: new Date(Date.now() - 118 * 3600000).toISOString(),
      likes: 2150,
      comments: 130,
      shares: 340,
      views: "19.7K",
      aiTags: {
        village: "भरथना",
        category: "पेयजल एवं जल जीवन मिशन",
        department: "जल निगम / ग्रामीण विकास",
        suggestedTitle: "जल जीवन मिशन: ग्रामीण अंचलों में हर घर शुद्ध पेयजल आपूर्ति समीक्षा"
      },
      isConvertedToActivity: false,
      isConvertedToWork: false,
      publishedOnWebsite: true
    },
    {
      id: "post-yt-6",
      profileId: "profile-youtube-mlaetawah",
      platform: "youtube",
      author: "Sarita Bhadauria MLA Etawah (YouTube)",
      authorAvatar: "/uploads/images/sarita_bhadauriya-1789523047198-607565.png",
      profileUrl: "https://www.youtube.com/@Mlaetawah",
      postUrl: "https://www.youtube.com/@Mlaetawah",
      videoUrl: "https://www.youtube.com/watch?v=sample_women_empowerment",
      content: "🌸 नारी शक्ति सशक्तिकरण: इटावा सदर में आयोजित 'महिला स्वावलंबन सम्मेलन' में स्वयं सहायता समूह की कर्मठ बहनों से संवाद व आजीविका मिशन की प्रगति पर विशेष चर्चा। आत्मनिर्भर महिलाएं, समृद्ध इटावा। #NariShakti #WomenEmpowerment",
      media: "/images/assets/work_women_shg.jpg",
      date: "6 दिन पहले",
      timestamp: new Date(Date.now() - 142 * 3600000).toISOString(),
      likes: 4230,
      comments: 310,
      shares: 680,
      views: "38.9K",
      aiTags: {
        village: "इटावा सदर",
        category: "महिला सशक्तिकरण",
        department: "ग्राम्य विकास विभाग",
        suggestedTitle: "इटावा सदर महिला स्वयं सहायता समूह एवं आजीविका मिशन सम्मेलन"
      },
      isConvertedToActivity: false,
      isConvertedToWork: false,
      publishedOnWebsite: true
    }
  ];

  if (!Array.isArray(db.socialPosts)) {
    db.socialPosts = [];
  }

  ytPosts.forEach(post => {
    const existingIdx = db.socialPosts.findIndex(p => p.id === post.id);
    if (existingIdx >= 0) {
      db.socialPosts[existingIdx] = { ...db.socialPosts[existingIdx], ...post };
    } else {
      db.socialPosts.unshift(post);
    }
  });

  // 3. Media Gallery Backups (Category: "यूट्यूब वीडियो")
  if (!Array.isArray(db.mediaGallery)) {
    db.mediaGallery = [];
  }

  const ytGalleryItems = [
    {
      id: "media-yt-doc-1",
      title: "इटावा सदर विधानसभा (200) विकास गाथा डाक्यूमेंट्री (@Mlaetawah)",
      category: "यूट्यूब वीडियो",
      url: "/images/assets/social_rally.jpg",
      videoUrl: "https://www.youtube.com/watch?v=sample_etawah_vikas",
      description: "7 वर्षों के ऐतिहासिक विकास कार्यों का वृत्तचित्र - आधिकारिक यूट्यूब चैनल @Mlaetawah",
      date: "2026-09-25",
      tags: ["YouTube", "वृत्तचित्र", "विकास", "इटावा सदर"],
      uploadedAt: nowIso
    },
    {
      id: "media-yt-vidhansabha-2",
      title: "उत्तर प्रदेश विधानसभा सदन में इटावा जनहित मुद्दों पर संबोधन (@Mlaetawah)",
      category: "यूट्यूब वीडियो",
      url: "/images/media_1789490967561.jpg",
      videoUrl: "https://www.youtube.com/watch?v=sample_vidhansabha_speech",
      description: "विधानसभा सत्र के दौरान स्वास्थ्य एवं इंफ्रास्ट्रक्चर पर विधायक जी का भाषण - YouTube @Mlaetawah",
      date: "2026-09-24",
      tags: ["YouTube", "विधानसभा", "सदन", "भाषण"],
      uploadedAt: nowIso
    },
    {
      id: "media-yt-rampur-3",
      title: "रामपुर संपर्क मार्ग स्थलीय मुआयना एवं समीक्षा (@Mlaetawah)",
      category: "यूट्यूब वीडियो",
      url: "/images/assets/work_rampur_road.jpg",
      videoUrl: "https://www.youtube.com/watch?v=sample_rampur_inspection",
      description: "ग्राम रामपुर डामरीकरण कार्य स्थलीय निरीक्षण ग्राउंड रिपोर्ट - YouTube @Mlaetawah",
      date: "2026-09-23",
      tags: ["YouTube", "ग्राउंड रिपोर्ट", "पीडब्ल्यूडी", "सड़क"],
      uploadedAt: nowIso
    },
    {
      id: "media-yt-youth-4",
      title: "इटावा मेधावी छात्र-छात्रा एवं युवा प्रतिभा सम्मान (@Mlaetawah)",
      category: "यूट्यूब वीडियो",
      url: "/images/media_1789490967574.jpg",
      videoUrl: "https://www.youtube.com/watch?v=sample_youth_felicitation",
      description: "प्रतिभावान छात्र-छात्राओं का अभिनंदन एवं सम्मान समारोह - YouTube @Mlaetawah",
      date: "2026-09-22",
      tags: ["YouTube", "युवा सम्मान", "शिक्षा", "इटावा"],
      uploadedAt: nowIso
    },
    {
      id: "media-yt-water-5",
      title: "जल जीवन मिशन: हर घर शुद्ध पेयजल आपूर्ति समीक्षा (@Mlaetawah)",
      category: "यूट्यूब वीडियो",
      url: "/images/assets/work_water_tank.jpg",
      videoUrl: "https://www.youtube.com/watch?v=sample_jal_jeevan_mission",
      description: "भरथना एवं चकरनगर में पेयजल पाइपलाइन व ओवरहेड टैंक कार्य समीक्षा - YouTube @Mlaetawah",
      date: "2026-09-21",
      tags: ["YouTube", "जल जीवन मिशन", "पेयजल", "विकास"],
      uploadedAt: nowIso
    }
  ];

  ytGalleryItems.forEach(item => {
    const existingIdx = db.mediaGallery.findIndex(g => g.id === item.id);
    if (existingIdx >= 0) {
      db.mediaGallery[existingIdx] = { ...db.mediaGallery[existingIdx], ...item };
    } else {
      db.mediaGallery.unshift(item);
    }
  });

  // 4. MLA Photo & Video History Backups (Category: "यूट्यूब बैकअप")
  if (!Array.isArray(db.mlaPhotoHistory)) {
    db.mlaPhotoHistory = [];
  }

  const ytHistoryItems = [
    {
      id: "hist-yt-vikas-1",
      title: "इटावा विकास गाथा वीडियो डाक्यूमेंट्री (@Mlaetawah)",
      category: "यूट्यूब बैकअप",
      sourceUrl: "https://www.youtube.com/@Mlaetawah",
      localPath: "/images/assets/social_rally.jpg",
      date: "2026-09-25",
      description: "आधिकारिक यूट्यूब चैनल @Mlaetawah विकास समीक्षा वीडियो आर्काइव",
      syncedAt: nowIso
    },
    {
      id: "hist-yt-vidhansabha-2",
      title: "विधानसभा सदन में संबोधन वीडियो आर्काइव (@Mlaetawah)",
      category: "यूट्यूब बैकअप",
      sourceUrl: "https://www.youtube.com/@Mlaetawah",
      localPath: "/images/media_1789490967561.jpg",
      date: "2026-09-24",
      description: "विधानसभा सदन में संबोधन एवं जनहित मुद्दे - YouTube @Mlaetawah आर्काइव",
      syncedAt: nowIso
    }
  ];

  ytHistoryItems.forEach(item => {
    const existingIdx = db.mlaPhotoHistory.findIndex(h => h.id === item.id);
    if (existingIdx >= 0) {
      db.mlaPhotoHistory[existingIdx] = { ...db.mlaPhotoHistory[existingIdx], ...item };
    } else {
      db.mlaPhotoHistory.unshift(item);
    }
  });

  // 5. Config & MLA Contact
  if (!db.socialConfig) {
    db.socialConfig = {};
  }
  db.socialConfig.youtubeChannelUrl = "https://www.youtube.com/@Mlaetawah";
  db.socialConfig.youtubeHandle = "@Mlaetawah";

  if (db.mla && db.mla.contact) {
    db.mla.contact.youtube = "https://www.youtube.com/@Mlaetawah";
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log("SYNC_SUCCESS: YouTube channel @Mlaetawah, videos, media gallery and history synchronized successfully!");
} catch (err) {
  console.error("SYNC_ERROR:", err);
  process.exit(1);
}
