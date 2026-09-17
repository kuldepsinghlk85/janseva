import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const SYSTEM_ROLES = [
  {
    id: 'admin',
    key: 'admin',
    name: 'मुख्य प्रशासक (Super Admin)',
    roleTitle: 'एडमिन (Super Admin)',
    username: 'admin',
    defaultPassword: 'admin123',
    icon: '👑',
    themeColor: 'purple',
    gradient: 'from-purple-600 via-indigo-600 to-blue-700',
    badge: 'पूर्ण नियंत्रण (All Privileges)',
    department: 'आईटी एवं मुख्य प्रशासनिक नियंत्रण प्रकोष्ठ',
    phone: '9450000001',
    primaryTab: 'dashboard',
    allowedTabs: [
      'dashboard', 'people-directory', 'location-intelligence', 'activities',
      'master-data', 'media-library', 'website-builder', 'hero-posters',
      'media-changer', 'festival-manager', 'communication', 'social',
      'blogs', 'works', 'events', 'citizens', 'members', 'leaders',
      'ai-assistant', 'analytics', 'audit', 'mobile-manager'
    ],
    features: [
      'सभी 20+ प्रशासनिक मॉड्यूल्स का पूर्ण एक्सेस',
      'सिस्टम कॉन्फ़िगरेशन व डेटाबेस बैकअप',
      'यूजर व रोल मैनेजमेंट (Role-Based Access Control)',
      'सम्पूर्ण ऑडिट लॉग्स एवं सुरक्षा सेटिंग्स'
    ]
  },
  {
    id: 'mla',
    key: 'mla',
    name: 'माननीया श्रीमती सरिता भदौरिया',
    roleTitle: 'विधायक (MLA - इटावा सदर 200)',
    username: 'mla_sarita',
    defaultPassword: 'mla2026',
    icon: '🏛️',
    themeColor: 'orange',
    gradient: 'from-orange-500 via-amber-500 to-green-600',
    badge: 'क्षेत्रीय नेतृत्व (VIP Controls)',
    department: 'विधानसभा सदस्य कार्यालय (इटावा 200)',
    phone: '9415045678',
    primaryTab: 'dashboard',
    allowedTabs: [
      'dashboard', 'activities', 'communication', 'works', 'events',
      'hero-posters', 'citizens', 'leaders', 'analytics', 'people-directory'
    ],
    features: [
      'जनसंवाद शिकायतों की सीधी समीक्षा व स्वीकृति',
      'क्षेत्रीय जनता व कार्यकर्ताओं को डायरेक्ट व्यक्तिगत व्हाट्सएप संदेश',
      'सामूहिक व्हाट्सएप ब्रॉडकास्ट एवं आपातकालीन सूचनाएं',
      'विकास कार्यों की स्वीकृति व निरीक्षण स्टेटस अनुमोदन',
      'विधायक दैनिक जन-गतिविधि डायरी एवं मीडिया समीक्षा'
    ]
  },
  {
    id: 'data_manager',
    key: 'data_manager',
    name: 'डेटा ऑपरेशंस मैनेजर',
    roleTitle: 'डेटा मैनेजर (Data Manager)',
    username: 'data_manager',
    defaultPassword: 'data123',
    icon: '📊',
    themeColor: 'blue',
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    badge: 'मास्टर डेटा व एक्सेल (Data Engine)',
    department: 'सूचना, GIS मैपिंग एवं डेटा प्रबंधन',
    phone: '9839001122',
    primaryTab: 'master-data',
    allowedTabs: [
      'master-data', 'people-directory', 'location-intelligence',
      'media-library', 'website-builder', 'festival-manager', 'blogs', 'news', 'social', 'mobile-manager'
    ],
    features: [
      'तहसील, ब्लॉक, ग्राम पंचायत, गाँव व पोलिंग बूथ मास्टर डेटा',
      'एमएस एक्सेल (.xlsx/.csv) से मतदाताओं व नागरिकों का बल्क अपलोड',
      'मास्टर डायरेक्टरी व यूजर सर्च इंजन का रखरखाव',
      'वेबसाइट सामग्री, योजनाएं, समाचार व मीडिया लाइब्रेरी अपडेट'
    ]
  },
  {
    id: 'karyakarta',
    key: 'karyakarta',
    name: 'बूथ समन्वयक / कार्यकर्ता',
    roleTitle: 'कार्यकर्ता (Booth Coordinator)',
    username: 'karyakarta_lead',
    defaultPassword: 'karyakarta123',
    icon: '🚩',
    themeColor: 'emerald',
    gradient: 'from-emerald-600 via-teal-600 to-green-700',
    badge: 'ग्राउंड कनेक्ट (Booth Level)',
    department: 'क्षेत्रीय कार्यकर्ता संगठन / बूथ प्रबंधन',
    phone: '9451122334',
    primaryTab: 'citizens',
    allowedTabs: [
      'citizens', 'people-directory', 'activities', 'events', 'members'
    ],
    features: [
      'घर-घर जाकर नए नागरिकों व सदस्यों का त्वरित मोबाइल पंजीकरण',
      'बूथ स्तर की जनसमस्याओं को सीधे पोर्टल पर दर्ज करना',
      'सदस्यता अभियान व सक्रिय कार्यकर्ताओं की सूची देखना',
      'स्थानीय संपर्क डायरेक्टरी से 1-क्लिक व्हाट्सएप संवाद'
    ]
  },
  {
    id: 'mla_assistant',
    key: 'mla_assistant',
    name: 'सचिवालय प्रतिनिधि (PA to MLA)',
    roleTitle: 'विधायक का असिस्टेंट (MLA Assistant / PA)',
    username: 'mla_assistant',
    defaultPassword: 'pa2026',
    icon: '📋',
    themeColor: 'rose',
    gradient: 'from-rose-600 via-red-600 to-orange-600',
    badge: 'जनसुनवाई व निस्तारण (PA Office)',
    department: 'विधायक सचिवालय / जनसुनवाई व निस्तारण प्रकोष्ठ',
    phone: '9415123450',
    primaryTab: 'citizens',
    allowedTabs: [
      'dashboard', 'citizens', 'communication', 'activities', 'works', 'audit', 'people-directory'
    ],
    features: [
      'जनसंवाद समस्याओं की दैनिक जांच व सत्यापन',
      'संबंधित सरकारी विभागों (बिजली, जल निगम, PWD आदि) को पत्राचार व अग्रेषण',
      'टोकन रसीद प्रिंट करना एवं एक्शन टेकन रिपोर्ट (ATR) दर्ज करना',
      'माननीया विधायक का दैनिक दौरा व जन-मुलाकात डायरी प्रबंधन'
    ]
  }
];

