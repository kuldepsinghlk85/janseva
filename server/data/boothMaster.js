const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'boothMaster.json');

const initialBooths = [
  {
    id: 1,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "101",
    pollingStationName: "Primary School Rampur Room No. 1",
    villageId: 1,
    villageName: "Rampur",
    address: "Village Rampur, Barhpura Block, Etawah",
    latitude: "26.7852",
    longitude: "79.0215",
    totalVoters: 890,
    maleVoters: 480,
    femaleVoters: 410,
    sectorOfficer: "Shri R. K. Sharma (9415000001)",
    bloName: "Smt. Sunita Devi (9838000001)"
  },
  {
    id: 2,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "102",
    pollingStationName: "Primary School Aarazi Jadhonpur",
    villageId: 2,
    villageName: "Aarazi Jadhonpur",
    address: "Village Aarazi Jadhonpur, Barhpura Block, Etawah",
    latitude: "26.7625",
    longitude: "79.0118",
    totalVoters: 760,
    maleVoters: 405,
    femaleVoters: 355,
    sectorOfficer: "Shri R. K. Sharma (9415000001)",
    bloName: "Shri Rajesh Kumar (9838000002)"
  },
  {
    id: 3,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "103",
    pollingStationName: "Junior High School Ajabpur Jhingupur",
    villageId: 3,
    villageName: "Ajabpur Jhingupur",
    address: "Village Ajabpur Jhingupur, Barhpura Block, Etawah",
    latitude: "26.7715",
    longitude: "78.9955",
    totalVoters: 940,
    maleVoters: 510,
    femaleVoters: 430,
    sectorOfficer: "Shri Ajay Singh (9415000002)",
    bloName: "Shri Manoj Tiwari (9838000003)"
  },
  {
    id: 4,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "104",
    pollingStationName: "Inter College Udi North Wing",
    villageId: 4,
    villageName: "Udi",
    address: "Village Udi, Barhpura Block, Etawah",
    latitude: "26.7320",
    longitude: "78.9412",
    totalVoters: 1120,
    maleVoters: 600,
    femaleVoters: 520,
    sectorOfficer: "Shri Ajay Singh (9415000002)",
    bloName: "Shri Dinesh Chandra (9838000004)"
  },
  {
    id: 5,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "105",
    pollingStationName: "Primary School Ahladpur",
    villageId: 5,
    villageName: "Ahladpur",
    address: "Village Ahladpur, Basrehar Block, Etawah",
    latitude: "26.8415",
    longitude: "79.1125",
    totalVoters: 680,
    maleVoters: 370,
    femaleVoters: 310,
    sectorOfficer: "Shri V. P. Yadav (9415000003)",
    bloName: "Smt. Manju Lata (9838000005)"
  },
  {
    id: 6,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "106",
    pollingStationName: "Kanya Vidyalaya Akbarpur",
    villageId: 6,
    villageName: "Akbarpur",
    address: "Village Akbarpur, Basrehar Block, Etawah",
    latitude: "26.8525",
    longitude: "79.1235",
    totalVoters: 810,
    maleVoters: 435,
    femaleVoters: 375,
    sectorOfficer: "Shri V. P. Yadav (9415000003)",
    bloName: "Shri Ram Naresh (9838000006)"
  },
  {
    id: 7,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "107",
    pollingStationName: "Panchayat Bhavan Amritpur",
    villageId: 7,
    villageName: "Amritpur",
    address: "Village Amritpur, Basrehar Block, Etawah",
    latitude: "26.8335",
    longitude: "79.1415",
    totalVoters: 920,
    maleVoters: 490,
    femaleVoters: 430,
    sectorOfficer: "Shri V. P. Yadav (9415000003)",
    bloName: "Shri Surendra Kumar (9838000007)"
  },
  {
    id: 8,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "108",
    pollingStationName: "Primary School Atirajpur",
    villageId: 8,
    villageName: "Atirajpur",
    address: "Village Atirajpur, Saifai Block, Etawah",
    latitude: "26.9615",
    longitude: "79.0315",
    totalVoters: 740,
    maleVoters: 395,
    femaleVoters: 345,
    sectorOfficer: "Shri H. N. Pandey (9415000004)",
    bloName: "Shri Alok Kumar (9838000008)"
  },
  {
    id: 9,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "109",
    pollingStationName: "Panchayat Ghar Ujhiyani",
    villageId: 9,
    villageName: "Ujhiyani",
    address: "Village Ujhiyani, Saifai Block, Etawah",
    latitude: "26.9535",
    longitude: "79.0425",
    totalVoters: 650,
    maleVoters: 350,
    femaleVoters: 300,
    sectorOfficer: "Shri H. N. Pandey (9415000004)",
    bloName: "Smt. Rekha Rani (9838000009)"
  },
  {
    id: 10,
    assemblyId: 1,
    assembly: "Etawah",
    boothNumber: "110",
    pollingStationName: "Primary School Ajnoura",
    villageId: 10,
    villageName: "Ajnoura",
    address: "Village Ajnoura, Jaswantnagar Block, Etawah",
    latitude: "26.8835",
    longitude: "78.8955",
    totalVoters: 880,
    maleVoters: 470,
    femaleVoters: 410,
    sectorOfficer: "Shri K. C. Verma (9415000005)",
    bloName: "Shri Arvind Singh (9838000010)"
  }
];

let booths = [...initialBooths];

try {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    booths = JSON.parse(data);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(initialBooths, null, 2), 'utf8');
  }
} catch (err) {
  console.error('Error loading boothMaster.json:', err);
}

function saveBooths() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(booths, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving boothMaster.json:', err);
  }
}

module.exports = {
  booths,
  saveBooths
};
