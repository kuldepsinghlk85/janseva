import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import Navbar from '../components/public/Navbar';
import FestivalBanner from '../components/public/FestivalBanner';
import FooterPanorama from '../components/public/FooterPanorama';
import ActivityDetailModal from '../components/public/ActivityDetailModal';
import VoiceInputButton from '../components/common/VoiceInputButton';
import ShareButtons from '../components/public/ShareButtons';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Search,
  Filter,
  Eye,
  Share2,
  Tag,
  CheckCircle2,
  ChevronRight,
  Home
} from 'lucide-react';

export default function PublicTimelinePage() {
  const { navigateToPublicPage } = useApp();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getActivities();
        if (res && res.success) {
          setActivities(res.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = [
    { key: 'All', labelHi: 'सभी गतिविधियां' },
    { key: 'Inauguration', labelHi: 'लोकार्पण' },
    { key: 'Foundation Stone', labelHi: 'शिलान्यास' },
    { key: 'Inspection', labelHi: 'निरीक्षण' },
    { key: 'Public Meeting', labelHi: 'जनसंवाद चौपाल' },
    { key: 'Government Scheme', labelHi: 'सरकारी योजना' },
    { key: 'Village Visit', labelHi: 'ग्राम भ्रमण' }
  ];

  const villages = ['All', 'इटावा सदर', 'रामपुर', 'सैफई', 'बकेवर', 'तकरोई', 'पिलखर', 'जसवंतनगर', 'भरथना'];

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Inauguration':
      case 'लोकार्पण':
        return { label: 'लोकार्पण', color: 'bg-emerald-600 text-white' };
      case 'Foundation Stone':
      case 'शिलान्यास':
        return { label: 'शिलान्यास', color: 'bg-orange-600 text-white' };
      case 'Inspection':
      case 'निरीक्षण':
        return { label: 'निरीक्षण', color: 'bg-amber-500 text-white' };
      case 'Public Meeting':
      case 'जनसंवाद चौपाल':
        return { label: 'जनसंवाद चौपाल', color: 'bg-blue-600 text-white' };
      case 'Government Scheme':
      case 'सरकारी योजना':
        return { label: 'सरकारी योजना', color: 'bg-indigo-600 text-white' };
      case 'Village Visit':
      case 'ग्राम भ्रमण':
        return { label: 'ग्राम भ्रमण', color: 'bg-purple-600 text-white' };
      default:
        return { label: cat || 'गतिविधि', color: 'bg-slate-700 text-white' };
    }
  };

  const filtered = activities.filter((item) => {
    if (item.status === 'draft') return false;

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory || item.categoryHi === selectedCategory;
    const matchesVillage = selectedVillage === 'All' || (item.location?.village && item.location.village.includes(selectedVillage));
    const matchesTag = !activeTag || (item.tags && item.tags.includes(activeTag));
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location?.village && item.location.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.fullDescription && item.fullDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesVillage && matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <FestivalBanner />

      <main className="flex-1 pb-16">
        {/* Page Top Navigation Banner */}
        <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <button
              onClick={() => navigateToPublicPage('home')}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 text-xs font-black transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← मुख्य पृष्ठ पर वापस जाएं</span>
            </button>

            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <span onClick={() => navigateToPublicPage('home')} className="hover:text-orange-600 cursor-pointer flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span>होम</span>
              </span>
              <span>/</span>
              <span className="text-orange-600 font-bold">विकास यात्रा टाइमलाइन (पूर्ण विवरण)</span>
            </div>
          </div>
        </div>

        {/* Header Hero */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-10 px-4 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>विधानसभा क्षेत्र 200 - इटावा | दैनिक जन-गतिविधि इंजन</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              इटावा विकास यात्रा टाइमलाइन (सम्पूर्ण विवरण)
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 max-w-3xl leading-relaxed">
              सदर विधानसभा क्षेत्र में विधायक श्रीमती सरिता भदौरिया द्वारा प्रतिदिन संपन्न हो रहे लोकार्पण, शिलान्यास, जनसंवाद चौपाल, निरीक्षण एवं जनहित विकास कार्यों का आधिकारिक कालक्रमानुसार अभिलेख।
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-6">
          {/* Controls Bar: Search & Village Dropdown */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search with Voice Input */}
            <div className="w-full md:w-96 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="गतिविधि, सड़क, स्कूल या गांव खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <div className="absolute right-2">
                <VoiceInputButton
                  onTranscript={(text) => setSearchQuery(text)}
                  mode="replace"
                  buttonTitle="बोलकर खोजें"
                  size="sm"
                />
              </div>
            </div>

            {/* Village Filter */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">गाँव / क्षेत्र:</span>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-orange-500 outline-none"
              >
                {villages.map((v) => (
                  <option key={v} value={v}>
                    {v === 'All' ? 'सभी गाँव / क्षेत्र' : v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills (Matching media_1789502905973.png) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${
                  selectedCategory === cat.key
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.labelHi}
              </button>
            ))}
          </div>

          {/* Active Tag indicator */}
          {activeTag && (
            <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl text-xs">
              <Tag className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-slate-700">टैग फ़िल्टर: <b className="text-orange-700">{activeTag}</b></span>
              <button
                onClick={() => setActiveTag(null)}
                className="text-orange-600 font-bold hover:underline ml-2"
              >
                हटाएं ✕
              </button>
            </div>
          )}

          {/* Timeline Feed Container (Matching media_1789502905973.png) */}
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-bold">विकास यात्रा डेटा लोड हो रहा है...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="text-3xl">🔍</div>
              <h3 className="text-base font-bold text-slate-800">कोई गतिविधि नहीं मिली</h3>
              <p className="text-xs text-slate-500">कृपया खोज शब्द या फ़िल्टर बदलकर पुनः प्रयास करें।</p>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-6">
              {/* Vertical Orange Timeline Line */}
              <div className="absolute top-4 bottom-4 left-2.5 sm:left-3.5 w-1 bg-gradient-to-b from-orange-500 via-amber-500 to-orange-400 rounded-full"></div>

              {filtered.map((item, idx) => {
                const badge = getCategoryBadge(item.category || item.categoryHi);
                return (
                  <div key={item.id || idx} className="relative group">
                    {/* Circle on Timeline */}
                    <div className="absolute -left-6 sm:-left-8 top-6 w-5 h-5 rounded-full bg-white border-4 border-orange-500 shadow-md group-hover:scale-125 transition"></div>

                    {/* Timeline Card */}
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {/* Thumbnail Image */}
                        {item.images && item.images.length > 0 && (
                          <div
                            onClick={() => setSelectedActivity(item)}
                            className="w-full md:w-56 aspect-[16/10] md:h-36 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100 cursor-pointer shadow-xs relative group"
                          >
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                            />
                            <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="font-bold text-slate-700 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-orange-600" />
                              {item.date} {item.time ? `• ${item.time}` : ''}
                            </span>
                            {item.location?.village && (
                              <span className="font-semibold text-slate-600 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-red-500" />
                                {item.location.village}, {item.location.district || 'इटावा'}
                              </span>
                            )}
                          </div>

                          <h2
                            onClick={() => setSelectedActivity(item)}
                            className="text-base sm:text-lg font-black text-slate-900 hover:text-orange-600 transition cursor-pointer leading-snug"
                          >
                            {item.title}
                          </h2>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                            {item.shortDescription || item.fullDescription}
                          </p>

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {item.tags.map((t, tidx) => (
                                <button
                                  key={tidx}
                                  onClick={() => setActiveTag(t)}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-700 transition"
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Bar (Matching media_1789502905973.png) */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedActivity(item)}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <span>पूरी जानकारी देखें</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <ShareButtons
                          title={item.title}
                          shortDescription={item.shortDescription}
                          location={item.location?.village}
                          date={item.date}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <FooterPanorama />

      {/* Auto-generated Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onTagClick={(tag) => {
          setActiveTag(tag);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
}
