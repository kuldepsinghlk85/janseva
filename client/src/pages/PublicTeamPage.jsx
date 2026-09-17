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
  Users,
  MapPin,
  Phone,
  Mail,
  Home,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function PublicTeamPage() {
  const { navigateToPublicPage } = useApp();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultTeam = [
    {
      id: 1,
      name: 'राजेश सिंह चौहान',
      role: 'कार्यालय प्रभारी एवं जनसंपर्क अधिकारी',
      category: 'office',
      categoryName: 'कार्यालय टीम',
      area: 'विधायक कार्यालय, इटावा',
      phone: '+91 94123 45678',
      image: '/images/assets/modi_portrait.jpg'
    },
    {
      id: 2,
      name: 'सुनील कुमार भदौरिया',
      role: 'मंडल संयोजक (इटावा सदर)',
      category: 'mandal',
      categoryName: 'मंडल संयोजक',
      area: 'इटावा नगर मंडल',
      phone: '+91 98370 12345',
      image: '/images/assets/bottom_leaders_trio.jpg'
    },
    {
      id: 3,
      name: 'श्रीमती अनीता देवी',
      role: 'महिला मोर्चा संयोजिका',
      category: 'women',
      categoryName: 'महिला मोर्चा',
      area: 'इटावा विधानसभा',
      phone: '+91 97580 98765',
      image: '/images/assets/sarita_bhadauria_hero.jpg'
    },
    {
      id: 4,
      name: 'विकास यादव',
      role: 'युवा मोर्चा अध्यक्ष',
      category: 'youth',
      categoryName: 'युवा मोर्चा',
      area: 'सदर विधानसभा क्षेत्र',
      phone: '+91 91490 54321',
      image: '/images/assets/work_school_children.jpg'
    },
    {
      id: 5,
      name: 'अमित कुमार सक्सेना',
      role: 'आईटी एवं सोशल मीडिया प्रभारी',
      category: 'it',
      categoryName: 'आईटी व डिजिटल सेल',
      area: 'डिजिटल मीडिया केंद्र',
      phone: '+91 96340 67890',
      image: '/images/assets/work_street_lights.jpg'
    },
    {
      id: 6,
      name: 'राघवेंद्र प्रताप सिंह',
      role: 'किसान कल्याण प्रकोष्ठ संयोजक',
      category: 'kisan',
      categoryName: 'किसान प्रकोष्ठ',
      area: 'रामपुर, सैफई ब्लॉक',
      phone: '+91 94560 11223',
      image: '/images/assets/work_rampur_road.jpg'
    },
    {
      id: 7,
      name: 'दिनेश चंद्र शर्मा',
      role: 'बूथ प्रबंधन समन्वयक',
      category: 'booth',
      categoryName: 'बूथ प्रबंधन',
      area: 'बकेवर एवं तकरोई सेक्टर',
      phone: '+91 98970 33445',
      image: '/images/assets/bottom_leaders_trio.jpg'
    },
    {
      id: 8,
      name: 'डॉ. मनीष कुमार',
      role: 'स्वास्थ्य एवं जनसुनवाई प्रकोष्ठ',
      category: 'office',
      categoryName: 'कार्यालय टीम',
      area: 'जनसेवा केंद्र, इटावा',
      phone: '+91 94110 55667',
      image: '/images/assets/work_health_camp.jpg'
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getTeam();
        if (res && res.success && res.team && res.team.length > 0) {
          setTeam(res.team);
        } else {
          setTeam(defaultTeam);
        }
      } catch (e) {
        setTeam(defaultTeam);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = [
    { key: 'All', label: 'सभी सदस्य' },
    { key: 'office', label: 'कार्यालय टीम' },
    { key: 'mandal', label: 'मंडल संयोजक' },
    { key: 'booth', label: 'बूथ प्रबंधन' },
    { key: 'youth', label: 'युवा मोर्चा' },
    { key: 'women', label: 'महिला मोर्चा' },
    { key: 'it', label: 'आईटी व डिजिटल' },
    { key: 'kisan', label: 'किसान प्रकोष्ठ' }
  ];

  const filteredTeam = team.filter((m) => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.area && m.area.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <FestivalBanner />
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigateToPublicPage('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all backdrop-blur-sm border border-white/30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← मुख्य पृष्ठ पर वापस जाएं</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-purple-200">
              <button onClick={() => navigateToPublicPage('home')} className="hover:underline flex items-center gap-1 cursor-pointer">
                <Home className="w-3.5 h-3.5" /> मुख्य पृष्ठ
              </button>
              <span>/</span>
              <span className="text-white font-semibold">हमारी टीम</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-purple-100 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-sm">
              <Users className="w-3.5 h-3.5" /> जनसेवा सारथी
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
              हमारी टीम – आपके लिए सदैव तत्पर
            </h1>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              विधायक कार्यालय, मंडल, वार्ड एवं ग्राम स्तर पर जनता की समस्याओं के त्वरित समाधान एवं सरकारी योजनाओं के क्रियान्वयन हेतु समर्पित कार्यकर्ता।
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
                placeholder="नाम, पद या क्षेत्र खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputButton
                  onTranscript={(text) => setSearchQuery((prev) => (prev ? `${prev} ${text}` : text))}
                  className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
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
                      ? 'bg-purple-600 text-white shadow-md'
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

      {/* Team Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-sm font-medium">
            कुल <span className="font-bold text-purple-700">{filteredTeam.length}</span> टीम सदस्य सूचीबद्ध हैं
          </p>
          <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            24x7 जनसेवा हेल्पलाइन
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTeam.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-center text-center group"
            >
              <div className="flex flex-col items-center w-full">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-200 p-0.5 bg-slate-50 shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <img
                    src={item.image || '/images/assets/bottom_leaders_trio.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => { e.target.src = '/images/assets/bottom_leaders_trio.jpg'; }}
                  />
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase mb-1">
                  {item.categoryName || 'टीम सदस्य'}
                </span>

                <h3 className="font-black text-slate-900 text-sm group-hover:text-purple-700 transition">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">
                  {item.role}
                </p>

                <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold mt-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{item.area}</span>
                </div>
              </div>

              {/* Bottom Contact / Call button */}
              <div className="w-full pt-4 border-t border-slate-100 mt-4">
                <a
                  href={`tel:${item.phone?.replace(/\s+/g, '')}`}
                  className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-purple-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{item.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateToPublicPage('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
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
