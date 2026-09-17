import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Palette,
  Share2,
  FileText,
  HardHat,
  Calendar,
  Users,
  UserCheck,
  Briefcase,
  MessageSquare,
  Award,
  Image,
  BarChart2,
  Sliders,
  Shield,
  Bot,
  Sparkles,
  LogOut,
  ChevronRight,
  MapPin,
  Layers,
  Compass,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

export default function AdminSidebar() {
  const {
    adminTab,
    setAdminTab,
    setViewMode,
    navigateToPublicPage,
    mla,
    activeAdminRole,
    SYSTEM_ROLES
  } = useApp();

  const currentRole = SYSTEM_ROLES?.find(r => r.id === activeAdminRole) || SYSTEM_ROLES?.[0] || {
    id: 'admin',
    name: 'मुख्य प्रशासक',
    roleTitle: 'एडमिन (Super Admin)',
    username: 'admin',
    icon: '👑',
    allowedTabs: []
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
    { id: 'people-directory', label: 'Directory & User Engine', labelHi: 'मास्टर डायरेक्टरी व यूजर सर्च', icon: Users, badge: 'SEARCH ENGINE', badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' },
    { id: 'location-intelligence', label: 'GIS Location Intelligence', labelHi: 'विधानसभा व गाँव GIS मैपिंग', icon: Compass, badge: 'GIS MAP', badgeColor: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' },
    { id: 'activities', label: 'MLA Daily Activity', labelHi: 'दैनिक जन-गतिविधि प्रकाशक', icon: Calendar, badge: 'ENGINE', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'master-data', label: 'Master Data & Excel Importer', labelHi: 'मास्टर डेटा व एक्सेल अपलोड', icon: MapPin, badge: 'EXCEL', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'media-library', label: 'Media Library & Downloader', labelHi: 'मीडिया लाइब्रेरी (डाउनलोड/लिंक)', icon: Image, badge: 'MEDIA', badgeColor: 'bg-blue-600 text-white' },
    { id: 'website-builder', label: 'Homepage Builder', labelHi: 'वेबसाइट बिल्डर', icon: Palette, badge: 'CMS' },
    { id: 'mobile-manager', label: 'Mobile App CMS', labelHi: 'मोबाइल ऐप व मेन्यू कंट्रोल', icon: Smartphone, badge: 'MOBILE CMS', badgeColor: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' },
    { id: 'hero-posters', label: 'Hero Poster Slider', labelHi: 'हीरो पोस्टर स्लाइडर (4-6)', icon: Layers, badge: 'SLIDER', badgeColor: 'bg-orange-600 text-white' },
    { id: 'media-changer', label: 'MLA Photo & Banner Manager', labelHi: 'विधायक फोटो व बैनर', icon: Image, badge: 'PHOTO' },
    { id: 'festival-manager', label: 'Festival Page Manager', labelHi: 'त्यौहार पेज', icon: Sparkles, badge: 'NEW' },
    { id: 'communication', label: 'Communication & Broadcast', labelHi: 'एसएमएस/व्हाट्सएप', icon: MessageSquare, badge: 'ALERTS' },
    { id: 'social', label: 'Social Media Intelligence', labelHi: 'सोशल मीडिया', icon: Share2 },
    { id: 'blogs', label: 'Content Management', labelHi: 'कंटेंट / ब्लॉग', icon: FileText },
    { id: 'works', label: 'Development Works', labelHi: 'विकास कार्य', icon: HardHat },
    { id: 'events', label: 'Events & Field Visits', labelHi: 'कार्यक्रम व दौरे', icon: Calendar },
    { id: 'citizens', label: 'Citizen Database (CRM)', labelHi: 'नागरिक डेटाबेस', icon: Users, badge: 'CRM' },
    { id: 'members', label: 'Member & Team Mgmt', labelHi: 'कार्यकर्ता प्रबंधन', icon: Briefcase },
    { id: 'leaders', label: 'Leaders & Mentions', labelHi: 'मार्गदर्शक नेता', icon: Award },
    { id: 'ai-assistant', label: 'AI Political Assistant', labelHi: 'AI असिस्टेंट', icon: Bot, badge: 'AI', badgeColor: 'bg-indigo-600 text-white' },
    { id: 'analytics', label: 'Reports & Analytics', labelHi: 'रिपोर्ट्स व एनालिटिक्स', icon: BarChart2 },
    { id: 'audit', label: 'User Activity Logs', labelHi: 'ऑडिट लॉग्स', icon: Shield }
  ];

  // Filter items based on active role permissions
  const visibleNavItems = navItems.filter(item => {
    if (activeAdminRole === 'admin') return true;
    return currentRole.allowedTabs?.includes(item.id);
  });

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 flex-shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-green-600 p-0.5 flex items-center justify-center flex-shrink-0 shadow-md">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-xl">🪷</span>
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight">जनसेवा इटावा</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">Admin Panel v2.0</span>
          </div>
        </div>

        {/* Role Profile Card */}
        <div className="p-3.5 bg-slate-800/60 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0 bg-slate-700 shadow flex items-center justify-center text-xl">
            <span>{currentRole.icon}</span>
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xs font-black text-white truncate">
              {currentRole.name}
            </h3>
            <p className="text-[10px] text-orange-400 font-bold truncate">
              {currentRole.roleTitle}
            </p>
            <div className="flex items-center space-x-1 mt-0.5 text-[9px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate">{visibleNavItems.length} अनुमत मॉड्यूल्स</span>
            </div>
          </div>
        </div>

        {/* Quick Launch Mobile Web App Banner */}
        <div className="px-3 pt-2.5">
          <button
            onClick={() => navigateToPublicPage('mobile')}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-orange-600/30 via-amber-500/20 to-emerald-600/30 border border-orange-500/40 text-white hover:from-orange-600/40 hover:to-emerald-600/40 transition cursor-pointer"
            title="मोबाइल ऐप इंटरफेस खोलें (/mobile)"
          >
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-orange-400" />
              <div className="text-left">
                <div className="text-[11px] font-black leading-tight">📱 मोबाइल ऐप (/mobile)</div>
                <div className="text-[9px] text-slate-400">नागरिक व कार्यकर्ता मोड</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-wider ${
                    item.badgeColor || (isActive ? 'bg-white/25 text-white' : 'bg-orange-950 text-orange-400')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {/* Tricolor Ribbon Slogan Badge */}
        <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-center">
          <p className="text-[10px] font-bold text-slate-300">
            “जनता का विश्वास, हमारी ज़िम्मेदारी”
          </p>
          <div className="tricolor-ribbon w-full mt-1.5 rounded-full"></div>
        </div>

        <button
          onClick={() => setViewMode('public')}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Public Portal</span>
        </button>
      </div>
    </aside>
  );
}
