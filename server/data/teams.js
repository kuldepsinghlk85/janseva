// server/data/teams.js
// Node.js JavaScript Native Data Storage - MLA Teams, Categories & User Types

const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, 'teams.json');

const defaultData = {
  categories: [
    { id: 'booth-agents', name: 'Booth Agents', nameHi: 'बूथ एजेंट्स' },
    { id: 'social-media', name: 'Social Media Team', nameHi: 'सोशल मीडिया टीम' },
    { id: 'political-workers', name: 'Political Workers', nameHi: 'राजनीतिक कार्यकर्ता' },
    { id: 'office-staff', name: 'Office Staff', nameHi: 'कार्यालय स्टाफ' },
    { id: 'volunteers', name: 'Volunteers', nameHi: 'स्वयंसेवक (Volunteers)' },
    { id: 'kisan-morcha', name: 'Kisan Morcha', nameHi: 'किसान मोर्चा' },
    { id: 'mahila-morcha', name: 'Mahila Morcha', nameHi: 'महिला मोर्चा' }
  ],
  userTypes: [
    { id: 'booth-president', title: 'बूथ अध्यक्ष (Booth President)' },
    { id: 'booth-agent', title: 'बूथ एजेंट (Booth Agent)' },
    { id: 'sector-incharge', title: 'सेक्टर संयोजक (Sector Incharge)' },
    { id: 'mandal-adhyaksh', title: 'मंडल अध्यक्ष (Mandal Adhyaksh)' },
    { id: 'social-lead', title: 'सोशल मीडिया समन्वयक' },
    { id: 'political-worker', title: 'वरिष्ठ राजनीतिक कार्यकर्ता' },
    { id: 'office-secretary', title: 'कार्यालय सचिव / स्टाफ' },
    { id: 'volunteer-lead', title: 'स्वयंसेवक प्रमुख' }
  ],
  teams: [
    {
      id: 1,
      name: "Vijay Singh",
      role: "बूथ अध्यक्ष (Booth President)",
      area: "Booth 21, इटावा सदर",
      booth: "21",
      mobile: "9876112233",
      email: "vijay.singh@janseva.org",
      category: "Booth Agents",
      avatar: "/images/poli1.png",
      status: "Active",
      dateJoined: "2024-01-15"
    },
    {
      id: 2,
      name: "Neha Gupta",
      role: "सोशल मीडिया समन्वयक",
      area: "Constituency HQ",
      booth: "HQ",
      mobile: "9876223344",
      email: "neha.gupta@janseva.org",
      category: "Social Media Team",
      avatar: "/images/poli2.png",
      status: "Active",
      dateJoined: "2024-02-10"
    },
    {
      id: 3,
      name: "Rakesh Yadav",
      role: "सेक्टर संयोजक (Sector Incharge)",
      area: "Block - Saifai",
      booth: "45-52",
      mobile: "9876334455",
      email: "rakesh.y@janseva.org",
      category: "Political Workers",
      avatar: "/images/poli3.png",
      status: "Active",
      dateJoined: "2023-11-05"
    },
    {
      id: 4,
      name: "Mohd. Arif",
      role: "कार्यालय सचिव / स्टाफ",
      area: "Etawah Sadar",
      booth: "HQ",
      mobile: "9876445566",
      email: "arif.data@janseva.org",
      category: "Office Staff",
      avatar: "/images/poli4.png",
      status: "Active",
      dateJoined: "2024-03-01"
    },
    {
      id: 5,
      name: "Priyanka Dixit",
      role: "कार्यालय सचिव / स्टाफ",
      area: "MLA Camp Office",
      booth: "HQ",
      mobile: "9876556677",
      email: "priyanka.d@janseva.org",
      category: "Office Staff",
      avatar: "/images/poli1.png",
      status: "Active",
      dateJoined: "2024-03-15"
    },
    {
      id: 6,
      name: "Anil Kushwaha",
      role: "स्वयंसेवक प्रमुख",
      area: "Bakewar Sector",
      booth: "78",
      mobile: "9876667788",
      email: "anil.k@janseva.org",
      category: "Volunteers",
      avatar: "/images/poli3.png",
      status: "Active",
      dateJoined: "2024-04-20"
    }
  ]
};

let teamData = { ...defaultData };

function loadTeamData() {
  try {
    if (fs.existsSync(JSON_FILE)) {
      const data = fs.readFileSync(JSON_FILE, 'utf8');
      teamData = JSON.parse(data);
    } else {
      teamData = JSON.parse(JSON.stringify(defaultData));
      saveTeamData();
    }
  } catch (err) {
    console.error('Error reading teams.json:', err);
    teamData = JSON.parse(JSON.stringify(defaultData));
  }
}

function saveTeamData() {
  try {
    fs.writeFileSync(JSON_FILE, JSON.stringify(teamData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing teams.json:', err);
  }
}

loadTeamData();

module.exports = {
  get teams() { return teamData.teams; },
  get categories() { return teamData.categories; },
  get userTypes() { return teamData.userTypes; },
  teamData,
  saveTeamData,
  loadTeamData
};
