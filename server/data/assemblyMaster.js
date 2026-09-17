const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'assemblyMaster.json');

const initialAssemblies = [
  {
    id: 1,
    state: "Uttar Pradesh",
    district: "Etawah",
    assemblyName: "Etawah",
    assemblyCode: "200",
    status: "active"
  }
];

let assemblies = [...initialAssemblies];

try {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    assemblies = JSON.parse(data);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(initialAssemblies, null, 2), 'utf8');
  }
} catch (err) {
  console.error('Error loading assemblyMaster.json:', err);
}

function saveAssemblies() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(assemblies, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving assemblyMaster.json:', err);
  }
}

module.exports = {
  assemblies,
  saveAssemblies
};
