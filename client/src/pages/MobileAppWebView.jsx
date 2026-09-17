import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Home,
  MessageSquare,
  Users,
  HardHat,
  User,
  Shield,
  Smartphone,
  Phone,
  Send,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  ChevronRight,
  Plus,
  Mic,
  Paperclip,
  Share2,
  Calendar,
  MapPin,
  Sparkles,
  Info,
  LogOut,
  LogIn,
  Key,
  CheckCircle2,
  RotateCcw,
  Globe,
  BookOpen,
  Award,
  Layers,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Filter,
  Heart,
  HeartPulse,
  Building,
  Droplets,
  Landmark,
  Flame,
  FileText,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Car,
  Eye,
  Tag,
  PhoneCall,
  Copy,
  Check,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Repeat2
} from 'lucide-react';
import WhatsAppRegistrationLinkBox from '../components/public/WhatsAppRegistrationLinkBox';
import { ministersData } from '../data/ministersData';

// Helper function to safely format locations (handles strings, objects {village, block, district}, null)
const formatLocation = (loc, fallback = 'इटावा सदर') => {
  if (!loc) return fallback;
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [loc.village, loc.block, loc.district].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : fallback;
  }
  return String(loc);
};

// Welfare Schemes Master Dataset for In-App Mobile View
const staticSchemes = [
  {
    id: 1,
    category: 'housing',
    categoryName: 'आवास एवं आश्रय',
    title: 'प्रधानमंत्री आवास योजना (PMAY - ग्रामीण एवं शहरी)',
    icon: Home,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    beneficiaries: '32,400+ पक्के मकान',
    budget: '₹388 करोड़ व्यय',
    description: 'इटावा विधानसभा के प्रत्येक बेघर व कच्चे मकान वाले पात्र परिवार को पक्के मकान के निर्माण हेतु ₹1.20 लाख से ₹2.50 लाख तक की प्रत्यक्ष वित्तीय सहायता, निःशुल्क शौचालय एवं नल कनेक्शन।',
    benefits: [
      'पक्का मकान बनाने हेतु सीधी डीबीटी किस्त',
      'स्वच्छ भारत मिशन अंतर्गत ₹12,000 शौचालय अनुदान',
      'उज्ज्वला गैस कनेक्शन व सौभाग्य बिजली कनेक्शन'
    ],
    eligibility: 'SECC 2011 सूची में दर्ज अथवा बीपीएल परिवार जिनके पास पक्का मकान नहीं है।',
    portalUrl: 'https://pmaymis.gov.in'
  },
  {
    id: 2,
    category: 'farmer',
    categoryName: 'किसान कल्याण',
    title: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
    icon: Users,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    beneficiaries: '1.45 लाख+ किसान लाभान्वित',
    budget: '₹174 करोड़ प्रतिवर्ष',
    description: 'क्षेत्र के समस्त लघु एवं सीमांत किसान परिवारों को कृषि निवेश व खाद-बीज की जरूरतों हेतु प्रति वर्ष ₹6,000 की सुनिश्चित आर्थिक सहायता (₹2,000 की 3 समान किस्तों में सीधे बैंक खाते में)।',
    benefits: [
      'प्रत्येक 4 माह में ₹2,000 बैंक खाते में सीधा अंतरण',
      'किसान क्रेडिट कार्ड (KCC) से 4% ब्याज पर ऋण सुविधा',
      'पीएम फसल बीमा योजना का सीधा कवरेज'
    ],
    eligibility: 'कृषि योग्य भूमि रखने वाले सभी पंजीकृत किसान परिवार।',
    portalUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 3,
    category: 'health',
    categoryName: 'स्वास्थ्य सुरक्षा',
    title: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (AB-PMJAY)',
    icon: HeartPulse,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    beneficiaries: '2.1 लाख+ गोल्डन कार्ड धारक',
    budget: '₹5 लाख निःशुल्क उपचार',
    description: 'गरीब एवं मध्यमवर्गीय परिवारों को गंभीर बीमारियों के समय देश व प्रदेश के सभी सूचीबद्ध सरकारी व शीर्ष निजी अस्पतालों में प्रति परिवार ₹5 लाख तक का कैशलेस एवं निःशुल्क उपचार।',
    benefits: [
      '₹5,00,000 तक का सालाना कैशलेस इलाज',
      'दवाएं, जांचें, सर्जरी व भर्ती का समस्त खर्च शामिल',
      'परिवार के सदस्यों की संख्या पर कोई सीमा नहीं'
    ],
    eligibility: 'SECC 2011 पात्र परिवार एवं राशन कार्ड धारक अंत्योदय परिवार।',
    portalUrl: 'https://pmjay.gov.in'
  },
  {
    id: 4,
    category: 'women',
    categoryName: 'महिला सशक्तिकरण',
    title: 'प्रधानमंत्री उज्ज्वला योजना 2.0',
    icon: Flame,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    beneficiaries: '48,000+ गैस कनेक्शन',
    budget: '100% निःशुल्क कनेक्शन',
    description: 'धुएं से मुक्ति और माताओं-बहनों के उत्तम स्वास्थ्य हेतु प्रत्येक गरीब परिवार की महिला मुखिया के नाम निःशुल्क एलपीजी गैस कनेक्शन, भरा हुआ सिलेंडर एवं चूल्हा प्रदान किया जाता है।',
    benefits: [
      'निःशुल्क गैस कनेक्शन एवं सुरक्षा हॉस पाइप',
      'पहला भरा हुआ सिलेंडर एवं गैस चूल्हा बिल्कुल मुफ्त',
      'प्रति सिलेंडर ₹300 तक की सीधी सब्सिडी'
    ],
    eligibility: 'बीपीएल परिवार, प्रधानमंत्री आवास योजना लाभार्थी अथवा राशन कार्ड धारक वयस्क महिला।',
    portalUrl: 'https://www.pmuy.gov.in'
  },
  {
    id: 5,
    category: 'water',
    categoryName: 'पेयजल एवं स्वच्छता',
    title: 'जल जीवन मिशन - हर घर जल योजना',
    icon: Droplets,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    beneficiaries: '180+ ग्राम पंचायतों में पाइपलाइन',
    budget: '₹210 करोड़ स्वीकृत',
    description: 'इटावा विधानसभा क्षेत्र के समस्त ग्रामीण एवं दूरदराज के मजरों में प्रत्येक घर तक भूमिगत पाइपलाइन द्वारा स्वच्छ, शुद्ध एवं सुरक्षित पेयजल की 24x7 सतत आपूर्ति सुनिश्चित करना।',
    benefits: [
      'प्रत्येक घर के परिसर में निःशुल्क क्रियाशील नल कनेक्शन (FHTC)',
      'फ्लोराइड एवं आर्सेनिक मुक्त फिल्टर पेयजल',
      'गांवों में ओवरहेड टैंक एवं जल शोधन संयंत्रों की स्थापना'
    ],
    eligibility: 'क्षेत्र के समस्त ग्रामीण निवासी व ढाणियां।',
    portalUrl: 'https://jaljeevanmission.gov.in'
  },
  {
    id: 6,
    category: 'infrastructure',
    categoryName: 'अवसंरचना',
    title: 'प्रधानमंत्री ग्राम सड़क योजना एवं राज्य सड़क निर्माण',
    icon: Car,
    color: 'text-slate-700 bg-slate-100 border-slate-200',
    beneficiaries: '85+ संपर्क मार्ग निर्मित',
    budget: '₹340 करोड़ कुल लागत',
    description: 'इटावा सदर, रामपुर, सैफई, बकेवर के सभी मजरों को मुख्य राजमार्गों, मंडियों, जिला अस्पताल एवं शैक्षणिक संस्थानों से जोड़ने हेतु पक्की डामरीकृत व सीसी सड़कों का आधुनिक नेटवर्क।',
    benefits: [
      'बारहमासी पक्की संपर्क सड़कों का निर्माण',
      'सड़क सुरक्षा संकेतक, डिवाइडर एवं एलईडी सोलर लाइट',
      'कृषि उपज को मंडी तक पहुंचाने में समय व लागत की बचत'
    ],
    eligibility: 'सार्वजनिक उपयोग हेतु समस्त नागरिक।',
    portalUrl: 'http://omms.nic.in'
  },
  {
    id: 7,
    category: 'women',
    categoryName: 'महिला सशक्तिकरण',
    title: 'मुख्यमंत्री कन्या सुमंगला योजना (उत्तर प्रदेश)',
    icon: ShieldCheck,
    color: 'text-pink-600 bg-pink-50 border-pink-200',
    beneficiaries: '14,200+ कन्याएं लाभान्वित',
    budget: '₹25,000 प्रति बालिका',
    description: 'बालिकाओं के जन्म से लेकर उच्च शिक्षा तक 6 विभिन्न चरणों में कुल ₹25,000 की वित्तीय सहायता। इसका उद्देश्य कन्या भ्रूण हत्या रोकना, बाल विवाह पर अंकुश और बालिकाओं को आत्मनिर्भर बनाना है।',
    benefits: [
      'जन्म पर ₹3,000, 1 वर्ष के टीकाकरण पर ₹2,000',
      'कक्षा 1, 6 और 9 में प्रवेश पर ₹3,000 से ₹5,000',
      'स्नातक/डिप्लोमा में दाखिले पर ₹7,000 एकमुश्त'
    ],
    eligibility: 'उत्तर प्रदेश के निवासी परिवार जिनकी वार्षिक आय ₹3 लाख से कम हो।',
    portalUrl: 'https://mksy.up.gov.in'
  },
  {
    id: 8,
    category: 'youth',
    categoryName: 'युवा एवं रोजगार',
    title: 'पीएम स्वनिधि योजना (स्ट्रीट वेंडर्स आत्मनिर्भर निधि)',
    icon: Briefcase,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    beneficiaries: '9,800+ रेहड़ी-पटरी विक्रेता',
    budget: '₹10,000 से ₹50,000 ऋण',
    description: 'शहरी व ग्रामीण फेरीवालों, ठेलेवालों और छोटे दुकानदारों को अपने व्यापार को गति देने हेतु बिना किसी गारंटी के आसान किस्तों पर माइक्रो-क्रेडिट ऋण सुविधा।',
    benefits: [
      'प्रथम चरण में ₹10,000 का संपार्श्विक-मुक्त ऋण',
      'समय पर अदायगी पर दूसरे चरण में ₹20,000 व ₹50,000',
      'डिजिटल लेनदेन पर ₹1,200 सालाना कैशबैक'
    ],
    eligibility: 'शहरी अथवा उपनगरीय क्षेत्रों में कार्यरत स्ट्रीट वेंडर्स व दुकानदार।',
    portalUrl: 'https://pmsvanidhi.mohua.gov.in'
  }
];

// Constituency Villages & Local Units Dataset
const staticConstituencyVillages = [
  { id: 1, nameHi: 'इटावा नगर (वार्ड 1-40)', block: 'इटावा सदर', voters: '1,85,000+', panchayat: 'नगर पालिका परिषद', works: 34 },
  { id: 2, nameHi: 'रामपुर', block: 'इटावा सदर', voters: '4,200', panchayat: 'ग्राम पंचायत रामपुर', works: 8 },
  { id: 3, nameHi: 'सैफई', block: 'सैफई', voters: '6,500', panchayat: 'ग्राम पंचायत सैफई', works: 12 },
  { id: 4, nameHi: 'बकेवर', block: 'भरथना', voters: '8,900', panchayat: 'नगर पंचायत बकेवर', works: 14 },
  { id: 5, nameHi: 'तकरोई', block: 'इटावा सदर', voters: '3,800', panchayat: 'ग्राम पंचायत तकरोई', works: 6 },
  { id: 6, nameHi: 'पिलखर', block: 'इटावा सदर', voters: '5,100', panchayat: 'ग्राम पंचायत पिलखर', works: 7 },
  { id: 7, nameHi: 'जसवंतनगर', block: 'जसवंतनगर', voters: '28,000+', panchayat: 'नगर पालिका जसवंतनगर', works: 18 },
  { id: 8, nameHi: 'भरथना', block: 'भरथना', voters: '32,000+', panchayat: 'नगर पालिका भरथना', works: 21 },
  { id: 9, nameHi: 'वैदपुरा', block: 'सैफई', voters: '4,600', panchayat: 'ग्राम पंचायत वैदपुरा', works: 5 },
  { id: 10, nameHi: 'पिपरोली', block: 'इटावा सदर', voters: '2,900', panchayat: 'ग्राम पंचायत पिपरोली', works: 4 },
  { id: 11, nameHi: 'उदी मोड़', block: 'बढ़पुरा', voters: '5,400', panchayat: 'ग्राम पंचायत उदी', works: 9 },
  { id: 12, nameHi: 'चंबल किनारा मजरा', block: 'बढ़पुरा', voters: '1,800', panchayat: 'ग्राम पंचायत बढ़पुरा', works: 3 }
];

