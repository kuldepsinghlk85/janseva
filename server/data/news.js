// server/data/news.js
// Node.js JavaScript Native Data Storage - Regional News RSS

const news = [
  {
    id: 1,
    source: "अमर उजाला (Amar Ujala)",
    title: "इटावा में ₹15 करोड़ की ग्रामीण सड़कों का कायाकल्प, विधायक सरिता भदौरिया ने किया निरीक्षण",
    location: "रामपुर, इटावा",
    date: "2026-09-15",
    content: "इटावा विधानसभा के 12 प्रमुख ग्रामीण मार्गों के चौड़ीकरण और सुदृढ़ीकरण हेतु लोक निर्माण विभाग की टीम के साथ विधायक ने स्थलीय निरीक्षण किया।",
    summary: "ग्रामीण सड़कों का कायाकल्प, 60 दिन में कार्य पूर्ण करने का निर्देश।",
    category: "सड़क एवं परिवहन",
    image: "/images/assets/work_rampur_road.jpg",
    tags: ["Roads", "PWD", "Etawah"],
    status: "converted"
  },
  {
    id: 2,
    source: "दैनिक जागरण (Dainik Jagran)",
    title: "बकेवर में कन्या उच्च प्राथमिक विद्यालय को मिला स्मार्ट लैब का तोहफा",
    location: "बकेवर, इटावा",
    date: "2026-09-14",
    content: "विधायक निधि और सीएसआर सहयोग से बकेवर क्षेत्र की बालिकाओं हेतु अत्याधुनिक कंप्यूटर व रोबोटिक्स लैब का उद्घाटन हुआ।",
    summary: "बालिकाओं हेतु अत्याधुनिक कंप्यूटर व रोबोटिक्स लैब का उद्घाटन।",
    category: "शिक्षा",
    image: "/images/assets/work_school_children.jpg",
    tags: ["Education", "SmartLab", "Bakewar"],
    status: "unread"
  },
  {
    id: 3,
    source: "हिन्दुस्तान (Hindustan)",
    title: "हर घर नल योजना: इटावा के 80 गांवों में शुद्ध पेयजल आपूर्ति की शुरुआत",
    location: "तकरोई, इटावा",
    date: "2026-09-13",
    content: "जल जीवन मिशन के अंतर्गत विधानसभा क्षेत्र के 80 से अधिक गांवों में पाइपलाइन बिछाने का काम अंतिम चरण में।",
    summary: "80 से अधिक गांवों में पाइपलाइन बिछाने का काम अंतिम चरण में।",
    category: "पेयजल",
    image: "/images/assets/work_women_shg.jpg",
    tags: ["Water", "JJM", "Takroi"],
    status: "unread"
  }
];

module.exports = { news };
