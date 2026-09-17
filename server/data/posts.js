// server/data/posts.js
// Node.js JavaScript Native Data Storage - Social Media Posts

const posts = [
  {
    id: 1,
    platform: "instagram",
    author: "sarita_bhadauria_mla",
    content: "आज ग्राम सैफ़ई में विकास कार्यों का सघन निरीक्षण किया। अधिकारियों को गुणवत्ता और समयसीमा सुनिश्चित करने के सख्त निर्देश दिए। जनता का विश्वास ही हमारी सबसे बड़ी शक्ति है।",
    media: "/images/assets/work_school_children.jpg",
    date: "2 hours ago",
    likes: 2450,
    comments: 142,
    shares: 89,
    autoAdded: true,
    tags: ["सैफई", "विकास कार्य", "निरीक्षण"]
  },
  {
    id: 2,
    platform: "facebook",
    author: "Sarita Bhadauria MLA Etawah",
    content: "महिला स्वावलंबन समूह के साथ आत्मीय संवाद। इटावा की नारी शक्ति अब स्वयं सहायता समूहों के माध्यम से आर्थिक स्वावलंबन की नई मिसाल पेश कर रही है।",
    media: "/images/assets/work_women_shg.jpg",
    date: "5 hours ago",
    likes: 4120,
    comments: 298,
    shares: 340,
    autoAdded: true,
    tags: ["इटावा सदर", "महिला सशक्तिकरण", "आजीविका"]
  },
  {
    id: 3,
    platform: "youtube",
    author: "Sarita Bhadauria Official",
    content: "इटावा विकास यात्रा | जनता के साथ चौपाल में संवाद एवं विकास योजनाओं की प्रगति रिपोर्ट। पूरा वीडियो देखें।",
    media: "/images/assets/work_rampur_road.jpg",
    date: "12 hours ago",
    likes: 8920,
    comments: 560,
    shares: 810,
    autoAdded: true,
    tags: ["बकेवर", "जनसंवाद", "चौपाल"]
  },
  {
    id: 4,
    platform: "twitter",
    author: "@SaritaBhadauria",
    content: "आदरणीय प्रधानमंत्री श्री @narendramodi जी एवं मुख्यमंत्री श्री @myogiadityanath जी के मार्गदर्शन में इटावा विधानसभा (200) विकास की नई ऊंचाइयों को छू रहा है। #ViksitBharat #ViksitUP",
    media: "/images/assets/social_rally.jpg",
    date: "1 day ago",
    likes: 1820,
    comments: 115,
    shares: 430,
    autoAdded: true,
    tags: ["इटावा सदर", "नेतृत्व", "भाजपा"]
  }
];

module.exports = { posts };
