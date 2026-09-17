// server/data/socialProfiles.js
// Official Social Media Profiles and Initial Synced Post Streams

const initialProfiles = [
  {
    id: "profile-instagram-mlaetawah",
    platform: "instagram",
    handle: "mlaetawah",
    username: "@mlaetawah",
    displayName: "श्रीमती सरिता भदौरिया (MLA Etawah)",
    profileUrl: "https://www.instagram.com/mlaetawah/?hl=en",
    avatar: "/images/poli4.png",
    bio: "विधायक - इटावा सदर विधानसभा (200), उत्तर प्रदेश विधानसभा | भारतीय जनता पार्टी | जनसेवा, विकास एवं अंत्योदय को समर्पित।",
    followers: "18.4K",
    following: "245",
    totalPosts: 432,
    verified: true,
    status: "connected",
    lastSyncedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    autoSync: true
  },
  {
    id: "profile-facebook-mlaetawah",
    platform: "facebook",
    handle: "mlaetawah",
    username: "mlaetawah",
    displayName: "Sarita Bhadauria - MLA Etawah (आधिकारिक पृष्ठ)",
    profileUrl: "https://www.facebook.com/mlaetawah?mibextid=ZbWKwL&utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    avatar: "/images/poli1.png",
    bio: "आधिकारिक फेसबुक पृष्ठ - श्रीमती सरिता भदौरिया, विधायक, इटावा विधानसभा निर्वाचन क्षेत्र (200)। जनसेवा, क्षेत्र का विकास एवं लोक-कल्याण ही सर्वोच्च प्राथमिकता।",
    followers: "34.8K",
    likes: "31.2K",
    totalPosts: 876,
    verified: true,
    status: "connected",
    lastSyncedAt: new Date(Date.now() - 40 * 60000).toISOString(),
    autoSync: true
  }
];