// Organization Team & In-charges Dataset
const staticTeam = [
  { id: 1, name: 'राजेश सिंह चौहान', role: 'कार्यालय प्रभारी एवं जनसंपर्क अधिकारी', category: 'office', categoryName: 'कार्यालय टीम', area: 'विधायक कार्यालय, इटावा', phone: '9412345678', image: '/images/assets/modi_portrait.jpg' },
  { id: 2, name: 'सुनील कुमार भदौरिया', role: 'मंडल संयोजक (इटावा सदर)', category: 'mandal', categoryName: 'मंडल संयोजक', area: 'इटावा नगर मंडल', phone: '9837012345', image: '/images/assets/bottom_leaders_trio.jpg' },
  { id: 3, name: 'श्रीमती अनीता देवी', role: 'महिला मोर्चा संयोजिका', category: 'women', categoryName: 'महिला मोर्चा', area: 'इटावा सदर ग्रामीण', phone: '9758098765', image: '/images/assets/sarita_bhadauria_hero.jpg' },
  { id: 4, name: 'अमित कुमार दुबे', role: 'युवा मोर्चा अध्यक्ष', category: 'youth', categoryName: 'युवा मोर्चा', area: 'इटावा सदर विधानसभा', phone: '9456011223', image: '/images/poli3.png' },
  { id: 5, name: 'विपिन शर्मा', role: 'मीडिया एवं आईटी सेल प्रमुख', category: 'media', categoryName: 'आईटी सेल', area: 'सोशल मीडिया कंट्रोल रूम', phone: '9927055443', image: '/images/assets/yogi_portrait.jpg' },
  { id: 6, name: 'देवेंद्र प्रताप सिंह', role: 'किसान मोर्चा संयोजक', category: 'mandal', categoryName: 'किसान मोर्चा', area: 'बढ़पुरा ब्लॉक', phone: '9897066778', image: '/images/poli4.png' }
];

// Social Feed Dataset for Mobile View
const staticSocialPosts = [
  {
    id: 'sp1',
    platform: 'twitter',
    author: 'Sarita Bhadauria (@mlaetawah)',
    time: '2 घंटे पहले',
    content: 'आज इटावा सदर विधानसभा के अंतर्गत नवनिर्मित सामुदायिक भवन एवं पक्के संपर्क मार्ग का लोकार्पण किया। जनकल्याण और समग्र विकास हमारा मुख्य ध्येय है। #Etawah200 #BJP4UP',
    likes: '1.2K',
    retweets: '240'
  },
  {
    id: 'sp2',
    platform: 'facebook',
    author: 'श्रीमती सरिता भदौरिया (विधायक)',
    time: '5 घंटे पहले',
    content: 'जनसंवाद चौपाल में क्षेत्रवासियों की समस्याओं को सुनकर संबंधित अधिकारियों को मौके पर त्वरित निस्तारण के कड़े निर्देश दिए। जनसेवा ही हमारी सबसे बड़ी शक्ति है।',
    likes: '2.4K',
    comments: '185'
  },
  {
    id: 'sp3',
    platform: 'instagram',
    author: 'Sarita Bhadauria Official',
    time: '1 दिन पहले',
    content: 'ऑपरेशन कायाकल्प के तहत प्राथमिक विद्यालयों में स्मार्ट क्लासरूम व खेलकूद सुविधाओं का निरीक्षण। बच्चे हमारा भविष्य हैं। #ViksitEtawah',
    likes: '3.1K',
    comments: '94'
  }
];

// Press & News Fallbacks Dataset
const staticNewsFallbacks = [
  {
    id: 1,
    title: 'विधायक सरिता भदौरिया ने सदर अस्पताल में नई विंग व ऑक्सीजन प्लांट का किया निरीक्षण',
    source: 'अमर उजाला',
    date: 'आज',
    summary: 'माननीया विधायक जी ने जिला अस्पताल का औचक निरीक्षण किया। स्वास्थ्य कर्मियों को मरीजों के समुचित इलाज और दवाओं की निर्बाध उपलब्धता सुनिश्चित करने के निर्देश दिए।'
  },
  {
    id: 2,
    title: 'इटावा सदर में ₹14 करोड़ की लागत से बनने वाली 6 नई सड़कों का शिलान्यास',
    source: 'दैनिक जागरण',
    date: 'कल',
    summary: 'ग्रामीण क्षेत्रों को मुख्य राजमार्गों से जोड़ने वाली प्रधानमंत्री ग्राम सड़क योजना की परियोजनाओं का भूमि पूजन संपन्न हुआ। गुणवत्ता से कोई समझौता न करने की हिदायत दी।'
  },
  {
    id: 3,
    title: 'जनसंवाद चौपाल में 42 नागरिक समस्याओं का मौके पर ही कराया गया निस्तारण',
    source: 'हिंदुस्तान',
    date: '2 दिन पहले',
    summary: 'सदर विधानसभा के बढ़पुरा ब्लॉक में आयोजित जनसुनवाई में बिजली, पानी, सड़क और पेंशन से जुड़ी जनसमस्याओं को सुनकर त्वरित आदेश जारी किए।'
  },
  {
    id: 4,
    title: 'ऑपरेशन कायाकल्प के अंतर्गत 18 प्राथमिक विद्यालयों को आधुनिक स्मार्ट क्लास का तोहफा',
    source: 'राष्ट्रीय सहारा',
    date: '3 दिन पहले',
    summary: 'बेसिक शिक्षा परिषद के विद्यालयों में कंप्यूटर लैब, सोलर पैनल और स्वच्छ पेयजल की व्यवस्था का लोकार्पण किया गया।'
  }
];

