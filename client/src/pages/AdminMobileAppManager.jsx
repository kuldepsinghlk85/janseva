import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Smartphone,
  CheckCircle,
  Save,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Home,
  MessageSquare,
  Users,
  HardHat,
  Calendar,
  Award,
  BookOpen,
  MapPin,
  Share2,
  FileText,
  Phone,
  Send,
  Shield,
  Layers,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Sliders,
  Globe
} from 'lucide-react';

export default function AdminMobileAppManager() {
  const { showToast, navigateToPublicPage } = useApp();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileSettings, setMobileSettings] = useState({
    appName: "जनसेवा इटावा 200",
    appTagline: "श्रीमती सरिता भदौरिया • आधिकारिक मोबाइल पोर्टल",
    helplinePhone: "05688250000",
    officialWhatsapp: "9876543210",
    slogan: "“जनता का विश्वास, हमारी सेवा का संकल्प”",
    showTopRoleSwitcher: true,
    showRoleCredentialsBtn: true,
    features: {
      heroProfile: true,
      quickCounters: true,
      janSamvadSpotlight: true,
      whatsappRegBox: true,
      dailyActivities: true,
      guidanceLeaders: true,
      governmentSchemes: true,
      developmentWorks: true,
      peopleDirectory: true,
      constituencyMap: true,
      socialMediaFeed: true,
      latestNews: true,
      festivalBanner: true,
      leadershipQuotes: true,
      websiteDrawer: true
    },
    bottomTabs: {
      home: true,
      jansamvad: true,
      directory: true,
      works: true,
      websiteMenu: true,
      profile: true
    }
  });

  const [activeCategory, setActiveCategory] = useState('features'); // 'features' | 'tabs' | 'roles' | 'branding'

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.getMobileSettings();
      if (res?.success && res.mobile) {
        setMobileSettings(prev => ({
          ...prev,
          ...res.mobile,
          features: { ...prev.features, ...(res.mobile.features || {}) },
          bottomTabs: { ...prev.bottomTabs, ...(res.mobile.bottomTabs || {}) }
        }));
      }
    } catch (e) {
      console.warn('Failed to load mobile settings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.updateMobileSettings(mobileSettings, 'Super Admin');
      if (res?.success) {
        showToast('मोबाइल ऐप व मेन्यू सेटिंग्स सफलतापूर्वक सहेजी गईं!', 'success');
      } else {
        showToast(res?.message || 'सेव करने में त्रुटि हुई', 'error');
      }
    } catch (e) {
      showToast('त्रुटि हुई', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeature = async (key) => {
    const newState = !mobileSettings.features[key];
    setMobileSettings(prev => ({
      ...prev,
      features: { ...prev.features, [key]: newState }
    }));
    try {
      await api.toggleMobileFeature({ featureKey: key }, 'Super Admin');
      showToast(`${featureDefinitions.find(f => f.key === key)?.title || key}: ${newState ? 'इनेबल (चालू)' : 'डिसेबल (बंद)'}`, 'info');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleTab = async (key) => {
    const newState = !mobileSettings.bottomTabs[key];
    setMobileSettings(prev => ({
      ...prev,
      bottomTabs: { ...prev.bottomTabs, [key]: newState }
    }));
    try {
      await api.toggleMobileFeature({ tabKey: key }, 'Super Admin');
      showToast(`बॉटम टैब [${key}]: ${newState ? 'इनेबल' : 'डिसेबल'}`, 'info');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('क्या आप सभी मोबाइल सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      const defaultState = {
        appName: "जनसेवा इटावा 200",
        appTagline: "श्रीमती सरिता भदौरिया • आधिकारिक मोबाइल पोर्टल",
        helplinePhone: "05688250000",
        officialWhatsapp: "9876543210",
        slogan: "“जनता का विश्वास, हमारी सेवा का संकल्प”",
        showTopRoleSwitcher: true,
        showRoleCredentialsBtn: true,
        features: {
          heroProfile: true,
          quickCounters: true,
          janSamvadSpotlight: true,
          whatsappRegBox: true,
          dailyActivities: true,
          guidanceLeaders: true,
          governmentSchemes: true,
          developmentWorks: true,
          peopleDirectory: true,
          constituencyMap: true,
          socialMediaFeed: true,
          latestNews: true,
          festivalBanner: true,
          leadershipQuotes: true,
          websiteDrawer: true
        },
        bottomTabs: {
          home: true,
          jansamvad: true,
          directory: true,
          works: true,
          websiteMenu: true,
          profile: true
        }
      };
      setMobileSettings(defaultState);
      api.updateMobileSettings(defaultState, 'Super Admin');
      showToast('सभी मोबाइल सेटिंग्स डिफ़ॉल्ट पर रीसेट कर दी गईं!', 'success');
    }
  };

  // Metadata definition of all features that can be toggled
  const featureDefinitions = [
    {
      key: 'heroProfile',
      title: 'माननीया विधायक बायो व प्रोफाइल कार्ड',
      desc: 'विधायक श्रीमती सरिता भदौरिया का मुख्य फोटो, पदवी एवं कार्यालय हेल्पलाइन कॉल बटन',
      icon: '🪷',
      category: 'मुख्य प्रोफाइल'
    },
    {
      key: 'quickCounters',
      title: '4 त्वरित सांख्यिकी काउंटर्स',
      desc: 'जनसंवाद निस्तारण (842+), ग्राम पंचायतें (214), विकास कार्य (136+) एवं नागरिक संख्या',
      icon: '📊',
      category: 'सांख्यिकी'
    },
    {
      key: 'janSamvadSpotlight',
      title: 'जनसंवाद स्पॉटलाइट व एक्शन कार्ड',
      desc: 'नागरिकों हेतु सीधी समस्या दर्ज करने एवं टोकन स्टेटस ट्रैक करने का प्रमुख बटन',
      icon: '📝',
      category: 'जनसेवा'
    },
    {
      key: 'whatsappRegBox',
      title: 'व्हाट्सएप रजिस्ट्रेशन लिंक बॉक्स',
      desc: 'मोबाइल नंबर डालकर सीधे व्हाट्सएप पर एक्टिवेशन लिंक मंगाने का आधुनिक बॉक्स',
      icon: '📲',
      category: 'जनसेवा'
    },
    {
      key: 'dailyActivities',
      title: 'दैनिक जन-गतिविधि व दौरे (Live Feed)',
      desc: 'विधायक के दैनिक क्षेत्र भ्रमण, निरीक्षण, चौपाल व बैठकों का लाइव अपडेट्स कार्ड',
      icon: '🗓️',
      category: 'गतिविधियां'
    },
    {
      key: 'guidanceLeaders',
      title: 'मार्गदर्शक नेतृत्व व मंत्रीगण (Leaders Row)',
      desc: 'आदरणीय मोदी जी, योगी जी, जेपी नड्डा जी एवं राष्ट्रीय नेतृत्व का परिचय सेक्शन',
      icon: '🏛️',
      category: 'संगठन'
    },
    {
      key: 'governmentSchemes',
      title: 'सरकारी जनकल्याण योजनाएं (Schemes Row)',
      desc: 'लाड़ली बहना, पीएम आवास, किसान सम्मान, आयुष्मान भारत आदि योजनाओं का विवरण',
      icon: '📜',
      category: 'विकास'
    },
    {
      key: 'developmentWorks',
      title: 'क्षेत्रीय विकास परियोजनाएं (Development Works)',
      desc: 'इटावा सदर 200 विधानसभा में स्वीकृत, प्रगति पर एवं पूर्ण विकास कार्यों की सूची',
      icon: '🏗️',
      category: 'विकास'
    },
    {
      key: 'peopleDirectory',
      title: 'मास्टर डायरेक्टरी व कार्यकर्ता संपर्क',
      desc: 'स्थानीय कार्यकर्ताओं, ग्राम प्रधानों, अधिकारियों व नागरिकों से 1-क्लिक सीधा व्हाट्सएप',
      icon: '👥',
      category: 'संपर्क'
    },
    {
      key: 'constituencyMap',
      title: 'विधानसभा 200 परिचय व बूथ मैपिंग',
      desc: 'तहसील, ब्लॉक, ग्राम पंचायत व बूथों की भौगोलिक जानकारी व मैपिंग कार्ड',
      icon: '🧭',
      category: 'भूगोल'
    },
    {
      key: 'socialMediaFeed',
      title: 'सोशल मीडिया व ट्वीट्स लाइव फीड',
      desc: 'माननीया विधायक के एक्स/ट्विटर, फेसबुक, इंस्टाग्राम व यूट्यूब अपडेट्स',
      icon: '📱',
      category: 'मीडिया'
    },
    {
      key: 'latestNews',
      title: 'ताज़ा समाचार व मीडिया कवरेज',
      desc: 'विधानसभा की अखबारी सुर्खियां, प्रेस विज्ञप्तियां व स्थानीय समाचार',
      icon: '📰',
      category: 'मीडिया'
    },
    {
      key: 'festivalBanner',
      title: 'त्यौहार व विशेष शुभकामना बैनर',
      desc: 'दीपावली, होली, नवरात्रि अथवा राष्ट्रीय पर्वों पर लाइव बधाई संदेश कार्ड',
      icon: '🪔',
      category: 'संस्कृति'
    },
    {
      key: 'leadershipQuotes',
      title: 'मार्गदर्शक विचार व बॉटम स्लोगन',
      desc: '“जनता का विश्वास, हमारी सेवा का संकल्प” तिरंगा रिबन व आदर्श विचार',
      icon: '🗣️',
      category: 'विचार'
    },
    {
      key: 'websiteDrawer',
      title: 'फुल वेबसाइट मेन्यू व पेज नेविगेशन ड्रॉअर',
      desc: 'मोबाइल ऐप के अंदर से मुख्य वेबसाइट के सभी 10+ पेजों तक तुरंत पहुंचने का ड्रॉअर',
      icon: '🌐',
      category: 'नेविगेशन'
    }
  ];

  const bottomTabsDefinitions = [
    { key: 'home', label: 'होम (Home)', icon: Home, desc: 'मुख्य मोबाइल फ़ीड व सभी सक्षम सेक्शंस' },
    { key: 'jansamvad', label: 'जनसंवाद (Jan Samvad)', icon: MessageSquare, desc: 'समस्या पंजीकरण, वॉयस इनपुट व लाइव ट्रैकर' },
    { key: 'directory', label: 'डायरेक्टरी (Directory)', icon: Users, desc: 'नागरिक व कार्यकर्ता खोज एवं 1-क्लिक व्हाट्सएप' },
    { key: 'works', label: 'विकास कार्य (Works)', icon: HardHat, desc: 'सड़क, पानी, बिजली विकास कार्यों की सूची' },
    { key: 'websiteMenu', label: 'वेबसाइट मेन्यू (Website Pages)', icon: Globe, desc: 'मुख्य वेबसाइट के सभी 10+ पेजों की सीधी सूची' },
    { key: 'profile', label: 'प्रोफाइल व लॉगिन (Profile & Auth)', icon: Shield, desc: 'नागरिक पंजीकरण, लॉगिन, 5-रोल व ऑडिट लॉग्स' }
  ];

  const enabledCount = Object.values(mobileSettings.features).filter(Boolean).length;
  const enabledTabsCount = Object.values(mobileSettings.bottomTabs).filter(Boolean).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn font-sans">
      
      {/* Top Banner & Control Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-orange-600/30 text-orange-400 border border-orange-500/40 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile CMS & Feature Controller</span>
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-emerald-400 font-bold">{enabledCount} / {featureDefinitions.length} सेक्शंस सक्रिय</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
            📱 मोबाइल ऐप व मेन्यू कंट्रोल सेंटर
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            मोबाइल वेब ऐप (<code className="text-orange-400 font-mono">/mobile</code>) पर दिखने वाले सभी होमपेज सेक्शंस, फीचर्स, मुख्य वेबसाइट लिंक्स और बॉटम नेविगेशन टैब्स को 1-क्लिक में चालू या बंद करें।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigateToPublicPage('mobile')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer shadow"
            title="मोबाइल ऐप को नए टैब/व्यू में देखें"
          >
            <ExternalLink className="w-4 h-4 text-orange-400" />
            <span>लाइव ऐप देखें (/mobile)</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 font-bold text-xs flex items-center space-x-1 border border-slate-700 transition cursor-pointer"
            title="डिफ़ॉल्ट पर रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>रीसेट</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-green-600 hover:opacity-95 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सहेज रहे हैं...' : 'सेटिंग्स सुरक्षित करें (Save)'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Category Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'features', label: `🌟 होमपेज सेक्शंस कंट्रोल (${enabledCount})` },
          { id: 'tabs', label: `📑 बॉटम नेविगेशन टैब्स (${enabledTabsCount})` },
          { id: 'roles', label: '👑 5-रोल स्विचर सेटिंग्स' },
          { id: 'branding', label: '📞 ऐप ब्रांडिंग व हेल्पलाइन' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex-shrink-0 ${
              activeCategory === cat.id
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: HOMEPAGE SECTIONS TOGGLE */}
      {activeCategory === 'features' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                होमपेज सेक्शंस व फीचर्स विज़िबिलिटी (15 फीचर्स)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                जिस सेक्शन का स्विच चालू (हरे रंग) में होगा, वह मोबाइल ऐप के होम फ़ीड पर दिखाई देगा।
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold">
              <button
                onClick={() => {
                  const updated = { ...mobileSettings.features };
                  Object.keys(updated).forEach(k => updated[k] = true);
                  setMobileSettings({ ...mobileSettings, features: updated });
                  showToast('सभी सेक्शंस इनेबल कर दिए गए', 'info');
                }}
                className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition cursor-pointer"
              >
                सभी चालू करें
              </button>
              <button
                onClick={() => {
                  const updated = { ...mobileSettings.features };
                  Object.keys(updated).forEach(k => updated[k] = false);
                  updated.heroProfile = true; // Keep hero at least
                  setMobileSettings({ ...mobileSettings, features: updated });
                  showToast('न्यूनतम सेक्शंस रखे गए', 'info');
                }}
                className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition cursor-pointer"
              >
                न्यूनतम मोड
              </button>
            </div>
          </div>

          {/* Grid of Feature Toggle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureDefinitions.map((feat) => {
              const isEnabled = Boolean(mobileSettings.features[feat.key]);
              return (
                <div
                  key={feat.key}
                  className={`p-4 rounded-2xl border transition-all shadow-sm flex flex-col justify-between ${
                    isEnabled
                      ? 'bg-white border-emerald-300 ring-1 ring-emerald-500/20'
                      : 'bg-slate-50/80 border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{feat.icon}</span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {feat.category}
                          </span>
                          <h3 className="text-xs font-black text-slate-900 leading-tight">
                            {feat.title}
                          </h3>
                        </div>
                      </div>

                      {/* Custom Modern Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(feat.key)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className={`font-bold flex items-center space-x-1 ${isEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isEnabled ? 'मोबाइल पर सक्रिय (Visible)' : 'छुपा हुआ (Hidden)'}</span>
                    </span>
                    <span className="font-mono text-slate-400">{feat.key}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: BOTTOM TABS CONTROL */}
      {activeCategory === 'tabs' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              बॉटम नेविगेशन टैब्स कंट्रोल (Bottom App Tabs)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              मोबाइल ऐप के सबसे नीचे दिखने वाली नेविगेशन पट्टी के टैब्स को चालू या बंद करें।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bottomTabsDefinitions.map((tab) => {
              const isEnabled = Boolean(mobileSettings.bottomTabs[tab.key]);
              const Icon = tab.icon;
              return (
                <div
                  key={tab.key}
                  className={`p-4 rounded-2xl border transition shadow-sm flex items-center justify-between ${
                    isEnabled
                      ? 'bg-white border-blue-300 ring-1 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEnabled ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{tab.label}</h4>
                      <p className="text-[11px] text-slate-500">{tab.desc}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleTab(tab.key)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ml-3 ${
                      isEnabled ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: 5 ROLES SWITCHER CONTROLS */}
      {activeCategory === 'roles' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              5 सेग्रीगेटेड रोल स्विचर कंट्रोल (One-Click Role Bar on Mobile)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              मोबाइल स्क्रीन के शीर्ष पर 5 रोल्स (एडमिन, विधायक, डेटा मैनेजर, कार्यकर्ता, विधायक असिस्टेंट) का स्विचर प्रदर्शित करें।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 max-w-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  मोबाइल पर शीर्ष रोल स्विचर पट्टी (Top Role Switcher Strip)
                </h4>
                <p className="text-[11px] text-slate-500">
                  नागरिकों या कार्यकर्ताओं को अपनी भूमिका के अनुसार मोबाइल ऐप तुरंत स्विच करने की सुविधा देता है।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileSettings({ ...mobileSettings, showTopRoleSwitcher: !mobileSettings.showTopRoleSwitcher })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  mobileSettings.showTopRoleSwitcher ? 'bg-orange-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    mobileSettings.showTopRoleSwitcher ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  क्रेडेंशियल्स व लॉगिन गाइड बटन (Credentials Guide Button)
                </h4>
                <p className="text-[11px] text-slate-500">
                  हेडर में 5 रोल्स के उपयोगकर्ता नाम व पासवर्ड देखने वाला बटन।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileSettings({ ...mobileSettings, showRoleCredentialsBtn: !mobileSettings.showRoleCredentialsBtn })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  mobileSettings.showRoleCredentialsBtn ? 'bg-orange-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    mobileSettings.showRoleCredentialsBtn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: APP BRANDING & HELPLINE */}
      {activeCategory === 'branding' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              ऐप ब्रांडिंग, शीर्षक व हेल्पलाइन सेटिंग्स
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              मोबाइल ऐप के हेडर, स्लोगन एवं आधिकारिक हेल्पलाइन नंबरों को यहाँ से बदलें।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5 max-w-2xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ऐप का शीर्षक (App Title)</label>
                <input
                  type="text"
                  value={mobileSettings.appName || ''}
                  onChange={(e) => setMobileSettings({ ...mobileSettings, appName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">टैगलाइन (Sub-title)</label>
                <input
                  type="text"
                  value={mobileSettings.appTagline || ''}
                  onChange={(e) => setMobileSettings({ ...mobileSettings, appTagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">कार्यालय हेल्पलाइन फोन</label>
                <input
                  type="text"
                  value={mobileSettings.helplinePhone || ''}
                  onChange={(e) => setMobileSettings({ ...mobileSettings, helplinePhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">आधिकारिक व्हाट्सएप नंबर</label>
                <input
                  type="text"
                  value={mobileSettings.officialWhatsapp || ''}
                  onChange={(e) => setMobileSettings({ ...mobileSettings, officialWhatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">आधिकारिक स्लोगन</label>
              <input
                type="text"
                value={mobileSettings.slogan || ''}
                onChange={(e) => setMobileSettings({ ...mobileSettings, slogan: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none font-medium italic"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow transition cursor-pointer"
              >
                {saving ? 'सहेज रहे हैं...' : 'परिवर्तन सुरक्षित करें'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
