const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'janSamvadMaster.json');

const initialGrievances = [
  {
    id: 'js-1001',
    tokenNumber: 'JS-2026-ETW-1001',
    citizenName: 'रामबाबू शर्मा',
    fatherSpouseName: 'स्व. रामदयाल शर्मा',
    mobile: '9876543210',
    tehsil: 'इटावा',
    block: 'बढ़पुरा',
    village: 'ग्राम रामपुर',
    category: 'सड़क व नाली निर्माण',
    department: 'ग्राम्य विकास एवं पंचायती राज',
    priority: 'आवश्यक',
    subject: 'गांव में जल निकासी नाली निर्माण',
    description: 'ग्राम रामपुर की मुख्य ब्राह्मण बस्ती में जल निकासी की नाली न होने से घरों का गंदा पानी रास्ते पर भर रहा है। कृपया 200 मीटर पक्की नाली का निर्माण स्वीकृत कराने की कृपा करें।',
    attachedDocuments: [
      {
        name: 'naali_problem_photo.jpg',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
        type: 'image'
      }
    ],
    status: 'pending', // 'pending', 'reviewed', 'in_progress', 'forwarded_dept', 'resolved', 'rejected'
    assignedRole: 'Grievance Officer',
    assignedStaff: 'श्री अजय कुमार (सहायक)',
    officialRemarks: 'शिकायत पटल पर दर्ज कर ली गई है। ग्राम पंचायत स्तर पर प्रारंभिक सत्यापन हेतु प्रेषित की जानी है।',
    actionTakenNote: '',
    createdAt: '2026-03-15T10:30:00Z',
    dateDisplay: '15 मार्च 2026',
    timeline: [
      {
        status: 'pending',
        title: 'समस्या जनसंवाद पोर्टल पर दर्ज',
        date: '15 मार्च 2026, 10:30 AM',
        by: 'नागरिक स्वयं (ऑनलाइन)',
        remarks: 'टोकन संख्या JS-2026-ETW-1001 आवंटित।'
      }
    ]
  },
  {
    id: 'js-1002',
    tokenNumber: 'JS-2026-ETW-1002',
    citizenName: 'कमलेश कुमारी',
    fatherSpouseName: 'पत्नी श्री शिवकुमार',
    mobile: '9876543211',
    tehsil: 'भरथना',
    block: 'भरथना',
    village: 'बकेवर',
    category: 'कल्याणकारी योजनाएं (महिला व बाल विकास)',
    department: 'महिला कल्याण विभाग',
    priority: 'अति-आवश्यक',
    subject: 'कन्या सुमंगला योजना का द्वितीय चरण किस्त',
    description: 'मेरी पुत्री का कन्या सुमंगला योजना में पंजीकरण हो चुका है, लेकिन विगत 6 माह से द्वितीय चरण की धनराशि बैंक खाते में नहीं आई है। सभी दस्तावेज संलग्न हैं।',
    attachedDocuments: [
      {
        name: 'sumangala_passbook.jpg',
        url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80',
        type: 'image'
      }
    ],
    status: 'in_progress',
    assignedRole: 'Grievance Officer',
    assignedStaff: 'श्रीमती नीतू सिंह',
    officialRemarks: 'महिला कल्याण अधिकारी, इटावा को प्राथमिकता पत्र प्रेषित। पीएफएमएस (PFMS) सत्यापन जारी।',
    actionTakenNote: 'संबंधित पटल सहायक से वार्ता हुई। अगले वित्तीय सप्ताह में किस्त अंतरित करने का आश्वासन प्राप्त।',
    createdAt: '2026-03-14T11:15:00Z',
    dateDisplay: '14 मार्च 2026',
    timeline: [
      {
        status: 'pending',
        title: 'समस्या जनसंवाद पोर्टल पर दर्ज',
        date: '14 मार्च 2026, 11:15 AM',
        by: 'नागरिक स्वयं',
        remarks: 'टोकन संख्या JS-2026-ETW-1002 आवंटित।'
      },
      {
        status: 'in_progress',
        title: 'संबंधित विभाग को अग्रेषित व कार्रवाई शुरू',
        date: '14 मार्च 2026, 03:45 PM',
        by: 'कार्यालय प्रभारी',
        remarks: 'महिला कल्याण विभाग को संदर्भ पत्र क्रमांक DPO/ETW/2026/410 जारी।'
      }
    ]
  },
  {
    id: 'js-1003',
    tokenNumber: 'JS-2026-ETW-1003',
    citizenName: 'सुरेश कुमार पाल',
    fatherSpouseName: 'श्री बाबूराम पाल',
    mobile: '9876543212',
    tehsil: 'इटावा',
    block: 'बसरेहर',
    village: 'तकरोई',
    category: 'विद्युत आपूर्ति व ट्रांसफार्मर',
    department: 'मध्य विद्युत वितरण निगम (MVVNL)',
    priority: 'अति-आवश्यक',
    subject: 'खेतों के लिए विद्युत ट्रांसफार्मर क्षमता वृद्धि',
    description: 'तकरोई गाँव के नलकूप फीडर पर लगा 63 KVA ट्रांसफार्मर ओवरलोड होकर बार-बार ट्रिप होता है। इसे 100 KVA क्षमता का करने की आवश्यकता है।',
    attachedDocuments: [
      {
        name: 'transformer_location.jpg',
        url: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?w=600&auto=format&fit=crop&q=80',
        type: 'image'
      }
    ],
    status: 'resolved',
    assignedRole: 'Super Admin',
    assignedStaff: 'कार्यालय प्रभारी',
    officialRemarks: 'विधायक जी के निर्देश पर अधिशासी अभियंता विद्युत इटावा द्वारा 100 KVA का नया ट्रांसफार्मर स्थापित कर आपूर्ति चालू की गई।',
    actionTakenNote: 'कार्य पूर्ण। अधिशासी अभियंता (विद्युत) की कार्यपूर्ति आख्या प्राप्त एवं कृषक द्वारा संतुष्टि पुष्टि।',
    createdAt: '2026-03-12T09:00:00Z',
    dateDisplay: '12 मार्च 2026',
    timeline: [
      {
        status: 'pending',
        title: 'समस्या जनसंवाद पोर्टल पर दर्ज',
        date: '12 मार्च 2026, 09:00 AM',
        by: 'नागरिक स्वयं',
        remarks: 'टोकन संख्या JS-2026-ETW-1003 आवंटित।'
      },
      {
        status: 'in_progress',
        title: 'अधिशासी अभियंता विद्युत को आदेशित',
        date: '12 मार्च 2026, 12:30 PM',
        by: 'विधायक कार्यालय',
        remarks: 'विशेष प्राथमिकता पत्र प्रेषित।'
      },
      {
        status: 'resolved',
        title: 'नया 100 KVA ट्रांसफार्मर स्थापित व निस्तारित',
        date: '14 मार्च 2026, 05:00 PM',
        by: 'सुपर एडमिन / विधायक कैंप कार्यालय',
        remarks: 'समस्या का शत-प्रतिशत समाधान हुआ।'
      }
    ]
  }
];