export default function MobileAppWebView({ initialTab = 'home' } = {}) {
  const {
    SYSTEM_ROLES,
    activeAdminRole,
    setActiveAdminRole,
    currentUser,
    loginUser,
    logoutUser,
    showToast,
    setViewMode,
    mla
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSimulatorFrame, setIsSimulatorFrame] = useState(true);
  const [showRoleCredentialsModal, setShowRoleCredentialsModal] = useState(false);
  const [showWebsiteDrawer, setShowWebsiteDrawer] = useState(false);

  // Dynamic Mobile Configuration from Admin Mobile App Manager
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

  // Internal Navigation Handler - Everything stays 100% inside the Mobile App
  const handleMobileNavigate = (viewId) => {
    setShowWebsiteDrawer(false);
    if (viewId === 'jan-samvad' || viewId === 'jansamvad') {
      setActiveTab('jansamvad');
    } else if (viewId === 'home') {
      setActiveTab('home');
    } else {
      setActiveTab(viewId);
    }
    try {
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {}
  };

  // Internal Sub-views Filter and Search States
  const [schemesSearch, setSchemesSearch] = useState('');
  const [schemesCategory, setSchemesCategory] = useState('All');
  const [timelineSearch, setTimelineSearch] = useState('');
  const [timelineCategory, setTimelineCategory] = useState('All');
  const [constituencyBlock, setConstituencyBlock] = useState('All');
  const [constituencySearch, setConstituencySearch] = useState('');
  const [leadersCategory, setLeadersCategory] = useState('All');
  const [teamCategory, setTeamCategory] = useState('All');
  const [newsSearch, setNewsSearch] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  // JanSamvad State
  const [samvadSubTab, setSamvadSubTab] = useState('register');
  const [complaintForm, setComplaintForm] = useState({
    name: '',
    mobile: '',
    village: 'इटावा सदर',
    category: 'सड़क व नाली',
    subject: '',
    description: '',
    department: 'लोक निर्माण विभाग (PWD)'
  });
  const [submittingGrievance, setSubmittingGrievance] = useState(false);
  const [grievanceReceipt, setGrievanceReceipt] = useState(null);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedGrievance, setTrackedGrievance] = useState(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [simulatedVoiceNote, setSimulatedVoiceNote] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // Directory State
  const [directoryList, setDirectoryList] = useState([]);
  const [dirSearch, setDirSearch] = useState('');
  const [dirFilter, setDirFilter] = useState('all');
  const [dirLoading, setDirLoading] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    mobile: '',
    category: 'कार्यकर्ता',
    village: 'इटावा सदर',
    designation: 'बूथ कार्यकर्ता'
  });

  // Development Works State
  const [worksList, setWorksList] = useState([]);
  const [worksLoading, setWorksLoading] = useState(false);
  const [worksSectorFilter, setWorksSectorFilter] = useState('all');

  // Profile & Auth State
  const [profileSubTab, setProfileSubTab] = useState('login');
  const [citRegForm, setCitRegForm] = useState({
    name: '',
    mobile: '',
    village: 'इटावा सदर',
    booth: 'बूथ 12 - सदर इटावा',
    voterId: '',
    type: 'Citizen',
    area: 'इटावा सदर विधानसभा (200)'
  });
  const [citLoginForm, setCitLoginForm] = useState({
    mobile: '',
    name: ''
  });
  const [staffLoginForm, setStaffLoginForm] = useState({
    username: '',
    password: ''
  });
  const [myGrievances, setMyGrievances] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Live Activities & News for Home Tab
  const [activities, setActivities] = useState([]);
  const [newsItems, setNewsItems] = useState([]);

  const currentRoleObj = SYSTEM_ROLES?.find(r => r.id === activeAdminRole) || SYSTEM_ROLES?.[0] || {
    id: 'admin',
    name: 'मुख्य प्रशासक',
    roleTitle: 'एडमिन (Super Admin)',
    username: 'admin',
    defaultPassword: 'admin123',
    icon: '👑'
  };

  useEffect(() => {
    loadMobileSettings();
    loadHomeData();
    loadDirectory();
    loadWorks();
    loadAuditLogs();
  }, []);

  const loadMobileSettings = async () => {
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
      console.warn('Mobile settings load error', e);
    }
  };

  useEffect(() => {
    if (currentUser?.mobile) {
      setComplaintForm(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        mobile: currentUser.mobile || prev.mobile,
        village: currentUser.village || prev.village
      }));
      loadMyGrievances(currentUser.mobile);
    }
  }, [currentUser]);

  const loadHomeData = async () => {
    try {
      const actRes = await api.getActivities();
      if (actRes?.data && Array.isArray(actRes.data)) setActivities(actRes.data);
      else if (actRes?.activities && Array.isArray(actRes.activities)) setActivities(actRes.activities);

      const newsRes = await api.getNews();
      if (newsRes?.data && Array.isArray(newsRes.data)) setNewsItems(newsRes.data);
      else if (newsRes?.news && Array.isArray(newsRes.news)) setNewsItems(newsRes.news);
      else setNewsItems(staticNewsFallbacks);
    } catch (e) {
      console.warn('Home data load error', e);
      setNewsItems(staticNewsFallbacks);
    }
  };

  const loadDirectory = async () => {
    setDirLoading(true);
    try {
      const res = await api.getDirectoryAll();
      const list = res?.people || res?.data || res?.items || [];
      if (Array.isArray(list)) {
        setDirectoryList(list);
      }
    } catch (e) {
      console.warn('Directory load error', e);
    } finally {
      setDirLoading(false);
    }
  };

  const loadWorks = async () => {
    setWorksLoading(true);
    try {
      const res = await api.getDevelopmentWorks();
      if (res?.success && Array.isArray(res.data)) {
        setWorksList(res.data);
      }
    } catch (e) {
      console.warn('Works load error', e);
    } finally {
      setWorksLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const res = await api.getAuditLogs();
      if (res?.logs) {
        setAuditLogs(res.logs.slice(0, 15));
      }
    } catch (e) {
      console.warn('Audit logs load error', e);
    } finally {
      setAuditLoading(false);
    }
  };

  const loadMyGrievances = async (mob) => {
    if (!mob) return;
    try {
      const res = await api.getCitizenGrievances(mob);
      if (res?.grievances) {
        setMyGrievances(res.grievances);
      }
    } catch (e) {
      console.warn('Failed to load my grievances', e);
    }
  };

  const handleSubmitGrievance = async (e) => {
    e.preventDefault();
    if (!complaintForm.name || !complaintForm.mobile || !complaintForm.subject) {
      showToast('कृपया नाम, मोबाइल नंबर व समस्या विषय अवश्य भरें!', 'error');
      return;
    }
    setSubmittingGrievance(true);
    try {
      const payload = {
        ...complaintForm,
        voiceNote: simulatedVoiceNote,
        attachment: attachedFile ? attachedFile.name : null,
        submittedVia: 'Mobile Web App (/mobile)',
        registeredByRole: activeAdminRole
      };
      const res = await api.registerJanSamvadGrievance(payload);
      if (res?.success) {
        setGrievanceReceipt(res.grievance);
        showToast('शिकायत सफलतापूर्वक दर्ज! टोकन नं: ' + res.grievance.token, 'success');
        setComplaintForm({
          name: currentUser?.name || '',
          mobile: currentUser?.mobile || '',
          village: currentUser?.village || 'इटावा सदर',
          category: 'सड़क व नाली',
          subject: '',
          description: '',
          department: 'लोक निर्माण विभाग (PWD)'
        });
        setSimulatedVoiceNote(null);
        setAttachedFile(null);
        loadMyGrievances(payload.mobile);
        loadAuditLogs();
      } else {
        showToast(res?.message || 'शिकायत दर्ज करने में त्रुटि हुई', 'error');
      }
    } catch (err) {
      showToast(err.message || 'त्रुटि हुई', 'error');
    } finally {
      setSubmittingGrievance(false);
    }
  };

  const handleTrackGrievance = async () => {
    if (!trackQuery.trim()) {
      showToast('कृपया टोकन नंबर या मोबाइल नंबर दर्ज करें', 'error');
      return;
    }
    setTrackingLoading(true);
    try {
      const res = await api.trackJanSamvadGrievance(trackQuery.trim());
      if (res?.success && res.grievance) {
        setTrackedGrievance(res.grievance);
        showToast('शिकायत विवरण प्राप्त हुआ!', 'success');
      } else {
        setTrackedGrievance(null);
        showToast(res?.message || 'इस नंबर से कोई शिकायत नहीं मिली।', 'error');
      }
    } catch (err) {
      showToast('खोज में त्रुटि हुई', 'error');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCitizenRegister = async (e) => {
    e.preventDefault();
    if (!citRegForm.name || !citRegForm.mobile) {
      showToast('कृपया नाम और मोबाइल नंबर भरें', 'error');
      return;
    }
    try {
      const res = await api.citizenRegisterAuth(citRegForm);
      if (res?.success && res.user) {
        loginUser(res.user);
        showToast(res.message || 'पंजीकरण सफल! आपका स्वागत है।', 'success');
        setProfileSubTab('my-grievances');
        loadMyGrievances(res.user.mobile);
        loadAuditLogs();
      } else {
        showToast(res?.message || 'पंजीकरण असफल रहा', 'error');
      }
    } catch (err) {
      showToast(err.message || 'पंजीकरण त्रुटि', 'error');
    }
  };

  const handleCitizenLogin = async (e) => {
    e.preventDefault();
    if (!citLoginForm.mobile) {
      showToast('कृपया मोबाइल नंबर दर्ज करें', 'error');
      return;
    }
    try {
      const res = await api.citizenLogin(citLoginForm);
      if (res?.success && res.user) {
        loginUser(res.user);
        showToast(res.message || 'लॉगिन सफल रहा!', 'success');
        setProfileSubTab('my-grievances');
        loadMyGrievances(res.user.mobile);
        loadAuditLogs();
      } else {
        showToast(res?.message || 'लॉगिन असफल', 'error');
      }
    } catch (err) {
      showToast(err.message || 'लॉगिन त्रुटि', 'error');
    }
  };

  const handleStaffLogin = async (roleObj) => {
    const creds = {
      username: roleObj ? roleObj.username : staffLoginForm.username,
      password: roleObj ? roleObj.defaultPassword : staffLoginForm.password
    };
    try {
      const res = await api.userLogin(creds);
      if (res?.success) {
        loginUser(res);
        if (roleObj) {
          setActiveAdminRole(roleObj.id);
        }
        showToast('सफलतापूर्वक लॉगिन: ' + res.name + ' (' + res.role + ')', 'success');
        setShowRoleCredentialsModal(false);
        loadAuditLogs();
      } else {
        showToast(res?.message || 'अमान्य यूजरनेम अथवा पासवर्ड', 'error');
      }
    } catch (err) {
      showToast('लॉगिन त्रुटि', 'error');
    }
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!newPerson.name || !newPerson.mobile) {
      showToast('नाम और मोबाइल नंबर आवश्यक है', 'error');
      return;
    }
    try {
      const res = await api.createDirectoryPerson({
        ...newPerson,
        type: newPerson.category === 'कार्यकर्ता' ? 'Member' : 'Citizen'
      });
      if (res?.success) {
        showToast('नया सदस्य डायरेक्टरी में जोड़ा गया!', 'success');
        setShowAddPersonModal(false);
        setNewPerson({
          name: '',
          mobile: '',
          category: 'कार्यकर्ता',
          village: 'इटावा सदर',
          designation: 'बूथ कार्यकर्ता'
        });
        loadDirectory();
        loadAuditLogs();
      } else {
        showToast(res?.message || 'जोड़ने में त्रुटि', 'error');
      }
    } catch (err) {
      showToast('त्रुटि हुई', 'error');
    }
  };

  const filteredDirectory = (Array.isArray(directoryList) ? directoryList : []).filter(item => {
    const q = (dirSearch || '').toLowerCase();
    const matchesQuery = (
      String(item.name || '').toLowerCase().includes(q) ||
      String(item.mobile || item.phone || '').includes(q) ||
      String(item.village || '').toLowerCase().includes(q)
    );
    if (!matchesQuery) return false;
    if (dirFilter === 'all') return true;
    if (dirFilter === 'citizen') return (item.type === 'Citizen' || item.category === 'Citizen');
    if (dirFilter === 'worker') return (item.type === 'Member' || item.category === 'कार्यकर्ता' || (item.role && String(item.role).includes('Booth')));
    if (dirFilter === 'pradhan') return (item.designation && String(item.designation).includes('प्रधान')) || item.category === 'ग्राम प्रधान';
    if (dirFilter === 'official') return (item.type === 'Official' || item.category === 'अधिकारी');
    return true;
  });

  const filteredWorks = worksList.filter(work => {
    if (worksSectorFilter === 'all') return true;
    return (work.sector || work.category || '').toLowerCase().includes(worksSectorFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Floating Control Bar on Desktop */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-3 py-2 bg-slate-800/90 backdrop-blur rounded-2xl border border-slate-700 text-xs text-white shadow-xl">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-orange-400" />
          <span className="font-bold">मोबाइल वेब व्यू मोड</span>
          <span className="px-1.5 py-0.5 rounded bg-orange-600/40 text-orange-300 font-mono text-[10px]">/mobile</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSimulatorFrame(!isSimulatorFrame)}
            className="px-2.5 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold transition cursor-pointer text-[11px]"
            title="मोबाइल फ्रेम टॉगल करें"
          >
            {isSimulatorFrame ? 'पूर्ण स्क्रीन' : 'मोबाइल फ्रेम'}
          </button>
          <button
            onClick={() => handleMobileNavigate('website-menu')}
            className="px-2.5 py-1 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold transition cursor-pointer flex items-center space-x-1 text-[11px]"
          >
            <Globe className="w-3 h-3" />
            <span>वेब मेन्यू</span>
          </button>
        </div>
      </div>

      {/* Main Mobile App Container */}
      <div className={`w-full ${isSimulatorFrame ? 'max-w-md sm:rounded-[36px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800' : 'max-w-xl sm:rounded-3xl'} bg-slate-50 min-h-screen sm:min-h-[860px] flex flex-col overflow-hidden relative border-slate-200`}>
        
        {/* Tricolor Ribbon */}
        <div className="tricolor-ribbon w-full h-1.5"></div>

        {/* Mobile App Native Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-green-600 p-0.5 shadow">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <span className="text-base">🪷</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">
                  {mobileSettings?.appName || 'जनसेवा इटावा 200'}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online"></span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-tight mt-0.5 truncate max-w-[200px]">
                {mobileSettings?.appTagline || `${mla?.name || 'श्रीमती सरिता भदौरिया'} • मोबाइल पोर्टल`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Website Drawer Trigger */}
            <button
              onClick={() => setShowWebsiteDrawer(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer shadow-sm"
              title="मुख्य वेबसाइट के सभी पृष्ठ खोलें"
            >
              <Globe className="w-3 h-3 text-indigo-600" />
              <span>वेब मेन्यू</span>
            </button>

            {/* 5-Role Guide Button */}
            {mobileSettings?.showRoleCredentialsBtn !== false && (
              <button
                onClick={() => setShowRoleCredentialsModal(true)}
                className="flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-black bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 transition cursor-pointer shadow-sm"
                title="5 रोल क्रेडेंशियल्स व लॉगिन व्यवस्था"
              >
                <Key className="w-3 h-3 text-orange-600" />
                <span>5 रोल</span>
              </button>
            )}

            {/* Admin CMS Button */}
            <button
              onClick={() => setViewMode('admin')}
              className="p-1.5 rounded-full bg-slate-900 hover:bg-orange-600 text-white transition shadow cursor-pointer"
              title="एडमिन CMS खोलें"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Top 5-Role One-Click Segregation Switcher Bar (Toggled from Admin Mobile CMS) */}
        {mobileSettings?.showTopRoleSwitcher !== false && (
          <section className="bg-slate-900 text-white px-3 py-2 border-b border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1 text-[10px] font-bold text-orange-400">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>सेग्रीगेटेड रोल चयन (One-Click Role Switch):</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">तत्काल पूर्वावलोकन</span>
            </div>

            {/* 5 Role Horizontal Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SYSTEM_ROLES?.map((role) => {
                const isActive = activeAdminRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveAdminRole(role.id)}
                    className={`flex-shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                      isActive
                        ? `bg-gradient-to-r ${role.gradient} text-white shadow-md ring-2 ring-white/60 scale-105`
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>{role.icon}</span>
                    <span className="truncate max-w-[90px]">{String(role.roleTitle || '').split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Role Privilege Ribbon */}
            <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <div className="flex items-center space-x-1 text-slate-300 truncate">
                <span className="font-black text-amber-400">{currentRoleObj.icon} {currentRoleObj.roleTitle}</span>
                <span className="text-slate-500">•</span>
                <span className="truncate text-slate-400">{currentRoleObj.badge}</span>
              </div>
              <button
                onClick={() => setShowRoleCredentialsModal(true)}
                className="text-[9px] font-bold text-cyan-400 hover:underline flex items-center space-x-0.5 flex-shrink-0 ml-2 cursor-pointer"
              >
                <span>क्रेडेंशियल्स</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </section>
        )}

        {/* Current Active User Status Bar */}
        {currentUser ? (
          <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-900 font-bold text-[11px]">
                सत्र: <span className="font-extrabold">{currentUser.name}</span> ({currentUser.role || 'सदस्य'})
              </span>
            </div>
            <button
              onClick={logoutUser}
              className="text-[10px] font-bold text-rose-700 hover:underline flex items-center space-x-0.5 cursor-pointer"
            >
              <LogOut className="w-2.5 h-2.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-amber-900 text-[11px] font-semibold">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>अतिथि मोड • अपनी समस्याओं की ट्रैकिंग हेतु लॉगिन करें</span>
            </div>
            <button
              onClick={() => { setActiveTab('profile'); setProfileSubTab('login'); }}
              className="px-2 py-0.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] transition cursor-pointer"
            >
              लॉगिन
            </button>
          </div>
        )}

        {/* Dynamic Mobile Tab Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 bg-slate-50">
          
          {/* ================= TAB 1: HOME ================= */}
          {activeTab === 'home' && (
            <div className="space-y-4 p-3.5 animate-fadeIn">
              
              {/* 1. Festival Banner (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.festivalBanner !== false && (
                <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-3.5 shadow-md relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                        पावन पर्व व विशेष संदेश
                      </span>
                    </div>
                    <span className="text-xl">🪔</span>
                  </div>
                  <h3 className="text-sm font-black mt-2 leading-snug">
                    समस्त इटावा सदर क्षेत्रवासियों को हार्दिक शुभकामनाएं व बधाई!
                  </h3>
                  <p className="text-[11px] text-amber-100 mt-1 leading-relaxed">
                    सद्भाव, खुशहाली और निरंतर विकास का यह पावन अवसर हमारे क्षेत्र में नई ऊर्जा व समृद्धि लाए।
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px]">
                    <span className="italic text-amber-200">“विकास और संस्कृति का संगम”</span>
                    <button
                      onClick={() => {
                        const text = "समस्त इटावा सदर विधानसभा क्षेत्रवासियों को पावन पर्वों की हार्दिक शुभकामनाएं - विधायक श्रीमती सरिता भदौरिया (इटावा 200)";
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white text-orange-800 font-bold text-[10px] shadow cursor-pointer hover:bg-orange-50"
                    >
                      <Share2 className="w-3 h-3 text-emerald-600" />
                      <span>व्हाट्सएप बधाई शेयर</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Hero MLA Profile Card (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.heroProfile !== false && (
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-green-700 text-white p-4 shadow-lg relative">
                  <div className="absolute right-2 bottom-0 opacity-15 text-8xl pointer-events-none select-none">
                    🪷
                  </div>
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="w-16 h-16 rounded-full border-2 border-white/90 overflow-hidden flex-shrink-0 bg-white/20 shadow-md">
                      <img
                        src="/images/assets/sarita_bhadauria_hero.jpg"
                        alt="MLA"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/poli4.png'; }}
                      />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur">
                        इटावा विधानसभा 200
                      </span>
                      <h2 className="text-base font-black leading-tight mt-1">
                        {mla?.name || 'श्रीमती सरिता भदौरिया'}
                      </h2>
                      <p className="text-xs text-orange-100 font-medium">
                        माननीया विधायक, उत्तर प्रदेश विधानसभा
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/20 text-xs italic font-semibold text-orange-50 flex items-center justify-between">
                    <span>{mobileSettings?.slogan || '“जनता का विश्वास, हमारी सेवा का संकल्प”'}</span>
                    <a
                      href={`tel:${mobileSettings?.helplinePhone || '05688250000'}`}
                      className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-white text-orange-800 font-black text-[10px] shadow"
                    >
                      <Phone className="w-2.5 h-2.5 text-orange-600" />
                      <span>कार्यालय कॉल</span>
                    </a>
                  </div>
                </div>
              )}

              {/* 3. 4 Quick Counters (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.quickCounters !== false && (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-base font-black text-orange-600 leading-tight">842+</div>
                    <div className="text-[9px] text-slate-500 font-bold mt-0.5">जनसंवाद समाधान</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-base font-black text-emerald-600 leading-tight">214</div>
                    <div className="text-[9px] text-slate-500 font-bold mt-0.5">ग्राम पंचायतें</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-base font-black text-blue-600 leading-tight">136+</div>
                    <div className="text-[9px] text-slate-500 font-bold mt-0.5">विकास कार्य</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-base font-black text-purple-600 leading-tight">12.5k</div>
                    <div className="text-[9px] text-slate-500 font-bold mt-0.5">पंजीकृत नागरिक</div>
                  </div>
                </div>
              )}

              {/* 4. JanSamvad Spotlight Callout Action Card (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.janSamvadSpotlight !== false && (
                <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-white p-3.5 rounded-2xl border border-orange-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-orange-700 bg-orange-200/70 px-2 py-0.5 rounded-full">
                        मुख्य जन-सुविधा
                      </span>
                      <h3 className="text-sm font-black text-slate-900 mt-1">
                        जनसंवाद: समस्या सीधे विधायक तक पहुंचाएं
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        सड़क, बिजली, पानी या राशन संबंधी समस्या फोटो व विवरण के साथ दर्ज करें।
                      </p>
                    </div>
                    <span className="text-2xl ml-2">📝</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => { setActiveTab('jansamvad'); setSamvadSubTab('register'); }}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs shadow hover:opacity-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>समस्या दर्ज करें</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('jansamvad'); setSamvadSubTab('track'); }}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-black text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-orange-600" />
                      <span>स्थिति ट्रैक करें</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 5. WhatsApp Registration Box (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.whatsappRegBox !== false && (
                <WhatsAppRegistrationLinkBox compact={true} />
              )}

              {/* 6. Daily MLA Activities Feed (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.dailyActivities !== false && (
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        दैनिक जन-गतिविधि व दौरे
                      </h3>
                    </div>
                    <button
                      onClick={() => handleMobileNavigate('timeline')}
                      className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      सभी देखें
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {activities.length > 0 ? (
                      activities.slice(0, 3).map((act) => (
                        <div
                          key={act.id}
                          onClick={() => handleMobileNavigate('timeline')}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/70 transition cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-orange-600" />
                              <span>{formatLocation(act.location, 'इटावा')}</span>
                            </span>
                            <span>{act.date || 'हाल ही में'}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {act.title}
                          </h4>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400">गतिविधियां लोड हो रही हैं...</div>
                    )}
                  </div>
                </div>
              )}

              {/* 7. Guidance Leaders & Mentors (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.guidanceLeaders !== false && (
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        मार्गदर्शक नेतृत्व व प्रेरणा
                      </h3>
                    </div>
                    <button
                      onClick={() => handleMobileNavigate('leaders')}
                      className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      विस्तृत देखें
                    </button>
                  </div>

                  <div className="flex space-x-2.5 overflow-x-auto pb-2 no-scrollbar">
                    {[
                      { name: 'श्री नरेन्द्र मोदी', title: 'प्रधानमंत्री, भारत सरकार', img: '/images/assets/modi_portrait.jpg', quote: 'सबका साथ, सबका विकास, सबका विश्वास' },
                      { name: 'श्री योगी आदित्यनाथ', title: 'मुख्यमंत्री, उत्तर प्रदेश', img: '/images/assets/yogi_portrait.jpg', quote: 'सुरक्षा, सुशासन और विकास' },
                      { name: 'श्री राजनाथ सिंह', title: 'रक्षा मंत्री, भारत सरकार', img: '/images/assets/bottom_leaders_trio.jpg', quote: 'सशक्त भारत, आत्मनिर्भर भारत' },
                      { name: 'स्व. अटल बिहारी वाजपेयी', title: 'भारत रत्न, पूर्व प्रधानमंत्री', img: '/images/poli3.png', quote: 'राष्ट्र प्रथम, सेवा सर्वोपरि' }
                    ].map((leader, idx) => (
                      <div key={idx} className="flex-shrink-0 w-36 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <div className="w-12 h-12 rounded-full mx-auto overflow-hidden border-2 border-orange-500 shadow mb-1.5 bg-slate-200">
                          <img src={leader.img} alt={leader.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/poli4.png'; }} />
                        </div>
                        <div className="text-[11px] font-black text-slate-900 truncate">{leader.name}</div>
                        <div className="text-[9px] text-slate-500 truncate">{leader.title}</div>
                        <div className="text-[9px] text-orange-700 italic font-semibold mt-1 line-clamp-2">“{leader.quote}”</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Government Welfare Schemes (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.governmentSchemes !== false && (
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        प्रमुख सरकारी जनकल्याणकारी योजनाएं
                      </h3>
                    </div>
                    <button
                      onClick={() => handleMobileNavigate('schemes')}
                      className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      सभी 15+ योजनाएं
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { title: 'प्रधानमंत्री आवास योजना (PMAY)', stats: '32,400+ मकान', benefit: '₹1.20L से ₹2.50L सीधी वित्तीय सहायता', icon: Home, color: 'text-blue-600 bg-blue-50' },
                      { title: 'आयुष्मान भारत - जन आरोग्य', stats: '1.45 लाख+ कार्ड', benefit: '₹5 लाख तक का सालाना कैशलेस इलाज', icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
                      { title: 'पीएम किसान सम्मान निधि', stats: '92,000+ किसान', benefit: '₹6,000 प्रति वर्ष 3 समान किस्तों में', icon: Landmark, color: 'text-emerald-600 bg-emerald-50' },
                      { title: 'प्रधानमंत्री उज्ज्वला योजना', stats: '48,000+ गैस कनेक्शन', benefit: 'निःशुल्क गैस कनेक्शन व सिलेंडर सब्सिडी', icon: Flame, color: 'text-amber-600 bg-amber-50' }
                    ].map((sch, idx) => {
                      const Icon = sch.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleMobileNavigate('schemes')}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 flex items-start space-x-2.5 transition cursor-pointer"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sch.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-900 truncate">{sch.title}</h4>
                              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex-shrink-0 ml-1">
                                {sch.stats}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-0.5">{sch.benefit}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleMobileNavigate('schemes')}
                    className="w-full mt-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center space-x-1 transition cursor-pointer border border-blue-200"
                  >
                    <span>पात्रता चेक करें व आवेदन लिंक देखें</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* 9. Development Projects Highlights (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.developmentWorks !== false && (
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <HardHat className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        इटावा सदर: प्रमुख विकास परियोजनाएं
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('works')}
                      className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      सभी कार्य ({worksList.length || 136})
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { title: 'जिला संयुक्त चिकित्सालय उच्चीकरण (100 बेड नवीन विंग)', sector: 'स्वास्थ्य अवसंरचना', cost: '₹24.5 करोड़', status: 'पूर्ण' },
                      { title: 'सदर रेलवे ओवरब्रिज व 4-लेन रिंग रोड कनेक्टिविटी', sector: 'सड़क व परिवहन', cost: '₹48.0 करोड़', status: 'प्रगति पर' },
                      { title: '214 ग्राम पंचायतों में सोलर स्ट्रीट लाइट व जल जीवन मिशन', sector: 'ग्रामीण विकास', cost: '₹36.2 करोड़', status: 'प्रगति पर' },
                      { title: 'राजकीय इंटर कॉलेज भवन एवं डिजिटल स्मार्ट क्लासरूम', sector: 'शिक्षा', cost: '₹12.8 करोड़', status: 'पूर्ण' }
                    ].map((w, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-semibold text-slate-500">{w.sector}</span>
                          <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${w.status === 'पूर्ण' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {w.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{w.title}</h4>
                        <div className="text-[10px] text-slate-500 font-bold mt-1">लागत: <span className="text-emerald-700">{w.cost}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10. Citizen Directory Quick Access (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.peopleDirectory !== false && (
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        जन-डायरेक्टरी व कार्यकर्ता संपर्क
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('directory')}
                      className="text-[10px] font-bold text-orange-600 hover:underline cursor-pointer"
                    >
                      सभी देखें ({directoryList.length})
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-3">
                    इटावा विधानसभा के कार्यकर्ताओं, नागरिकों एवं अधिकारियों से 1-क्लिक सीधा व्हाट्सएप संवाद।
                  </p>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200 hover:bg-emerald-100 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>डायरेक्टरी खोजें व व्हाट्सएप करें</span>
                  </button>
                </div>
              )}

              {/* 11. Constituency Map & GIS Summary (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.constituencyMap !== false && (
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        विधानसभा क्षेत्र इटावा (200) सांख्यिकी
                      </h3>
                    </div>
                    <span className="text-[10px] font-black text-orange-600">GIS प्रोफाइल</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="p-2 rounded-xl bg-orange-50/70 border border-orange-200/60">
                      <div className="text-sm font-black text-orange-700">2</div>
                      <div className="text-[9px] text-slate-600 font-bold">तहसीलें</div>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/60">
                      <div className="text-sm font-black text-blue-700">3</div>
                      <div className="text-[9px] text-slate-600 font-bold">विकास खंड</div>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                      <div className="text-sm font-black text-emerald-700">214</div>
                      <div className="text-[9px] text-slate-600 font-bold">ग्राम पंचायतें</div>
                    </div>
                    <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-200/60">
                      <div className="text-sm font-black text-purple-700">428</div>
                      <div className="text-[9px] text-slate-600 font-bold">पोलिंग बूथ</div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 col-span-2">
                      <div className="text-sm font-black text-amber-700">4,52,000+</div>
                      <div className="text-[9px] text-slate-600 font-bold">सम्मानित मतदाता</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMobileNavigate('constituency')}
                    className="w-full py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs border border-orange-200 flex items-center justify-center space-x-1 transition cursor-pointer"
                  >
                    <span>संपूर्ण भौगोलिक विवरण व GIS मैप देखें</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* 12. Social Media Live Feed (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.socialMediaFeed !== false && (
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <Share2 className="w-4 h-4 text-cyan-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        सोशल मीडिया लाइव कनेक्ट
                      </h3>
                    </div>
                    <button
                      onClick={() => handleMobileNavigate('social')}
                      className="text-[10px] text-cyan-600 font-bold hover:underline cursor-pointer"
                    >
                      सभी फीड्स
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center mb-3">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-[10px]">
                      <div className="text-base mb-0.5">𝕏</div>
                      <div>एक्स (Twitter)</div>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[10px]">
                      <div className="text-base mb-0.5">📘</div>
                      <div>फेसबुक</div>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-[10px]">
                      <div className="text-base mb-0.5">▶️</div>
                      <div>यूट्यूब</div>
                    </a>
                    <a href={`https://api.whatsapp.com/send?phone=${mobileSettings?.officialWhatsapp || '9876543210'}`} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                      <div className="text-base mb-0.5">💬</div>
                      <div>व्हाट्सएप</div>
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-bold text-slate-800">माननीया श्रीमती सरिता भदौरिया</span>
                      <span>हाल ही में</span>
                    </div>
                    <p className="text-slate-700">“इटावा सदर के विकास व जनसमस्याओं के त्वरित निस्तारण हेतु हम निरंतर प्रतिबद्ध हैं।”</p>
                  </div>
                </div>
              )}

              {/* 13. Latest News & Press Releases (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.latestNews !== false && (
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-rose-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        ताज़ा समाचार व मीडिया कवरेज
                      </h3>
                    </div>
                    <button
                      onClick={() => handleMobileNavigate('news')}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      सभी खबरें
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(newsItems && newsItems.length > 0 ? newsItems : staticNewsFallbacks).slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleMobileNavigate('news')}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200/70 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                          <span className="font-bold text-orange-700">{item.source || 'समाचार'}</span>
                          <span>{item.date || 'हाल ही में'}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{item.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 14. Leadership Inspirational Quotes Banner (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.leadershipQuotes !== false && (
                <div className="rounded-2xl p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-slate-800 text-center relative overflow-hidden">
                  <div className="text-amber-400 text-2xl font-serif mb-1 leading-none">“</div>
                  <p className="text-xs font-semibold leading-relaxed text-slate-200 italic px-2">
                    राष्ट्र प्रथम, सेवा सर्वोपरि — अंत्योदय के पावन संकल्प के साथ समाज के अंतिम व्यक्ति तक विकास पहुंचाना ही हमारा उद्देश्य है।
                  </p>
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-2">
                    — माननीया विधायक श्रीमती सरिता भदौरिया
                  </div>
                </div>
              )}

              {/* 15. Website Full Drawer Shortcut Card (Toggled by Admin Mobile CMS) */}
              {mobileSettings?.features?.websiteDrawer !== false && (
                <div className="rounded-2xl p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-white border border-indigo-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow flex-shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">मुख्य वेबसाइट के सभी 10+ पृष्ठ</h4>
                        <p className="text-[10px] text-slate-600">सभी सार्वजनिक पृष्ठ व सेवाएं मोबाइल में ब्राउज़ करें</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowWebsiteDrawer(true)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition cursor-pointer flex-shrink-0"
                    >
                      मेन्यू खोलें
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 2: JANSAMVAD ================= */}
          {activeTab === 'jansamvad' && (
            <div className="p-3.5 space-y-3.5 animate-fadeIn">
              
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-3.5 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                      जनसुनवाई व समस्या निवारण
                    </span>
                    <h2 className="text-base font-black mt-1">जनसंवाद पोर्टल</h2>
                  </div>
                  <MessageSquare className="w-7 h-7 text-orange-200" />
                </div>
                <p className="text-xs text-orange-100 mt-1">
                  सीधे विधायक कार्यालय तक अपनी समस्या दर्ज करें और लाइव स्टेटस ट्रैक करें।
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1 bg-slate-200 p-1 rounded-xl">
                <button
                  onClick={() => setSamvadSubTab('register')}
                  className={`py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    samvadSubTab === 'register' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  ✍️ समस्या दर्ज करें
                </button>
                <button
                  onClick={() => setSamvadSubTab('track')}
                  className={`py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    samvadSubTab === 'track' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  🔍 स्थिति ट्रैक करें
                </button>
              </div>

              {samvadSubTab === 'register' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  
                  {grievanceReceipt && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 mb-3">
                      <div className="flex items-center space-x-1.5 font-black text-xs text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>शिकायत दर्ज! टोकन नं: {grievanceReceipt.token}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        आपकी समस्या संबंधित विभाग एवं विधायक सचिवालय को प्रेषित कर दी गई है।
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`मेरी जनसंवाद शिकायत संख्या: ${grievanceReceipt.token} सफलतापूर्वक दर्ज हुई है। विषय: ${grievanceReceipt.subject}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 text-white font-bold text-[10px] text-center flex items-center justify-center space-x-1"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>व्हाट्सएप पर शेयर करें</span>
                        </a>
                        <button
                          onClick={() => setGrievanceReceipt(null)}
                          className="py-1 px-2 rounded-lg bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                        >
                          बंद करें
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitGrievance} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        आवेदक का नाम <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: राम शरण सिंह"
                        value={complaintForm.name}
                        onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          मोबाइल नंबर <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="10 अंकों का नंबर"
                          value={complaintForm.mobile}
                          onChange={(e) => setComplaintForm({ ...complaintForm, mobile: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          ग्राम / वार्ड
                        </label>
                        <input
                          type="text"
                          placeholder="जैसे: बसरेहर / सदर"
                          value={complaintForm.village}
                          onChange={(e) => setComplaintForm({ ...complaintForm, village: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          समस्या श्रेणी
                        </label>
                        <select
                          value={complaintForm.category}
                          onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                          className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none font-medium bg-white"
                        >
                          <option value="सड़क व नाली">सड़क व नाली</option>
                          <option value="विद्युत / ट्रांसफार्मर">विद्युत / ट्रांसफार्मर</option>
                          <option value="पेयजल / नल-जल">पेयजल / नल-जल</option>
                          <option value="राशन व खाद्य">राशन व खाद्य</option>
                          <option value="स्वास्थ्य व अस्पताल">स्वास्थ्य व अस्पताल</option>
                          <option value="पुलिस व राजस्व">पुलिस व राजस्व</option>
                          <option value="अन्य जनहित कार्य">अन्य जनहित कार्य</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          संबंधित विभाग
                        </label>
                        <select
                          value={complaintForm.department}
                          onChange={(e) => setComplaintForm({ ...complaintForm, department: e.target.value })}
                          className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none font-medium bg-white"
                        >
                          <option value="लोक निर्माण विभाग (PWD)">लोक निर्माण (PWD)</option>
                          <option value="विद्युत विभाग (DVVNL)">विद्युत विभाग (DVVNL)</option>
                          <option value="जल निगम / ग्राम्य विकास">जल निगम</option>
                          <option value="नगर पालिका / पंचायत">नगर पालिका/पंचायत</option>
                          <option value="राजस्व एवं तहसील">राजस्व एवं तहसील</option>
                          <option value="स्वास्थ्य विभाग">स्वास्थ्य विभाग</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        समस्या का संक्षिप्त विषय <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: गाँव में 25 KVA ट्रांसफार्मर पिछले 4 दिनों से फुंका है"
                        value={complaintForm.subject}
                        onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        समस्या का पूर्ण विवरण
                      </label>
                      <textarea
                        rows={3}
                        placeholder="स्थान, समस्या का समय और जरूरी जानकारी लिखें..."
                        value={complaintForm.description}
                        onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                      ></textarea>
                    </div>

                    {/* Voice & Attachment Bar */}
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsVoiceRecording(!isVoiceRecording);
                          if (!isVoiceRecording) {
                            setTimeout(() => {
                              setIsVoiceRecording(false);
                              setSimulatedVoiceNote('वॉयस रिकॉर्डिंग (0:24 sec) संलग्न');
                              showToast('वॉयस रिकॉर्डिंग सफलतापूर्वक संलग्न की गई!', 'success');
                            }, 2000);
                          }
                        }}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isVoiceRecording
                            ? 'bg-rose-600 text-white animate-pulse'
                            : simulatedVoiceNote
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5 text-rose-600" />
                        <span>{isVoiceRecording ? 'रिकॉर्ड हो रहा है...' : simulatedVoiceNote ? 'ऑडियो संलग्न ✓' : 'बोलकर बताएं'}</span>
                      </button>

                      <label className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition cursor-pointer">
                        <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate max-w-[120px]">
                          {attachedFile ? attachedFile.name : 'फोटो/कागज लगाएं'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setAttachedFile(e.target.files[0]);
                              showToast('दस्तावेज संलग्न किया गया!', 'success');
                            }
                          }}
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingGrievance}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {submittingGrievance ? (
                        <span>कृपया प्रतीक्षा करें...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>जनसंवाद में शिकायत सबमिट करें</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {samvadSubTab === 'track' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-slate-900">
                    शिकायत स्थिति जांचें (Live Status Tracker)
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="टोकन नंबर (उदा: JS-2026-...) या मोबाइल"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                    />
                    <button
                      onClick={handleTrackGrievance}
                      disabled={trackingLoading}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow cursor-pointer transition disabled:opacity-50"
                    >
                      {trackingLoading ? 'खोज रहे हैं...' : 'खोजें'}
                    </button>
                  </div>

                  {trackedGrievance && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold">टोकन संख्या</span>
                          <div className="text-xs font-black text-orange-600">{trackedGrievance.token}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          trackedGrievance.status === 'Resolved' || trackedGrievance.status === 'निस्तारित'
                            ? 'bg-emerald-100 text-emerald-800'
                            : trackedGrievance.status === 'Forwarded' || trackedGrievance.status === 'अग्रसारित'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {trackedGrievance.status || 'लंबित'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-900">{trackedGrievance.subject}</div>
                      <div className="text-[11px] text-slate-600">
                        {trackedGrievance.description || 'विस्तृत विवरण संलग्न है।'}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1">
                        <div>आवेदक: <strong className="text-slate-800">{trackedGrievance.name}</strong></div>
                        <div>गाँव: <strong className="text-slate-800">{trackedGrievance.village}</strong></div>
                        <div>विभाग: <strong className="text-slate-800">{trackedGrievance.department || 'PWD'}</strong></div>
                        <div>दिनांक: <strong className="text-slate-800">{trackedGrievance.date || 'हाल ही में'}</strong></div>
                      </div>

                      {trackedGrievance.actionTaken && (
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                          <strong>विभागीय कार्रवाई (ATR):</strong> {trackedGrievance.actionTaken}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 3: DIRECTORY ================= */}
          {activeTab === 'directory' && (
            <div className="p-3.5 space-y-3.5 animate-fadeIn">
              
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-3.5 text-white shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    जन-संपर्क व डायरेक्टरी इंजन
                  </span>
                  <h2 className="text-base font-black mt-1">मास्टर डायरेक्टरी व संपर्क</h2>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    नागरिकों व कार्यकर्ताओं को 1-क्लिक सीधा व्हाट्सएप संदेश।
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPersonModal(true)}
                  className="p-2 rounded-xl bg-white text-emerald-800 font-bold shadow hover:bg-emerald-50 cursor-pointer flex items-center space-x-1 text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया जोड़ें</span>
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="नाम, मोबाइल या गाँव से खोजें..."
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] font-bold no-scrollbar">
                {[
                  { id: 'all', label: 'सभी' },
                  { id: 'citizen', label: 'नागरिक' },
                  { id: 'worker', label: 'कार्यकर्ता' },
                  { id: 'pradhan', label: 'ग्राम प्रधान' },
                  { id: 'official', label: 'अधिकारी' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDirFilter(tab.id)}
                    className={`px-3 py-1 rounded-full flex-shrink-0 transition cursor-pointer ${
                      dirFilter === tab.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {dirLoading ? (
                  <div className="text-center py-6 text-xs text-slate-400">संपर्क लोड हो रहे हैं...</div>
                ) : filteredDirectory.length > 0 ? (
                  filteredDirectory.slice(0, 30).map((person, idx) => {
                    const cleanPhone = String(person.mobile || person.phone || '').replace(/\D/g, '');
                    const waLink = cleanPhone ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`नमस्ते ${person.name} जी, विधायक श्रीमती सरिता भदौरिया कार्यालय (इटावा) से जनसंपर्क।`)}` : '#';
                    return (
                      <div
                        key={person.id || idx}
                        className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between space-x-2"
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center flex-shrink-0 text-sm">
                            {person.name ? person.name.charAt(0) : 'न'}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-black text-slate-900 truncate">{person.name}</h4>
                            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                              <span>{person.mobile || 'फोन उपलब्ध नहीं'}</span>
                              <span>•</span>
                              <span className="truncate">{person.village || 'इटावा'}</span>
                            </div>
                            <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                              {person.designation || person.category || person.role || 'सदस्य'}
                            </span>
                          </div>
                        </div>

                        {cleanPhone && (
                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="कॉल करें"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow transition"
                              title="व्हाट्सएप खोलें"
                            >
                              <Send className="w-3 h-3" />
                              <span className="text-[10px]">WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                    कोई संपर्क नहीं मिला।
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= TAB 4: WORKS ================= */}
          {activeTab === 'works' && (
            <div className="p-3.5 space-y-3.5 animate-fadeIn">
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-3.5 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                      विकास कार्यों की मैपिंग
                    </span>
                    <h2 className="text-base font-black mt-1">क्षेत्रीय विकास परियोजनाएं</h2>
                  </div>
                  <HardHat className="w-7 h-7 text-blue-200" />
                </div>
                <p className="text-xs text-blue-100 mt-1">
                  इटावा सदर विधानसभा में स्वीकृत एवं पूर्ण विकास कार्य।
                </p>
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] font-bold no-scrollbar">
                {[
                  { id: 'all', label: 'सभी कार्य' },
                  { id: 'सड़क', label: 'सड़क व पुलिया' },
                  { id: 'जल', label: 'पेयजल' },
                  { id: 'विद्युत', label: 'विद्युतीकरण' },
                  { id: 'स्वास्थ्य', label: 'चिकित्सा' }
                ].map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setWorksSectorFilter(sec.id)}
                    className={`px-3 py-1 rounded-full flex-shrink-0 transition cursor-pointer ${
                      worksSectorFilter === sec.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5">
                {worksLoading ? (
                  <div className="text-center py-6 text-xs text-slate-400">विकास कार्य लोड हो रहे हैं...</div>
                ) : filteredWorks.length > 0 ? (
                  filteredWorks.map((work) => (
                    <div key={work.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                            {work.sector || work.category || 'विकास कार्य'}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 mt-1">{work.title}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          work.status === 'Completed' || work.status === 'पूर्ण'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {work.status || 'प्रगति पर'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {work.description || work.summary}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-orange-600" />
                          <span>{work.village || formatLocation(work.location, 'इटावा सदर')}</span>
                        </span>
                        <span>लागत: <strong>{work.cost || work.budget || 'स्वीकृत'}</strong></span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                    इस श्रेणी में विकास कार्य उपलब्ध नहीं हैं।
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= TAB 5: PROFILE & AUTH ================= */}
          {activeTab === 'profile' && (
            <div className="p-3.5 space-y-3.5 animate-fadeIn">
              
              <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] font-bold bg-slate-200 p-1 rounded-xl no-scrollbar">
                <button
                  onClick={() => setProfileSubTab('register')}
                  className={`px-3 py-1.5 rounded-lg flex-shrink-0 transition cursor-pointer ${
                    profileSubTab === 'register' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-700'
                  }`}
                >
                  📝 नागरिक पंजीकरण
                </button>
                <button
                  onClick={() => setProfileSubTab('login')}
                  className={`px-3 py-1.5 rounded-lg flex-shrink-0 transition cursor-pointer ${
                    profileSubTab === 'login' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-700'
                  }`}
                >
                  🔑 नागरिक लॉगिन
                </button>
                <button
                  onClick={() => setProfileSubTab('staff')}
                  className={`px-3 py-1.5 rounded-lg flex-shrink-0 transition cursor-pointer ${
                    profileSubTab === 'staff' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-700'
                  }`}
                >
                  🛡️ 5 रोल लॉगिन
                </button>
                <button
                  onClick={() => setProfileSubTab('my-grievances')}
                  className={`px-3 py-1.5 rounded-lg flex-shrink-0 transition cursor-pointer ${
                    profileSubTab === 'my-grievances' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-700'
                  }`}
                >
                  📋 मेरी शिकायतें
                </button>
                <button
                  onClick={() => setProfileSubTab('audit')}
                  className={`px-3 py-1.5 rounded-lg flex-shrink-0 transition cursor-pointer ${
                    profileSubTab === 'audit' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-700'
                  }`}
                >
                  📜 गतिविधि ऑडिट
                </button>
              </div>

              {profileSubTab === 'register' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <h3 className="text-xs font-black text-slate-900">
                      नया नागरिक / मतदाता पंजीकरण (Citizen Registration)
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    पंजीकरण के उपरांत आपकी सभी समस्याओं का त्वरित निवारण एवं जनसेवा डिजिटल कार्ड जारी होगा।
                  </p>

                  <form onSubmit={handleCitizenRegister} className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">पूरा नाम *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: राम शरण सिंह"
                        value={citRegForm.name}
                        onChange={(e) => setCitRegForm({ ...citRegForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">मोबाइल नंबर *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10 अंकों का मोबाइल नंबर"
                        value={citRegForm.mobile}
                        onChange={(e) => setCitRegForm({ ...citRegForm, mobile: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">गाँव / मोहल्ला</label>
                        <input
                          type="text"
                          value={citRegForm.village}
                          onChange={(e) => setCitRegForm({ ...citRegForm, village: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">मतदाता पहचान (Voter ID)</label>
                        <input
                          type="text"
                          placeholder="उदा: UP/200/..."
                          value={citRegForm.voterId}
                          onChange={(e) => setCitRegForm({ ...citRegForm, voterId: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                      पंजीकरण करें व सदस्यता प्राप्त करें
                    </button>
                  </form>
                </div>
              )}

              {profileSubTab === 'login' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4 text-orange-600" />
                    <h3 className="text-xs font-black text-slate-900">
                      नागरिक लॉगिन (Citizen Portal Login)
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    अपना मोबाइल नंबर दर्ज करके सीधे लॉगिन करें और अपनी पिछली शिकायतें देखें।
                  </p>

                  <form onSubmit={handleCitizenLogin} className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">मोबाइल नंबर *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10 अंकों का मोबाइल नंबर"
                        value={citLoginForm.mobile}
                        onChange={(e) => setCitLoginForm({ ...citLoginForm, mobile: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">आपका नाम (वैकल्पिक)</label>
                      <input
                        type="text"
                        placeholder="नाम"
                        value={citLoginForm.name}
                        onChange={(e) => setCitLoginForm({ ...citLoginForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-orange-600 text-white font-black text-xs shadow-md hover:bg-orange-700 transition cursor-pointer"
                    >
                      लॉगिन करें
                    </button>
                  </form>
                </div>
              )}

              {profileSubTab === 'staff' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <h3 className="text-xs font-black text-slate-900">
                        5 सेग्रीगेटेड रोल अधिकृत लॉगिन
                      </h3>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    भविष्य में अलग-अलग लॉगिन के लिए ये 5 स्वतंत्र खाते पहले से कॉन्फ़िगर हैं:
                  </p>

                  <div className="space-y-2">
                    {SYSTEM_ROLES?.map((role) => (
                      <div
                        key={role.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition flex items-center justify-between"
                      >
                        <div className="truncate">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-sm">{role.icon}</span>
                            <span className="text-xs font-black text-slate-900 truncate">{role.roleTitle}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            User: <strong className="text-slate-900">{role.username}</strong> | Pass: <strong className="text-orange-700">{role.defaultPassword}</strong>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStaffLogin(role)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-orange-600 font-bold text-[10px] shadow transition cursor-pointer flex-shrink-0 ml-2"
                        >
                          सीधा लॉगिन
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileSubTab === 'my-grievances' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900">मेरी दर्ज शिकायतें</h3>
                    <span className="text-[10px] font-bold text-orange-600">कुल: {myGrievances.length}</span>
                  </div>

                  {currentUser?.mobile ? (
                    myGrievances.length > 0 ? (
                      <div className="space-y-2">
                        {myGrievances.map((g) => (
                          <div key={g.id || g.token} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono font-bold text-orange-600">{g.token}</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                                {g.status || 'लंबित'}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900">{g.subject}</div>
                            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                              <span>विभाग: {g.department || 'PWD'}</span>
                              <span>{g.date || 'हाल ही में'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-400">
                        इस मोबाइल नंबर से अभी तक कोई शिकायत दर्ज नहीं है।
                      </div>
                    )
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      कृपया अपनी शिकायतें देखने के लिए पहले मोबाइल नंबर से लॉगिन करें।
                    </div>
                  )}
                </div>
              )}

              {profileSubTab === 'audit' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs font-black text-slate-900">
                        लाइव गतिविधि ऑडिट लॉग्स (Audit Trail)
                      </h3>
                    </div>
                    <button
                      onClick={loadAuditLogs}
                      className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>रीफ्रेश</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log, i) => (
                        <div key={log.id || i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                            <span className="font-bold text-slate-800">{log.user || 'System'}</span>
                            <span>{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'अभी'}</span>
                          </div>
                          <div className="text-slate-700 font-medium">{log.action}</div>
                          {log.module && (
                            <span className="inline-block px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold">
                              {log.module}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400">ऑडिट लॉग्स लोड हो रहे हैं...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: WEBSITE MENU (वेबसाइट मेन्यू) ================= */}
          {activeTab === 'website-menu' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 rounded-2xl p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                      वेबसाइट पोर्टल नेविगेशन
                    </span>
                    <h2 className="text-base font-black mt-1.5">मुख्य वेबसाइट के सभी पृष्ठ</h2>
                  </div>
                  <Globe className="w-8 h-8 text-indigo-300" />
                </div>
                <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
                  इटावा सदर 200 विधानसभा पोर्टल के सभी पृष्ठ, योजनाएं, विकास कार्य व सेवाएं सीधे इसी मोबाइल ऐप में उपलब्ध हैं।
                </p>
              </div>

              {/* Complete Public Navigation Directory */}
              <div className="space-y-2">
                {[
                  { id: 'home', title: 'मुख्य पृष्ठ (Home)', subtitle: 'पोर्टल होम, घोषणाएं व ताज़ा खबरें', icon: Home, color: 'from-orange-500 to-amber-500', badge: 'मुख्य' },
                  { id: 'timeline', title: 'हमारी विधायक (Our MLA)', subtitle: 'जीवन परिचय, राजनीतिक यात्रा व प्रेरणा', icon: Award, color: 'from-amber-500 to-orange-600', badge: 'बायोग्राफी' },
                  { id: 'works', title: 'विकास कार्य एवं उपलब्धियां (Development)', subtitle: 'सड़कें, अस्पताल, विद्युत व विकास परियोजनाएं', icon: HardHat, color: 'from-blue-600 to-indigo-600', badge: '136+ कार्य' },
                  { id: 'schemes', title: 'सरकारी जनकल्याणकारी योजनाएं (Schemes)', subtitle: 'पीएम आवास, आयुष्मान भारत, किसान सम्मान निधि', icon: BookOpen, color: 'from-emerald-600 to-teal-600', badge: '15+ योजनाएं' },
                  { id: 'leaders', title: 'मार्गदर्शक शीर्ष नेतृत्व (Leaders)', subtitle: 'माननीय प्रधानमंत्री मोदी जी व मुख्यमंत्री योगी जी', icon: Award, color: 'from-purple-600 to-indigo-600', badge: 'मार्गदर्शन' },
                  { id: 'constituency', title: 'विधानसभा क्षेत्र इटावा 200 (Constituency)', subtitle: 'भौगोलिक सीमाएं, 214 ग्राम पंचायतें व GIS मैपिंग', icon: MapPin, color: 'from-orange-600 to-rose-600', badge: 'GIS मैप' },
                  { id: 'social', title: 'सोशल मीडिया लाइव केंद्र (Media Hub)', subtitle: 'एक्स (Twitter), फेसबुक, यूट्यूब लाइव अपडेट्स', icon: Share2, color: 'from-cyan-600 to-blue-600', badge: 'लाइव' },
                  { id: 'news', title: 'ताज़ा समाचार व मीडिया कवरेज (News)', subtitle: 'दैनिक प्रेस विज्ञप्तियां, समाचार व टीवी कवरेज', icon: FileText, color: 'from-rose-600 to-pink-600', badge: 'प्रेस' },
                  { id: 'jan-samvad', title: 'जनसंवाद शिकायत निवारण (JanSamvad)', subtitle: 'अपनी जनसमस्या सीधे विधायक को भेजें व ट्रैक करें', icon: MessageSquare, color: 'from-rose-600 to-orange-600', badge: 'समाधान' },
                  { id: 'team', title: 'विधानसभा संगठन एवं टीम (Team)', subtitle: 'पदाधिकारी, मंडल अध्यक्ष व समन्वय प्रकोष्ठ', icon: Users, color: 'from-teal-600 to-emerald-700', badge: 'संपर्क' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleMobileNavigate(item.id)}
                      className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-orange-400 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center flex-shrink-0 shadow`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-orange-600 transition">
                              {item.title}
                            </h4>
                            <span className="text-[9px] font-extrabold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-orange-50 flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition flex-shrink-0 ml-2">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Return to Home Screen Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleMobileNavigate('home')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-green-700 text-white font-extrabold text-xs shadow-lg hover:opacity-95 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>होम स्क्रीन पर वापस जाएं</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= SUB-VIEW: TIMELINE (हमारी विधायक • जीवन परिचय व कार्य टाइमलाइन) ================= */}
          {activeTab === 'timeline' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Sticky Back Header */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur -mx-3.5 -mt-3.5 px-3.5 py-2.5 mb-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => handleMobileNavigate('home')}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-800 hover:text-orange-700 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>होम पर वापस</span>
                </button>
                <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">हमारी विधायक • टाइमलाइन</span>
                <button
                  onClick={() => setShowWebsiteDrawer(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  title="मेन्यू"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* MLA Bio Card */}
              <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-slate-900 rounded-3xl p-4 text-white shadow-xl relative overflow-hidden">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white/10 flex-shrink-0">
                    <img
                      src="/images/assets/sarita_bhadauria_hero.jpg"
                      alt="Smt. Sarita Bhadauria"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/assets/modi_portrait.jpg'; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      भारतीय जनता पार्टी
                    </span>
                    <h2 className="text-base font-black truncate mt-1">श्रीमती सरिता भदौरिया</h2>
                    <p className="text-xs text-orange-100 truncate">विधायक - 200 सदर विधानसभा, इटावा</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
                  <div className="bg-white/10 rounded-xl p-1.5">
                    <div className="text-sm font-black">2 बार</div>
                    <div className="text-[9px] text-orange-200 font-semibold">विजयी जनादेश</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-1.5">
                    <div className="text-sm font-black">{worksList.length || 136}+</div>
                    <div className="text-[9px] text-orange-200 font-semibold">विकास कार्य</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-1.5">
                    <div className="text-sm font-black">45,000+</div>
                    <div className="text-[9px] text-orange-200 font-semibold">जनसुनवाई समाधान</div>
                  </div>
                </div>
                <p className="text-[11px] text-orange-100 italic mt-3 bg-black/20 p-2 rounded-xl leading-relaxed">
                  “राष्ट्र सेवा, अंत्योदय और इटावा सदर का सर्वांगीण विकास ही हमारे जीवन का एकमात्र संकल्प है।”
                </p>
              </div>

              {/* Search & Categories Filter */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="दौरे, शिलान्यास या लोकार्पण खोजें..."
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-bold">
                  {['All', 'लोकार्पण', 'शिलान्यास', 'निरीक्षण', 'जनसंवाद चौपाल', 'सरकारी योजना'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTimelineCategory(cat)}
                      className={`px-3 py-1 rounded-xl flex-shrink-0 transition cursor-pointer ${
                        timelineCategory === cat
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'All' ? 'सभी गतिविधियां' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities List */}
              <div className="space-y-3">
                {(activities.length > 0 ? activities : [
                  {
                    id: 101,
                    title: 'सदर चिकित्सालय में नवीन आईसीयू विंग व ऑक्सीजन प्लांट का लोकार्पण',
                    category: 'लोकार्पण',
                    location: 'जिला अस्पताल, इटावा सदर',
                    date: '15 सितम्बर 2026',
                    description: 'इटावा सदर के नागरिकों को उच्चस्तरीय आपातकालीन चिकित्सा सेवाएं प्रदान करने हेतु 50 बेड नवीन आईसीयू का लोकार्पण किया गया।'
                  },
                  {
                    id: 102,
                    title: 'बढ़पुरा ब्लॉक में ₹8.5 करोड़ की लागत से 5 संपर्क मार्गों का शिलान्यास',
                    category: 'शिलान्यास',
                    location: 'ग्राम बढ़पुरा, इटावा',
                    date: '12 सितम्बर 2026',
                    description: 'प्रधानमंत्री ग्राम सड़क योजना के अंतर्गत ग्रामीण अंचल को मुख्य मार्ग से जोड़ने वाली पक्की सड़कों का भूमिपूजन संपन्न हुआ।'
                  },
                  {
                    id: 103,
                    title: 'जनसंवाद चौपाल में 42 नागरिकों की समस्याओं का मौके पर कराया निस्तारण',
                    category: 'जनसंवाद चौपाल',
                    location: 'रामपुर मजरा, इटावा',
                    date: '08 सितम्बर 2026',
                    description: 'बिजली, पानी, सड़क एवं वृद्धावस्था पेंशन से जुड़े प्रकरणों पर अधिकारियों को मौके पर त्वरित आदेश जारी किए गए।'
                  },
                  {
                    id: 104,
                    title: 'राजकीय बालिका इंटर कॉलेज में स्मार्ट क्लास व लाइब्रेरी का औचक निरीक्षण',
                    category: 'निरीक्षण',
                    location: 'इटावा नगर',
                    date: '05 सितम्बर 2026',
                    description: 'छात्राओं से संवाद कर पठन-पाठन की स्थिति का जायजा लिया और खेल सामग्री वितरित की।'
                  }
                ])
                  .filter((act) => {
                    const locText = formatLocation(act.location, '');
                    const matchesCategory = timelineCategory === 'All' || (act.category || '').includes(timelineCategory);
                    const matchesSearch = !timelineSearch || (act.title || '').toLowerCase().includes(timelineSearch.toLowerCase()) || locText.toLowerCase().includes(timelineSearch.toLowerCase());
                    return matchesCategory && matchesSearch;
                  })
                  .map((act, idx) => (
                    <div key={act.id || idx} className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-extrabold border border-orange-200">
                          {act.category || 'गतिविधि'}
                        </span>
                        <span className="text-slate-500 font-semibold">{act.date || 'हाल ही में'}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 leading-snug">{act.title}</h4>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-orange-600 flex-shrink-0" />
                        <span>{formatLocation(act.location, 'इटावा सदर विधानसभा')}</span>
                      </div>
                      {act.description && (
                        <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {act.description}
                        </p>
                      )}
                      <div className="pt-1 flex items-center justify-between">
                        <button
                          onClick={() => {
                            const text = `*${act.title}*\nस्थान: ${formatLocation(act.location, 'इटावा')}\nदिनांक: ${act.date || 'हाल ही में'}\n\n${act.description || ''}\n\n📲 जनसेवा इटावा 200 ऐप से शेयर किया गया`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center space-x-1 transition cursor-pointer"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>व्हाट्सएप पर शेयर करें</span>
                        </button>
                        <span className="text-[9px] text-slate-400 font-bold">आधिकारिक दौरा</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= SUB-VIEW: SCHEMES (सरकारी जनकल्याणकारी योजनाएं) ================= */}
          {activeTab === 'schemes' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Sticky Back Header */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur -mx-3.5 -mt-3.5 px-3.5 py-2.5 mb-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => handleMobileNavigate('home')}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-800 hover:text-orange-700 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>होम पर वापस</span>
                </button>
                <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">सरकारी जनकल्याणकारी योजनाएं</span>
                <button
                  onClick={() => setShowWebsiteDrawer(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  title="मेन्यू"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Top Schemes Banner */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-4 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                      जनकल्याण सर्वोपरि
                    </span>
                    <h2 className="text-base font-black mt-1.5">सरकारी योजनाओं का सीधा लाभ</h2>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-300" />
                </div>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  इटावा सदर विधानसभा में केंद्र एवं राज्य सरकार की प्रमुख योजनाओं की पात्रता, लाभ एवं आवेदन प्रक्रिया सीधे यहां देखें।
                </p>
              </div>

              {/* Search & Category Pills */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="योजना का नाम या लाभ खोजें..."
                    value={schemesSearch}
                    onChange={(e) => setSchemesSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-bold">
                  {[
                    { key: 'All', label: 'सभी योजनाएं' },
                    { key: 'housing', label: 'आवास' },
                    { key: 'farmer', label: 'किसान' },
                    { key: 'health', label: 'स्वास्थ्य' },
                    { key: 'women', label: 'महिला' },
                    { key: 'water', label: 'पेयजल' },
                    { key: 'infrastructure', label: 'अवसंरचना' },
                    { key: 'youth', label: 'रोजगार' }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSchemesCategory(cat.key)}
                      className={`px-3 py-1 rounded-xl flex-shrink-0 transition cursor-pointer ${
                        schemesCategory === cat.key
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schemes Cards List */}
              <div className="space-y-3">
                {staticSchemes
                  .filter((sch) => {
                    const matchesCat = schemesCategory === 'All' || sch.category === schemesCategory;
                    const matchesSearch = !schemesSearch || sch.title.toLowerCase().includes(schemesSearch.toLowerCase()) || sch.description.toLowerCase().includes(schemesSearch.toLowerCase());
                    return matchesCat && matchesSearch;
                  })
                  .map((sch) => {
                    const Icon = sch.icon;
                    return (
                      <div key={sch.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${sch.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5 mb-0.5">
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                {sch.categoryName}
                              </span>
                            </div>
                            <h3 className="text-xs font-black text-slate-900 leading-snug">{sch.title}</h3>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                            {sch.beneficiaries}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 font-extrabold border border-blue-200">
                            {sch.budget}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed">{sch.description}</p>

                        {/* Benefits List */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                          <div className="text-[10px] font-black text-slate-800 uppercase tracking-wide">मुख्य लाभ:</div>
                          {sch.benefits.map((b, i) => (
                            <div key={i} className="flex items-start space-x-1.5 text-[10px] text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>

                        {/* Eligibility */}
                        <div className="text-[10px] text-slate-500 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                          <span className="font-bold text-amber-800">पात्रता: </span>
                          <span>{sch.eligibility}</span>
                        </div>

                        {/* Actions */}
                        <div className="pt-1 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              const text = `*${sch.title}*\n${sch.beneficiaries}\n${sch.description}\n\nपोर्टल: ${sch.portalUrl}\n\n📲 जनसेवा इटावा 200 ऐप`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center justify-center space-x-1 transition cursor-pointer"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>व्हाट्सएप शेयर</span>
                          </button>
                          <a
                            href={sch.portalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200 flex items-center justify-center space-x-1 transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>आधिकारिक पोर्टल</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================= SUB-VIEW: LEADERS (मार्गदर्शक शीर्ष नेतृत्व) ================= */}
          {activeTab === 'leaders' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Sticky Back Header */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur -mx-3.5 -mt-3.5 px-3.5 py-2.5 mb-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => handleMobileNavigate('home')}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-800 hover:text-orange-700 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>होम पर वापस</span>
                </button>
                <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">मार्गदर्शक शीर्ष नेतृत्व</span>
                <button
                  onClick={() => setShowWebsiteDrawer(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  title="मेन्यू"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Header Banner */}
              <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 rounded-3xl p-4 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                      राष्ट्र प्रथम, सेवा सर्वोपरि
                    </span>
                    <h2 className="text-base font-black mt-1.5">मार्गदर्शक शीर्ष नेतृत्व</h2>
                  </div>
                  <Award className="w-8 h-8 text-purple-300" />
                </div>
                <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                  परम आदरणीय प्रधानमंत्री नरेन्द्र मोदी जी एवं मुख्यमंत्री योगी आदित्यनाथ जी के प्रेरणादायी मार्गदर्शन में इटावा का विकास।
                </p>
              </div>

              {/* Filter Pills */}
              <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm flex space-x-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold">
                {[
                  { key: 'All', label: 'सभी नेतृत्व' },
                  { key: 'modi', label: 'पीएम मोदी जी' },
                  { key: 'yogi', label: 'सीएम योगी जी' },
                  { key: 'central', label: 'केंद्रीय मंत्री' },
                  { key: 'state', label: 'उपमुख्यमंत्री' },
                  { key: 'party', label: 'संगठन' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setLeadersCategory(cat.key)}
                    className={`px-3 py-1 rounded-xl flex-shrink-0 transition cursor-pointer ${
                      leadersCategory === cat.key
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Leaders Cards List */}
              <div className="space-y-3">
                {ministersData
                  .filter((leader) => leadersCategory === 'All' || leader.category === leadersCategory)
                  .map((leader) => (
                    <div key={leader.id} className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow bg-slate-200 flex-shrink-0">
                          <img
                            src={leader.avatar}
                            alt={leader.author}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/images/assets/modi_portrait.jpg'; }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1">
                            <h4 className="text-xs font-black text-slate-900 truncate">{leader.author}</h4>
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold truncate">{leader.role}</p>
                          <span className="text-[9px] text-orange-600 font-mono">{leader.handle}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        “{leader.text}”
                      </p>

                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400 font-medium">{leader.date}</span>
                        <button
                          onClick={() => {
                            const text = `*${leader.author} (${leader.role})*:\n"${leader.text}"\n\n📲 जनसेवा इटावा 200 ऐप से शेयर किया गया`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 flex items-center space-x-1 transition cursor-pointer"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>व्हाट्सएप संदेश</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= SUB-VIEW: CONSTITUENCY (विधानसभा क्षेत्र इटावा 200) ================= */}
          {activeTab === 'constituency' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Sticky Back Header */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur -mx-3.5 -mt-3.5 px-3.5 py-2.5 mb-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => handleMobileNavigate('home')}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-800 hover:text-orange-700 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>होम पर वापस</span>
                </button>
                <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">विधानसभा क्षेत्र इटावा (200)</span>
                <button
                  onClick={() => setShowWebsiteDrawer(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  title="मेन्यू"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Constituency GIS Overview Box */}
              <div className="bg-gradient-to-br from-teal-700 via-cyan-800 to-slate-900 rounded-3xl p-4 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                      भौगोलिक प्रोफाइल व सांख्यिकी
                    </span>
                    <h2 className="text-base font-black mt-1.5">200 - इटावा सदर विधानसभा</h2>
                  </div>
                  <MapPin className="w-8 h-8 text-teal-300" />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
                  <div className="bg-white/10 rounded-xl p-1.5">
                    <div className="text-sm font-black text-amber-300">2</div>
                    <div className="text-[9px] text-teal-100 font-semibold">तहसीलें</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-1.5">
                    <div className="text-sm font-black text-amber-300">4</div>
                    <div className="text-[9px] text-teal-100 font-semibold">विकास खंड</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-1.5">
                    <div className="text-sm font-black text-amber-300">214</div>
                    <div className="text-[9px] text-teal-100 font-semibold">ग्राम पंचायतें</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-1.5">
                    <div className="text-sm font-black text-amber-300">428</div>
                    <div className="text-[9px] text-teal-100 font-semibold">मतदेय स्थल</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-1.5 col-span-2">
                    <div className="text-sm font-black text-emerald-300">4,52,000+</div>
                    <div className="text-[9px] text-teal-100 font-semibold">सम्मानित मतदाता</div>
                  </div>
                </div>
              </div>

              {/* Search & Block Filter */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="गांव, मजरा या पंचायत खोजें..."
                    value={constituencySearch}
                    onChange={(e) => setConstituencySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-bold">
                  {['All', 'इटावा सदर', 'सैफई', 'भरथना', 'जसवंतनगर', 'बढ़पुरा'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setConstituencyBlock(b)}
                      className={`px-3 py-1 rounded-xl flex-shrink-0 transition cursor-pointer ${
                        constituencyBlock === b
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b === 'All' ? 'सभी ब्लॉक' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Villages and Panchayats List */}
              <div className="space-y-2.5">
                {staticConstituencyVillages
                  .filter((v) => {
                    const matchesBlock = constituencyBlock === 'All' || v.block.includes(constituencyBlock);
                    const matchesSearch = !constituencySearch || v.nameHi.toLowerCase().includes(constituencySearch.toLowerCase()) || v.block.toLowerCase().includes(constituencySearch.toLowerCase()) || v.panchayat.toLowerCase().includes(constituencySearch.toLowerCase());
                    return matchesBlock && matchesSearch;
                  })
                  .map((v) => (
                    <div key={v.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-black text-slate-900 truncate">{v.nameHi}</h4>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 border border-teal-200">
                            {v.block}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{v.panchayat}</div>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-600 font-semibold mt-1">
                          <span>👥 मतदाता: {v.voters}</span>
                          <span>🏗️ कार्य: {v.works}</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-[9px] border border-emerald-200 flex-shrink-0">
                        सक्रिय क्षेत्र
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= SUB-VIEW: SOCIAL MEDIA HUB (सोशल मीडिया केंद्र) ================= */}
          {activeTab === 'social' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Sticky Back Header */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur -mx-3.5 -mt-3.5 px-3.5 py-2.5 mb-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => handleMobileNavigate('home')}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-800 hover:text-orange-700 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>होम पर वापस</span>
                </button>
                <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">सोशल मीडिया केंद्र</span>
                <button
                  onClick={() => setShowWebsiteDrawer(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  title="मेन्यू"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Header Banner */}
              <div className="bg-gradient-to-r from-cyan-600 via-blue-700 to-slate-900 rounded-3xl p-4 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                      लाइव डिजिटल कनेक्ट
                    </span>
                    <h2 className="text-base font-black mt-1.5">सोशल मीडिया लाइव केंद्र</h2>
                  </div>
                  <Share2 className="w-8 h-8 text-cyan-300" />
                </div>
                <p className="text-xs text-cyan-100 mt-1 leading-relaxed">
                  माननीया विधायक श्रीमती सरिता भदौरिया के आधिकारिक सोशल मीडिया हैंडल्स एवं ताज़ा पोस्ट्स।
                </p>
              </div>

              {/* Platform Quick Links */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <a href="https://twitter.com/mlaetawah" target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-black text-slate-900 font-bold text-[10px]">
                  <div className="text-lg mb-0.5">𝕏</div>
                  <div>एक्स</div>
                </a>
                <a href="https://facebook.com/mlaetawah" target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 text-blue-700 font-bold text-[10px]">
                  <div className="text-lg mb-0.5">📘</div>
                  <div>फेसबुक</div>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-rose-500 text-rose-700 font-bold text-[10px]">
                  <div className="text-lg mb-0.5">▶️</div>
                  <div>यूट्यूब</div>
                </a>
                <a href={`https://api.whatsapp.com/send?phone=${mobileSettings?.officialWhatsapp || '9876543210'}`} target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 text-emerald-700 font-bold text-[10px]">
                  <div className="text-lg mb-0.5">💬</div>
                  <div>व्हाट्सएप</div>
                </a>
              </div>

              {/* Platform Filter Pills */}
              <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm flex space-x-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold">
                {[
                  { key: 'All', label: 'सभी फीड्स' },
                  { key: 'twitter', label: '𝕏 एक्स' },
                  { key: 'facebook', label: 'फेसबुक' },
                  { key: 'instagram', label: 'इंस्टाग्राम' }
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSocialPlatform(p.key)}
                    className={`px-3 py-1 rounded-xl flex-shrink-0 transition cursor-pointer ${
                      socialPlatform === p.key
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Social Posts Stream */}
              <div className="space-y-3">
                {staticSocialPosts
                  .filter((sp) => socialPlatform === 'All' || sp.platform === socialPlatform)
                  .map((sp) => (
                    <div key={sp.id} className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs">
                            स
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900">{sp.author}</div>
                            <div className="text-[10px] text-slate-400">{sp.time}</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold text-[9px] uppercase border border-cyan-200">
                          {sp.platform}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-medium">{sp.content}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-bold">
                        <div className="flex items-center space-x-3">
                          <span>❤️ {sp.likes}</span>
                          <span>💬 {sp.comments || sp.retweets || '210'}</span>
                        </div>
                        <button
                          onClick={() => {
                            const text = `*${sp.author}*:\n"${sp.content}"\n\n📲 जनसेवा इटावा 200 ऐप से शेयर किया गया`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center space-x-1 transition cursor-pointer"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>शेयर करें</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= SUB-VIEW: TEAM (विधानसभा संगठन एवं टीम) ================= */}
          {activeTab === 'team' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Sticky Back Header */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur -mx-3.5 -mt-3.5 px-3.5 py-2.5 mb-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => handleMobileNavigate('home')}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-800 hover:text-orange-700 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>होम पर वापस</span>
                </button>
                <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">विधानसभा संगठन व टीम</span>
                <button
                  onClick={() => setShowWebsiteDrawer(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  title="मेन्यू"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Header Banner */}
              <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 rounded-3xl p-4 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                      समन्वय एवं जनसेवा
                    </span>
                    <h2 className="text-base font-black mt-1.5">विधानसभा संगठन एवं टीम</h2>
                  </div>
                  <Users className="w-8 h-8 text-emerald-300" />
                </div>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  इटावा सदर के समर्पित पदाधिकारी, मंडल अध्यक्ष एवं कार्यकर्ता बंधु। किसी भी सहायता हेतु सीधे संपर्क करें।
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm flex space-x-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold">
                {[
                  { key: 'All', label: 'सभी सदस्य' },
                  { key: 'office', label: 'कार्यालय टीम' },
                  { key: 'mandal', label: 'मंडल संयोजक' },
                  { key: 'women', label: 'महिला मोर्चा' },
                  { key: 'youth', label: 'युवा मोर्चा' },
                  { key: 'media', label: 'आईटी सेल' }
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setTeamCategory(c.key)}
                    className={`px-3 py-1 rounded-xl flex-shrink-0 transition cursor-pointer ${
                      teamCategory === c.key
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                {staticTeam
                  .filter((m) => teamCategory === 'All' || m.category === teamCategory)
                  .map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-teal-500 shadow bg-slate-200 flex-shrink-0">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/images/assets/modi_portrait.jpg'; }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-slate-900 truncate">{member.name}</h4>
                          <p className="text-[10px] text-teal-700 font-bold truncate">{member.role}</p>
                          <div className="flex items-center space-x-1 text-[10px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{member.area}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <a
                          href={`tel:${member.phone}`}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-600" />
                          <span>कॉल करें</span>
                        </a>
                        <a
                          href={`https://api.whatsapp.com/send?phone=91${member.phone}&text=${encodeURIComponent('नमस्ते ' + member.name + ' जी, जनसेवा इटावा 200 पोर्टल के संदर्भ में संवाद हेतु संदेश।')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center justify-center space-x-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          <span>व्हाट्सएप</span>
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= SUB-VIEW: NEWS (ताज़ा समाचार व मीडिया कवरेज) ================= */}
          {activeTab === 'news' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Sticky Back Header */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur -mx-3.5 -mt-3.5 px-3.5 py-2.5 mb-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => handleMobileNavigate('home')}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-800 hover:text-orange-700 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>होम पर वापस</span>
                </button>
                <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">ताज़ा समाचार व मीडिया कवरेज</span>
                <button
                  onClick={() => setShowWebsiteDrawer(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  title="मेन्यू"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Header Banner */}
              <div className="bg-gradient-to-r from-rose-700 via-pink-800 to-slate-900 rounded-3xl p-4 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                      मीडिया एवं प्रेस कवरेज
                    </span>
                    <h2 className="text-base font-black mt-1.5">ताज़ा समाचार व प्रेस विज्ञप्तियां</h2>
                  </div>
                  <FileText className="w-8 h-8 text-rose-300" />
                </div>
                <p className="text-xs text-rose-100 mt-1 leading-relaxed">
                  इटावा सदर विधानसभा में विकास कार्यों, जनसुनवाई एवं कार्यक्रमों की प्रमुख समाचार पत्रों में प्रकाशित खबरें।
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="समाचार या प्रेस विज्ञप्ति खोजें..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* News Items List */}
              <div className="space-y-3">
                {(newsItems && newsItems.length > 0 ? newsItems : staticNewsFallbacks)
                  .filter((item) => !newsSearch || item.title.toLowerCase().includes(newsSearch.toLowerCase()) || (item.source || '').toLowerCase().includes(newsSearch.toLowerCase()))
                  .map((item, idx) => (
                    <div key={item.id || idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-black border border-rose-200">
                          {item.source || 'समाचार'}
                        </span>
                        <span className="text-slate-400 font-semibold">{item.date || 'हाल ही में'}</span>
                      </div>

                      <h3 className="text-xs font-black text-slate-900 leading-snug">{item.title}</h3>

                      {item.summary && (
                        <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {item.summary}
                        </p>
                      )}

                      <div className="pt-1 flex items-center justify-between">
                        <button
                          onClick={() => {
                            const text = `*${item.title}* (${item.source || 'समाचार'})\n\n${item.summary || ''}\n\n📲 जनसेवा इटावा 200 ऐप`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center space-x-1 transition cursor-pointer"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>व्हाट्सएप पर शेयर करें</span>
                        </button>
                        <span className="text-[9px] text-slate-400 font-bold">दैनिक मीडिया बुलेटिन</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </main>

        {/* Bottom Native App Navigation Bar (Dynamically controlled by Admin Mobile CMS) */}
        <nav className="bg-white border-t border-slate-200 px-1.5 py-1.5 absolute bottom-0 left-0 right-0 z-40 flex items-center justify-around shadow-lg">
          
          {mobileSettings?.bottomTabs?.home !== false && (
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'home' ? 'text-orange-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">होम</span>
            </button>
          )}

          {mobileSettings?.bottomTabs?.jansamvad !== false && (
            <button
              onClick={() => setActiveTab('jansamvad')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'jansamvad' ? 'text-orange-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">जनसंवाद</span>
            </button>
          )}

          {mobileSettings?.bottomTabs?.directory !== false && (
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'directory' ? 'text-emerald-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">डायरेक्टरी</span>
            </button>
          )}

          {mobileSettings?.bottomTabs?.works !== false && (
            <button
              onClick={() => setActiveTab('works')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'works' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <HardHat className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">विकास</span>
            </button>
          )}

          {mobileSettings?.bottomTabs?.websiteMenu !== false && (
            <button
              onClick={() => setActiveTab('website-menu')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'website-menu' ? 'text-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">वेब मेन्यू</span>
            </button>
          )}

          {mobileSettings?.bottomTabs?.profile !== false && (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'profile' ? 'text-purple-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">प्रोफाइल</span>
            </button>
          )}

        </nav>

      </div>

      {/* MODAL: Full Website Slide-Over Drawer (Accessible from Header or Card) */}
      {showWebsiteDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    वेबसाइट मेन्यू व सभी सार्वजनिक पृष्ठ
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    इटावा सदर (200) मुख्य वेब पोर्टल
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWebsiteDrawer(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'home', title: 'मुख्य पृष्ठ (Home)', desc: 'पोर्टल होम, घोषणाएं व ताज़ा खबरें', icon: Home, color: 'text-orange-600 bg-orange-50' },
                { id: 'timeline', title: 'हमारी विधायक (Our MLA)', desc: 'जीवन परिचय, राजनीतिक यात्रा व प्रेरणा', icon: Award, color: 'text-amber-600 bg-amber-50' },
                { id: 'works', title: 'विकास कार्य एवं उपलब्धियां (Development)', desc: 'सड़कें, अस्पताल, विद्युत व विकास परियोजनाएं', icon: HardHat, color: 'text-blue-600 bg-blue-50' },
                { id: 'schemes', title: 'सरकारी जनकल्याणकारी योजनाएं (Schemes)', desc: 'पीएम आवास, आयुष्मान भारत, किसान सम्मान निधि', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
                { id: 'leaders', title: 'मार्गदर्शक शीर्ष नेतृत्व (Leaders)', desc: 'माननीय प्रधानमंत्री मोदी जी व मुख्यमंत्री योगी जी', icon: Award, color: 'text-purple-600 bg-purple-50' },
                { id: 'constituency', title: 'विधानसभा क्षेत्र इटावा 200 (Constituency)', desc: 'भौगोलिक सीमाएं, 214 ग्राम पंचायतें व GIS मैपिंग', icon: MapPin, color: 'text-orange-600 bg-orange-50' },
                { id: 'social', title: 'सोशल मीडिया लाइव केंद्र (Media Hub)', desc: 'एक्स (Twitter), फेसबुक, यूट्यूब लाइव अपडेट्स', icon: Share2, color: 'text-cyan-600 bg-cyan-50' },
                { id: 'news', title: 'ताज़ा समाचार व मीडिया कवरेज (News)', desc: 'दैनिक प्रेस विज्ञप्तियां, समाचार व टीवी कवरेज', icon: FileText, color: 'text-rose-600 bg-rose-50' },
                { id: 'jan-samvad', title: 'जनसंवाद शिकायत निवारण (JanSamvad)', desc: 'अपनी जनसमस्या सीधे विधायक को भेजें व ट्रैक करें', icon: MessageSquare, color: 'text-rose-600 bg-rose-50' },
                { id: 'team', title: 'विधानसभा संगठन एवं टीम (Team)', desc: 'पदाधिकारी, मंडल अध्यक्ष व समन्वय प्रकोष्ठ', icon: Users, color: 'text-teal-600 bg-teal-50' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleMobileNavigate(item.id);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600">{item.title}</div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600" />
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                handleMobileNavigate('home');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-green-700 text-white font-black text-xs shadow hover:opacity-95 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>होम स्क्रीन पर वापस जाएं</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: 5 Segregated Roles & Credentials Modal */}
      {showRoleCredentialsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    5 सेग्रीगेटेड रोल्स एवं क्रेडेंशियल्स व्यवस्था
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    एडमिन, विधायक, डेटा मैनेजर, कार्यकर्ता, विधायक असिस्टेंट
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleCredentialsModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              वर्तमान में आप ऊपर दी गई लिंक/बटन से किसी भी रोल को 1-क्लिक में स्विच करके देख सकते हैं। भविष्य में प्रत्येक रोल का व्यक्तिगत पासवर्ड लॉगिन भी सक्रिय है:
            </p>

            <div className="space-y-3">
              {SYSTEM_ROLES?.map((role) => {
                const isCurActive = activeAdminRole === role.id;
                return (
                  <div
                    key={role.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      isCurActive
                        ? 'bg-orange-50/70 border-orange-400 ring-2 ring-orange-500/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{role.icon}</span>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{role.roleTitle}</h4>
                          <span className="text-[10px] text-slate-500 font-semibold">{role.department}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveAdminRole(role.id);
                          handleStaffLogin(role);
                        }}
                        className={`px-3 py-1 rounded-xl text-[10px] font-black transition cursor-pointer ${
                          isCurActive
                            ? 'bg-orange-600 text-white shadow'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isCurActive ? 'वर्तमान सक्रिय ✓' : 'यह रोल चुनें'}
                      </button>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 text-[10px] font-mono grid grid-cols-2 gap-1 text-slate-700 mb-1.5">
                      <div>User: <strong className="text-slate-900">{role.username}</strong></div>
                      <div>Pass: <strong className="text-orange-700">{role.defaultPassword}</strong></div>
                    </div>

                    <ul className="text-[10px] text-slate-600 space-y-0.5 list-disc pl-4">
                      {(role.features || []).map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowRoleCredentialsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                समझ गया / विंडो बंद करें
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: Add New Person to Directory */}
      {showAddPersonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-black text-slate-900">नया व्यक्ति / सदस्य जोड़ें</h3>
              <button onClick={() => setShowAddPersonModal(false)} className="text-slate-500 font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddPerson} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="नाम दर्ज करें"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">मोबाइल नंबर *</label>
                <input
                  type="tel"
                  required
                  placeholder="10 अंकों का नंबर"
                  value={newPerson.mobile}
                  onChange={(e) => setNewPerson({ ...newPerson, mobile: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">श्रेणी</label>
                  <select
                    value={newPerson.category}
                    onChange={(e) => setNewPerson({ ...newPerson, category: e.target.value })}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 outline-none bg-white font-medium"
                  >
                    <option value="कार्यकर्ता">कार्यकर्ता</option>
                    <option value="नागरिक">नागरिक</option>
                    <option value="ग्राम प्रधान">ग्राम प्रधान</option>
                    <option value="अधिकारी">अधिकारी</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">गाँव / वार्ड</label>
                  <input
                    type="text"
                    value={newPerson.village}
                    onChange={(e) => setNewPerson({ ...newPerson, village: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow hover:bg-emerald-700 transition cursor-pointer"
              >
                डायरेक्टरी में सुरक्षित करें
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
