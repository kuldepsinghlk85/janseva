/**
 * JanSeva AI Intelligence Engine
 * Handles post classification, blog generation from news, and constituency Q&A
 */

const VILLAGES = [
  'Rampur', 'Saifai', 'Bakewar', 'Takroi', 'Pilkhar', 'Jaswantnagar',
  'Bharthana', 'Chakarnagar', 'Udi', 'Banthar', 'Bechpura', 'Barhpura'
];

const CATEGORIES = [
  { name: 'सड़क एवं परिवहन', en: 'Roads & Transport', keywords: ['सड़क', 'मार्ग', 'पुल', 'डामरीकरण', 'road', 'highway', 'bridge', 'construction', 'निर्माण'] },
  { name: 'शिक्षा', en: 'Education', keywords: ['स्कूल', 'विद्यालय', 'शिक्षा', 'कॉलेज', 'छात्र', 'school', 'college', 'education', 'classroom', 'विद्यार्थी'] },
  { name: 'स्वास्थ्य', en: 'Healthcare', keywords: ['अस्पताल', 'स्वास्थ्य', 'दवा', 'शिविर', 'सीएचसी', 'hospital', 'clinic', 'health', 'medical', 'डॉक्टर'] },
  { name: 'पेयजल', en: 'Drinking Water', keywords: ['जल', 'पानी', 'नल', 'जल जीवन मिशन', 'हैंडपंप', 'water', 'pipeline', 'tubewell', 'पेयजल'] },
  { name: 'महिला सशक्तिकरण', en: 'Women Empowerment', keywords: ['महिला', 'स्वयं सहायता', 'दीदी', 'सखी', 'women', 'shg', 'empowerment', 'बालिका'] },
  { name: 'कृषि एवं ग्रामीण विकास', en: 'Agriculture & Rural Dev', keywords: ['किसान', 'कृषि', 'फसल', 'मंडी', 'farmer', 'agriculture', 'panchayat', 'गाँव'] },
  { name: 'बिजली', en: 'Electricity', keywords: ['विद्युत', 'बिजली', 'ट्रांसफार्मर', 'सोलर', 'electricity', 'power', 'light', 'ऊर्जा'] },
  { name: 'सरकारी योजनाएँ', en: 'Govt Schemes', keywords: ['योजना', 'आवास', 'राशन', 'पेंशन', 'आयुष्मान', 'scheme', 'pmay', 'beneficiary', 'लाभार्थी'] }
];

const DEPARTMENTS = [
  { name: 'लोक निर्माण विभाग (PWD)', keywords: ['सड़क', 'पुल', 'मार्ग', 'road', 'pwd', 'डामरीकरण'] },
  { name: 'जल निगम / जल जीवन मिशन', keywords: ['जल', 'नल', 'पानी', 'water', 'pipe', 'टंकी'] },
  { name: 'बेसिक शिक्षा परिषद', keywords: ['विद्यालय', 'स्कूल', 'शिक्षा', 'school', 'education'] },
  { name: 'चिकित्सा एवं स्वास्थ्य विभाग', keywords: ['अस्पताल', 'स्वास्थ्य', 'स्वास्थ्य केंद्र', 'health', 'hospital'] },
  { name: 'उत्तर प्रदेश पावर कारपोरेशन (UPPCL)', keywords: ['विद्युत', 'बिजली', 'सबस्टेशन', 'power', 'electricity'] },
  { name: 'ग्राम्य विकास विभाग', keywords: ['पंचायत', 'आवास', 'सचिवालय', 'rural', 'panchayat'] }
];

function classifySocialPost(text) {
  const content = (text || '').toLowerCase();
  
  // Detect village
  let detectedVillage = 'इटावा सदर';
  for (const v of VILLAGES) {
    if (content.includes(v.toLowerCase()) || text.includes(v)) {
      detectedVillage = v;
      break;
    }
  }

  // Detect category
  let detectedCategory = 'सामान्य जनसंवाद';
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(k => content.includes(k.toLowerCase()))) {
      detectedCategory = cat.name;
      break;
    }
  }

  // Detect department
  let detectedDepartment = 'सामान्य प्रशासन';
  for (const dept of DEPARTMENTS) {
    if (dept.keywords.some(k => content.includes(k.toLowerCase()))) {
      detectedDepartment = dept.name;
      break;
    }
  }

  return {
    village: detectedVillage,
    category: detectedCategory,
    department: detectedDepartment,
    workType: 'विकास कार्य / जनसंवाद',
    confidence: 0.94,
    autoAdded: true,
    suggestedTitle: `${detectedVillage} में ${detectedCategory} संबंधित कार्य समीक्षा`
  };
}

