// server/data/mlaProfile.js
// Node.js JavaScript Native Data Storage - MLA Profile

const mlaProfile = {
  id: 1,
  name: "श्रीमती सरिता भदौरिया",
  nameEn: "Smt. Sarita Bhadauria",
  title: "विधायक, इटावा विधानसभा (200)",
  constituency: "इटावा (200)",
  district: "इटावा",
  state: "उत्तर प्रदेश",
  party: "भारतीय जनता पार्टी (BJP)",
  avatar: "/images/assets/sarita_bhadauria_hero.jpg",
  heroPortrait: "/images/assets/sarita_bhadauria_hero.jpg",
  slogans: [
    "जनता की सेवा ही सच्ची राजनीति है।",
    "सपना से सेवा, विकास से विश्वास, जनता का साथ",
    "सेवा, संवाद, विकास हमारा संकल्प",
    "जनता का विश्वास, विकास का संकल्प, इटावा का उज्जवल भविष्य"
  ],
  about: "श्रीमती सरिता भदौरिया उत्तर प्रदेश की 17वीं एवं 18वीं विधानसभा में इटावा विधानसभा (200) का गौरवशाली प्रतिनिधित्व कर रही हैं। वे क्षेत्र के सर्वांगीण विकास, महिला स्वावलंबन, युवाओं के कौशल विकास एवं किसान कल्याण के लिए सदैव समर्पित हैं।",
  electionHistory: [
    { year: "2022", election: "18वीं उत्तर प्रदेश विधानसभा", votes: "98,150", margin: "+17,342", result: "विजेता" },
    { year: "2017", election: "17वीं उत्तर प्रदेश विधानसभा", votes: "91,234", margin: "+17,342", result: "विजेता" }
  ],
  stats: {
    developmentWorks: "125+",
    villagesCovered: "80+",
    population: "5.4 लाख+",
    socialPosts: "2,000+",
    janSamvad: "350+",
    activeMembers: "1,200+"
  },
  contact: {
    office: "विधायक कार्यालय, कलेक्ट्रेट रोड, इटावा, उ.प्र. - 206001",
    helpline: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "mla.etawah200@janseva.org",
    website: "https://janseva-etawah200.org"
  }
};

module.exports = { mlaProfile };