// Configurable Role-Based Access Control (RBAC)
const initialRolePermissions = {
  super_admin: {
    roleName: 'सुपर एडमिन / विधायक कार्यालय प्रभारी (Super Admin)',
    canUpdateStatus: ['pending', 'reviewed', 'in_progress', 'forwarded_dept', 'resolved', 'rejected'],
    canPrintReport: true,
    canAssignStaff: true,
    canDeleteGrievance: true,
    canBroadcastAlerts: true,
    canManageRoles: true
  },
  grievance_officer: {
    roleName: 'जनसंवाद निवारण अधिकारी (Grievance Officer)',
    canUpdateStatus: ['reviewed', 'in_progress', 'forwarded_dept'],
    canPrintReport: true,
    canAssignStaff: true,
    canDeleteGrievance: false,
    canBroadcastAlerts: false,
    canManageRoles: false
  },
  field_coordinator: {
    roleName: 'क्षेत्रीय / सेक्टर समन्वयक (Field Coordinator)',
    canUpdateStatus: ['in_progress'],
    canPrintReport: true,
    canAssignStaff: false,
    canDeleteGrievance: false,
    canBroadcastAlerts: false,
    canManageRoles: false
  },
  viewer: {
    roleName: 'विभागीय संपर्क / दर्शक (Viewer / Department Liaison)',
    canUpdateStatus: [],
    canPrintReport: true,
    canAssignStaff: false,
    canDeleteGrievance: false,
    canBroadcastAlerts: false,
    canManageRoles: false
  }
};

let store = {
  grievances: [...initialGrievances],
  rolePermissions: { ...initialRolePermissions }
};

try {
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    store = JSON.parse(raw);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
  }
} catch (err) {
  console.error('Error loading janSamvadMaster.json:', err);
}

function saveStore() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving janSamvadMaster.json:', err);
  }
}

module.exports = {
  store,
  saveStore
};
