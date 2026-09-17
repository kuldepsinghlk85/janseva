const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'masterData.json');

const initialMasterData = {
  villages: [
    { id: 'rampur', name: 'Rampur', nameHi: 'रामपुर', block: 'इटावा सदर', district: 'इटावा', pincode: '206001' },
    { id: 'saifai', name: 'Saifai', nameHi: 'सैफई', block: 'सैफई', district: 'इटावा', pincode: '206130' },
    { id: 'bakewar', name: 'Bakewar', nameHi: 'बकेवर', block: 'भरथना', district: 'इटावा', pincode: '206124' },
    { id: 'takroi', name: 'Takroi', nameHi: 'तकरोई', block: 'इटावा सदर', district: 'इटावा', pincode: '206001' },
    { id: 'pilkhar', name: 'Pilkhar', nameHi: 'पिलखर', block: 'इटावा सदर', district: 'इटावा', pincode: '206001' },
    { id: 'jaswantnagar', name: 'Jaswantnagar', nameHi: 'जसवंतनगर', block: 'जसवंतनगर', district: 'इटावा', pincode: '206245' },
    { id: 'bharthana', name: 'Bharthana', nameHi: 'भरथना', block: 'भरथना', district: 'इटावा', pincode: '206242' },
    { id: 'udi', name: 'Udi', nameHi: 'उदी', block: 'बढ़पुरा', district: 'इटावा', pincode: '206131' },
    { id: 'chakarnagar', name: 'Chakarnagar', nameHi: 'चकरनगर', block: 'चकरनगर', district: 'इटावा', pincode: '206125' },
    { id: 'basrehar', name: 'Basrehar', nameHi: 'बसरेहर', block: 'बसरेहर', district: 'इटावा', pincode: '206253' },
    { id: 'chaubia', name: 'Chaubia', nameHi: 'चौबिया', block: 'सैफई', district: 'इटावा', pincode: '206126' },
    { id: 'lawedi', name: 'Lawedi', nameHi: 'लवेदी', block: 'महेवा', district: 'इटावा', pincode: '206127' },
    { id: 'vaidpura', name: 'Vaidpura', nameHi: 'वैदपुरा', block: 'सैफई', district: 'इटावा', pincode: '206130' },
    { id: 'pachhaygaon', name: 'Pachhaygaon', nameHi: 'पछायगांव', block: 'बढ़पुरा', district: 'इटावा', pincode: '206131' }
  ],
  categories: [
    { id: 'Inauguration', name: 'Inauguration', nameHi: 'लोकार्पण / उद्घाटन', type: 'activity', color: 'orange' },
    { id: 'Foundation Stone', name: 'Foundation Stone', nameHi: 'शिलान्यास', type: 'activity', color: 'amber' },
    { id: 'Inspection', name: 'Inspection', nameHi: 'स्थलीय निरीक्षण', type: 'activity', color: 'blue' },
    { id: 'Public Meeting', name: 'Public Meeting', nameHi: 'जनसंवाद चौपाल', type: 'activity', color: 'green' },
    { id: 'Village Visit', name: 'Village Visit', nameHi: 'ग्राम भ्रमण', type: 'activity', color: 'emerald' },
    { id: 'Development Work', name: 'Development Work', nameHi: 'विकास कार्य', type: 'both', color: 'indigo' },
    { id: 'Government Scheme', name: 'Government Scheme', nameHi: 'सरकारी योजना', type: 'both', color: 'purple' },
    { id: 'Road Transport', name: 'Road & Transport', nameHi: 'सड़क एवं परिवहन', type: 'work', color: 'orange' },
    { id: 'Education', name: 'Education', nameHi: 'शिक्षा', type: 'work', color: 'sky' },
    { id: 'Healthcare', name: 'Healthcare', nameHi: 'स्वास्थ्य सेवा', type: 'work', color: 'rose' },
    { id: 'Drinking Water', name: 'Drinking Water', nameHi: 'पेयजल', type: 'work', color: 'teal' },
    { id: 'Grievance Redressal', name: 'Grievance Redressal', nameHi: 'जनसुनवाई', type: 'activity', color: 'red' },
    { id: 'Other', name: 'Other', nameHi: 'अन्य कार्यक्रम', type: 'both', color: 'slate' }
  ],
  tags: [
    { id: 'road', name: 'सड़क', count: 12 },
    { id: 'gram-vikas', name: 'ग्राम विकास', count: 18 },
    { id: 'pwd', name: 'पीडब्ल्यूडी', count: 8 },
    { id: 'etawah', name: 'इटावा', count: 25 },
    { id: 'inauguration', name: 'लोकार्पण', count: 15 },
    { id: 'samvad', name: 'जनसंवाद', count: 9 },
    { id: 'nari-shakti', name: 'नारी शक्ति', count: 7 },
    { id: 'swasthya', name: 'स्वास्थ्य', count: 11 },
    { id: 'shiksha', name: 'शिक्षा', count: 10 },
    { id: 'kisan', name: 'किसान', count: 14 },
    { id: 'bijli', name: 'बिजली', count: 6 },
    { id: 'swachhata', name: 'स्वच्छता', count: 8 }
  ]
};

let masterData = { ...initialMasterData };

try {
  if (fs.existsSync(dataFilePath)) {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    masterData = {
      villages: parsed.villages || initialMasterData.villages,
      categories: parsed.categories || initialMasterData.categories,
      tags: parsed.tags || initialMasterData.tags,
      tehsilBlocks: parsed.tehsilBlocks || []
    };
  } else {
    fs.writeFileSync(dataFilePath, JSON.stringify(initialMasterData, null, 2), 'utf8');
  }
} catch (e) {
  console.error('Error loading masterData.json, using fallback:', e);
}

function saveMasterData() {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(masterData, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save masterData.json:', e);
  }
}

module.exports = {
  masterData,
  saveMasterData
};
