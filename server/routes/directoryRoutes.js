// server/routes/directoryRoutes.js
const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');
const { teamData, saveTeamData } = require('../data/teams');
const userService = require('../services/userService');

// Initial default officials for Etawah Constituency if not in db
const defaultOfficials = [
  {
    id: 'off-1',
    name: 'श्री विक्रम सिंह राघव',
    fatherSpouseName: 'श्री आर. एस. राघव',
    role: 'उपजिलाधिकारी (SDM सदर)',
    designation: 'Sub-Divisional Magistrate',
    department: 'राजस्व विभाग (Revenue)',
    jurisdiction: 'इटावा सदर तहसील',
    village: 'इटावा मुख्यालय',
    mobile: '9454416001',
    email: 'sdm-etawah@nic.in',
    category: 'विभागीय अधिकारी (Officials)',
    photo: '/images/poli3.png',
    status: 'Active',
    notes: 'तहसील व भूमि विवाद निस्तारण अधिकृत',
    createdAt: '2026-09-01'
  },
  {
    id: 'off-2',
    name: 'श्रीमती नीलम श्रीवास्तव',
    fatherSpouseName: 'श्री ए. के. श्रीवास्तव',
    role: 'खंड विकास अधिकारी (BDO बढ़पुरा)',
    designation: 'Block Development Officer',
    department: 'ग्राम्य विकास (Rural Dev)',
    jurisdiction: 'बढ़पुरा ब्लॉक',
    village: 'बढ़पुरा',
    mobile: '9454416002',
    email: 'bdo-barhpura@nic.in',
    category: 'विभागीय अधिकारी (Officials)',
    photo: '/images/poli2.png',
    status: 'Active',
    notes: 'मनरेगा व ग्रामीण विकास कार्य',
    createdAt: '2026-09-01'
  },
  {
    id: 'off-3',
    name: 'श्री अखिलेश कुमार',
    fatherSpouseName: '',
    role: 'तहसीलदार सदर',
    designation: 'Tehsildar',
    department: 'राजस्व विभाग (Revenue)',
    jurisdiction: 'सदर तहसील',
    village: 'इटावा',
    mobile: '9454416003',
    email: 'tehsildar-etawah@nic.in',
    category: 'विभागीय अधिकारी (Officials)',
    photo: '/images/poli1.png',
    status: 'Active',
    notes: 'प्रमाण पत्र, दाखिल खारिज व राजस्व',
    createdAt: '2026-09-01'
  },
  {
    id: 'off-4',
    name: 'श्री देवेंद्र सिंह',
    fatherSpouseName: '',
    role: 'अधिशासी अभियंता (XEN विद्युत)',
    designation: 'Executive Engineer (Electricity)',
    department: 'विद्युत वितरण मंडल (DVVNL)',
    jurisdiction: 'इटावा नगरीय व ग्रामीण',
    village: 'इटावा सदर',
    mobile: '9454416004',
    email: 'xen-etawah@dvvnl.org',
    category: 'विभागीय अधिकारी (Officials)',
    photo: '/images/poli4.png',
    status: 'Active',
    notes: 'बिजली आपूर्ति, ट्रांसफॉर्मर व बिल सुधार',
    createdAt: '2026-09-01'
  },
  {
    id: 'off-5',
    name: 'श्री राकेश कुमार शर्मा',
    fatherSpouseName: '',
    role: 'क्षेत्राधिकारी पुलिस (CO City)',
    designation: 'Circle Officer Police',
    department: 'गृह एवं पुलिस (Police)',
    jurisdiction: 'इटावा नगर सर्किल',
    village: 'इटावा नगर',
    mobile: '9454416005',
    email: 'cocity-etw@uppolice.gov.in',
    category: 'विभागीय अधिकारी (Officials)',
    photo: '/images/poli1.png',
    status: 'Active',
    notes: 'कानून व्यवस्था व जन सुरक्षा',
    createdAt: '2026-09-01'
  },
  {
    id: 'off-6',
    name: 'डॉ. गीताराम आनंद',
    fatherSpouseName: '',
    role: 'मुख्य चिकित्सा अधिकारी (CMO)',
    designation: 'Chief Medical Officer',
    department: 'चिकित्सा एवं स्वास्थ्य (Health)',
    jurisdiction: 'जनपद इटावा',
    village: 'इटावा',
    mobile: '9454416006',
    email: 'cmo-etw@up.nic.in',
    category: 'विभागीय अधिकारी (Officials)',
    photo: '/images/poli3.png',
    status: 'Active',
    notes: 'जिला अस्पताल व सीएचसी/पीएचसी स्वास्थ्य सेवाएं',
    createdAt: '2026-09-01'
  }
];

