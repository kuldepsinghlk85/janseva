// server/data/templates.js
// Node.js JavaScript Native Data Storage - Dynamic Homepage Templates & Sections

const templates = [
  {
    id: 1,
    key: "development-focus",
    name: "Development Focus Homepage",
    nameHi: "विकास केंद्रित होमपेज",
    active: true,
    description: "सड़क, स्कूल, अस्पताल, पेयजल और आधारभूत संरचना पर केंद्रित मुख्य लेआउट।",
    sections: [
      "hero",
      "stats",
      "leaderSocial",
      "constituencyMap",
      "latestWorks",
      "schemes",
      "timeline",
      "citizenConnect",
      "bottomBanner"
    ]
  },
  {
    id: 2,
    key: "public-connect",
    name: "Public Connect Homepage",
    nameHi: "जनसंवाद होमपेज",
    active: false,
    description: "नागरिक संपर्क, समस्या निवारण, बैठकों और QR सदस्यता पर जोर।",
    sections: [
      "hero",
      "stats",
      "citizenConnect",
      "constituencyMap",
      "latestWorks",
      "leaderSocial",
      "bottomBanner"
    ]
  },
  {
    id: 3,
    key: "media-news",
    name: "Media & News Homepage",
    nameHi: "मीडिया एवं समाचार होमपेज",
    active: false,
    description: "दैनिक समाचार कवरेज, प्रेस विज्ञप्तियां और मीडिया वीडियो।",
    sections: [
      "hero",
      "news",
      "blogs",
      "leaderSocial",
      "stats",
      "bottomBanner"
    ]
  },
  {
    id: 4,
    key: "leadership-focus",
    name: "Political Leadership Homepage",
    nameHi: "राजनीतिक नेतृत्व होमपेज",
    active: false,
    description: "पार्टी विचारधारा, राष्ट्रीय नेताओं के मार्गदर्शन और रैलियों का संकलन।",
    sections: [
      "hero",
      "leaderSocial",
      "stats",
      "schemes",
      "latestWorks",
      "bottomBanner"
    ]
  },
  {
    id: 5,
    key: "complete-intelligence",
    name: "Complete Intelligence Dashboard Homepage",
    nameHi: "समग्र इंटेलिजेंस होमपेज",
    active: false,
    description: "लाइव मैप्स, विकास स्टेटस चार्ट और डेटा विज़ुअलाइज़ेशन युक्त समग्र डैशबोर्ड।",
    sections: [
      "hero",
      "stats",
      "constituencyMap",
      "latestWorks",
      "timeline",
      "schemes",
      "leaderSocial",
      "citizenConnect",
      "bottomBanner"
    ]
  }
];

const websiteSections = [
  { id: "hero-banner", name: "Hero Banner", nameHi: "मुख्य बैनर", enabled: true, order: 1 },
  { id: "development-highlights", name: "6 Live Stat Badges", nameHi: "6 मुख्य सांख्यिकी बैज", enabled: true, order: 2 },
  { id: "leader-social", name: "Leader Social Updates", nameHi: "बड़े नेता सोशल अपडेट", enabled: true, order: 3 },
  { id: "constituency-map", name: "Constituency & QR Connect", nameHi: "विधानसभा क्षेत्र व QR कनेक्ट", enabled: true, order: 4 },
  { id: "latest-news", name: "Latest Development Updates", nameHi: "ताजा विकास अपडेट", enabled: true, order: 5 },
  { id: "schemes", name: "Popular Schemes", nameHi: "लोकप्रिय सरकारी योजनाएँ", enabled: true, order: 6 },
  { id: "timeline", name: "Development Timeline", nameHi: "विकास की समयरेखा", enabled: true, order: 7 },
  { id: "bottom-banner", name: "Bottom Panorama Trio Banner", nameHi: "नीचे का पैनोरमा बैनर", enabled: true, order: 8 },
  { id: "gallery", name: "Media Gallery", nameHi: "फोटो व वीडियो गैलरी", enabled: true, order: 9 }
];

module.exports = { templates, websiteSections };
