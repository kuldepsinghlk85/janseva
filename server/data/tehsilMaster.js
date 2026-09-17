const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tehsilMaster.json');

const initialTehsils = [
  { id: 1, district: "Etawah", name: "Etawah", code: "ETW001", nameHi: "इटावा" },
  { id: 2, district: "Etawah", name: "Saifai", code: "ETW002", nameHi: "सैफई" },
  { id: 3, district: "Etawah", name: "Jaswantnagar", code: "ETW003", nameHi: "जसवंतनगर" },
  { id: 4, district: "Etawah", name: "Chakarnagar", code: "ETW004", nameHi: "चकरनगर" },
  { id: 5, district: "Etawah", name: "Bharthana", code: "ETW005", nameHi: "भरथना" },
  { id: 6, district: "Etawah", name: "Mahewa", code: "ETW006", nameHi: "महेवा" },
  { id: 7, district: "Etawah", name: "Takha", code: "ETW007", nameHi: "ताखा" }
];

let tehsils = [...initialTehsils];

try {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    tehsils = JSON.parse(data);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(initialTehsils, null, 2), 'utf8');
  }
} catch (err) {
  console.error('Error loading tehsilMaster.json:', err);
}

function saveTehsils() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(tehsils, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving tehsilMaster.json:', err);
  }
}

module.exports = {
  tehsils,
  saveTehsils
};