function getOfficialsList(db) {
  if (!db.officials || !Array.isArray(db.officials) || db.officials.length === 0) {
    db.officials = [...defaultOfficials];
    writeDb(db);
  }
  return db.officials;
}

// GET /api/directory/all - Full consolidated list with search engine
router.get('/all', (req, res) => {
  try {
    const db = readDb();
    const q = (req.query.q || '').trim().toLowerCase();
    const typeFilter = (req.query.type || 'all').toLowerCase();
    const categoryFilter = (req.query.category || 'all').toLowerCase();
    const villageFilter = (req.query.village || 'all').toLowerCase();
    const statusFilter = (req.query.status || 'all').toLowerCase();

    const officials = getOfficialsList(db);
    const citizens = db.citizens || [];
    const members = db.members || [];
    const workers = teamData.teams || [];
    const systemUsers = userService.getAllUsers();

    const unifiedList = [];

    // 1. Officials
    officials.forEach(o => {
      unifiedList.push({
        id: o.id,
        entityType: 'official',
        typeLabel: 'अधिकारी (Official)',
        typeBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: o.name,
        fatherSpouseName: o.fatherSpouseName || '',
        mobile: o.mobile,
        email: o.email || '',
        role: o.role || o.designation || 'विभागीय अधिकारी',
        designation: o.designation || o.role,
        category: o.category || 'विभागीय अधिकारी (Officials)',
        department: o.department || 'सामान्य प्रशासन',
        jurisdiction: o.jurisdiction || 'इटावा',
        village: o.village || o.jurisdiction || 'इटावा',
        booth: '',
        photo: o.photo || null,
        status: o.status || 'Active',
        notes: o.notes || '',
        createdAt: o.createdAt || ''
      });
    });

    // 2. Party Workers / Karyakartas
    workers.forEach(w => {
      unifiedList.push({
        id: `wrk-${w.id}`,
        originalId: w.id,
        entityType: 'worker',
        typeLabel: 'कार्यकर्ता (Karyakarta)',
        typeBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        name: w.name,
        fatherSpouseName: w.fatherSpouseName || '',
        mobile: w.mobile,
        email: w.email || '',
        role: w.role || 'कार्यकर्ता',
        designation: w.role,
        category: w.category || 'Political Workers',
        department: 'पार्टी संगठन / मोर्चा',
        jurisdiction: w.area || 'इटावा',
        village: w.area || 'इटावा सदर',
        booth: w.booth || '',
        photo: w.avatar || null,
        status: w.status || 'Active',
        notes: w.notes || '',
        createdAt: w.dateJoined || ''
      });
    });

    // 3. Members
    members.forEach(m => {
      unifiedList.push({
        id: m.id || `mem-${m.mobile}`,
        originalId: m.id,
        entityType: 'member',
        typeLabel: 'सदस्य (Member)',
        typeBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        name: m.name,
        fatherSpouseName: m.fatherSpouseName || '',
        mobile: m.mobile,
        email: m.email || '',
        role: m.role || 'सक्रिय सदस्य',
        designation: m.role,
        category: m.category || 'पार्टी सदस्य (Members)',
        department: 'सदस्यता प्रकोष्ठ',
        jurisdiction: m.village || 'इटावा सदर',
        village: m.village || 'इटावा सदर',
        booth: m.booth || '',
        photo: m.photo || null,
        status: m.idCard === 'Issued' ? 'Verified' : 'Active',
        notes: m.notes || `आईडी कार्ड: ${m.idCard || 'Pending'}`,
        createdAt: m.date || ''
      });
    });

    // 4. Citizens & Contacts
    citizens.forEach(c => {
      const alreadyIn = unifiedList.some(p => p.mobile && c.mobile && String(p.mobile).trim() === String(c.mobile).trim());
      if (!alreadyIn) {
        unifiedList.push({
          id: c.id || `cit-${c.mobile}`,
          originalId: c.id,
          entityType: 'citizen',
          typeLabel: 'नागरिक (Citizen)',
          typeBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          name: c.name,
          fatherSpouseName: c.fatherSpouseName || '',
          mobile: c.mobile,
          email: c.email || '',
          role: c.type || c.category || 'आम नागरिक',
          designation: c.type || 'मतदाता',
          category: c.category || c.type || 'नागरिक (Citizens)',
          department: 'नागरिक एवं जनसंवाद',
          jurisdiction: c.area || c.village || 'इटावा विधानसभा',
          village: c.village || c.area || 'इटावा सदर',
          booth: c.booth || '',
          photo: c.photo || null,
          status: 'Active',
          notes: c.notes || (c.source ? `स्रोत: ${c.source}` : ''),
          createdAt: c.date || ''
        });
      }
    });

    // 5. System Users (Admin & Staff)
    systemUsers.forEach(u => {
      unifiedList.push({
        id: `sys-${u.id}`,
        originalId: u.id,
        entityType: 'user',
        typeLabel: 'सिस्टम यूजर (User)',
        typeBadgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        name: u.name,
        fatherSpouseName: '',
        mobile: u.phone || '',
        email: u.email || `${u.username}@janseva.org`,
        role: u.role || 'Staff Operator',
        designation: `@${u.username}`,
        category: 'सिस्टम एडमिन व स्टाफ',
        department: u.department || 'विधानसभा कार्यालय',
        jurisdiction: 'एडमिन पोर्टल',
        village: 'मुख्यालय',
        booth: '',
        photo: u.avatar || null,
        status: u.status || 'Active',
        notes: `अनुमतियां: ${(u.permissions || []).join(', ')}`,
        createdAt: u.createdAt || ''
      });
    });

    // Apply Filter Search Engine
    const filtered = unifiedList.filter(item => {
      if (q) {
        const matchName = item.name && item.name.toLowerCase().includes(q);
        const matchMobile = item.mobile && item.mobile.includes(q);
        const matchFather = item.fatherSpouseName && item.fatherSpouseName.toLowerCase().includes(q);
        const matchRole = item.role && item.role.toLowerCase().includes(q);
        const matchVillage = item.village && item.village.toLowerCase().includes(q);
        const matchDept = item.department && item.department.toLowerCase().includes(q);
        const matchCategory = item.category && item.category.toLowerCase().includes(q);
        if (!matchName && !matchMobile && !matchFather && !matchRole && !matchVillage && !matchDept && !matchCategory) {
          return false;
        }
      }

      if (typeFilter !== 'all' && item.entityType !== typeFilter) {
        return false;
      }

      if (categoryFilter !== 'all' && item.category.toLowerCase() !== categoryFilter) {
        return false;
      }

      if (villageFilter !== 'all' && item.village.toLowerCase() !== villageFilter) {
        return false;
      }

      if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter) {
        return false;
      }

      return true;
    });

    const stats = {
      total: unifiedList.length,
      officials: unifiedList.filter(p => p.entityType === 'official').length,
      workers: unifiedList.filter(p => p.entityType === 'worker').length,
      members: unifiedList.filter(p => p.entityType === 'member').length,
      citizens: unifiedList.filter(p => p.entityType === 'citizen').length,
      users: unifiedList.filter(p => p.entityType === 'user').length
    };

    const categoriesSet = new Set();
    (teamData.categories || []).forEach(c => categoriesSet.add(c.name || c.nameHi));
    unifiedList.forEach(p => { if (p.category) categoriesSet.add(p.category); });
    const allCategories = Array.from(categoriesSet).filter(Boolean);

    const villageSet = new Set();
    unifiedList.forEach(p => { if (p.village && p.village.trim()) villageSet.add(p.village.trim()); });
    const allVillages = Array.from(villageSet).slice(0, 40);

    const deptSet = new Set();
    unifiedList.forEach(p => { if (p.department && p.department.trim()) deptSet.add(p.department.trim()); });
    const allDepartments = Array.from(deptSet);

    res.json({
      success: true,
      count: filtered.length,
      stats,
      people: filtered,
      categories: allCategories,
      villages: allVillages,
      departments: allDepartments
    });
  } catch (err) {
    console.error('Directory Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/directory/person - Create any person (Citizen, Member, Worker, Official, User)
router.post('/person', (req, res) => {
  try {
    const {
      entityType = 'citizen',
      name,
      fatherSpouseName = '',
      mobile,
      email = '',
      role = '',
      designation = '',
      category = '',
      department = '',
      jurisdiction = '',
      village = 'इटावा सदर',
      booth = '',
      photo = '',
      status = 'Active',
      notes = '',
      username = '',
      password = '',
      permissions = []
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'नाम अनिवार्य है।' });
    }

    const cleanMobile = mobile ? String(mobile).replace(/\D/g, '') : '';
    const db = readDb();

    let createdPerson = null;

    if (entityType === 'official') {
      if (!db.officials) db.officials = [...defaultOfficials];
      createdPerson = {
        id: 'off-' + Date.now(),
        name: name.trim(),
        fatherSpouseName: fatherSpouseName.trim(),
        role: role || designation || 'विभागीय अधिकारी',
        designation: designation || role || 'Officer',
        department: department || 'सामान्य प्रशासन',
        jurisdiction: jurisdiction || village || 'इटावा',
        village: village || 'इटावा सदर',
        mobile: cleanMobile,
        email: email.trim(),
        category: category || 'विभागीय अधिकारी (Officials)',
        photo: photo || '',
        status: status || 'Active',
        notes: notes.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      db.officials.unshift(createdPerson);
      writeDb(db);
      logAudit(req.body.actor || 'Admin', `Added Official: ${createdPerson.name} (${createdPerson.role})`, 'Directory Engine', createdPerson);

    } else if (entityType === 'member') {
      if (!db.members) db.members = [];
      createdPerson = {
        id: 'mem-' + Date.now(),
        name: name.trim(),
        fatherSpouseName: fatherSpouseName.trim(),
        mobile: cleanMobile,
        email: email.trim(),
        role: role || 'सक्रिय सदस्य',
        village: village || 'इटावा सदर',
        booth: booth || 'बूथ 01',
        category: category || 'पार्टी सदस्य (Members)',
        photo: photo || '',
        idCard: 'Issued',
        status: 'Active',
        notes: notes.trim(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      db.members.unshift(createdPerson);
      writeDb(db);
      logAudit(req.body.actor || 'Admin', `Added Member: ${createdPerson.name}`, 'Directory Engine', createdPerson);

    } else if (entityType === 'worker') {
      createdPerson = {
        id: teamData.teams.length ? Math.max(...teamData.teams.map(t => t.id)) + 1 : 1,
        name: name.trim(),
        fatherSpouseName: fatherSpouseName.trim(),
        role: role || 'कार्यकर्ता',
        area: village || 'इटावा सदर',
        booth: booth || '',
        mobile: cleanMobile,
        email: email.trim(),
        category: category || 'Political Workers',
        avatar: photo || '/images/poli1.png',
        status: status || 'Active',
        notes: notes.trim(),
        dateJoined: new Date().toISOString().split('T')[0]
      };
      teamData.teams.push(createdPerson);
      saveTeamData();
      logAudit(req.body.actor || 'Admin', `Added Worker: ${createdPerson.name} (${createdPerson.role})`, 'Directory Engine', createdPerson);

    } else if (entityType === 'user') {
      createdPerson = userService.createUser({
        name: name.trim(),
        username: username || name.toLowerCase().replace(/\s+/g, ''),
        role: role || 'Staff Operator',
        password: password || 'janseva@2026',
        permissions: permissions.length ? permissions : ['view_all', 'manage_grievances'],
        avatar: photo || '/images/poli2.png',
        phone: cleanMobile,
        email: email.trim(),
        department: department || 'विधानसभा कार्यालय',
        status: status || 'active'
      }, req.body.actor || 'Super Admin');

    } else {
      // Default: Citizen
      if (!db.citizens) db.citizens = [];
      createdPerson = {
        id: 'cit-' + Date.now(),
        name: name.trim(),
        fatherSpouseName: fatherSpouseName.trim(),
        mobile: cleanMobile,
        email: email.trim(),
        village: village || 'इटावा सदर',
        booth: booth || 'सामान्य मतदाता',
        type: role || category || 'Citizen',
        category: category || 'नागरिक (Citizens)',
        area: 'इटावा विधानसभा (200)',
        photo: photo || '',
        notes: notes.trim(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        source: 'Directory Engine'
      };
      db.citizens.unshift(createdPerson);
      writeDb(db);
      logAudit(req.body.actor || 'Admin', `Added Citizen: ${createdPerson.name} (${cleanMobile})`, 'Directory Engine', createdPerson);
    }

    // Sync to citizens if mobile present and 10 digits
    if (cleanMobile && cleanMobile.length === 10 && entityType !== 'citizen' && entityType !== 'user') {
      const existsInCit = (db.citizens || []).some(c => String(c.mobile).trim() === cleanMobile);
      if (!existsInCit) {
        db.citizens.unshift({
          id: 'cit-sync-' + Date.now(),
          name: name.trim(),
          fatherSpouseName: fatherSpouseName.trim(),
          mobile: cleanMobile,
          village: village || 'इटावा सदर',
          type: role || category || entityType,
          category: category || entityType,
          photo: photo || '',
          source: `${entityType} Sync`,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });
        writeDb(db);
      }
    }

    res.status(201).json({
      success: true,
      message: `${name} को डायरेक्टरी में सफलतापूर्वक जोड़ दिया गया!`,
      person: createdPerson
    });
  } catch (err) {
    console.error('Create Person Error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/directory/:type/:id
router.delete('/:type/:id', (req, res) => {
  try {
    const { type, id } = req.params;
    const db = readDb();
    const cleanId = String(id).replace(/^(off|wrk|mem|cit|sys)-/, '');

    if (type === 'official') {
      db.officials = (db.officials || []).filter(o => o.id !== id && o.id !== `off-${cleanId}`);
      writeDb(db);
    } else if (type === 'worker') {
      const numId = parseInt(cleanId);
      teamData.teams = teamData.teams.filter(t => t.id !== numId);
      saveTeamData();
    } else if (type === 'member') {
      db.members = (db.members || []).filter(m => m.id !== id && m.id !== cleanId);
      writeDb(db);
    } else if (type === 'citizen') {
      db.citizens = (db.citizens || []).filter(c => c.id !== id && c.id !== cleanId);
      writeDb(db);
    } else if (type === 'user') {
      userService.deleteUser(id, req.query.actor || 'Super Admin');
    }

    logAudit(req.query.actor || 'Admin', `Deleted person from directory: ${type} (${id})`, 'Directory Engine', { type, id });

    res.json({ success: true, message: 'व्यक्ति को डायरेक्टरी से सफलतापूर्वक हटा दिया गया है।' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
