// server/services/userService.js
// User Service Layer communicating with users.js

const { users: initialUsers } = require('../data/users');
const { readDb, writeDb, logAudit } = require('../utils/db');

function getDbUsers() {
  const db = readDb();
  if (!db.systemUsers || !Array.isArray(db.systemUsers) || db.systemUsers.length === 0) {
    db.systemUsers = initialUsers.map(u => ({ ...u }));
    writeDb(db);
    return db.systemUsers;
  }

  // Ensure all 5 standard roles exist in db.systemUsers
  let modified = false;
  for (const initUser of initialUsers) {
    const existingIndex = db.systemUsers.findIndex(u => u.username.toLowerCase() === initUser.username.toLowerCase());
    if (existingIndex === -1) {
      db.systemUsers.push({ ...initUser });
      modified = true;
    } else {
      // Update role attributes
      const existing = db.systemUsers[existingIndex];
      if (!existing.roleKey || !existing.roleTitle || !existing.badges) {
        db.systemUsers[existingIndex] = {
          ...initUser,
          ...existing,
          roleKey: initUser.roleKey,
          roleTitle: initUser.roleTitle,
          badges: initUser.badges,
          description: initUser.description,
          permissions: initUser.permissions
        };
        modified = true;
      }
    }
  }

  if (modified) {
    writeDb(db);
  }
  return db.systemUsers;
}

class UserService {
  getAllUsers() {
    const list = getDbUsers();
    return list.map(u => {
      const { passwordHash, ...safe } = u;
      return { ...safe, hasPassword: !!passwordHash, password: passwordHash };
    });
  }

  getUserById(id) {
    const list = getDbUsers();
    const u = list.find(user => String(user.id) === String(id));
    if (!u) return null;
    const { passwordHash, ...safe } = u;
    return safe;
  }

  createUser(data, actor = 'Super Admin') {
    const db = readDb();
    if (!db.systemUsers || !Array.isArray(db.systemUsers)) {
      db.systemUsers = initialUsers.map(u => ({ ...u }));
    }

    const username = String(data.username || '').trim().toLowerCase();
    if (!username) throw new Error('Username is required');

    const exists = db.systemUsers.some(u => u.username.toLowerCase() === username);
    if (exists) throw new Error(`यूजरनेम "${username}" पहले से ही किसी अन्य यूजर के पास है।`);

    const newUser = {
      id: 'usr-' + Date.now(),
      name: data.name?.trim() || username,
      username: username,
      role: data.role || 'Staff Operator',
      passwordHash: data.password || 'janseva@2026',
      permissions: Array.isArray(data.permissions) && data.permissions.length > 0 
        ? data.permissions 
        : ['view_all', 'manage_grievances'],
      avatar: data.avatar || '/images/poli2.png',
      status: data.status || 'active',
      phone: data.phone || '',
      email: data.email || '',
      department: data.department || 'विधानसभा कार्यालय',
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.systemUsers.push(newUser);
    writeDb(db);

    logAudit(actor, `Created new system user: ${newUser.name} (@${newUser.username}) [${newUser.role}]`, 'User Management', {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    });

    const { passwordHash, ...safe } = newUser;
    return safe;
  }

  updateUser(id, data, actor = 'Super Admin') {
    const db = readDb();
    if (!db.systemUsers) db.systemUsers = initialUsers.map(u => ({ ...u }));

    const index = db.systemUsers.findIndex(u => String(u.id) === String(id));
    if (index === -1) return null;

    const user = db.systemUsers[index];

    if (data.username && data.username.toLowerCase() !== user.username.toLowerCase()) {
      const exists = db.systemUsers.some(u => String(u.id) !== String(id) && u.username.toLowerCase() === data.username.toLowerCase());
      if (exists) throw new Error(`यूजरनेम "${data.username}" पहले से इस्तेमाल में है।`);
      user.username = data.username.toLowerCase().trim();
    }

    if (data.name) user.name = data.name.trim();
    if (data.role) user.role = data.role;
    if (data.password) user.passwordHash = data.password;
    if (data.permissions) user.permissions = data.permissions;
    if (data.avatar) user.avatar = data.avatar;
    if (data.status) user.status = data.status;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.email !== undefined) user.email = data.email;
    if (data.department !== undefined) user.department = data.department;

    writeDb(db);

    logAudit(actor, `Updated system user: ${user.name} (@${user.username})`, 'User Management', {
      id: user.id,
      role: user.role,
      status: user.status
    });

    const { passwordHash, ...safe } = user;
    return safe;
  }

