import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import Navbar from '../components/public/Navbar';
import FestivalBanner from '../components/public/FestivalBanner';
import FooterPanorama from '../components/public/FooterPanorama';
import VoiceInputButton from '../components/common/VoiceInputButton';
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase,
  Share2,
  Home,
  IndianRupee,
  Layers,
  Building
} from 'lucide-react';

export default function PublicWorksPage() {
  const { navigateToPublicPage } = useApp();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultWorks = [
    {
      id: 'w1',
      title: 'रामपुर-वैदपुरा डामरीकृत संपर्क मार्ग निर्माण',
      category: 'सड़क एवं पुलिया',
      village: 'रामपुर',
      block: 'इटावा सदर',
      cost: '₹1.85 करोड़',
      status: 'completed',
      completionDate: '15 सितंबर 2026',
      agency: 'लोक निर्माण विभाग (UP PWD)',
      image: '/images/assets/work_rampur_road.jpg',
      description: 'रामपुर से वैदपुरा 8.5 किमी डामरीकृत संपर्क मार्ग का निर्माण पूर्ण। 12 गांवों के किसानों व छात्रों को आवागमन में सुगमता।'
    },
    {
      id: 'w2',
      title: 'राजकीय बालिका इंटर कॉलेज स्मार्ट क्लास व आधुनिक प्रयोगशाला',
      category: 'शिक्षा एवं विद्यालय',
      village: 'इटावा नगर',
      block: 'सदर',
      cost: '₹75 लाख',
      status: 'completed',
      completionDate: '10 अगस्त 2026',
      agency: 'माध्यमिक शिक्षा विभाग',
      image: '/images/assets/work_school_children.jpg',
      description: 'ऑपरेशन कायाकल्प के तहत आधुनिक कंप्यूटर लैब, कोडिंग कक्ष एवं डिजिटल स्मार्ट बोर्ड की स्थापना।'
    },
    {
      id: 'w3',
      title: 'पिलखर प्राथमिक स्वास्थ्य केंद्र उच्चीकरण व प्रसव गृह निर्माण',
      category: 'स्वास्थ्य सेवाएं',
      village: 'पिलखर',
      block: 'इटावा सदर',
      cost: '₹1.20 करोड़',
      status: 'in_progress',
      completionDate: 'नवंबर 2026 तक लक्षित',
      agency: 'राष्ट्रीय स्वास्थ्य मिशन (NHM)',
      image: '/images/assets/work_health_camp.jpg',
      description: '24x7 प्रसव केंद्र, अत्याधुनिक पैथोलॉजी लैब, 10-बेड वार्ड एवं चिकित्सक आवास का निर्माण कार्य प्रगति पर।'
    },
    {
      id: 'w4',
      title: 'इटावा सदर नगर निकाय एलईडी स्ट्रीट लाइट एवं हाईमास्ट स्थापना',
      category: 'विद्युतीकरण व प्रकाश',
      village: 'इटावा नगर',
      block: 'सदर',
      cost: '₹95 लाख',
      status: 'completed',
      completionDate: 'जुलाई 2026',
      agency: 'नगर पालिका परिषद इटावा',
      image: '/images/assets/work_street_lights.jpg',
      description: 'मुख्य मार्गों एवं आंतरिक चौराहों पर 1,500 एलईडी स्ट्रीट लाइट्स एवं 25 हाईमास्ट पोल स्थापित।'
    },
    {
      id: 'w5',
      title: 'सैफई एवं बकेवर ग्रामीण पेयजल पाइपलाइन व ओवरहेड टैंक',
      category: 'पेयजल एवं जल शोधन',
      village: 'सैफई',
      block: 'सैफई',
      cost: '₹3.40 करोड़',
      status: 'in_progress',
      completionDate: 'दिसंबर 2026 तक लक्षित',
      agency: 'जल निगम (ग्रामीण)',
      image: '/images/assets/work_rampur_road.jpg',
      description: '2.5 लाख लीटर क्षमता का ओवरहेड टैंक एवं 18 किमी भूमिगत पाइपलाइन बिछाने का कार्य अंतिम चरण में।'
    },
    {
      id: 'w6',
      title: 'तकरोई किसान बहुउद्देशीय ग्रामीण हाट एवं गोदाम शेड',
      category: 'कृषि एवं विपणन',
      village: 'तकरोई',
      block: 'इटावा सदर',
      cost: '₹60 लाख',
      status: 'sanctioned',
      completionDate: 'कार्य शीघ्र प्रारंभ',
      agency: 'मंडी समिति एवं ग्रामीण विकास',
      image: '/images/assets/work_health_camp.jpg',
      description: 'किसानों की उपज सुरक्षित रखने व स्थानीय हाट बाजार हेतु आधुनिक शेड, तौल केंद्र व विश्राम गृह स्वीकृत।'
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getDevelopmentWorks();
        if (res && res.success && res.works && res.works.length > 0) {
          setWorks(res.works);
        } else {
          setWorks(defaultWorks);
        }
      } catch (e) {
        setWorks(defaultWorks);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const villages = ['All', 'इटावा नगर', 'रामपुर', 'सैफई', 'बकेवर', 'तकरोई', 'पिलखर', 'जसवंतनगर', 'भरथना'];

  const filteredWorks = works.filter((w) => {
    const matchesStatus = selectedStatus === 'All' || w.status === selectedStatus;
    const matchesVillage = selectedVillage === 'All' || (w.village && w.village.includes(selectedVillage));
    const matchesSearch =
      !searchQuery ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.category && w.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.village && w.village.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesVillage && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'पूर्ण (Completed)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'in_progress':
        return { label: 'प्रगति पर (In Progress)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'sanctioned':
      default:
        return { label: 'स्वीकृत (Sanctioned)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
  };

  const handleShareWhatsApp = (item) => {
    const text = `*विकास कार्य: ${item.title}*\n\n📍 स्थान: ${item.village} (${item.block})\n💰 स्वीकृत लागत: ${item.cost}\n🏢 कार्यदायी संस्था: ${item.agency}\n— श्रीमती सरिता भदौरिया (सदर विधायक, इटावा 200)`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <FestivalBanner />
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigateToPublicPage('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all backdrop-blur-sm border border-white/30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← मुख्य पृष्ठ पर वापस जाएं</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <button onClick={() => navigateToPublicPage('home')} className="hover:underline flex items-center gap-1 cursor-pointer">
                <Home className="w-3.5 h-3.5" /> मुख्य पृष्ठ
              </button>
              <span>/</span>
              <span className="text-white font-semibold">विकास कार्य एवं परियोजनाएं</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-sm">
              <Building className="w-3.5 h-3.5" /> क्षेत्र विकास प्रगति रिपोर्ट
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
              इटावा विधानसभा क्षेत्र में संचालित विकास कार्य एवं स्वीकृत परियोजनाएं
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              सड़क, शिक्षा, स्वास्थ्य, पेयजल एवं विद्युतीकरण के क्षेत्र में विधायक निधि एवं राज्य/केंद्रीय बजट से स्वीकृत समस्त विकास कार्यों की पारदर्शी स्थिति।
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-5 mb-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="परियोजना, सड़क या गांव खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputButton
                  onTranscript={(text) => setSearchQuery((prev) => (prev ? `${prev} ${text}` : text))}
                  className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                />
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {[
                { key: 'All', label: 'सभी कार्य' },
                { key: 'completed', label: 'पूर्ण कार्य' },
                { key: 'in_progress', label: 'प्रगति पर' },
                { key: 'sanctioned', label: 'स्वीकृत' }
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => setSelectedStatus(st.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedStatus === st.key
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Village Dropdown */}
            <div className="w-full md:w-auto">
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full md:w-44 px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white"
              >
                {villages.map((v) => (
                  <option key={v} value={v}>
                    {v === 'All' ? 'समस्त गांव / क्षेत्र' : v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-sm font-medium">
            कुल <span className="font-bold text-emerald-700">{filteredWorks.length}</span> विकास कार्य प्रदर्शित
          </p>
          <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            लोक निर्माण एवं जन कल्याण
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((item) => {
            const statusInfo = getStatusBadge(item.status);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image with status badge */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        {item.village}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">लागत / बजट</span>
                        <p className="font-black text-slate-900">{item.cost}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">कार्यदायी संस्था</span>
                        <p className="font-bold text-slate-700 truncate">{item.agency}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.completionDate}
                  </span>

                  <button
                    onClick={() => handleShareWhatsApp(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Home CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateToPublicPage('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
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
