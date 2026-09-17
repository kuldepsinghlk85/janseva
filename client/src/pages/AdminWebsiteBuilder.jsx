import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Sparkles,
  Save,
  Eye,
  Layout,
  Layers,
  Settings,
  Calendar,
  Globe,
  Code,
  Check,
  CheckCircle2,
  Smartphone,
  ExternalLink,
  PlusCircle,
  Edit,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminWebsiteBuilder() {
  const {
    settings,
    setSettings,
    loadSettings,
    setViewMode,
    showToast,
    setShowMobileSimulator,
    setAdminTab
  } = useApp();

  const [activeTab, setActiveTab] = useState('templates'); // templates, settings, sections, blogs, festival, seo, css
  const [saving, setSaving] = useState(false);

  // Hero Form State
  const [heroForm, setHeroForm] = useState({
    title: 'विकास ही मेरी प्राथमिकता है,\nऔर जनता ही मेरी शक्ति।',
    subtitle: 'इटावा के सर्वांगीण विकास एवं जन-जन के कल्याण हेतु अहर्निश समर्पित',
    signature: 'श्रीमती सरिता भदौरिया',
    designation: 'विधायक, इटावा विधानसभा (200)',
    saritaImage: '/images/assets/sarita_bhadauria_hero.jpg',
    modiImage: '/images/assets/modi_portrait.jpg',
    yogiImage: '/images/assets/yogi_portrait.jpg',
    modiQuote: 'विकसित भारत का आधार है विकसित प्रदेश और सशक्त जिले',
    yogiQuote: 'हर जिले का विकास हर गांव का उत्थान यही हमारी पहचान',
    ctaPrimaryText: 'जनसेवा से जुड़ें →',
    ctaSecondaryText: 'हमारी कहानी देखें',
    bannerImage: '/images/media_1789490967602.jpg',
    show: true
  });

  // Festival Form State
  const [festivalForm, setFestivalForm] = useState({
    active: false,
    title: 'गणेश चतुर्थी की हार्दिक शुभकामनाएं',
    message: 'समस्त इटावा वासियों को गणेश चतुर्थी के पावन पर्व पर हार्दिक बधाई एवं शुभकामनाएं।',
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    bannerImage: '/images/assets/sarita_bhadauria_hero.jpg'
  });

  // Sections State
  const [sections, setSections] = useState([]);

  // SEO Form State
  const [seoForm, setSeoForm] = useState({
    metaTitle: 'जनसेवा इटावा (200) | विधायक श्रीमती सरिता भदौरिया - आधिकारिक पोर्टल',
    metaDescription: 'इटावा विधानसभा (200) की माननीया विधायक श्रीमती सरिता भदौरिया का आधिकारिक जनसेवा एवं विकास पोर्टल। दैनिक जन-गतिविधि, विकास कार्य व सरकारी योजनाएं।',
    keywords: 'इटावा विधायक, सरिता भदौरिया, Sarita Bhadauria MLA Etawah, BJP Etawah 200, JanSeva, विकास कार्य',
    ogImage: '/images/assets/sarita_bhadauria_hero.jpg'
  });

  // Custom Code Form State
  const [customCodeForm, setCustomCodeForm] = useState({
    css: '',
    js: ''
  });

  // Blog Settings State
  const [blogSettingsForm, setBlogSettingsForm] = useState({
    showOnHome: true,
    maxHomeCards: 3
  });

  // Sync state when settings change
  useEffect(() => {
    if (settings) {
      if (settings.hero) setHeroForm(prev => ({ ...prev, ...settings.hero }));
      if (settings.festival) setFestivalForm(prev => ({ ...prev, ...settings.festival }));
      if (settings.sections) setSections(settings.sections);
      if (settings.seo) setSeoForm(prev => ({ ...prev, ...settings.seo }));
      if (settings.customCode) setCustomCodeForm(prev => ({ ...prev, ...settings.customCode }));
      if (settings.blogSettings) setBlogSettingsForm(prev => ({ ...prev, ...settings.blogSettings }));
    }
  }, [settings]);

  // Save Hero Section Changes
  const handleSaveHero = async () => {
    setSaving(true);
    const res = await api.updateHero(heroForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('Hero Header एवं मुख्य पृष्ठ विवरण सफलतापूर्वक अपडेट किया गया!', 'success');
      await loadSettings();
    } else {
      showToast('अपडेट विफल रहा, पुनः प्रयास करें।', 'error');
    }
  };

  // 1-Click Activate Template
  const handleActivateTemplate = async (templateId) => {
    setSaving(true);
    const res = await api.setTemplate(templateId, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      if (res.sections) setSections(res.sections);
      showToast(`टेम्पलेट सफलतापूर्वक सक्रिय किया गया: ${res.template?.name || templateId}`, 'success');
      await loadSettings();
    } else {
      showToast('टेम्पलेट सक्रिय करने में त्रुटि आई।', 'error');
    }
  };

  // Toggle Section Switch
  const handleToggleSection = async (sectionId) => {
    const res = await api.toggleSection(sectionId, 'Admin (Super Admin)');
    if (res.success) {
      const updated = sections.map(s => s.id === sectionId ? { ...s, enabled: res.section.enabled } : s);
      setSections(updated);
      showToast(`सेक्शन ${res.section.nameHi || res.section.name}: ${res.section.enabled ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}`, 'info');
      await loadSettings();
    }
  };

  // Move Section Up/Down in Order
  const handleMoveSection = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const updated = reordered.map((sec, i) => ({ ...sec, order: i + 1 }));
    setSections(updated);

    const res = await api.updateSections(updated, 'Admin (Super Admin)');
    if (res.success) {
      showToast('सेक्शन का क्रम सफलतापूर्वक बदला गया और होमपेज पर लागू हुआ!', 'success');
      await loadSettings();
    }
  };

  // Reset Sections to Default Order
  const handleResetSections = async () => {
    const defaultSections = [
      { id: 'about-mla', name: 'About MLA', nameHi: 'विधायक परिचय', enabled: true, order: 1 },
      { id: 'hero-banner', name: 'Hero Banner', nameHi: 'मुख्य बैनर', enabled: true, order: 2 },
      { id: 'development-highlights', name: 'Development Highlights', nameHi: 'विकास कार्य झलकियां', enabled: true, order: 3 },
      { id: 'social-feed', name: 'Social Media Feed', nameHi: 'सोशल मीडिया अपडेट', enabled: true, order: 4 },
      { id: 'latest-news', name: 'Latest News', nameHi: 'ताज़ा समाचार', enabled: true, order: 5 },
      { id: 'upcoming-events', name: 'Upcoming Events', nameHi: 'आगामी कार्यक्रम', enabled: true, order: 6 },
      { id: 'testimonial', name: 'Testimonial', nameHi: 'जनता के अनुभव', enabled: true, order: 7 },
      { id: 'citizen-services', name: 'Citizen Services', nameHi: 'नागरिक सेवाएं एवं QR', enabled: true, order: 8 },
      { id: 'leader-network', name: 'Leader Network', nameHi: 'मार्गदर्शक नेतृत्व', enabled: true, order: 9 },
      { id: 'blogs', name: 'Blogs', nameHi: 'ब्लॉग एवं लेख', enabled: true, order: 10 },
      { id: 'gallery', name: 'Gallery', nameHi: 'फोटो एवं वीडियो गैलरी', enabled: true, order: 11 }
    ];
    setSections(defaultSections);
    const res = await api.updateSections(defaultSections, 'Admin (Super Admin)');
    if (res.success) {
      showToast('लेआउट क्रम डिफ़ॉल्ट पर रीसेट कर दिया गया!', 'success');
      await loadSettings();
    }
  };

  // Toggle Festival Campaign
  const handleToggleFestival = async (activeState) => {
    const updated = { ...festivalForm, active: activeState };
    setFestivalForm(updated);
    const res = await api.updateFestival(updated, 'Admin (Super Admin)');
    if (res.success) {
      showToast(`फेस्टिवल पेज ${activeState ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'} किया गया!`, 'success');
      await loadSettings();
    }
  };

  // Save Festival Form
  const handleSaveFestival = async () => {
    setSaving(true);
    const res = await api.updateFestival(festivalForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('फेस्टिवल विवरण सफलतापूर्वक सुरक्षित किया गया!', 'success');
      await loadSettings();
    }
  };

  // Save SEO Form
  const handleSaveSeo = async () => {
    setSaving(true);
    const res = await api.updateSeo(seoForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('SEO एवं मेटा टैग्स सफलतापूर्वक सुरक्षित किए गए!', 'success');
      await loadSettings();
    }
  };

  // Save Custom Code Form
  const handleSaveCustomCode = async () => {
    setSaving(true);
    const res = await api.updateCustomCode(customCodeForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('कस्टम CSS/JS कोड सुरक्षित किया गया और वेबसाइट पर लागू हुआ!', 'success');
      await loadSettings();
    }
  };

  // Save Blog Settings
  const handleSaveBlogSettings = async () => {
    setSaving(true);
    const res = await api.updateBlogSettings(blogSettingsForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('ब्लॉग सेटिंग्स सुरक्षित की गईं!', 'success');
      await loadSettings();
    }
  };

  const templatesList = settings?.templates || [
    { id: 'development-focus', name: 'Development Focus', nameHi: 'विकास केंद्रित होमपेज', desc: 'सड़क, स्कूल, अस्पताल, पेयजल और आधारभूत संरचना पर विशेष ध्यान।' },
    { id: 'public-connect', name: 'Public Connect', nameHi: 'जनसंवाद होमपेज', desc: 'नागरिक संपर्क, समस्या निवारण, बैठकों और QR सदस्यता पर जोर।' },
    { id: 'media-news', name: 'Media & News', nameHi: 'मीडिया एवं समाचार होमपेज', desc: 'दैनिक समाचार कवरेज, प्रेस विज्ञप्तियां और मीडिया वीडियो।' },
    { id: 'political-leadership', name: 'Political Leadership', nameHi: 'राजनीतिक नेतृत्व होमपेज', desc: 'पार्टी विचारधारा, राष्ट्रीय नेताओं के मार्गदर्शन और रैलियों का संकलन।' },
    { id: 'complete-intelligence', name: 'Complete Intelligence', nameHi: 'समग्र इंटेलिजेंस होमपेज', desc: 'लाइव मैप्स, विकास स्टेटस चार्ट और डेटा विज़ुअलाइज़ेशन युक्त डैशबोर्ड।' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Welcome Banner with Live Actions (Mockup 1 Header) */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 rounded-2xl p-5 sm:p-6 border border-orange-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-orange-700">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Website Management & Appearance</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Welcome back, Admin!
          </h2>
          <p className="text-xs text-slate-600">
            Manage your MLA Constituency Platform • “जनता की सेवा ही सच्ची राजनीति है।” — जनसेवा
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('public')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs transition shadow-sm"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSaveHero}
            disabled={saving}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-md shadow-orange-600/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Summary Cards (Mockup 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900">5,42,318</div>
          <div className="text-[10px] font-bold text-slate-500">Total Citizens</div>
          <span className="text-[9px] text-emerald-600 font-bold">+12%</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900">1,248</div>
          <div className="text-[10px] font-bold text-slate-500">Total Posts</div>
          <span className="text-[9px] text-emerald-600 font-bold">+18%</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900">320</div>
          <div className="text-[10px] font-bold text-slate-500">Development Works</div>
          <span className="text-[9px] text-emerald-600 font-bold">+25%</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900">46</div>
          <div className="text-[10px] font-bold text-slate-500">Upcoming Events</div>
          <span className="text-[9px] text-emerald-600 font-bold">+10%</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900">24</div>
          <div className="text-[10px] font-bold text-slate-500">Pending Approvals</div>
          <span className="text-[9px] text-amber-600 font-bold">Needs Review</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900">2.4M</div>
          <div className="text-[10px] font-bold text-slate-500">Total Reach (Social)</div>
          <span className="text-[9px] text-emerald-600 font-bold">+32%</span>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
        {[
          { id: 'templates', label: 'Templates', icon: Layout },
          { id: 'settings', label: 'Homepage Settings', icon: Settings },
          { id: 'sections', label: 'Section Manager', icon: Layers },
          { id: 'blogs', label: 'Blog Settings', icon: Edit },
          { id: 'festival', label: 'Festival Pages', icon: Calendar },
          { id: 'seo', label: 'SEO & Meta', icon: Globe },
          { id: 'css', label: 'Custom CSS/JS', icon: Code }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Builder Grid: Left Controls & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Config Forms & Section Switchers (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: Pre-built Homepage Templates */}
          {activeTab === 'templates' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Pre-built Homepage Templates</h3>
                  <span className="text-xs text-orange-600 font-bold">1-क्लिक सक्रियण</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select any pre-configured layout and activate it as the primary public homepage with 1 click. All section orders dynamically adapt.
                </p>
              </div>

              <div className="space-y-3">
                {templatesList.map((tmpl) => {
                  const isActive = settings?.activeTemplate === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-black text-slate-900">{tmpl.name}</h4>
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                            {tmpl.nameHi}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white flex items-center space-x-1">
                              <Check className="w-3 h-3 inline" />
                              <span>ACTIVE</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{tmpl.desc}</p>
                      </div>

                      <button
                        onClick={() => handleActivateTemplate(tmpl.id)}
                        disabled={isActive || saving}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-slate-900 hover:bg-orange-600 text-white shadow-sm active:scale-95'
                        }`}
                      >
                        <span>{isActive ? 'Current Active' : 'Activate Template'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Homepage Settings (Hero, Quotes, Photos) */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Hero Section & Headline Settings</h3>
                  <p className="text-xs text-slate-500">
                    यहाँ बदले गए सभी शीर्षक, उद्धरण और फोटो सीधे मुख्य पृष्ठ पर वास्तविक समय में दिखेंगे।
                  </p>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                  <span>Show on Website</span>
                  <input
                    type="checkbox"
                    checked={heroForm.show}
                    onChange={(e) => setHeroForm({ ...heroForm, show: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Main Heading & Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Banner Title (Main Heading - नई लाइन के लिए Enter दबाएं)
                  </label>
                  <textarea
                    rows={2}
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                    placeholder="उदा. “विकास ही मेरी प्राथमिकता है,&#10;और जनता ही मेरी शक्ति।”"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subtitle / Tagline (उपशीर्षक)
                  </label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="इटावा के सर्वांगीण विकास एवं जन-जन के कल्याण हेतु अहर्निश समर्पित"
                  />
                </div>
              </div>

              {/* Signature & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">विधायक का नाम (Signature Name)</label>
                  <input
                    type="text"
                    value={heroForm.signature}
                    onChange={(e) => setHeroForm({ ...heroForm, signature: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">पदवी (Designation)</label>
                  <input
                    type="text"
                    value={heroForm.designation}
                    onChange={(e) => setHeroForm({ ...heroForm, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Modi & Yogi Quotes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PM नरेन्द्र मोदी जी का विचार (Quote)</label>
                  <textarea
                    rows={2}
                    value={heroForm.modiQuote}
                    onChange={(e) => setHeroForm({ ...heroForm, modiQuote: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CM योगी आदित्यनाथ जी का विचार (Quote)</label>
                  <textarea
                    rows={2}
                    value={heroForm.yogiQuote}
                    onChange={(e) => setHeroForm({ ...heroForm, yogiQuote: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={heroForm.ctaPrimaryText}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={heroForm.ctaSecondaryText}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* MLA Photo URL & Preview */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">विधायक मुख्य फोटो (MLA Photo URL)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={heroForm.saritaImage}
                    onChange={(e) => setHeroForm({ ...heroForm, saritaImage: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAdminTab('media-changer')}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                    <span>फोटो बदलें</span>
                  </button>
                </div>
              </div>

              {/* Hero Poster Slider Quick-Link Card */}
              <div className="pt-3 border-t border-slate-100">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-orange-900 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                      <span>दैनिक हीरो पोस्टर स्लाइडर (4-6 पोस्टर रोटेशन)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      होमपेज के दाहिने हिस्से में चलने वाले 4 से 6 पोस्टर अपलोड करें, उनका क्रम बदलें और ऑटो-स्लाइड गति तय करें।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminTab('hero-posters')}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-xs transition active:scale-95 flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
                  >
                    <span>पोस्टर स्लाइडर सेटिंग्स खोलें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveHero}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition cursor-pointer"
                >
                  {saving ? 'सुरक्षित हो रहा है...' : 'Hero Section अपडेट करें'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Section Manager (Reorder & Visibility) */}
          {activeTab === 'sections' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                      {sections.length}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Website Sections Manager (क्रम और दृश्यता नियंत्रण)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    किसी भी सेक्शन को ऊपर/नीचे करें या स्विच बंद करके वेबसाइट से छिपाएं। परिवर्तन तत्काल मुख्य पृष्ठ पर दिखेंगे।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetSections}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                  title="Reset to default order"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>डिफ़ॉल्ट रीसेट</span>
                </button>
              </div>

              <div className="space-y-2">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      sec.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/80 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Order number badge */}
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-black text-[11px] flex items-center justify-center border border-slate-200">
                        #{idx + 1}
                      </span>

                      {/* Reorder Up/Down arrows */}
                      <div className="flex flex-col space-y-0.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="hover:text-orange-600 disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === sections.length - 1}
                          className="hover:text-orange-600 disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900">{sec.name}</div>
                        <div className="text-[10px] text-orange-700 font-semibold">{sec.nameHi}</div>
                      </div>
                    </div>

                    {/* Switch & Status */}
                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sec.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {sec.enabled ? 'सक्रिय (Visible)' : 'छिपा हुआ (Hidden)'}
                      </span>

                      <button
                        onClick={() => handleToggleSection(sec.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition cursor-pointer ${
                          sec.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                            sec.enabled ? 'translate-x-4' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Blog Settings */}
          {activeTab === 'blogs' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Blog & Article Settings</h3>
                  <p className="text-xs text-slate-500">
                    मुख्य पृष्ठ पर ब्लॉग व आलेखों के प्रदर्शन का नियंत्रण।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminTab('blogs')}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition cursor-pointer"
                >
                  पूरा ब्लॉग प्रबंधक खोलें →
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-800">मुख्य पृष्ठ पर ब्लॉग दिखाएं</div>
                    <div className="text-slate-500 text-[11px]">होमपेज पर ब्लॉग सेक्शन की दृश्यता चालू या बंद करें</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={blogSettingsForm.showOnHome}
                    onChange={(e) => setBlogSettingsForm({ ...blogSettingsForm, showOnHome: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">होमपेज पर प्रदर्शित होने वाले आलेखों की संख्या</label>
                  <select
                    value={blogSettingsForm.maxHomeCards}
                    onChange={(e) => setBlogSettingsForm({ ...blogSettingsForm, maxHomeCards: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value={3}>3 आलेख</option>
                    <option value={6}>6 आलेख</option>
                    <option value={9}>9 आलेख</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveBlogSettings}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs transition cursor-pointer"
                >
                  {saving ? 'सुरक्षित हो रहा है...' : 'ब्लॉग सेटिंग्स सुरक्षित करें'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Festival Page Manager */}
          {activeTab === 'festival' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Festival Campaign & Banner Settings</h3>
                  <p className="text-xs text-slate-500">
                    पर्व एवं विशेष दिवस पर मुख्य पृष्ठ पर बधाई बैनर व विशेष संदेश लाइव करें।
                  </p>
                </div>
                <button
                  onClick={() => handleToggleFestival(!festivalForm.active)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    festivalForm.active ? 'bg-red-100 text-red-700' : 'bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  {festivalForm.active ? 'Deactivate' : 'Activate Festival Page'}
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Festival Title (त्यौहार का नाम)</label>
                  <input
                    type="text"
                    value={festivalForm.title}
                    onChange={(e) => setFestivalForm({ ...festivalForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Greeting Message (शुभकामना संदेश)</label>
                  <textarea
                    rows={3}
                    value={festivalForm.message}
                    onChange={(e) => setFestivalForm({ ...festivalForm, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={festivalForm.startDate}
                      onChange={(e) => setFestivalForm({ ...festivalForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">End Date (Auto Restore)</label>
                    <input
                      type="date"
                      value={festivalForm.endDate}
                      onChange={(e) => setFestivalForm({ ...festivalForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveFestival}
                    disabled={saving}
                    className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow cursor-pointer"
                  >
                    {saving ? 'सुरक्षित हो रहा है...' : 'फेस्टिवल सेटिंग्स सुरक्षित करें'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('festival-manager')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                  >
                    पूरा पोस्टर व वीडियो प्रबंधक →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SEO & Meta */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">Search Engine Optimization (SEO) & Social Meta</h3>
                <p className="text-xs text-slate-500">
                  गूगल, फेसबुक और व्हाट्सएप पर शेयर करते समय दिखने वाले शीर्षक व विवरण का विन्यास।
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Page Title (मेटा शीर्षक)</label>
                  <input
                    type="text"
                    value={seoForm.metaTitle}
                    onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meta Description (सर्च विवरण)</label>
                  <textarea
                    rows={3}
                    value={seoForm.metaDescription}
                    onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Keywords (कीवर्ड्स - अल्पविराम द्वारा अलग करें)</label>
                  <input
                    type="text"
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Social Share Image (OG Image URL)</label>
                  <input
                    type="text"
                    value={seoForm.ogImage}
                    onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveSeo}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow cursor-pointer"
                >
                  {saving ? 'सुरक्षित हो रहा है...' : 'SEO सेटिंग्स सुरक्षित करें'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: Custom CSS/JS */}
          {activeTab === 'css' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">Custom CSS & Analytics Scripts</h3>
                <p className="text-xs text-slate-500">
                  वेबसाइट के डिज़ाइन को ओवरराइड करने या Google Analytics / Meta Pixel टैग जोड़ने के लिए।
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom CSS</label>
                  <textarea
                    rows={5}
                    value={customCodeForm.css}
                    onChange={(e) => setCustomCodeForm({ ...customCodeForm, css: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
                    placeholder="/* Custom CSS */ .hero-headline { color: #f97316; }"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Head JavaScript / Analytics Code</label>
                  <textarea
                    rows={4}
                    value={customCodeForm.js}
                    onChange={(e) => setCustomCodeForm({ ...customCodeForm, js: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
                    placeholder="<!-- Analytics or Tracker Script -->"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveCustomCode}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer"
                >
                  {saving ? 'सुरक्षित हो रहा है...' : 'Custom Code लागू करें'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Website Preview & Quick Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Website Preview Frame */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-xs font-black text-slate-900">Live Website Preview</h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowMobileSimulator(true)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition cursor-pointer"
                  title="मोबाइल सिम्युलेटर खोलें"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => window.open('/', '_blank')}
                  className="flex items-center space-x-1 text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Interactive Scaled Live Preview Container */}
            <div className="rounded-xl overflow-hidden border border-slate-300 aspect-[16/11] bg-slate-100 relative group shadow-inner">
              <iframe
                src="/?preview=true"
                title="Live Website View"
                className="w-[200%] h-[200%] transform scale-50 origin-top-left border-0 pointer-events-none"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-2xs">
                <button
                  type="button"
                  onClick={() => window.open('/', '_blank')}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg transition transform hover:scale-105 cursor-pointer flex items-center space-x-1.5"
                >
                  <span>लाइव वेबसाइट नए टैब में खोलें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-center font-medium">
              यहाँ किए गए सभी बदलाव वेबसाइट एवं मोबाइल ऐप पर वास्तविक समय में अपडेट होते हैं
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-900">Quick Actions (त्वरित कार्य)</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAdminTab('activities')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-center border border-emerald-200 transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>+ Add New Post</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminTab('blogs')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-center border border-blue-200 transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Manage Blogs</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminTab('works')}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-center border border-purple-200 transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>+ Add Event / Work</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminTab('festival-manager')}
                className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-center border border-orange-200 transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Create Festival Page</span>
              </button>
            </div>
          </div>

          {/* Current Template Widget */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">Current Active Template</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-slate-900 capitalize">
                  {settings?.activeTemplate?.replace(/-/g, ' ') || 'Development Focus'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {templatesList.find(t => t.id === settings?.activeTemplate)?.desc || 'Ideal for constituency development works'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>

          {/* Blog Section Control Widget */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Blog Section Control</h4>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                {sections.find(s => s.id === 'blogs')?.enabled ? 'Blogs are Visible on Website' : 'Blogs are Hidden'}
              </span>
              <button
                type="button"
                onClick={() => handleToggleSection('blogs')}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer"
              >
                Toggle
              </button>
            </div>
          </div>

          {/* Festival Landing Page Widget */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Festival Landing Page</h4>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                {festivalForm.active ? 'Festival Page is Active' : 'No festival page active'}
              </span>
              <button
                type="button"
                onClick={() => handleToggleFestival(!festivalForm.active)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  festivalForm.active ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                }`}
              >
                {festivalForm.active ? 'Turn Off' : 'Activate'}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