const initialPosts = [
  {
    id: "post-ig-1",
    profileId: "profile-instagram-mlaetawah",
    platform: "instagram",
    author: "श्रीमती सरिता भदौरिया (@mlaetawah)",
    authorAvatar: "/images/poli4.png",
    profileUrl: "https://www.instagram.com/mlaetawah/?hl=en",
    postUrl: "https://www.instagram.com/mlaetawah/?hl=en",
    content: "आज ग्राम सैफ़ई एवं बकेवर क्षेत्र में प्राथमिक विद्यालय के नवीन भवन एवं आधुनिक स्मार्ट क्लासरूम का स्थलीय निरीक्षण किया। नौनिहालों को बेहतर शिक्षा व सभी आधुनिक सुविधाएं उपलब्ध कराना हमारी सरकार का संकल्प है। अधिकारियों को गुणवत्ता से कोई समझौता न करने के सख्त निर्देश दिए।",
    media: "/images/assets/work_school_children.jpg",
    date: "2 घंटे पहले",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    likes: 2450,
    comments: 142,
    shares: 89,
    aiTags: {
      village: "सैफई",
      category: "शिक्षा",
      department: "बेसिक शिक्षा परिषद",
      suggestedTitle: "सैफई प्राथमिक विद्यालय स्मार्ट क्लासरूम व भवन निरीक्षण"
    },
    isConvertedToActivity: false,
    isConvertedToWork: false,
    publishedOnWebsite: true
  },
  {
    id: "post-fb-1",
    profileId: "profile-facebook-mlaetawah",
    platform: "facebook",
    author: "Sarita Bhadauria MLA Etawah",
    authorAvatar: "/images/poli1.png",
    profileUrl: "https://www.facebook.com/mlaetawah?mibextid=ZbWKwL&utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    postUrl: "https://www.facebook.com/mlaetawah?mibextid=ZbWKwL&utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    content: "इटावा सदर में आयोजित 'महिला स्वावलंबन एवं आजीविका सम्मेलन' में स्वयं सहायता समूह की कर्मठ बहनों से संवाद। प्रधानमंत्री आवास व मुद्रा योजना से जुड़कर आत्मनिर्भर बन रहीं हमारी माताएं व बहनें नए भारत की सशक्त तस्वीर प्रस्तुत कर रही हैं।",
    media: "/images/assets/work_women_shg.jpg",
    date: "5 घंटे पहले",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    likes: 4120,
    comments: 298,
    shares: 340,
    aiTags: {
      village: "इटावा सदर",
      category: "महिला सशक्तिकरण",
      department: "ग्राम्य विकास विभाग",
      suggestedTitle: "इटावा सदर महिला स्वयं सहायता समूह संवाद सम्मेलन"
    },
    isConvertedToActivity: false,
    isConvertedToWork: false,
    publishedOnWebsite: true
  },
  {
    id: "post-ig-2",
    profileId: "profile-instagram-mlaetawah",
    platform: "instagram",
    author: "श्रीमती सरिता भदौरिया (@mlaetawah)",
    authorAvatar: "/images/poli4.png",
    profileUrl: "https://www.instagram.com/mlaetawah/?hl=en",
    postUrl: "https://www.instagram.com/mlaetawah/?hl=en",
    content: "ग्राम रामपुर में लोक निर्माण विभाग (PWD) द्वारा ₹1.85 करोड़ की लागत से बनने वाले संपर्क मार्ग के डामरीकरण कार्य का सघन निरीक्षण। ग्रामीणों से बातचीत कर उनकी समस्याओं को सुना और तय समय सीमा में कार्य पूरा करने का निर्देश दिया।",
    media: "/images/assets/work_rampur_road.jpg",
    date: "1 दिन पहले",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    likes: 3210,
    comments: 184,
    shares: 120,
    aiTags: {
      village: "रामपुर",
      category: "सड़क एवं परिवहन",
      department: "लोक निर्माण विभाग (PWD)",
      suggestedTitle: "रामपुर संपर्क मार्ग डामरीकरण कार्य समीक्षा"
    },
    isConvertedToActivity: true,
    isConvertedToWork: true,
    publishedOnWebsite: true
  },
  {
    id: "post-fb-2",
    profileId: "profile-facebook-mlaetawah",
    platform: "facebook",
    author: "Sarita Bhadauria MLA Etawah",
    authorAvatar: "/images/poli1.png",
    profileUrl: "https://www.facebook.com/mlaetawah?mibextid=ZbWKwL&utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    postUrl: "https://www.facebook.com/mlaetawah?mibextid=ZbWKwL&utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    content: "जसवंतनगर एवं बकेवर क्षेत्र के किसान भाइयों के साथ चौपाल में संवाद। प्रधानमंत्री किसान सम्मान निधि एवं जल जीवन मिशन के अंतर्गत हर घर नल योजना की प्रगति की समीक्षा की। किसानों की खुशहाली ही हमारी प्राथमिकता है।",
    media: "/images/assets/work_water_tank.jpg",
    date: "2 दिन पहले",
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
    likes: 5430,
    comments: 412,
    shares: 490,
    aiTags: {
      village: "जसवंतनगर",
      category: "पेयजल",
      department: "जल निगम / जल जीवन मिशन",
      suggestedTitle: "जसवंतनगर-बकेवर किसान संवाद एवं जल जीवन मिशन समीक्षा"
    },
    isConvertedToActivity: false,
    isConvertedToWork: false,
    publishedOnWebsite: true
  },
  {
    id: "post-ig-3",
    profileId: "profile-instagram-mlaetawah",
    platform: "instagram",
    author: "श्रीमती सरिता भदौरिया (@mlaetawah)",
    authorAvatar: "/images/poli4.png",
    profileUrl: "https://www.instagram.com/mlaetawah/?hl=en",
    postUrl: "https://www.instagram.com/mlaetawah/?hl=en",
    content: "इटावा जिला अस्पताल में स्वास्थ्य सेवाओं, आपातकालीन वार्ड व दवा वितरण व्यवस्था का औचक निरीक्षण किया। मरीजों व उनके तीमारदारों से मिलकर कुशलक्षेम जाना और डॉक्टरों को शत-प्रतिशत संवेदनशीलता के साथ उपचार सुनिश्चित करने के कड़े निर्देश दिए।",
    media: "/images/poli3.png",
    date: "3 दिन पहले",
    timestamp: new Date(Date.now() - 72 * 3600000).toISOString(),
    likes: 3890,
    comments: 215,
    shares: 145,
    aiTags: {
      village: "इटावा सदर",
      category: "स्वास्थ्य",
      department: "चिकित्सा एवं स्वास्थ्य विभाग",
      suggestedTitle: "इटावा जिला चिकित्सालय औचक निरीक्षण व स्वास्थ्य सेवा समीक्षा"
    },
    isConvertedToActivity: false,
    isConvertedToWork: false,
    publishedOnWebsite: true
  }
];

module.exports = { initialProfiles, initialPosts };
