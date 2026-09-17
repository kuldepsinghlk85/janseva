import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import MediaPickerModal from '../components/common/MediaPickerModal';
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
  Smartphone,
  ExternalLink,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  CheckSquare,
  Type
} from 'lucide-react';

export default function AdminWebsiteBuilder() {
  const {
    settings,
    setSettings,
    loadSettings,
    setViewMode,
    showToast,
    setShowMobileSimulator,
    navigateToPublicPage
  } = useApp();

  const [activeTab, setActiveTab] = useState('theme'); // theme, header, modules, templates, hero, sections, festival, seo, css
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // 1. Theme State (WordPress Style)
  const [themeForm, setThemeForm] = useState({
    preset: 'saffron',
    primaryColor: '#ea580c',
    secondaryColor: '#16a34a',
    accentColor: '#f59e0b',
    navbarBg: '#ffffff',
    navbarText: '#0f172a',
    footerBg: '#0f172a',
    bodyBg: '#f8fafc',
    cardRadius: 'rounded-xl',
    fontFamily: 'Inter',
    headerStyle: 'standard'
  });

  // 2. Header & Logo State
  const [headerForm, setHeaderForm] = useState({
    siteTitle: 'जनसेवा इटावा',
    highlightWord: 'इटावा',
    subtitle: 'People • Development • Trust',
    tagline: '“मजबूत नेतृत्व, विकसित इटावा, समृद्ध भारत”',
    constituency: 'जनसेवा इटावा (विधानसभा 200)',
    logoType: 'icon',
    logoIcon: '🪷',
    logoImage: '',
    logoWidth: 44,
    headerLayout: 'standard',
    showRibbon: true,
    showMobileAppBtn: true,
    showLoginBtn: true,
    showLangBtn: true
  });

  // 3. Module & Feature Visibility State
  const [modulesForm, setModulesForm] = useState({
    topRibbon: true,
    headerMobileAppBtn: true,
    headerLoginBtn: true,
    headerLangBtn: true,
    festivalBanner: true,
    officialMlaBanner: true,
    heroSlider: true,
    janSamvadSpotlight: true,
    metricsBar: true,
    featuredActivity: true,
    updatesAndSchemes: true,
    socialAndConstituency: true,
    knowYourConstituency: true,
    latestActivitiesAndMinisters: true,
    timelineAndTeam: true,
    citizenTestimonial: true,
    footerPanorama: true,
    floatingMobileSimulator: true,
    floatingQrModal: true
  });

  // 4. Hero Form State
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

  // 5. Festival Form State
  const [festivalForm, setFestivalForm] = useState({
    active: false,
    title: 'गणेश चतुर्थी की हार्दिक शुभकामनाएं',
    message: 'समस्त इटावा वासियों को गणेश चतुर्थी के पावन पर्व पर हार्दिक बधाई एवं शुभकामनाएं।',
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    bannerImage: '/images/assets/sarita_bhadauria_hero.jpg'
  });

  // 6. Sections State
  const [sections, setSections] = useState([]);

  // 7. SEO Form State
  const [seoForm, setSeoForm] = useState({
    metaTitle: 'जनसेवा इटावा (200) | विधायक श्रीमती सरिता भदौरिया - आधिकारिक पोर्टल',
    metaDescription: 'इटावा विधानसभा (200) की माननीया विधायक श्रीमती सरिता भदौरिया का आधिकारिक जनसेवा एवं विकास पोर्टल।',
    keywords: 'इटावा विधायक, सरिता भदौरिया, Sarita Bhadauria MLA Etawah, BJP Etawah 200, JanSeva, विकास कार्य',
    ogImage: '/images/assets/sarita_bhadauria_hero.jpg'
  });

  // 8. Custom Code Form State
  const [customCodeForm, setCustomCodeForm] = useState({
    css: '',
    js: ''
  });

  // Sync state when settings change
  useEffect(() => {
    if (settings) {
      if (settings.theme) setThemeForm(prev => ({ ...prev, ...settings.theme }));
      if (settings.header) setHeaderForm(prev => ({ ...prev, ...settings.header }));
      if (settings.modules) setModulesForm(prev => ({ ...prev, ...settings.modules }));
      if (settings.hero) setHeroForm(prev => ({ ...prev, ...settings.hero }));
      if (settings.festival) setFestivalForm(prev => ({ ...prev, ...settings.festival }));
      if (settings.sections) setSections(settings.sections);
      if (settings.seo) setSeoForm(prev => ({ ...prev, ...settings.seo }));
      if (settings.customCode) setCustomCodeForm(prev => ({ ...prev, ...settings.customCode }));
    }
  }, [settings]);

  // Presets List
  const themePresets = settings?.themePresets || [
    {
      id: 'saffron',
      name: 'भगवा एवं राष्ट्रभक्ति',
      nameEn: 'Saffron Patriot',
      desc: 'पारंपरिक ऊर्जावान भगवा व समृद्ध हरित रंग का सामंजस्य',
      primaryColor: '#ea580c',
      secondaryColor: '#16a34a',
      accentColor: '#f59e0b',
      navbarBg: '#ffffff',
      navbarText: '#0f172a',
      footerBg: '#0f172a',
      bodyBg: '#f8fafc',
      cardRadius: 'rounded-xl',
      fontFamily: 'Inter'
    },
    {
      id: 'royal_blue',
      name: 'शाही नीला / डिजिटल भारत',
      nameEn: 'Royal Blue & Gold',
      desc: 'गंभीर, आधुनिक प्रशासनिक नीला एवं स्वर्णिम आभा',
      primaryColor: '#1d4ed8',
      secondaryColor: '#0284c7',
      accentColor: '#f59e0b',
      navbarBg: '#0f172a',
      navbarText: '#ffffff',
      footerBg: '#020617',
      bodyBg: '#f1f5f9',
      cardRadius: 'rounded-xl',
      fontFamily: 'Inter'
    },
    {
      id: 'emerald',
      name: 'समृद्धि हरित / विकास एवं प्रकृति',
      nameEn: 'Emerald Prosperity',
      desc: 'विकास, पर्यावरण, ग्रामीण उन्नति और ताज़गी का प्रतीक',
      primaryColor: '#059669',
      secondaryColor: '#0d9488',
      accentColor: '#ea580c',
      navbarBg: '#ffffff',
      navbarText: '#064e3b',
      footerBg: '#064e3b',
      bodyBg: '#f0fdf4',
      cardRadius: 'rounded-2xl',
      fontFamily: 'Inter'
    },
    {
      id: 'tricolor',
      name: 'राष्ट्रीय तिरंगा गौरव',
      nameEn: 'National Tricolor',
      desc: 'केसरिया, श्वेत व हरा — पूर्ण राष्ट्रभक्ति और जनसेवा भावना',
      primaryColor: '#ea580c',
      secondaryColor: '#15803d',
      accentColor: '#1e3a8a',
      navbarBg: '#ffffff',
      navbarText: '#1e293b',
      footerBg: '#111827',
      bodyBg: '#fafaf9',
      cardRadius: 'rounded-lg',
      fontFamily: 'Inter'
    },
    {
      id: 'maroon_gold',
      name: 'शाही मैरून एवं स्वर्णिम',
      nameEn: 'Imperial Maroon & Amber',
      desc: 'गरिमापूर्ण ऐतिहासिक मैरून व एम्बर स्वर्णिम चमक',
      primaryColor: '#991b1b',
      secondaryColor: '#b45309',
      accentColor: '#d97706',
      navbarBg: '#ffffff',
      navbarText: '#450a0a',
      footerBg: '#450a0a',
      bodyBg: '#fef2f2',
      cardRadius: 'rounded-xl',
      fontFamily: 'Rozha One'
    },
    {
      id: 'dark_modern',
      name: 'डार्क मॉडर्न एलीट',
      nameEn: 'Dark Modern Elite',
      desc: 'प्रीमियम हाई-टेक डार्क लुक व वाइब्रेंट पर्पल हाइलाइट्स',
      primaryColor: '#8b5cf6',
      secondaryColor: '#06b6d4',
      accentColor: '#ec4899',
      navbarBg: '#090d16',
      navbarText: '#f8fafc',
      footerBg: '#030712',
      bodyBg: '#0b0f19',
      cardRadius: 'rounded-2xl',
      fontFamily: 'Inter'
    }
  ];

  // Module Definitions with Categories & Descriptions
  const MODULE_ITEMS = [
    {
      key: 'topRibbon',
      nameHi: 'शीर्ष तिरंगा रिबन व स्लोगन पट्टी',
      nameEn: 'Top Ribbon & Motto Bar',
      category: 'हेडर व शीर्ष घटक',
      desc: 'पेज के सबसे ऊपर तिरंगा धारी, विधानसभा नाम और स्लोगन प्रदर्शित करता है।'
    },
    {
      key: 'headerMobileAppBtn',
      nameHi: 'हेडर मोबाइल ऐप बटन (/mobile)',
      nameEn: 'Header Mobile App Button',
      category: 'हेडर व शीर्ष घटक',
      desc: 'हेडर में सीधे मोबाइल वेब ऐप खोलने वाला बटन।'
    },
    {
      key: 'headerLoginBtn',
      nameHi: 'नागरिक प्रोफाइल व यूजर लॉगिन बटन',
      nameEn: 'User Login / Profile Button',
      category: 'हेडर व शीर्ष घटक',
      desc: 'नागरिकों व कार्यकर्ताओं के लिए लॉगिन/प्रोफाइल बटन।'
    },
    {
      key: 'headerLangBtn',
      nameHi: 'भाषा चयन ड्रॉपडाउन (हिंदी / English)',
      nameEn: 'Language Switcher Dropdown',
      category: 'हेडर व शीर्ष घटक',
      desc: 'हेडर में भाषा बदलने का ड्रॉपडाउन।'
    },
    {
      key: 'festivalBanner',
      nameHi: 'त्यौहार व पर्व विशेष शुभकामना बैनर',
      nameEn: 'Festival Campaign Greeting Banner',
      category: 'मुख्य बैनर व हीरो घटक',
      desc: 'विशेष पर्वों पर टॉप पर प्रदर्शित होने वाला आकर्षक शुभकामना बैनर।'
    },
    {
      key: 'officialMlaBanner',
      nameHi: 'माननीया विधायक आधिकारिक प्रोफाइल व संदेश',
      nameEn: 'Official MLA Portrait & Message Banner',
      category: 'मुख्य बैनर व हीरो घटक',
      desc: 'संसदीय सत्र, पार्टी लोगो एवं माननीया विधायक का आधिकारिक संदेश।'
    },
    {
      key: 'heroSlider',
      nameHi: 'मुख्य हीरो पोस्टर स्लाइडर व वीडियो',
      nameEn: 'Hero Poster Slider & Highlights',
      category: 'मुख्य बैनर व हीरो घटक',
      desc: 'होमपेज का मुख्य पोस्टर स्लाइडर (4-6 हाई-रेज़ॉल्यूशन पोस्टर्स)।'
    },
    {
      key: 'janSamvadSpotlight',
      nameHi: 'जनसंवाद एवं समस्या निवारण स्पॉटलाइट',
      nameEn: 'Jan Samvad Grievance Spotlight',
      category: 'मुख्य बैनर व हीरो घटक',
      desc: 'नागरिकों की समस्याओं का समाधान और डायरेक्ट आवेदन बॉक्स।'
    },
    {
      key: 'metricsBar',
      nameHi: 'विधानसभा प्रमुख सांख्यिकी व आंकड़े (Metrics Bar)',
      nameEn: 'Constituency Key Metrics Bar',
      category: 'विकास कार्य, आंकड़े व योजनाएं',
      desc: '420+ बूथ, 200+ गांव, ₹500+ करोड़ विकास कार्य आदि के आंकड़े।'
    },
    {
      key: 'featuredActivity',
      nameHi: 'विशेष मुख्य विकास गतिविधि कार्ड (Featured Story)',
      nameEn: 'Featured Highlight Story Card',
      category: 'विकास कार्य, आंकड़े व योजनाएं',
      desc: 'ताज़ा मुख्य विकास कार्य या बड़ी उपलब्धि का विशेष हाइलाइट कार्ड।'
    },
    {
      key: 'updatesAndSchemes',
      nameHi: 'ताज़ा अपडेट्स एवं सरकारी योजनाएं पंक्ति',
      nameEn: 'Latest Updates & Schemes Row',
      category: 'विकास कार्य, आंकड़े व योजनाएं',
      desc: 'प्रमुख कल्याणकारी योजनाओं और ताज़ा गतिविधियों की संयुक्त पंक्ति।'
    },
    {
      key: 'timelineAndTeam',
      nameHi: 'विकास यात्रा टाइमलाइन व क्षेत्रीय टीम',
      nameEn: 'Vikas Yatra Timeline & Team',
      category: 'विकास कार्य, आंकड़े व योजनाएं',
      desc: 'विधानसभा विकास की ऐतिहासिक टाइमलाइन व प्रमुख कार्यकर्ता टीम।'
    },
    {
      key: 'socialAndConstituency',
      nameHi: 'सोशल मीडिया लाइव वॉल व नेतागण',
      nameEn: 'Social Media Feed & Leadership Row',
      category: 'जनसंपर्क, नक्शा व सोशल मीडिया',
      desc: 'फेसबुक/ट्विटर लाइव पोस्ट्स एवं पार्टी नेतृत्व की झलकियां।'
    },
    {
      key: 'knowYourConstituency',
      nameHi: 'विधानसभा परिचय व इंटरैक्टिव नक्शा (GIS Map)',
      nameEn: 'Know Your Constituency & Map',
      category: 'जनसंपर्क, नक्शा व सोशल मीडिया',
      desc: 'इटावा सदर का विस्तृत भौगोलिक परिचय और बूथ मैपिंग।'
    },
    {
      key: 'latestActivitiesAndMinisters',
      nameHi: 'मंत्रिगण व समस्त दैनिक गतिविधियां अनुभाग',
      nameEn: 'Ministers & All Activities Section',
      category: 'जनसंपर्क, नक्शा व सोशल मीडिया',
      desc: 'दैनिक जन-गतिविधियां, उद्घाटन, बैठकें और वरिष्ठ नेतागण।'
    },
    {
      key: 'citizenTestimonial',
      nameHi: 'नागरिक अनुभव व नीचे का सदस्यता बैनर',
      nameEn: 'Citizen Testimonials & Bottom Banner',
      category: 'जनसंपर्क, नक्शा व सोशल मीडिया',
      desc: 'क्षेत्रीय जनता की प्रतिक्रियाएं एवं सदस्यता आमंत्रण बैनर।'
    },
    {
      key: 'footerPanorama',
      nameHi: 'फुटर पैनोरमा, हेल्पलाइन व सोशल लिंक्स',
      nameEn: 'Footer Panorama & Directory Links',
      category: 'फुटर व फ्लोटिंग टूल्स',
      desc: 'वेबसाइट का संपूर्ण फुटर, संपर्क सूत्र और त्वरित नेविगेशन।'
    },
    {
      key: 'floatingMobileSimulator',
      nameHi: 'फ्लोटिंग मोबाइल व्यू सिमुलेटर बटन',
      nameEn: 'Floating Mobile Simulator Toggle',
      category: 'फुटर व फ्लोटिंग टूल्स',
      desc: 'स्क्रीन के कोने में मोबाइल व्यू का फ्लोटिंग बटन।'
    },
    {
      key: 'floatingQrModal',
      nameHi: 'नागरिक सदस्यता व QR कोड पॉपअप',
      nameEn: 'Citizen Connect & QR Membership Modal',
      category: 'फुटर व फ्लोटिंग टूल्स',
      desc: 'नागरिकों को व्हाट्सएप या फॉर्म से जोड़ने वाला त्वरित पॉपअप।'
    }
  ];

  // Save Handlers
  const handleSaveTheme = async (customTheme = null) => {
    setSaving(true);
    const toSave = customTheme || themeForm;
    const res = await api.updateTheme(toSave, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('थीम एवं रंग-रोगन सेटिंग्स सफलतापूर्वक सुरक्षित की गईं!', 'success');
      await loadSettings();
    } else {
      showToast('थीम अपडेट विफल रहा!', 'error');
    }
  };

  const handleSaveHeader = async () => {
    setSaving(true);
    const res = await api.updateHeader(headerForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('हेडर, शीर्षक एवं लोगो ब्रांडिंग सफलतापूर्वक सुरक्षित की गई!', 'success');
      await loadSettings();
    } else {
      showToast('हेडर अपडेट विफल रहा!', 'error');
    }
  };

  const handleSaveModules = async (customModules = null) => {
    setSaving(true);
    const toSave = customModules || modulesForm;
    const res = await api.updateModules(toSave, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('मॉड्यूल विजिबिलिटी सेटिंग्स सफलतापूर्वक सुरक्षित की गईं!', 'success');
      await loadSettings();
    } else {
      showToast('मॉड्यूल अपडेट विफल रहा!', 'error');
    }
  };

  const handleToggleModule = async (key) => {
    const updated = { ...modulesForm, [key]: !modulesForm[key] };
    setModulesForm(updated);
    const res = await api.toggleModule(key, 'Admin (Super Admin)');
    if (res.success) {
      showToast(`मॉड्यूल [${key}] अब ${res.state ? 'चालू (ON)' : 'बंद (OFF)'} है।`, 'info');
      await loadSettings();
    }
  };

  const handleSetAllModules = async (status) => {
    const updated = {};
    MODULE_ITEMS.forEach(m => {
      updated[m.key] = status;
    });
    setModulesForm(updated);
    await handleSaveModules(updated);
  };

  const handleApplyPreset = async (preset) => {
    const updated = {
      ...themeForm,
      preset: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      navbarBg: preset.navbarBg,
      navbarText: preset.navbarText,
      footerBg: preset.footerBg,
      bodyBg: preset.bodyBg,
      cardRadius: preset.cardRadius,
      fontFamily: preset.fontFamily
    };
    setThemeForm(updated);
    await handleSaveTheme(updated);
  };

  const handleResetAll = async () => {
    if (!window.confirm('क्या आप सचमुच मास्टर लेआउट, थीम, हेडर और मॉड्यूल्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) return;
    setSaving(true);
    const res = await api.resetThemeSettings('Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      if (res.theme) setThemeForm(res.theme);
      if (res.header) setHeaderForm(res.header);
      if (res.modules) setModulesForm(res.modules);
      showToast(res.message || 'सफलतापूर्वक डिफ़ॉल्ट रीसेट किया गया!', 'success');
      await loadSettings();
    }
  };

  const handleSaveAllMasterLayout = async () => {
    setSaving(true);
    try {
      await Promise.all([
        api.updateTheme(themeForm, 'Admin (Super Admin)'),
        api.updateHeader(headerForm, 'Admin (Super Admin)'),
        api.updateModules(modulesForm, 'Admin (Super Admin)')
      ]);
      showToast('सम्पूर्ण मास्टर लेआउट (थीम, हेडर व मॉड्यूल्स) एक साथ सुरक्षित कर दिया गया!', 'success');
      await loadSettings();
    } catch (e) {
      showToast('सहेजने में त्रुटि आई!', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleActivateTemplate = async (templateId) => {
    setSaving(true);
    const res = await api.setTemplate(templateId, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast(`टेम्पलेट सफलतापूर्वक सक्रिय किया गया!`, 'success');
      await loadSettings();
    }
  };

  const handleSaveHero = async () => {
    setSaving(true);
    const res = await api.updateHero(heroForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('Hero Header विवरण सफलतापूर्वक सुरक्षित किया गया!', 'success');
      await loadSettings();
    }
  };

  const handleSaveSeo = async () => {
    setSaving(true);
    const res = await api.updateSeo(seoForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('SEO एवं मेटा टैग्स सुरक्षित किए गए!', 'success');
      await loadSettings();
    }
  };

  const handleSaveCustomCode = async () => {
    setSaving(true);
    const res = await api.updateCustomCode(customCodeForm, 'Admin (Super Admin)');
    setSaving(false);
    if (res.success) {
      showToast('कस्टम CSS/JS सुरक्षित किया गया!', 'success');
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

  const activeModulesCount = Object.values(modulesForm).filter(Boolean).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Master Top Control Banner (WordPress Style) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 border border-slate-700 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-orange-500 text-white">
              MASTER LAYOUT & THEME CUSTOMIZER
            </span>
            <span className="text-xs text-slate-400 font-bold">
              • सक्रिय थीम: <span className="text-orange-400 font-black">{themePresets.find(p => p.id === themeForm.preset)?.name || 'कस्टम'}</span>
            </span>
            <span className="text-xs text-slate-400 font-bold">
              • सक्रिय मॉड्यूल्स: <span className="text-emerald-400 font-black">{activeModulesCount}/{MODULE_ITEMS.length}</span>
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>वेबसाइट थीम, लोगो व मास्टर लेआउट प्रबंधक</span>
          </h2>
          <p className="text-xs text-slate-300">
            वर्डप्रेस की तरह वेबसाइट के रंग-रोगन, लोगो, हेडर शीर्षक (<span className="text-amber-300 font-bold">"{headerForm.siteTitle}"</span>) और सभी मॉड्यूल्स की विजिबिलिटी को 1-क्लिक में नियंत्रित करें।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setViewMode('public')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs transition cursor-pointer"
            title="मुख्य वेबसाइट देखें"
          >
            <Eye className="w-4 h-4 text-orange-400" />
            <span>लाइव प्रीव्यू</span>
          </button>

          <button
            onClick={() => navigateToPublicPage('mobile')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs transition cursor-pointer"
            title="मोबाइल ऐप व्यू देखें"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>मोबाइल ऐप</span>
          </button>

          <button
            onClick={handleResetAll}
            disabled={saving}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 border border-slate-700 hover:border-red-600 font-bold text-xs transition cursor-pointer"
            title="मूल सेटिंग्स पर रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>डिफ़ॉल्ट रीसेट</span>
          </button>

          <button
            onClick={handleSaveAllMasterLayout}
            disabled={saving}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs transition shadow-lg shadow-orange-500/30 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सुरक्षित हो रहा है...' : 'सभी परिवर्तन सेव करें'}</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
        {[
          { id: 'theme', label: '🎨 वर्डप्रेस थीम एवं रंग', icon: Palette },
          { id: 'header', label: '🏷️ हेडर, शीर्षक व लोगो', icon: Type },
          { id: 'modules', label: '👁️ मॉड्यूल विजिबिलिटी मैट्रिक्स', icon: CheckSquare },
          { id: 'templates', label: '📐 लेआउट टेम्पलेट्स', icon: Layout },
          { id: 'hero', label: '⭐ मुख्य बैनर व कोट्स', icon: Settings },
          { id: 'sections', label: '📑 सेक्शन क्रम प्रबंधन', icon: Layers },
          { id: 'festival', label: '🪔 त्यौहार अभियान', icon: Calendar },
          { id: 'seo', label: '🔍 SEO व मेटा', icon: Globe },
          { id: 'css', label: '💻 कस्टम CSS/JS', icon: Code }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Tab Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* TAB 1: WORDPRESS THEME & COLOR PRESETS */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              
              {/* Presets Grid */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <Palette className="w-4 h-4 text-orange-600" />
                      <span>वर्डप्रेस-स्टाइल थीम प्रीसेट्स (1-क्लिक एक्टिवेशन)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      किसी भी थीम कार्ड पर क्लिक करें — पूरी वेबसाइट के बटन्स, कार्ड्स, हेडर्स और बॉर्डर्स तुरंत उस रंग में बदल जाएंगे।
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {themePresets.map((preset) => {
                    const isSelected = themeForm.preset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-3.5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/40 shadow-md ring-2 ring-orange-400/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">{preset.name}</span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 block">{preset.nameEn}</span>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{preset.desc}</p>
                        </div>

                        {/* Color Swatch Dots */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: preset.primaryColor }} title="Primary" />
                            <span className="w-5 h-5 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: preset.secondaryColor }} title="Secondary" />
                            <span className="w-5 h-5 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: preset.accentColor }} title="Accent" />
                          </div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isSelected ? 'सक्रिय थीम' : 'लागू करें'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      कस्टम कलर पैलेट एवं स्टाइल ट्यूनिंग
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      अपनी पसंद के अनुसार मुख्य रंग, द्वितीयक रंग, हेडर/फुटर बैकग्राउंड और फॉन्ट स्टाइल को कस्टमाइज़ करें।
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveTheme()}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>रंग सेव करें</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Primary Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>मुख्य रंग (Primary Brand Color)</span>
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: themeForm.primaryColor }} />
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.primaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value, preset: 'custom' })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={themeForm.primaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value, preset: 'custom' })}
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">सभी मुख्य बटन्स, लिंक्स व सक्रिय टैब्स का रंग</span>
                  </div>

                  {/* Secondary Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>द्वितीयक रंग (Secondary Color)</span>
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: themeForm.secondaryColor }} />
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.secondaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value, preset: 'custom' })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={themeForm.secondaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value, preset: 'custom' })}
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">सफलता बैज, प्रगति बार व द्वितीयक हाइलाइट्स</span>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>हाइलाइट / एक्सेंट रंग (Accent Color)</span>
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: themeForm.accentColor }} />
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.accentColor}
                        onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value, preset: 'custom' })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={themeForm.accentColor}
                        onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value, preset: 'custom' })}
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">विशेष अलर्ट्स, स्टार्स व स्वर्णिम हाइलाइट्स</span>
                  </div>

                  {/* Navbar Background */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">हेडर/नेवबार बैकग्राउंड</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.navbarBg}
                        onChange={(e) => setThemeForm({ ...themeForm, navbarBg: e.target.value, preset: 'custom' })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={themeForm.navbarBg}
                        onChange={(e) => setThemeForm({ ...themeForm, navbarBg: e.target.value, preset: 'custom' })}
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Footer Background */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">फुटर बैकग्राउंड रंग</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.footerBg}
                        onChange={(e) => setThemeForm({ ...themeForm, footerBg: e.target.value, preset: 'custom' })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={themeForm.footerBg}
                        onChange={(e) => setThemeForm({ ...themeForm, footerBg: e.target.value, preset: 'custom' })}
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Body Background */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">पेज बैकग्राउंड शेड (Body Hue)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.bodyBg}
                        onChange={(e) => setThemeForm({ ...themeForm, bodyBg: e.target.value, preset: 'custom' })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={themeForm.bodyBg}
                        onChange={(e) => setThemeForm({ ...themeForm, bodyBg: e.target.value, preset: 'custom' })}
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography & Card Radius */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">कार्ड बॉर्डर रेडियस (Corner Smoothness)</label>
                    <select
                      value={themeForm.cardRadius}
                      onChange={(e) => setThemeForm({ ...themeForm, cardRadius: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="rounded-none">तीखे कोने (Sharp Corners - 0px)</option>
                      <option value="rounded-lg">क्लासिक गोल (Subtle Rounded - 8px)</option>
                      <option value="rounded-xl">आधुनिक मॉडर्न (Modern - 12px)</option>
                      <option value="rounded-2xl">अति गोल (Soft Curved - 16px)</option>
                      <option value="rounded-3xl">पिल व बबल (Pill / Bubble - 24px)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">फॉन्ट परिवार (Typography Font)</label>
                    <select
                      value={themeForm.fontFamily}
                      onChange={(e) => setThemeForm({ ...themeForm, fontFamily: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Inter">Inter (आधुनिक, स्पष्ट एवं उच्च पठनीयता)</option>
                      <option value="Mukta">Mukta (सुंदर देवनागरी व हिंदी फॉन्ट)</option>
                      <option value="Noto Sans Devanagari">Noto Sans Devanagari (आधिकारिक सरकारी मानक)</option>
                      <option value="Rozha One">Rozha One / Serif (गरिमापूर्ण ऐतिहासिक शाही शैली)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HEADER, LOGO & BRANDING CUSTOMIZER */}
          {activeTab === 'header' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                    <Type className="w-4 h-4 text-orange-600" />
                    <span>वेबसाइट हेडर, शीर्षक व लोगो कस्टमाइज़र</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    यहाँ से वर्तमान "जनसेवा इटावा" हेडर को अपनी इच्छानुसार बदलें और लोगो आइकन या इमेज अपलोड करें।
                  </p>
                </div>
                <button
                  onClick={handleSaveHeader}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>हेडर सेव करें</span>
                </button>
              </div>

              {/* Main Titles Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    वेबसाइट मुख्य हेडर शीर्षक (Site Title) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={headerForm.siteTitle}
                    onChange={(e) => setHeaderForm({ ...headerForm, siteTitle: e.target.value })}
                    placeholder="उदा. जनसेवा इटावा, आपका नेता, विधायक सेवा केंद्र..."
                    className="w-full px-3.5 py-2.5 text-xs font-black bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-500">यह नाम पूरे हेडर और लोगो के पास प्रमुखता से दिखाई देगा।</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    हाइलाइट शब्द (Highlight Word in Theme Color)
                  </label>
                  <input
                    type="text"
                    value={headerForm.highlightWord}
                    onChange={(e) => setHeaderForm({ ...headerForm, highlightWord: e.target.value })}
                    placeholder="उदा. इटावा"
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-500">शीर्षक का वह शब्द जो थीम के प्राथमिक रंग में चमकेगा।</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">उपशीर्षक (Subtitle / Tagline Under Logo)</label>
                  <input
                    type="text"
                    value={headerForm.subtitle}
                    onChange={(e) => setHeaderForm({ ...headerForm, subtitle: e.target.value })}
                    placeholder="People • Development • Trust"
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">विधानसभा नाम व संख्या (Constituency Info)</label>
                  <input
                    type="text"
                    value={headerForm.constituency}
                    onChange={(e) => setHeaderForm({ ...headerForm, constituency: e.target.value })}
                    placeholder="जनसेवा इटावा (विधानसभा 200)"
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">शीर्ष रिबन स्लोगन (Top Announcement Motto)</label>
                  <input
                    type="text"
                    value={headerForm.tagline}
                    onChange={(e) => setHeaderForm({ ...headerForm, tagline: e.target.value })}
                    placeholder="“मजबूत नेतृत्व, विकसित इटावा, समृद्ध भारत”"
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Logo Section */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  लोगो चयन (Logo Type & Graphics)
                </h4>

                <div className="flex items-center space-x-6 text-xs font-bold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="logoType"
                      checked={headerForm.logoType === 'icon'}
                      onChange={() => setHeaderForm({ ...headerForm, logoType: 'icon' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>प्रतीक चिन्ह (Icon / Emblem)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="logoType"
                      checked={headerForm.logoType === 'image'}
                      onChange={() => setHeaderForm({ ...headerForm, logoType: 'image' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>कस्टम इमेज लोगो (Custom Image / Photo)</span>
                  </label>
                </div>

                {headerForm.logoType === 'icon' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">प्रतीक चिन्ह चुनें:</label>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {['🪷', '🏛️', '🇮🇳', '🚩', '🤝', '⚖️', '🦁', '⭐', '🌾', '☀️'].map((ico) => (
                        <button
                          key={ico}
                          type="button"
                          onClick={() => setHeaderForm({ ...headerForm, logoIcon: ico })}
                          className={`h-12 rounded-xl border flex items-center justify-center text-2xl transition cursor-pointer ${
                            headerForm.logoIcon === ico
                              ? 'border-orange-500 bg-orange-100 shadow-sm scale-105 ring-2 ring-orange-400/30'
                              : 'border-slate-200 bg-slate-50 hover:bg-white'
                          }`}
                        >
                          {ico}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-700">लोगो इमेज URL या मीडिया से चुनें:</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={headerForm.logoImage}
                        onChange={(e) => setHeaderForm({ ...headerForm, logoImage: e.target.value })}
                        placeholder="https://... या /uploads/... या /images/..."
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>मीडिया से चुनें</span>
                      </button>
                    </div>

                    {headerForm.logoImage && (
                      <div className="flex items-center space-x-3 pt-2">
                        <span className="text-[11px] font-bold text-slate-500">प्रीव्यू:</span>
                        <img
                          src={headerForm.logoImage}
                          alt="Logo Preview"
                          className="h-12 w-12 object-contain rounded-lg border border-slate-200 bg-white p-1"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Logo Size */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>लोगो का आकार (Logo Dimension): {headerForm.logoWidth}px</span>
                    <span className="text-slate-400">32px - 64px</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="64"
                    value={headerForm.logoWidth}
                    onChange={(e) => setHeaderForm({ ...headerForm, logoWidth: Number(e.target.value) })}
                    className="w-full accent-orange-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Live Header Simulation Bar */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-2">
                <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider block">
                  लाइव हेडर प्रीव्यू (Live Header Simulation)
                </span>
                <div className="flex items-center space-x-3 bg-white text-slate-900 p-3 rounded-xl">
                  {headerForm.logoType === 'image' && headerForm.logoImage ? (
                    <img
                      src={headerForm.logoImage}
                      alt="Logo"
                      style={{ width: `${headerForm.logoWidth}px`, height: `${headerForm.logoWidth}px` }}
                      className="object-contain rounded-lg shadow-sm"
                    />
                  ) : (
                    <div
                      style={{ width: `${headerForm.logoWidth}px`, height: `${headerForm.logoWidth}px` }}
                      className="rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-green-600 p-0.5 flex items-center justify-center shadow-md flex-shrink-0"
                    >
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xl">
                        {headerForm.logoIcon}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-black font-serif tracking-tight">
                      {headerForm.siteTitle}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider -mt-1 block">
                      {headerForm.subtitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURE & MODULE VISIBILITY CONTROLLER */}
          {activeTab === 'modules' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                    <CheckSquare className="w-4 h-4 text-orange-600" />
                    <span>वेबसाइट मॉड्यूल एवं फीचर विजिबिलिटी कंट्रोलर</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    वेबसाइट के किसी भी मॉड्यूल को ऑन (दृश्यमान) या ऑफ (अदृश्य) करें। परिवर्तन तुरंत मुख्य वेबसाइट पर लागू होंगे।
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleSetAllModules(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition border border-emerald-200 cursor-pointer"
                  >
                    सभी ऑन करें
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllModules(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition border border-slate-200 cursor-pointer"
                  >
                    सभी ऑफ करें
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveModules()}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>सेव करें</span>
                  </button>
                </div>
              </div>

              {/* Modules Grouped by Category */}
              <div className="space-y-4">
                {['हेडर व शीर्ष घटक', 'मुख्य बैनर व हीरो घटक', 'विकास कार्य, आंकड़े व योजनाएं', 'जनसंपर्क, नक्शा व सोशल मीडिया', 'फुटर व फ्लोटिंग टूल्स'].map((cat) => {
                  const itemsInCat = MODULE_ITEMS.filter(m => m.category === cat);
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-black text-slate-800 uppercase tracking-wider bg-slate-100/70 px-3 py-1.5 rounded-lg">
                        <span>{cat}</span>
                        <span className="text-[10px] text-slate-400">({itemsInCat.length} मॉड्यूल्स)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {itemsInCat.map((item) => {
                          const isEnabled = modulesForm[item.key] !== false;
                          return (
                            <div
                              key={item.key}
                              onClick={() => handleToggleModule(item.key)}
                              className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 cursor-pointer select-none ${
                                isEnabled
                                  ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50'
                                  : 'border-slate-200 bg-slate-50/60 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                  <h4 className="text-xs font-black text-slate-900">{item.nameHi}</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2">{item.desc}</p>
                              </div>

                              {/* Toggle Switch */}
                              <div className="flex flex-col items-end flex-shrink-0">
                                <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition duration-300 ${
                                  isEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                                }`}>
                                  <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition"></div>
                                </div>
                                <span className={`text-[9px] font-black uppercase mt-1 ${
                                  isEnabled ? 'text-emerald-700' : 'text-slate-400'
                                }`}>
                                  {isEnabled ? 'दृश्यमान (ON)' : 'अदृश्य (OFF)'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TEMPLATES CHOOSER */}
          {activeTab === 'templates' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Pre-built Homepage Templates</h3>
                  <span className="text-xs text-orange-600 font-bold">1-क्लिक सक्रियण</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select any pre-configured layout and activate it as the primary public homepage with 1 click.
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
                              <Check className="w-3.5 h-3.5 inline" />
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

          {/* TAB 5: HERO CONTENT SETTINGS */}
          {activeTab === 'hero' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Hero Header & Quotes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Edit hero title, subtitle, leadership quotes and call-to-action buttons.</p>
                </div>
                <button
                  onClick={handleSaveHero}
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>हीरो सेव करें</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Hero Main Title (2 Lines)</label>
                  <textarea
                    rows={2}
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Hero Subtitle</label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">PM Modi Quote</label>
                    <textarea
                      rows={2}
                      value={heroForm.modiQuote}
                      onChange={(e) => setHeroForm({ ...heroForm, modiQuote: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">CM Yogi Quote</label>
                    <textarea
                      rows={2}
                      value={heroForm.yogiQuote}
                      onChange={(e) => setHeroForm({ ...heroForm, yogiQuote: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECTION REORDERING */}
          {activeTab === 'sections' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Homepage Sections Reordering</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Use the up/down arrows to change the vertical layout order on the homepage.</p>
                </div>
              </div>

              <div className="space-y-2">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-black text-slate-900">{sec.nameHi || sec.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{sec.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={async () => {
                          const newSecs = [...sections];
                          const temp = newSecs[idx - 1];
                          newSecs[idx - 1] = newSecs[idx];
                          newSecs[idx] = temp;
                          newSecs.forEach((s, i) => s.order = i + 1);
                          setSections(newSecs);
                          await api.updateSections(newSecs);
                        }}
                        className="p-1 rounded bg-white border border-slate-200 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={async () => {
                          const newSecs = [...sections];
                          const temp = newSecs[idx + 1];
                          newSecs[idx + 1] = newSecs[idx];
                          newSecs[idx] = temp;
                          newSecs.forEach((s, i) => s.order = i + 1);
                          setSections(newSecs);
                          await api.updateSections(newSecs);
                        }}
                        className="p-1 rounded bg-white border border-slate-200 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FESTIVAL */}
          {activeTab === 'festival' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">त्यौहार व पर्व अभियान सेटिंग्स</h3>
                <p className="text-xs text-slate-500 mt-0.5">विशेष पर्वों के दौरान होमपेज पर शुभकामना बैनर व संदेश दिखाएं।</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={festivalForm.active}
                    onChange={(e) => setFestivalForm({ ...festivalForm, active: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>पर्व बैनर अभी सक्रिय (Active) करें</span>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">पर्व का शीर्षक</label>
                  <input
                    type="text"
                    value={festivalForm.title}
                    onChange={(e) => setFestivalForm({ ...festivalForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">शुभकामना संदेश</label>
                  <textarea
                    rows={2}
                    value={festivalForm.message}
                    onChange={(e) => setFestivalForm({ ...festivalForm, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    setSaving(true);
                    await api.updateFestival(festivalForm);
                    setSaving(false);
                    showToast('त्यौहार सेटिंग्स सुरक्षित की गईं!', 'success');
                    await loadSettings();
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
                >
                  पर्व सेटिंग्स सेव करें
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: SEO */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">SEO & Meta Tags</h3>
                <button
                  onClick={handleSaveSeo}
                  className="px-4 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
                >
                  SEO सेव करें
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Meta Title</label>
                  <input
                    type="text"
                    value={seoForm.metaTitle}
                    onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Meta Description</label>
                  <textarea
                    rows={3}
                    value={seoForm.metaDescription}
                    onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: CUSTOM CODE */}
          {activeTab === 'css' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Custom CSS / JS Code</h3>
                <button
                  onClick={handleSaveCustomCode}
                  className="px-4 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
                >
                  कोड सेव करें
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 font-mono">Custom CSS</label>
                <textarea
                  rows={8}
                  value={customCodeForm.css}
                  onChange={(e) => setCustomCodeForm({ ...customCodeForm, css: e.target.value })}
                  placeholder="/* Write custom CSS overrides here */"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-emerald-400 rounded-xl"
                />
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Interactive Palette & Status Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-5 sticky top-24">
          
          {/* Live Palette Visualizer Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                लाइव स्टाइल प्रीव्यू (Live Style Swatch)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Mockup Button Swatches */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">बटन्स व लिंक्स:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  style={{ backgroundColor: themeForm.primaryColor }}
                  className="px-3 py-1.5 rounded-lg text-white font-bold text-xs shadow-sm flex-1 text-center"
                >
                  Primary Action
                </button>
                <button
                  type="button"
                  style={{ backgroundColor: themeForm.secondaryColor }}
                  className="px-3 py-1.5 rounded-lg text-white font-bold text-xs shadow-sm flex-1 text-center"
                >
                  Secondary Action
                </button>
              </div>
            </div>

            {/* Mockup Alert / Badge */}
            <div className="p-2.5 rounded-xl border flex items-center justify-between text-xs" style={{ borderColor: themeForm.accentColor, backgroundColor: `${themeForm.accentColor}15` }}>
              <span className="font-bold" style={{ color: themeForm.accentColor }}>Accent Alert / Badge</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: themeForm.accentColor }}>NEW</span>
            </div>

            {/* Header Preview Strip */}
            <div className="p-3 rounded-xl border shadow-inner space-y-1" style={{ backgroundColor: themeForm.navbarBg, borderColor: '#e2e8f0' }}>
              <span className="text-[9px] font-extrabold uppercase tracking-wider block" style={{ color: themeForm.navbarText }}>
                {headerForm.constituency}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-base">{headerForm.logoType === 'icon' ? headerForm.logoIcon : '🖼️'}</span>
                <span className="text-sm font-black font-serif" style={{ color: themeForm.navbarText }}>
                  {headerForm.siteTitle}
                </span>
              </div>
            </div>

            {/* Quick Status Info */}
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1 font-medium">
              <div className="flex items-center justify-between">
                <span>सक्रिय फ़ॉन्ट:</span>
                <span className="font-bold text-slate-800">{themeForm.fontFamily}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>कार्ड रेडियस:</span>
                <span className="font-bold text-slate-800">{themeForm.cardRadius}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>सक्रिय मॉड्यूल्स:</span>
                <span className="font-bold text-emerald-600">{activeModulesCount} / {MODULE_ITEMS.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Direct Links Card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>त्वरित नेविगेशन व परीक्षण</span>
            </h4>
            <div className="space-y-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('public')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white hover:bg-orange-100/50 border border-orange-200 flex items-center justify-between transition cursor-pointer text-slate-800"
              >
                <span>🌐 मुख्य वेबसाइट देखें</span>
                <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
              </button>
              <button
                type="button"
                onClick={() => navigateToPublicPage('mobile')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white hover:bg-orange-100/50 border border-orange-200 flex items-center justify-between transition cursor-pointer text-slate-800"
              >
                <span>📱 मोबाइल ऐप व्यू (/mobile)</span>
                <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
              </button>
              <button
                type="button"
                onClick={() => setShowMobileSimulator(true)}
                className="w-full text-left px-3 py-2 rounded-xl bg-white hover:bg-orange-100/50 border border-orange-200 flex items-center justify-between transition cursor-pointer text-slate-800"
              >
                <span>📲 फ्लोटिंग फोन सिमुलेटर</span>
                <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          setHeaderForm({ ...headerForm, logoImage: url, logoType: 'image' });
          showToast('लोगो इमेज चुनी गई!', 'success');
        }}
        title="लोगो हेतु मीडिया लाइब्रेरी से चित्र चुनें"
      />

    </div>
  );
}
