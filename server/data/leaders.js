// server/data/leaders.js
// Node.js JavaScript Native Data Storage - Leaders Network

const leaders = [
  {
    id: 1,
    name: "नरेन्द्र मोदी",
    nameEn: "Narendra Modi",
    position: "प्रधानमंत्री",
    party: "BJP",
    quote: "विकसित भारत का आधार है विकसित प्रदेश और सशक्त जिले।",
    photo: "/images/assets/modi_portrait.jpg",
    posts: 3,
    engagement: "25K",
    socialUpdate: {
      handle: "@narendramodi",
      image: "/images/assets/social_modi.jpg",
      text: "नया भारत, विकसित भारत के लिए मिलकर काम करें। हर नागरिक का प्रयास राष्ट्र को नई ऊंचाइयों पर ले जाएगा।",
      likes: "2.4M",
      comments: "12K",
      shares: "5.1K"
    }
  },
  {
    id: 2,
    name: "योगी आदित्यनाथ",
    nameEn: "Yogi Adityanath",
    position: "मुख्यमंत्री, उत्तर प्रदेश",
    party: "BJP",
    quote: "हर जिले का विकास हर गांव का उत्थान यही हमारी पहचान।",
    photo: "/images/assets/yogi_portrait.jpg",
    posts: 5,
    engagement: "18K",
    socialUpdate: {
      handle: "@myogiadityanath",
      image: "/images/assets/social_yogi.jpg",
      text: "यूपी का हर जिला बनेगा विकास का मॉडल। विकास की अविरल धारा से हर गांव और कस्बे का उत्थान।",
      likes: "1.1M",
      comments: "8.5K",
      shares: "2.3K"
    }
  },
  {
    id: 3,
    name: "सरिता भदौरिया",
    nameEn: "Sarita Bhadauria",
    position: "विधायक, इटावा (200)",
    party: "BJP",
    quote: "जनता का विश्वास, विकास का संकल्प, इटावा का उज्जवल भविष्य।",
    photo: "/images/assets/sarita_bhadauria_hero.jpg",
    posts: 8,
    engagement: "12K",
    socialUpdate: {
      handle: "@SaritaBhadauria",
      image: "/images/assets/sarita_bhadauria_hero.jpg",
      text: "सेवा, संवाद और विकास ही हमारा संकल्प है। हर नागरिक की समस्या का त्वरित निवारण।",
      likes: "180K",
      comments: "4.5K",
      shares: "1.2K"
    }
  },
  {
    id: 4,
    name: "भारतीय जनता पार्टी",
    nameEn: "BJP India",
    position: "भाजपा राष्ट्रीय",
    party: "BJP",
    quote: "सेवा, सुशासन और गरीब कल्याण।",
    photo: "/images/assets/social_bjp.jpg",
    posts: 8,
    engagement: "12K",
    socialUpdate: {
      handle: "@BJP4India",
      image: "/images/assets/social_bjp.jpg",
      text: "सेवा, सुशासन, गरीब कल्याण। अंत्योदय के पावन संकल्प के साथ प्रत्येक नागरिक की सेवा में समर्पित।",
      likes: "850K",
      comments: "6.2K",
      shares: "1.9K"
    }
  },
  {
    id: 5,
    name: "हेमा मालिनी",
    nameEn: "Hema Malini",
    position: "सांसद, मथुरा",
    party: "BJP",
    quote: "कला, संस्कृति और जनसेवा का सुंदर समन्वय।",
    photo: "/images/assets/modi_portrait.jpg",
    posts: 1,
    engagement: "8K",
    socialUpdate: null
  }
];

module.exports = { leaders };
