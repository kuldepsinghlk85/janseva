const express = require('express');
const router = express.Router();
const { readDb, writeDb, logAudit } = require('../utils/db');
const { store, saveStore } = require('../data/janSamvadMaster');

// ======================== COMMUNICATION OVERVIEW ========================
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    alerts: db.communication?.alerts || [],
    queries: store.grievances || [],
    rolePermissions: store.rolePermissions || {}
  });
});

// ======================== DIRECT CONTACTS DIRECTORY (CITIZENS & JAN SAMVAD) ========================
router.get('/contacts', (req, res) => {
  try {
    const db = readDb();
    const { search, village, category } = req.query;
    
    // Aggregate from Citizens CRM
    const citizens = db.citizens || [];
    // Aggregate from Jan Samvad Grievances
    const grievances = store.grievances || [];

    const contactMap = new Map();

    // 1. Process registered citizens
    citizens.forEach(c => {
      const mobile = String(c.mobile || '').trim();
      if (!mobile) return;
      contactMap.set(mobile, {
        id: c.id,
        name: c.name || 'नागरिक',
        mobile,
        village: c.village || 'इटावा सदर',
        booth: c.booth || '',
        category: c.type || c.category || 'Citizen',
        source: c.source || 'Citizens CRM',
        photo: c.photo || '',
        notes: c.notes || '',
        fatherSpouseName: c.fatherSpouseName || '',
        token: ''
      });
    });

    // 2. Process Jan Samvad applicants (merging or adding)
    grievances.forEach(g => {
      const mobile = String(g.mobile || '').trim();
      if (!mobile) return;
      if (!contactMap.has(mobile)) {
        contactMap.set(mobile, {
          id: g.id,
          name: g.citizenName || 'आवेदक',
          mobile,
          village: g.village || 'इटावा सदर',
          booth: g.block || '',
          category: 'Jan Samvad Grievance',
          source: 'जनसंवाद पोर्टल',
          photo: '',
          notes: g.subject || '',
          fatherSpouseName: g.fatherSpouseName || '',
          token: g.tokenNumber || ''
        });
      }
    });


    let list = Array.from(contactMap.values());

    // Apply filtering
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.village.toLowerCase().includes(q) ||
        (c.booth && c.booth.toLowerCase().includes(q))
      );
    }
    if (village && village !== 'all' && village !== 'All') {
      list = list.filter(c => c.village.toLowerCase().includes(village.toLowerCase()));
    }
    if (category && category !== 'all' && category !== 'All') {
      list = list.filter(c => (c.category || '').toLowerCase() === category.toLowerCase());
    }

    res.json({
      success: true,
      count: list.length,
      contacts: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================== LOG DIRECT WHATSAPP MESSAGE ========================
router.post('/log-direct-message', (req, res) => {
  try {
    const { recipients, message, user = 'MLA (श्रीमती सरिता भदौरिया)' } = req.body;
    if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
      return res.status(400).json({ success: false, message: 'Recipients required' });
    }

    const count = Array.isArray(recipients) ? recipients.length : 1;
    const recipientSummary = Array.isArray(recipients)
      ? recipients.map(r => `${r.name || 'नागरिक'} (${r.mobile})`).join(', ')
      : `${recipients.name || 'नागरिक'} (${recipients.mobile})`;

    const db = readDb();
    if (!db.communication) db.communication = { alerts: [], directMessages: [] };
    if (!db.communication.directMessages) db.communication.directMessages = [];

    const entry = {
      id: 'dm-' + Date.now(),
      recipientsCount: count,
      recipients: recipientSummary,
      message,
      sender: user,
      sentAt: new Date().toISOString(),
      dateDisplay: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    db.communication.directMessages.unshift(entry);
    if (db.communication.directMessages.length > 200) {
      db.communication.directMessages = db.communication.directMessages.slice(0, 200);
    }
    writeDb(db);

    logAudit(user, `Direct WhatsApp Connect: ${count} contact(s)`, 'Communication', entry);

    res.json({ success: true, message: 'Direct message logged successfully', entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================== DISPATCH BROADCAST (SMS / WHATSAPP) ========================
router.post('/alerts', (req, res) => {
  const { title, type, recipients, message, user } = req.body;
  const db = readDb();
  if (!db.communication) db.communication = { alerts: [], queries: [] };

  const newAlert = {
    id: 'alt-' + Date.now(),
    title: title || 'सार्वजनिक सूचना',
    type: type || 'WhatsApp Broadcast',
    recipients: recipients || 'समस्त पंजीकृत नागरिक (1,420)',
    date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'Sent',
    message: message || ''
  };

  db.communication.alerts.unshift(newAlert);
  writeDb(db);
  logAudit(user || 'Admin', `Dispatched Broadcast Alert: ${newAlert.title} via ${newAlert.type}`, 'Communication', newAlert);

  res.json({ success: true, alert: newAlert });
});

// ======================== JAN SAMVAD: GET ALL GRIEVANCES ========================
router.get('/jan-samvad', (req, res) => {
  try {
    let list = store.grievances || [];
    const { status, village, search, priority } = req.query;

    if (status && status !== 'all') {
      list = list.filter(g => (g.status || '').toLowerCase() === status.toLowerCase());
    }
    if (village && village !== 'all') {
      list = list.filter(g => (g.village || '').toLowerCase().includes(village.toLowerCase()));
    }
    if (priority && priority !== 'all') {
      list = list.filter(g => (g.priority || '').toLowerCase() === priority.toLowerCase());
    }
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(g =>
        (g.tokenNumber && g.tokenNumber.toLowerCase().includes(q)) ||
        (g.citizenName && g.citizenName.toLowerCase().includes(q)) ||
        (g.mobile && g.mobile.includes(q)) ||
        (g.subject && g.subject.toLowerCase().includes(q)) ||
        (g.village && g.village.toLowerCase().includes(q)) ||
        (g.description && g.description.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================== JAN SAMVAD: TRACK BY TOKEN / MOBILE ========================
router.get('/jan-samvad/track/:tokenOrMobile', (req, res) => {
  try {
    const term = (req.params.tokenOrMobile || '').trim().toLowerCase();
    const list = store.grievances || [];

    const found = list.find(g =>
      (g.tokenNumber && g.tokenNumber.toLowerCase() === term) ||
      (g.mobile && g.mobile === term) ||
      (g.id && g.id.toLowerCase() === term)
    );

    if (!found) {
      return res.status(404).json({
        success: false,
        message: 'इस टोकन अथवा मोबाइल नंबर से कोई शिकायत नहीं मिली।'
      });
    }

    res.json({ success: true, data: found });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================== JAN SAMVAD: REGISTER NEW GRIEVANCE ========================
router.post('/jan-samvad/register', (req, res) => {
  try {
    const {
      citizenName,
      fatherSpouseName,
      mobile,
      tehsil,
      block,
      village,
      category,
      department,
      priority,
      subject,
      description,
      attachedDocuments
    } = req.body;

    if (!citizenName || !mobile || !subject) {
      return res.status(400).json({
        success: false,
        message: 'कृपया नागरिक का नाम, मोबाइल नंबर और समस्या का विषय अवश्य भरें।'
      });
    }

    // Generate token: JS-2026-ETW-XXXX
    const nextNum = 1000 + (store.grievances.length + 1);
    const tokenNumber = `JS-2026-ETW-${nextNum}`;
    const id = 'js-' + nextNum;

    const dateDisplay = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeDisplay = new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });

    const newGrievance = {
      id,
      tokenNumber,
      citizenName: citizenName.trim(),
      fatherSpouseName: (fatherSpouseName || '').trim(),
      mobile: mobile.trim(),
      tehsil: tehsil || 'इटावा',
      block: block || 'बढ़पुरा',
      village: village || 'ग्राम रामपुर',
      category: category || 'सामान्य जनसमस्या',
      department: department || 'जनसुनवाई प्रकोष्ठ',
      priority: priority || 'आवश्यक',
      subject: subject.trim(),
      description: description || '',
      attachedDocuments: Array.isArray(attachedDocuments) ? attachedDocuments : [],
      status: 'pending',
      assignedRole: 'Grievance Officer',
      assignedStaff: 'कार्यालय सहायक',
      officialRemarks: 'पोर्टल पर समस्या प्राप्त हुई। प्रारंभिक सत्यापन एवं संज्ञान प्रक्रियाधीन।',
      actionTakenNote: '',
      createdAt: new Date().toISOString(),
      dateDisplay,
      timeline: [
        {
          status: 'pending',
          title: 'समस्या जनसंवाद पोर्टल पर दर्ज',
          date: `${dateDisplay}, ${timeDisplay}`,
          by: 'नागरिक स्वयं (ऑनलाइन)',
          remarks: `शिकायत सफलतापूर्वक दर्ज हुई। ट्रैकिंग टोकन संख्या ${tokenNumber} आवंटित किया गया।`
        }
      ]
    };

    store.grievances.unshift(newGrievance);
    saveStore();

    logAudit('Citizen Portal', `New Jan Samvad Grievance: ${newGrievance.citizenName} (${tokenNumber})`, 'JanSamvad', { tokenNumber });

    res.status(201).json({
      success: true,
      message: 'आपकी समस्या जनसंवाद पोर्टल पर सफलतापूर्वक दर्ज कर ली गई है।',
      tokenNumber,
      data: newGrievance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================== JAN SAMVAD: ACTION & STATUS UPDATE (WITH RBAC) ========================
router.put('/jan-samvad/action/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      actionTakenNote,
      officialRemarks,
      assignedStaff,
      department,
      userRole = 'super_admin',
      user = 'Admin'
    } = req.body;

    const grievance = (store.grievances || []).find(g => g.id === id || g.tokenNumber === id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'शिकायत नहीं मिली।' });
    }

    // Check Role-Based Access Permission
    const roleConfig = store.rolePermissions?.[userRole];
    if (roleConfig && status && status !== grievance.status) {
      const allowedStatuses = roleConfig.canUpdateStatus || [];
      if (!allowedStatuses.includes(status)) {
        return res.status(403).json({
          success: false,
          message: `आपके पद (${roleConfig.roleName || userRole}) के पास इस स्थिति (${status}) में बदलने की अनुमति नहीं है। केवल अधिकृत अधिकारी ही इस स्थिति में बदल सकते हैं।`
        });
      }
    }

    const previousStatus = grievance.status;
    if (status) grievance.status = status;
    if (actionTakenNote) grievance.actionTakenNote = actionTakenNote;
    if (officialRemarks) grievance.officialRemarks = officialRemarks;
    if (assignedStaff) grievance.assignedStaff = assignedStaff;
    if (department) grievance.department = department;
    grievance.updatedAt = new Date().toISOString();

    // Map status label for timeline
    const statusTitles = {
      pending: 'लंबित / समीक्षा प्रतीक्षित',
      reviewed: 'समीक्षित (कार्यालय द्वारा संज्ञान)',
      in_progress: 'कार्रवाई प्रगति पर',
      forwarded_dept: 'संबंधित विभाग को अग्रेषित',
      resolved: 'समस्या का पूर्ण समाधान / निस्तारित',
      rejected: 'अस्वीकृत / संज्ञान के योग्य नहीं'
    };

    const dateDisplay = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeDisplay = new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });

    if (!grievance.timeline) grievance.timeline = [];
    grievance.timeline.push({
      status: grievance.status,
      title: statusTitles[grievance.status] || `स्थिति अपडेट: ${grievance.status}`,
      date: `${dateDisplay}, ${timeDisplay}`,
      by: `${user} (${roleConfig?.roleName ? roleConfig.roleName.split('(')[0].trim() : userRole})`,
      remarks: actionTakenNote || officialRemarks || `स्थिति परिवर्तित: ${previousStatus} → ${grievance.status}`
    });

    saveStore();

    logAudit(user, `Jan Samvad Action on ${grievance.tokenNumber}: Status ${grievance.status}`, 'JanSamvad', {
      tokenNumber: grievance.tokenNumber,
      status: grievance.status
    });

    res.json({
      success: true,
      message: 'कार्रवाई विवरण एवं स्थिति सफलतापूर्वक अपडेट कर दी गई!',
      data: grievance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================== JAN SAMVAD: ROLES & PERMISSIONS ========================
router.get('/jan-samvad/roles', (req, res) => {
  res.json({
    success: true,
    data: store.rolePermissions || {}
  });
});

router.put('/jan-samvad/roles', (req, res) => {
  try {
    const { rolePermissions, user = 'Admin' } = req.body;
    if (!rolePermissions || typeof rolePermissions !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid role permissions data' });
    }

    store.rolePermissions = rolePermissions;
    saveStore();

    logAudit(user, 'Updated Jan Samvad Role-Based Permissions Matrix', 'JanSamvad', rolePermissions);

    res.json({
      success: true,
      message: 'भूमिका अनुमतियां (Role Permissions) सफलतापूर्वक अपडेट कर दी गईं!',
      data: store.rolePermissions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
