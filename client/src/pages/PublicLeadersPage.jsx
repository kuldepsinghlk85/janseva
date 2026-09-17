import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ministersData } from '../data/ministersData';
import Navbar from '../components/public/Navbar';
import FestivalBanner from '../components/public/FestivalBanner';
import FooterPanorama from '../components/public/FooterPanorama';
import VoiceInputButton from '../components/common/VoiceInputButton';
import {
  ArrowLeft,
  Search,
  Share2,
  Heart,
  MessageCircle,
  Repeat2,
  ExternalLink,
  Sparkles,
  Home,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function PublicLeadersPage() {
  const { navigateToPublicPage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const categories = [
    { key: 'All', label: 'सभी नेतृत्व' },
    { key: 'modi', label: 'प्रधानमंत्री मोदी' },
    { key: 'yogi', label: 'मुख्यमंत्री योगी' },
    { key: 'central', label: 'केंद्रीय मंत्री' },
    { key: 'state', label: 'उप-मुख्यमंत्री (उ.प्र.)' },
    { key: 'party', label: 'संगठन नेतृत्व' }
  ];

  const filteredLeaders = ministersData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.handle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareWhatsApp = (item) => {
    const text = `*${item.author} (${item.role})*:\n"${item.text}"\n\nपूरी पोस्ट देखें: ${item.postUrl || window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = (item) => {
    const url = item.postUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <FestivalBanner />
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigateToPublicPage('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all backdrop-blur-sm border border-white/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← मुख्य पृष्ठ पर वापस जाएं</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-orange-100">
              <button onClick={() => navigateToPublicPage('home')} className="hover:underline flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> मुख्य पृष्ठ
              </button>
              <span>/</span>
              <span className="text-white font-semibold">मंत्रियों एवं वरिष्ठ नेतृत्व के संदेश</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-orange-100 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-sm">
              <Users className="w-3.5 h-3.5" /> प्रेरणास्रोत एवं वरिष्ठ नेतृत्व
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
              मंत्रियों एवं वरिष्ठ नेतृत्व के सोशल मीडिया संदेश
            </h1>
            <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
              आदरणीय प्रधानमंत्री जी, मुख्यमंत्री जी एवं केंद्र व राज्य के शीर्ष मंत्रियों के आधिकारिक संदेश, नीतियां एवं राष्ट्र/प्रदेश हित में लिए गए महत्वपूर्ण निर्णय।
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-5 mb-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input with Voice typing */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="नेता, मंत्री या विषय खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputButton
                  onTranscript={(text) => setSearchQuery((prev) => (prev ? `${prev} ${text}` : text))}
                  className="p-1 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === c.key
                      ? 'bg-orange-600 text-white shadow-md'
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

      {/* Main Grid of Minister Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-sm font-medium">
            कुल <span className="font-bold text-orange-600">{filteredLeaders.length}</span> प्रमुख नेताओं के संदेश उपलब्ध हैं
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500">आधिकारिक स्रोत से प्रमाणित</span>
          </div>
        </div>

        {filteredLeaders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-base mb-2">कोई संदेश प्राप्त नहीं हुआ</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-orange-600 text-sm font-semibold hover:underline"
            >
              सभी फिल्टर हटाएं
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLeaders.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Header with Avatar & Name */}
                <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-orange-50/40 via-white to-amber-50/20">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 shadow-sm flex-shrink-0"
                      onError={(e) => {
                        e.target.src = '/images/assets/modi_portrait.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-orange-600 transition-colors">
                          {item.author}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.role}</p>
                      <span className="text-[11px] text-orange-600 font-medium">{item.handle}</span>
                    </div>
                  </div>
                </div>

                {/* Post Image (if available) */}
                {item.image && (
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.author}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                      {item.date || 'हालिया'}
                    </div>
                  </div>
                )}

                {/* Post Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-4 mb-4">
                    "{item.text}"
                  </p>

                  {/* Social Metrics */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs mb-3">
                    <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="w-3.5 h-3.5 text-red-400" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                      <span>{item.comments}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-green-500 transition-colors">
                      <Repeat2 className="w-3.5 h-3.5 text-green-500" />
                      <span>{item.shares}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                      title="मूल पोस्ट देखें"
                    >
                      <span>पोस्ट</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleShareWhatsApp(item)}
                      className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors border border-emerald-200"
                      title="व्हाट्सएप पर शेयर करें"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>शेयर</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(item)}
                      className="inline-flex items-center justify-center px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                      title="लिंक कॉपी करें"
                    >
                      {copiedId === item.id ? 'कॉपी हुआ!' : 'कॉपी'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Home CTA bottom */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateToPublicPage('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
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