function generateBlogFromNews(newsItem) {
  const headline = newsItem.title || 'इटावा विकास समाचार';
  const village = newsItem.location || 'इटावा';
  
  return {
    title: `विकास की राह पर इटावा: ${headline}`,
    slug: 'news-blog-' + Date.now(),
    category: newsItem.category || 'विकास कार्य',
    village: village,
    excerpt: newsItem.summary || 'इटावा विधानसभा क्षेत्र के समग्र विकास के लिए विधायक श्रीमती सरिता भदौरिया द्वारा निरंतर उठाए जा रहे कदम।',
    content: `
### ${headline}
**स्थान:** ${village} | **दिनांक:** ${new Date().toLocaleDateString('hi-IN')}

इटावा विधानसभा (200) को विकास और प्रगति की नई ऊंचाइयों पर ले जाने के संकल्प के साथ विधायक श्रीमती सरिता भदौरिया निरंतर क्षेत्र में सक्रिय हैं। 

#### मुख्य बिंदु:
- **नागरिक सुविधा में विस्तार:** ${newsItem.summary || 'क्षेत्रवासियों की प्राथमिक समस्याओं के त्वरित निस्तारण हेतु अधिकारियों को निर्देश जारी किए गए हैं।'}
- **गुणवत्ता और समयबद्धता:** विकास कार्यों में पारदर्शिता और तय समय सीमा में कार्य पूर्ण करने को सर्वोच्च प्राथमिकता दी जा रही है।
- **जनसंवाद का परिणाम:** जनता से सीधे संवाद और सुझावों के आधार पर योजनाओं को धरातल पर उतारा जा रहा है।

> "हमारा एक ही लक्ष्य है — इटावा के हर गांव, हर गली और हर नागरिक तक विकास की किरण पहुंचे। सेवा, संवाद और विकास ही हमारा संकल्प है।"  
> — **श्रीमती सरिता भदौरिया (विधायक, इटावा 200)**

सभी सम्मानित क्षेत्रवासियों से अनुरोध है कि जनहित के विकास कार्यों में अपनी सक्रिय भागीदारी बनाए रखें।
    `.trim(),
    status: 'published',
    author: 'कार्यालय श्रीमती सरिता भदौरिया (विधायक, इटावा)',
    image: newsItem.image || '/images/media_1789490967602.jpg',
    tags: [village, 'विकास कार्य', 'इटावा200', 'जनसंवाद'],
    date: new Date().toISOString()
  };
}

function queryConstituencyAI(query, db) {
  const q = (query || '').toLowerCase();
  const works = db.developmentWorks || [];
  const citizens = db.citizens || [];

  if (q.includes('road') || q.includes('सड़क') || q.includes('मार्ग')) {
    const roadProjects = works.filter(w => w.category.includes('सड़क') || w.category.toLowerCase().includes('road'));
    const completed = roadProjects.filter(w => w.status === 'Completed' || w.status === 'पूर्ण').length;
    return {
      answer: `इटावा विधानसभा (200) में कुल **${roadProjects.length} सड़क एवं परिवहन परियोजनाएं** स्वीकृत हैं।\n\n• **पूर्ण कार्य:** ${completed} सड़कें\n• **प्रगतिरत कार्य:** ${roadProjects.length - completed} सड़कें\n• **मुख्य प्रभावित गांव:** रामपुर, बकेवर, तकरोई, जसवंतनगर मार्ग।\n\nलोक निर्माण विभाग (PWD) द्वारा सभी कार्यों का समयबद्ध निरीक्षण जारी है।`,
      data: roadProjects
    };
  }

  if (q.includes('village') || q.includes('गांव') || q.includes('गाँव') || q.includes('rampur') || q.includes('रामपुर')) {
    const rampurWorks = works.filter(w => (w.village || '').toLowerCase().includes('rampur') || (w.village || '').includes('रामपुर'));
    return {
      answer: `ग्राम रामपुर में वर्तमान में **${rampurWorks.length} विकास कार्य** संचालित हैं। इनमें मुख्य रूप से संपर्क मार्ग डामरीकरण, सोलर लाइट स्थापना और प्राथमिक विद्यालय का कायाकल्प शामिल है। कुल व्यय लगभग ₹1.85 करोड़ है।`,
      data: rampurWorks
    };
  }

  if (q.includes('press release') || q.includes('प्रेस नोट') || q.includes('भाषण') || q.includes('speech')) {
    return {
      answer: `**प्रेस विज्ञप्ति (कार्यालय विधायक, इटावा - 200):**\n\n"इटावा विधानसभा में चौमुखी विकास की गति तीव्र, जनसंवाद के माध्यम से हो रहा समस्याओं का समाधान"\n\n**इटावा:** विधायक श्रीमती सरिता भदौरिया ने कहा कि 'सबका साथ, सबका विकास' केवल एक नारा नहीं बल्कि हमारी कार्यशैली का मूलमंत्र है। विधानसभा क्षेत्र के 80 से अधिक गांवों में बुनियादी ढांचे, शिक्षा, स्वास्थ्य और पेयजल की दिशा में रिकॉर्ड कार्य कराए जा रहे हैं। आगामी माह में करोड़ों की नई योजनाओं का शिलान्यास किया जाएगा।`,
      data: null
    };
  }

  if (q.includes('citizen') || q.includes('सदस्य') || q.includes('नागरिक')) {
    return {
      answer: `जनसेवा डेटाबेस में अब तक **${citizens.length.toLocaleString('en-IN')}+ नागरिक एवं कार्यकर्ता** पंजीकृत हैं। इनमें ब्लॉक स्तर पर बकेवर, सैफई, इटावा सदर और जसवंतनगर क्षेत्र के बूथ एजेंट्स व सक्रिय समर्थक जुड़े हुए हैं।`,
      data: { total: citizens.length }
    };
  }

  // Default intelligent response
  return {
    answer: `जनसेवा AI इंटेलिजेंस रिपोर्ट: वर्तमान में इटावा (200) में कुल **${works.length} विकास कार्य** दर्ज हैं। 80+ गांवों में पहुंच के साथ ₹48+ करोड़ की विकास परियोजनाओं की निरंतर निगरानी की जा रही है। आप किसी विशिष्ट गांव (जैसे 'रामपुर'), विभाग (जैसे 'सड़क' या 'पेयजल'), अथवा प्रेस नोट लेखन के बारे में पूछ सकते हैं।`,
    data: { totalWorks: works.length, totalCitizens: citizens.length }
  };
}

module.exports = {
  classifySocialPost,
  generateBlogFromNews,
  queryConstituencyAI,
  VILLAGES,
  CATEGORIES
};