  deleteUser(id, actor = 'Super Admin') {
    const db = readDb();
    if (!db.systemUsers) return false;

    const user = db.systemUsers.find(u => String(u.id) === String(id));
    if (!user) return false;

    if (user.username === 'admin' || String(user.id) === '1') {
      throw new Error('मूल सुपर एडमिन यूजर (admin) को हटाया नहीं जा सकता।');
    }

    db.systemUsers = db.systemUsers.filter(u => String(u.id) !== String(id));
    writeDb(db);

    logAudit(actor, `Deleted system user: ${user.name} (@${user.username})`, 'User Management', {
      id: user.id,
      username: user.username
    });

    return true;
  }

  authenticate(username, password) {
    const list = getDbUsers();
    const cleanUser = String(username).trim().toLowerCase();
    const user = list.find(u => u.username.toLowerCase() === cleanUser && u.status === 'active');
    if (!user) return null;
    if (user.passwordHash === password) {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  citizenLogin(mobile, name) {
    const { readDb, writeDb, logAudit } = require('../utils/db');
    const db = readDb();
    const cleanMobile = String(mobile).trim();
    if (!cleanMobile) return null;

    let citizen = (db.citizens || []).find(c => c.mobile === cleanMobile);
    if (!citizen) {
      // Auto-register citizen if not existing
      citizen = {
        id: 'cit-' + Date.now(),
        name: name ? name.trim() : 'नागरिक सदस्य',
        mobile: cleanMobile,
        village: 'इटावा सदर',
        booth: 'सामान्य मतदाता',
        type: 'Citizen',
        area: 'इटावा विधानसभा (200)',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        source: 'User Portal Login'
      };
      if (!db.citizens) db.citizens = [];
      db.citizens.unshift(citizen);
      writeDb(db);
    } else if (name && name.trim() && citizen.name === 'नागरिक सदस्य') {
      citizen.name = name.trim();
      writeDb(db);
    }

    logAudit(
      citizen.name,
      `नागरिक पोर्टल पर लॉगिन किया (${citizen.mobile})`,
      'Citizen Portal',
      { mobile: citizen.mobile, village: citizen.village }
    );

    return {
      id: citizen.id,
      name: citizen.name,
      mobile: citizen.mobile,
      village: citizen.village,
      role: citizen.type || 'Citizen',
      token: 'cit_tok_' + Date.now()
    };
  }

  citizenRegister(data) {
    const { readDb, writeDb, logAudit } = require('../utils/db');
    const db = readDb();
    const cleanMobile = String(data.mobile).trim();
    if (!cleanMobile || !data.name) return { error: 'Name and Mobile are required' };

    let citizen = (db.citizens || []).find(c => c.mobile === cleanMobile);
    if (citizen) {
      return {
        isExisting: true,
        user: {
          id: citizen.id,
          name: citizen.name,
          mobile: citizen.mobile,
          village: citizen.village,
          role: citizen.type || 'Citizen'
        }
      };
    }

    citizen = {
      id: 'cit-' + Date.now(),
      name: data.name.trim(),
      mobile: cleanMobile,
      village: data.village || 'इटावा सदर',
      booth: data.booth || 'सामान्य मतदाता',
      type: data.type || 'Citizen',
      area: data.area || 'इटावा विधानसभा (200)',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      source: 'Citizen Registration Portal'
    };

    if (!db.citizens) db.citizens = [];
    db.citizens.unshift(citizen);
    writeDb(db);

    logAudit(
      citizen.name,
      `नया नागरिक सदस्य पंजीकृत: ${citizen.name} (${citizen.mobile})`,
      'Citizen Registration',
      citizen
    );

    return {
      isExisting: false,
      user: {
        id: citizen.id,
        name: citizen.name,
        mobile: citizen.mobile,
        village: citizen.village,
        role: citizen.type || 'Citizen'
      }
    };
  }

  getCitizenGrievances(mobile) {
    const path = require('path');
    const fs = require('fs');
    const jsonPath = path.join(__dirname, '../data/janSamvadMaster.json');
    try {
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const grievances = JSON.parse(raw);
        const cleanMobile = String(mobile).trim();
        return grievances.filter(g => String(g.mobile).trim() === cleanMobile);
      }
    } catch (e) {
      console.error('Error fetching citizen grievances', e);
    }
    return [];
  }
}

module.exports = new UserService();

