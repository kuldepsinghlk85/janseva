import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/public/Navbar';
import FestivalBanner from '../components/public/FestivalBanner';
import FooterPanorama from '../components/public/FooterPanorama';
import VoiceInputButton from '../components/common/VoiceInputButton';
import {
  ArrowLeft,
  Search,
  Share2,
  ExternalLink,
  Home,
  CheckCircle2,
  Landmark,
  Flame,
  Droplets,
  HeartPulse,
  Users,
  Car,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function PublicSchemesPage() {
  const { navigateToPublicPage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const categories = [
    { key: 'All', label: 'सभी योजनाएं' },
    { key: 'housing', label: 'आवास एवं आश्रय' },
    { key: 'farmer', label: 'किसान कल्याण' },
    { key: 'health', label: 'स्वास्थ्य सुरक्षा' },
    { key: 'women', label: 'महिला सशक्तिकरण' },
    { key: 'water', label: 'पेयजल एवं स्वच्छता' },
    { key: 'youth', label: 'युवा एवं शिक्षा' },
    { key: 'infrastructure', label: 'अवसंरचना' }
  ];

  const allSchemes = [
    {
      id: 1,
      category: 'housing',
      categoryName: 'आवास एवं आश्रय',
      title: 'प्रधानमंत्री आवास योजना (PMAY - ग्रामीण एवं शहरी)',
      icon: Home,
      iconColor: 'bg-blue-100 text-blue-600',
      beneficiaries: '32,400+ पक्के मकान स्वीकृत',
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
      iconColor: 'bg-emerald-100 text-emerald-600',
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
      iconColor: 'bg-rose-100 text-rose-600',
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
      iconColor: 'bg-amber-100 text-amber-600',
      beneficiaries: '48,000+ गैस कनेक्शन वितरित',
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
      iconColor: 'bg-cyan-100 text-cyan-600',
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
      iconColor: 'bg-slate-200 text-slate-800',
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
      iconColor: 'bg-purple-100 text-purple-600',
      beneficiaries: '14,500+ बेटियां लाभान्वित',
      budget: '₹25,000 कुल सहायता',
      description: 'बेटियों के जन्म से लेकर उच्च शिक्षा (स्नातक) तक 6 विभिन्न चरणों में कुल ₹25,000 की वित्तीय सहायता प्रदान कर कन्या भ्रूण हत्या रोकथाम एवं बालिका शिक्षा को प्रोत्साहन।',
      benefits: [
        'जन्म पर ₹5,000, 1 वर्ष के टीकाकरण पर ₹2,000',
        'कक्षा 1 में ₹3,000, कक्षा 6 में ₹3,000, कक्षा 9 में ₹5,000',
        '10वीं/12वीं उपरांत स्नातक या डिप्लोमा में ₹7,000'
      ],
      eligibility: 'उत्तर प्रदेश के स्थायी निवासी, वार्षिक पारिवारिक आय ₹3 लाख से कम।',
      portalUrl: 'https://mksy.up.gov.in'
    },
    {
      id: 8,
      category: 'youth',
      categoryName: 'युवा एवं शिक्षा',
      title: 'स्वामी विवेकानंद युवा सशक्तिकरण - निःशुल्क स्मार्टफोन व टैबलेट वितरण',
      icon: GraduationCap,
      iconColor: 'bg-indigo-100 text-indigo-600',
      beneficiaries: '22,000+ छात्र-छात्राओं को वितरित',
      budget: '100% सरकारी अनुदान',
      description: 'इटावा जिले के स्नातक, परास्नातक, तकनीकी, आईटीआई एवं कौशल विकास पाठ्यक्रमों में अध्ययनरत छात्र-छात्राओं को डिजिटल शिक्षा व ऑनलाइन करियर अवसरों हेतु निःशुल्क स्मार्टफोन व टैबलेट।',
      benefits: [
        'नवीनतम 5G समर्थित स्मार्टफोन / टैबलेट डिवाइस',
        'शैक्षणिक पोर्टल एवं करियर गाइडेंस ऐप्स प्री-इंस्टॉल्ड',
        'डिजिटल लाइब्रेरी एवं ई-लर्निंग सामग्री तक सीधी पहुंच'
      ],
      eligibility: 'मान्यता प्राप्त महाविद्यालयों/विश्वविद्यालयों में नियमित अध्ययनरत युवा।',
      portalUrl: 'https://digishakti.up.gov.in'
    }
  ];

  const filteredSchemes = allSchemes.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareWhatsApp = (item) => {
    const text = `*${item.title}*\n\n${item.description}\n\n📊 लाभान्वित: ${item.beneficiaries}\n🌐 आधिकारिक पोर्टल: ${item.portalUrl}\n— विधायक श्रीमती सरिता भदौरिया कार्यालय, इटावा`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <FestivalBanner />
      <Navbar />

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigateToPublicPage('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all backdrop-blur-sm border border-white/30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← मुख्य पृष्ठ पर वापस जाएं</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-blue-200">
              <button onClick={() => navigateToPublicPage('home')} className="hover:underline flex items-center gap-1 cursor-pointer">
                <Home className="w-3.5 h-3.5" /> मुख्य पृष्ठ
              </button>
              <span>/</span>
              <span className="text-white font-semibold">महत्वपूर्ण सरकारी योजनाएं</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-sm">
              <Landmark className="w-3.5 h-3.5" /> जनकल्याण एवं अंत्योदय
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
              महत्वपूर्ण सरकारी योजनाएं व जनकल्याणकारी अभियान
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              माननीय प्रधानमंत्री श्री नरेन्द्र मोदी जी एवं मुख्यमंत्री योगी आदित्यनाथ जी के नेतृत्व में संचालित सभी प्रमुख योजनाओं का संपूर्ण विवरण, पात्रता, लाभ एवं इटावा सदर में प्रगति रिपोर्ट।
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-5 mb-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Voice Enabled Search */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="योजना का नाम, लाभ या विषय खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputButton
                  onTranscript={(text) => setSearchQuery((prev) => (prev ? `${prev} ${text}` : text))}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === c.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Schemes Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-sm font-medium">
            कुल <span className="font-bold text-blue-600">{filteredSchemes.length}</span> प्रमुख योजनाएं प्रदर्शित हैं
          </p>
          <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            प्रत्यक्ष लाभ अंतरण (DBT) समर्थित
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.iconColor} shadow-xs`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                          {item.categoryName}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">इटावा में लाभान्वित</span>
                      <p className="font-black text-emerald-700">{item.beneficiaries}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">स्वीकृत वित्तीय मदद</span>
                      <p className="font-black text-blue-700">{item.budget}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700">मुख्य विशेषताएं व लाभ:</span>
                    {item.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Eligibility */}
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900">
                    <span className="font-bold">पात्रता: </span>
                    <span>{item.eligibility}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={item.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>आधिकारिक पोर्टल / आवेदन</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleShareWhatsApp(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition cursor-pointer"
                    title="व्हाट्सएप पर शेयर करें"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Home CTA bottom */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateToPublicPage('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← मुख्य पृष्ठ पर वापस जाएं</span>
          </button>
        </div>
      </div>

      <FooterPanorama />
    </div>
  );
}
