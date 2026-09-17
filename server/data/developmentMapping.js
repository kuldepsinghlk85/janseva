const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'developmentMapping.json');

const initialDevelopments = [
  {
    id: 1,
    villageId: 1,
    villageName: "Rampur",
    block: "Barhpura",
    tehsil: "Etawah",
    title: "Interlocking & Drainage System in Main Basti",
    category: "Road & Drainage",
    budget: "₹ 12.80 Lakhs",
    sanctionDate: "2024-04-10",
    completionDate: "2024-11-20",
    status: "Completed",
    contractor: "M/s Sharma Construction",
    description: "Construction of 450m high quality CC road with covered side drainage to prevent waterlogging during monsoon.",
    tags: ["Road", "Drainage", "Cleanliness"],
    latitude: "26.7850",
    longitude: "79.0210",
    photos: [
      "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: 2,
    villageId: 2,
    villageName: "Aarazi Jadhonpur",
    block: "Barhpura",
    tehsil: "Etawah",
    title: "Solar Street Light Installation (25 Poles)",
    category: "Solar & Energy",
    budget: "₹ 6.50 Lakhs",
    sanctionDate: "2024-06-15",
    completionDate: "2024-09-30",
    status: "Completed",
    contractor: "UPNEDA Authorized Vendor",
    description: "Installation of 25 all-in-one solar LED street lights covering major crossings and dark spots in the village.",
    tags: ["Solar_Light", "Security", "Green_Energy"],
    latitude: "26.7620",
    longitude: "79.0110",
    photos: [
      "https://images.unsplash.com/photo-1508873696983-2df57046475a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: 3,
    villageId: 3,
    villageName: "Ajabpur Jhingupur",
    block: "Barhpura",
    tehsil: "Etawah",
    title: "Primary School Renovation & Smart Classroom",
    category: "Education",
    budget: "₹ 8.20 Lakhs",
    sanctionDate: "2024-08-01",
    completionDate: "2025-01-15",
    status: "Completed",
    contractor: "Basic Shiksha Parishad Etawah",
    description: "Operation Kayakalp upgrade: Tiled flooring, smart TV classroom, boundary wall, and clean drinking water unit.",
    tags: ["Primary_School", "Smart_Class", "Education"],
    latitude: "26.7710",
    longitude: "78.9950",
    photos: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: 4,
    villageId: 4,
    villageName: "Udi",
    block: "Barhpura",
    tehsil: "Etawah",
    title: "Chambal Ravine Protection Bund & Link Road",
    category: "Infrastructure & Flood Protection",
    budget: "₹ 48.00 Lakhs",
    sanctionDate: "2024-09-12",
    completionDate: null,
    status: "In Progress",
    contractor: "PWD Etawah",
    description: "Protection bund along ravines and wide bitumen link road connecting Udi chauraha to riverbank clusters.",
    tags: ["Road", "PWD", "Flood_Control"],
    latitude: "26.7320",
    longitude: "78.9412",
    photos: [
      "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: 5,
    villageId: 5,
    villageName: "Ahladpur",
    block: "Basrehar",
    tehsil: "Etawah",
    title: "Primary Health Sub-Center Modernization",
    category: "Healthcare",
    budget: "₹ 22.50 Lakhs",
    sanctionDate: "2024-10-05",
    completionDate: null,
    status: "In Progress",
    contractor: "Health Department Construction Wing",
    description: "Upgradation to Ayushman Arogya Mandir with diagnostic facilities, doctor chambers, and emergency beds.",
    tags: ["Healthcare", "Health_Center", "Ayushman"],
    latitude: "26.8415",
    longitude: "79.1125",
    photos: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: 6,
    villageId: 6,
    villageName: "Akbarpur",
    block: "Basrehar",
    tehsil: "Etawah",
    title: "Multipurpose Community Hall (Kalyan Mandap / Barat Ghar)",
    category: "Community Welfare",
    budget: "₹ 32.00 Lakhs",
    sanctionDate: "2025-01-10",
    completionDate: null,
    status: "Sanctioned",
    contractor: "Rural Engineering Services (RES)",
    description: "Spacious community center with dining hall and solar power setup for village social and cultural functions.",
    tags: ["Community_Hall", "Barat_Ghar", "Social_Welfare"],
    latitude: "26.8525",
    longitude: "79.1235",
    photos: []
  },
  {
    id: 7,
    villageId: 7,
    villageName: "Amritpur",
    block: "Basrehar",
    tehsil: "Etawah",
    title: "Har Ghar Nal Se Jal - Piped Water Scheme",
    category: "Drinking Water",
    budget: "₹ 62.00 Lakhs",
    sanctionDate: "2024-03-20",
    completionDate: null,
    status: "In Progress",
    contractor: "Jal Nigam Rural",
    description: "Overhead storage tank (150 KL) and underground pipeline network providing tap water connections to 320 households.",
    tags: ["Drinking_Water", "Jal_Jeevan_Mission", "Water_Tank"],
    latitude: "26.8335",
    longitude: "79.1415",
    photos: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: 8,
    villageId: 8,
    villageName: "Atirajpur",
    block: "Saifai",
    tehsil: "Saifai",
    title: "Modern Panchayat Bhavan & Digital Library",
    category: "Digital Governance",
    budget: "₹ 19.50 Lakhs",
    sanctionDate: "2024-05-18",
    completionDate: "2024-12-05",
    status: "Completed",
    contractor: "Panchayati Raj Dept",
    description: "Equipped with high-speed internet, 6 computers for students, CSC service center, and meeting conference hall.",
    tags: ["Digital_Library", "Panchayat_Bhavan", "CSC_Center"],
    latitude: "26.9615",
    longitude: "79.0315",
    photos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80"
    ]
  }
];

let developments = [...initialDevelopments];

try {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    developments = JSON.parse(data);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(initialDevelopments, null, 2), 'utf8');
  }
} catch (err) {
  console.error('Error loading developmentMapping.json:', err);
}

function saveDevelopments() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(developments, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving developmentMapping.json:', err);
  }
}

module.exports = {
  developments,
  saveDevelopments
};
