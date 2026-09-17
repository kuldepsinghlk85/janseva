// server/data/users.js
// Node.js JavaScript Native Data Storage - 5 Segregated Roles & System Users

const users = [
  {
    id: 1,
    name: "मुख्य प्रशासक (Super Admin)",
    username: "admin",
    role: "Super Admin",
    roleKey: "admin",
    roleTitle: "एडमिन (Super Admin)",
    passwordHash: "admin123",
    permissions: ["all"],
    avatar: "/images/admimadmin.png",
    status: "active",
    phone: "9450000001",
    department: "आईटी एवं प्रशासनिक नियंत्रण प्रकोष्ठ",
    badges: ["पूर्ण नियंत्रण", "सिस्टम कॉन्फ़िगरेशन", "यूजर मैनेजमेंट", "ऑडिट लॉग्स"],
    description: "पूरे पोर्टल, डेटाबेस, सुरक्षा और सभी मॉड्यूल्स का सर्वोच्च प्रशासनिक अधिकार।",
    createdAt: "2026-09-15"
  },
  {
    id: 2,
    name: "माननीया श्रीमती सरिता भदौरिया",
    username: "mla_sarita",
    role: "MLA",
    roleKey: "mla",
    roleTitle: "विधायक (MLA - इटावा सदर 200)",
    passwordHash: "mla2026",
    permissions: ["view_all", "approve_grievances", "broadcast_whatsapp", "approve_works", "mla_diary", "vip_letters"],
    avatar: "/images/assets/sarita_bhadauria_hero.jpg",
    status: "active",
    phone: "9415045678",
    department: "विधानसभा सदस्य कार्यालय (इटावा 200)",
    badges: ["क्षेत्रीय जनसंवाद", "व्हाट्सएप संदेश प्रेषक", "विकास कार्य स्वीकृति", "वीआईपी पत्राचार"],
    description: "जनसंवाद शिकायतों की समीक्षा, व्यक्तिगत व सामूहिक व्हाट्सएप संदेश, विकास कार्यों की स्वीकृति।",
    createdAt: "2026-09-15"
  },
  {
    id: 3,
    name: "डेटा ऑपरेशंस मैनेजर (Data Manager)",
    username: "data_manager",
    role: "Data Manager",
    roleKey: "data_manager",
    roleTitle: "डेटा मैनेजर (Data Manager)",
    passwordHash: "data123",
    permissions: ["manage_master_data", "excel_import", "manage_content", "manage_directory", "manage_schemes"],
    avatar: "/images/poli2.png",
    status: "active",
    phone: "9839001122",
    department: "सूचना, GIS मैपिंग एवं डेटा प्रबंधन",
    badges: ["मास्टर डेटा एंट्री", "एक्सेल बल्क अपलोड", "डायरेक्टरी प्रबंधन", "योजनाएं व समाचार"],
    description: "तहसील, ब्लॉक, ग्राम पंचायत, बूथ डेटा एंट्री, एमएस एक्सेल लिस्ट अपलोड, डायरेक्टरी व सामग्री प्रबंधन।",
    createdAt: "2026-09-15"
  },
  {
    id: 4,
    name: "क्षेत्रीय बूथ समन्वयक (Karyakarta Lead)",
    username: "karyakarta_lead",
    role: "Karyakarta",
    roleKey: "karyakarta",
    roleTitle: "कार्यकर्ता (Booth Coordinator)",
    passwordHash: "karyakarta123",
    permissions: ["register_citizens", "booth_reports", "membership_drive", "local_directory", "view_booth_grievances"],
    avatar: "/images/poli1.png",
    status: "active",
    phone: "9451122334",
    department: "क्षेत्रीय कार्यकर्ता संगठन / बूथ प्रबंधन",
    badges: ["घर-घर नागरिक पंजीकरण", "बूथ समस्या रिपोर्ट", "सदस्यता अभियान", "स्थानीय संपर्क"],
    description: "जमीनी स्तर पर नागरिकों व सदस्यों का पंजीकरण, बूथवार समस्याओं की रिपोर्ट, जनसंपर्क।",
    createdAt: "2026-09-15"
  },
  {
    id: 5,
    name: "सचिवालय प्रतिनिधि (PA to MLA)",
    username: "mla_assistant",
    role: "MLA Assistant",
    roleKey: "mla_assistant",
    roleTitle: "विधायक का असिस्टेंट (MLA Assistant / PA)",
    passwordHash: "pa2026",
    permissions: ["manage_grievances", "forward_departments", "action_taken_reports", "schedule_diary", "print_tokens"],
    avatar: "/images/poli3.png",
    status: "active",
    phone: "9415123450",
    department: "विधायक सचिवालय / जनसुनवाई व निस्तारण प्रकोष्ठ",
    badges: ["शिकायत पंजीकरण व अग्रेषण", "विभागीय पत्राचार", "दैनिक दौरा व डायरी", "कार्रवाई रिपोर्ट (ATR)"],
    description: "जनसंवाद समस्याओं की जांच, संबंधित विभाग को पत्राचार/अग्रेषण, टोकन रसीद प्रिंट व एक्शन टेकन रिपोर्ट दर्ज करना।",
    createdAt: "2026-09-15"
  }
];

module.exports = { users };

