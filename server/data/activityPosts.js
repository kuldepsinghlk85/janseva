// server/data/activityPosts.js
// Node.js JavaScript Object & JSON File Storage - MLA Daily Activity Publisher & Development Timeline Engine

const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, 'activityPosts.json');

const defaultActivities = [
  {
    id: 1,
    slug: "road-inauguration-rampur",
    title: "ग्राम रामपुर से वैदपुरा 8.5 किमी नवनिर्मित संपर्क मार्ग का भव्य लोकार्पण",
    category: "Inauguration",
    categoryHi: "लोकार्पण",
    date: "2026-09-16",
    time: "11:30 AM",
    location: {
      village: "रामपुर",
      block: "इटावा सदर",
      district: "इटावा"
    },
    shortDescription: "विधायक श्रीमती सरिता भदौरिया द्वारा रामपुर-वैदपुरा डामरीकृत संपर्क मार्ग का वैदिक मंत्रोच्चार के साथ लोकार्पण।",
    fullDescription: "आज ग्राम रामपुर में लोक निर्माण विभाग द्वारा 8.5 करोड़ रुपये की लागत से नवनिर्मित 8.5 किमी डामरीकृत संपर्क मार्ग का विधिवत लोकार्पण किया गया। इस अवसर पर क्षेत्र के सैकड़ों किसान भाइयों और माताओं-बहनों ने वर्षों पुरानी मांग पूर्ण होने पर पुष्पवर्षा कर आभार प्रकट किया।\n\nसड़क निर्माण से रामपुर, वैदपुरा, पिपरोली सहित दर्जन भर गांवों का सीधा संपर्क जिला मुख्यालय और मुख्य राजमार्ग से सुगम हो गया है। निरीक्षण के दौरान अधिकारियों को निर्देशित किया गया कि सड़क के दोनों किनारों पर वृक्षारोपण और सुरक्षा संकेतक तत्काल लगाए जाएं।",
    images: [
      "/images/assets/work_rampur_road.jpg",
      "/images/assets/work_health_camp.jpg"
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    documents: [
      { name: "प्रोजेक्ट स्वीकृति पत्र (PWD).pdf", url: "#" }
    ],
    externalLinks: [
      { title: "उत्तर प्रदेश लोक निर्माण विभाग (UP PWD)", url: "https://uppwd.gov.in" },
      { title: "इटावा जिला प्रशासन आधिकारिक पोर्टल", url: "https://etawah.nic.in" }
    ],
    tags: ["#Road", "#Development", "#Rampur", "#Inauguration", "#Etawah200"],
    shareEnabled: true,
    status: "published",
    views: 1240,
    shares: 280,
    createdAt: "2026-09-16T11:30:00.000Z",
    updatedAt: "2026-09-16T11:30:00.000Z"
  },
  {
    id: 2,
    slug: "smart-class-inspection-ggic",
    title: "राजकीय बालिका इंटर कॉलेज में स्मार्ट क्लास व आधुनिक विज्ञान प्रयोगशाला का स्थलीय निरीक्षण",
    category: "Inspection",
    categoryHi: "स्थलीय निरीक्षण",
    date: "2026-09-14",
    time: "02:00 PM",
    location: {
      village: "इटावा नगर",
      block: "इटावा सदर",
      district: "इटावा"
    },
    shortDescription: "बालिका इंटर कॉलेज में 'ऑपरेशन कायाकल्प' के अंतर्गत स्थापित डिजिटल प्रयोगशाला व कक्षाओं का अवलोकन कर छात्राओं से संवाद।",
    fullDescription: "इटावा नगर स्थित राजकीय बालिका इंटर कॉलेज (GGIC) में उत्तर प्रदेश सरकार की महत्वाकांक्षी योजना 'ऑपरेशन कायाकल्प' के तहत निर्मित स्मार्ट डिजिटल क्लासरूम एवं आधुनिक विज्ञान प्रयोगशाला का औचक निरीक्षण किया।\n\nछात्राओं के साथ संवाद करते हुए उनकी शैक्षणिक आवश्यकताओं और नवाचारों पर चर्चा की। छात्राओं का उत्साह देखकर अत्यंत प्रसन्नता हुई। विद्यालय प्रबंधन को निर्देश दिए गए कि सभी डिजिटल उपकरण नियमित रूप से क्रियाशील रहें एवं प्रत्येक बालिका को कंप्यूटर व कोडिंग की बुनियादी शिक्षा मिले।",
    images: [
      "/images/assets/work_school_children.jpg",
      "/images/assets/work_women_shg.jpg"
    ],
    videoUrl: "",
    documents: [],
    externalLinks: [
      { title: "माध्यमिक शिक्षा परिषद उत्तर प्रदेश", url: "https://upmsp.edu.in" }
    ],
    tags: ["#Education", "#GirlsEmpowerment", "#Inspection", "#SmartClass"],
    shareEnabled: true,
    status: "published",
    views: 980,
    shares: 165,
    createdAt: "2026-09-14T14:00:00.000Z",
    updatedAt: "2026-09-14T14:00:00.000Z"
  },
  {
    id: 3,
    slug: "women-shg-samvad-takroi",
    title: "ग्राम तकरोई में महिला स्वयं सहायता समूहों के साथ जनसंवाद एवं ऋण चेक वितरण",
    category: "Public Meeting",
    categoryHi: "जनसंवाद चौपाल",
    date: "2026-09-12",
    time: "10:00 AM",
    location: {
      village: "तकरोई",
      block: "बकेवर",
      district: "इटावा"
    },
    shortDescription: "दीनदयाल अंत्योदय योजना के तहत 45 महिला स्वयं सहायता समूहों को स्वावलंबन हेतु 45 लाख रुपये के चेक वितरित।",
    fullDescription: "ग्राम तकरोई में आयोजित विशाल नारी शक्ति चौपाल में बकेवर क्षेत्र के 45 से अधिक स्वयं सहायता समूहों की बहनों के साथ आत्मीय संवाद किया। इस अवसर पर राष्ट्रीय ग्रामीण आजीविका मिशन (NRLM) के तहत विभिन्न समूहों को स्वरोजगार व कुटीर उद्योग हेतु ऋण स्वीकृति चेक सौंपे गए।\n\nमाताओं-बहनों द्वारा हस्तनिर्मित उत्पादों (अचार, मुरब्बा, वस्त्र एवं जैविक खाद) की प्रदर्शनी का भी अवलोकन किया और उनके उत्पादों को स्थानीय हाट-बाजारों व ई-कॉमर्स से जोड़ने हेतु अधिकारियों को निर्देशित किया।",
    images: [
      "/images/assets/work_women_shg.jpg"
    ],
    videoUrl: "",
    documents: [],
    externalLinks: [
      { title: "राष्ट्रीय ग्रामीण आजीविका मिशन (NRLM)", url: "https://aajeevika.gov.in" }
    ],
    tags: ["#WomenSHG", "#SelfReliantWomen", "#NRLM", "#Takroi"],
    shareEnabled: true,
    status: "published",
    views: 1450,
    shares: 340,
    createdAt: "2026-09-12T10:00:00.000Z",
    updatedAt: "2026-09-12T10:00:00.000Z"
  },
  {
    id: 4,
    slug: "health-camp-pilkhar-chc",
    title: "सामुदायिक स्वास्थ्य केंद्र पिलखर में डिजिटल एक्स-रे एवं पैथोलॉजी सेवा का शुभारंभ",
    category: "Development Work",
    categoryHi: "विकास कार्य",
    date: "2026-09-10",
    time: "11:00 AM",
    location: {
      village: "पिलखर",
      block: "जसवंतनगर मार्ग",
      district: "इटावा"
    },
    shortDescription: "पिलखर सीएचसी में अत्याधुनिक डायग्नोस्टिक सेवाओं का शुभारंभ, क्षेत्रवासियों को अब जांच हेतु शहर नहीं जाना पड़ेगा।",
    fullDescription: "विधायक निधि एवं स्वास्थ्य विभाग के संयुक्त प्रयासों से सीएचसी पिलखर में आधुनिक डिजिटल एक्स-रे मशीन, अल्ट्रासाउंड एवं कंप्यूटराइज्ड पैथोलॉजी लैब की स्थापना पूर्ण कर जनसेवा हेतु समर्पित की गई।\n\nइस सुविधा से पिलखर, उदी, बढ़पुरा सहित 30 से अधिक ग्रामीण अंचलों के मरीजों को निःशुल्क व त्वरित जांच सुविधा उपलब्ध होगी। इस अवसर पर आयोजित स्वास्थ्य शिविर में 450 से अधिक नागरिकों का स्वास्थ्य परीक्षण कर निःशुल्क दवाएं वितरित की गईं।",
    images: [
      "/images/assets/work_health_camp.jpg"
    ],
    videoUrl: "",
    documents: [],
    externalLinks: [
      { title: "राष्ट्रीय स्वास्थ्य मिशन उत्तर प्रदेश", url: "https://nhm.up.gov.in" },
      { title: "आयुष्मान भारत पोर्टल", url: "https://pmjay.gov.in" }
    ],
    tags: ["#Healthcare", "#Pilkhar", "#DevelopmentWork", "#HealthForAll"],
    shareEnabled: true,
    status: "published",
    views: 1120,
    shares: 210,
    createdAt: "2026-09-10T11:00:00.000Z",
    updatedAt: "2026-09-10T11:00:00.000Z"
  }
];

// Load from JSON file or initialize
let activities = [];

function loadActivities() {
  try {
    if (fs.existsSync(JSON_FILE)) {
      const data = fs.readFileSync(JSON_FILE, 'utf8');
      activities = JSON.parse(data);
    } else {
      activities = [...defaultActivities];
      saveActivities();
    }
  } catch (err) {
    console.error('Error loading activityPosts.json:', err);
    activities = [...defaultActivities];
  }
}

function saveActivities() {
  try {
    fs.writeFileSync(JSON_FILE, JSON.stringify(activities, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving activityPosts.json:', err);
  }
}

loadActivities();

module.exports = {
  activities,
  saveActivities,
  loadActivities
};