const PAGE_HASH_MAP = {
  '#timeline-page': 'timeline',
  '#leaders-page': 'leaders',
  '#schemes-page': 'schemes',
  '#works-page': 'works',
  '#team-page': 'team',
  '#constituency-page': 'constituency',
  '#social-page': 'social',
  '#jan-samvad-page': 'jan-samvad',
  '#mobile-page': 'mobile',
  '#mobile': 'mobile'
};

export function AppProvider({ children }) {
  const [viewMode, setViewMode] = useState('public'); // 'public' | 'admin'
  const [publicPage, setPublicPage] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/mobile' || window.location.pathname.startsWith('/mobile')) {
        return 'mobile';
      }
      const hash = window.location.hash;
      return PAGE_HASH_MAP[hash] || 'home';
    }
    return 'home';
  });
  const [adminTab, setAdminTab] = useState('dashboard');
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 5 Segregated Roles Switcher State
  const [activeAdminRole, setActiveAdminRoleState] = useState(() => {
    try {
      return localStorage.getItem('janseva_active_role') || 'admin';
    } catch {
      return 'admin';
    }
  });

  // Current logged in user (Citizen, Volunteer, Staff, or Admin)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('janseva_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setActiveAdminRole = (roleId) => {
    setActiveAdminRoleState(roleId);
    try {
      localStorage.setItem('janseva_active_role', roleId);
    } catch (e) {
      console.error(e);
    }
    const roleObj = SYSTEM_ROLES.find(r => r.id === roleId) || SYSTEM_ROLES[0];
    if (!roleObj.allowedTabs.includes(adminTab)) {
      setAdminTab(roleObj.primaryTab);
    }
    showToast(`सक्रिय रोल बदला: ${roleObj.roleTitle}`, 'info');
  };

  const loginUser = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('janseva_user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed saving user in localStorage', e);
    }
    // Auto-align active admin role if logging in with a matching role
    if (userData && (userData.roleKey || userData.role)) {
      const matchKey = (userData.roleKey || userData.role || '').toLowerCase();
      if (matchKey.includes('mla') && !matchKey.includes('assistant')) {
        setActiveAdminRoleState('mla');
      } else if (matchKey.includes('assistant') || matchKey.includes('pa')) {
        setActiveAdminRoleState('mla_assistant');
      } else if (matchKey.includes('data')) {
        setActiveAdminRoleState('data_manager');
      } else if (matchKey.includes('karyakarta') || matchKey.includes('booth') || matchKey.includes('coord')) {
        setActiveAdminRoleState('karyakarta');
      } else if (matchKey.includes('admin')) {
        setActiveAdminRoleState('admin');
      }
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('janseva_user');
    } catch (e) {
      console.error('Failed removing user from localStorage', e);
    }
  };

  const navigateToPublicPage = (page) => {
    setPublicPage(page);
    setViewMode('public');
    if (page === 'mobile') {
      if (window.location.pathname !== '/mobile') {
        window.history.pushState(null, '', '/mobile');
      }
      window.location.hash = '';
    } else if (page && page !== 'home') {
      if (window.location.pathname.startsWith('/mobile')) {
        window.history.pushState(null, '', `/#${page}-page`);
      } else {
        window.location.hash = `#${page}-page`;
      }
    } else {
      if (window.location.pathname.startsWith('/mobile')) {
        window.history.pushState(null, '', '/');
      } else if (window.location.hash.endsWith('-page') || window.location.hash.includes('mobile')) {
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const syncRouteWithLocation = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      if (pathname === '/mobile' || pathname.startsWith('/mobile') || hash === '#mobile' || hash === '#mobile-page') {
        setViewMode('public');
        setPublicPage('mobile');
        return;
      }

      const targetPage = PAGE_HASH_MAP[hash] || 'home';
      setPublicPage(targetPage);
    };

    window.addEventListener('hashchange', syncRouteWithLocation);
    window.addEventListener('popstate', syncRouteWithLocation);
    syncRouteWithLocation();

    // Check URL query parameters (e.g. from WhatsApp activation link)
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const action = searchParams.get('action');
      if (action === 'register' || action === 'activate' || action === 'membership' || action === 'qr' || searchParams.has('mobile')) {
        setShowQrModal(true);
      } else if (action === 'jansamvad') {
        navigateToPublicPage('jan-samvad');
      } else if (action === 'login') {
        setShowLoginModal(true);
      }
    } catch (e) {
      console.warn('URL params check error:', e);
    }

    return () => {
      window.removeEventListener('hashchange', syncRouteWithLocation);
      window.removeEventListener('popstate', syncRouteWithLocation);
    };
  }, []);

  const [settings, setSettings] = useState(null);
  const [mla, setMla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success) {
        setSettings(res.settings);
        setMla(res.mla);
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Dynamic Theme CSS Engine (WordPress Style)
  useEffect(() => {
    if (!settings?.theme) return;
    const theme = settings.theme;

    const primary = theme.primaryColor || '#ea580c';
    const secondary = theme.secondaryColor || '#16a34a';
    const accent = theme.accentColor || '#f59e0b';
    const navbarBg = theme.navbarBg || '#ffffff';
    const navbarText = theme.navbarText || '#0f172a';
    const footerBg = theme.footerBg || '#0f172a';
    const bodyBg = theme.bodyBg || '#f8fafc';
    const font = theme.fontFamily || 'Inter';

    let styleEl = document.getElementById('janseva-dynamic-theme-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'janseva-dynamic-theme-style';
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      :root {
        --theme-primary: ${primary};
        --theme-secondary: ${secondary};
        --theme-accent: ${accent};
        --theme-navbar-bg: ${navbarBg};
        --theme-navbar-text: ${navbarText};
        --theme-footer-bg: ${footerBg};
        --theme-body-bg: ${bodyBg};
      }
      body {
        background-color: ${bodyBg} !important;
        font-family: ${font}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      }
      /* Theme classes & overrides */
      .theme-primary-bg,
      .bg-orange-600,
      .bg-saffron-600 {
        background-color: ${primary} !important;
      }
      .theme-primary-text,
      .text-orange-600,
      .text-saffron-600 {
        color: ${primary} !important;
      }
      .theme-primary-border,
      .border-orange-600,
      .border-saffron-600 {
        border-color: ${primary} !important;
      }
      .theme-secondary-bg,
      .bg-green-600,
      .bg-indiaGreen-600 {
        background-color: ${secondary} !important;
      }
      .theme-secondary-text,
      .text-green-600,
      .text-indiaGreen-600 {
        color: ${secondary} !important;
      }
      .theme-secondary-border,
      .border-green-600,
      .border-indiaGreen-600 {
        border-color: ${secondary} !important;
      }
      .theme-accent-bg {
        background-color: ${accent} !important;
      }
      .theme-accent-text {
        color: ${accent} !important;
      }
      .hover\\:bg-orange-700:hover,
      .hover\\:bg-orange-600:hover {
        filter: brightness(0.92);
      }
      .hover\\:text-orange-600:hover {
        color: ${primary} !important;
      }
    `;
  }, [settings?.theme]);

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        publicPage,
        setPublicPage,
        navigateToPublicPage,
        adminTab,
        setAdminTab,
        showMobileSimulator,
        setShowMobileSimulator,
        showQrModal,
        setShowQrModal,
        showLoginModal,
        setShowLoginModal,
        currentUser,
        loginUser,
        logoutUser,
        activeAdminRole,
        setActiveAdminRole,
        SYSTEM_ROLES,
        settings,
        setSettings,
        mla,
        setMla,
        loading,
        loadSettings,
        toast,
        showToast
      }}

    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
