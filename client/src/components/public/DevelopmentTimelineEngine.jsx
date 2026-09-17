import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  Eye,
  Share2,
  Filter,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import ShareButtons from './ShareButtons';
import VoiceInputButton from '../common/VoiceInputButton';

export default function DevelopmentTimelineEngine({ activities = [], onSelectActivity, activeTag, onTagClick }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(6);

  const categories = [
    { key: 'All', labelHi: 'सभी गतिविधियां' },
    { key: 'Inauguration', labelHi: 'लोकार्पण' },
    { key: 'Foundation Stone', labelHi: 'शिलान्यास' },
    { key: 'Inspection', labelHi: 'निरीक्षण' },
    { key: 'Public Meeting', labelHi: 'जनसंवाद चौपाल' },
    { key: 'Government Scheme', labelHi: 'सरकारी योजना' },
    { key: 'Village Visit', labelHi: 'ग्राम भ्रमण' }
  ];

  const categoryLabels = {
    Inauguration: 'लोकार्पण',
    'Foundation Stone': 'शिलान्यास',
    Inspection: 'निरीक्षण',
    'Public Meeting': 'जनसंवाद चौपाल',
    'Development Work': 'विकास कार्य',
    'Government Scheme': 'सरकारी योजना',
    'Village Visit': 'ग्राम भ्रमण',
    'Grievance Redressal': 'जनसुनवाई',
    Other: 'अन्य'
  };

  // Filter activities
  const filtered = activities.filter((item) => {
    if (item.status === 'draft') return false;

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesTag = !activeTag || (item.tags && item.tags.includes(activeTag));
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location?.village && item.location.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesTag && matchesSearch;
  });

  const displayedList = filtered.slice(0, displayCount);

  return (
    <section id="development-journey" className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-white to-orange-50/30 border-t border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>विधानसभा क्षेत्र 200 - इटावा</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              विकास यात्रा टाइमलाइन
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
              इटावा सदर विधानसभा क्षेत्र में प्रतिदिन हो रहे शिलान्यास, लोकार्पण, जनसंवाद व विकास कार्यों का कालक्रमानुसार जीवंत अभिलेख।
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-72 relative flex items-center">
            <input
              type="text"
              placeholder="गतिविधि या गांव का नाम खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <VoiceInputButton
                onTranscript={(text) => setSearchQuery(text)}
                mode="replace"
                buttonTitle="बोलकर खोजें"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === c.key
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.labelHi}
            </button>
          ))}

          {activeTag && (
            <button
              onClick={() => onTagClick && onTagClick(null)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>टैग: #{activeTag}</span>
              <span className="text-xs font-black ml-1">✕</span>
            </button>
          )}
        </div>

        {/* Timeline Engine Body */}
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">इस श्रेणी में कोई जन-गतिविधि उपलब्ध नहीं है।</p>
            <p className="text-xs text-slate-400">कृपया अन्य श्रेणी चुनें या खोज शब्द बदलें।</p>
          </div>
        ) : (
          <div className="relative">
            {/* Central / Left Spine Line for Timeline */}
            <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500 via-amber-400 to-orange-200 hidden sm:block"></div>

            <div className="space-y-6">
              {displayedList.map((item, idx) => {
                const img = Array.isArray(item.images) && item.images.length
                  ? item.images[0]
                  : '/images/assets/work_rampur_road.jpg';

                const catLabel = item.categoryHi || categoryLabels[item.category] || item.category;

                return (
                  <div
                    key={item.id || idx}
                    className="relative sm:pl-16 group"
                  >
                    {/* Node Dot on Timeline */}
                    <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-white border-4 border-orange-500 shadow-md hidden sm:block group-hover:scale-125 group-hover:border-orange-600 transition-all z-10"></div>

                    {/* Timeline Item Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col md:flex-row gap-5 items-start md:items-center">
                      
                      {/* Image Thumbnail */}
                      <div className="w-full md:w-56 flex-shrink-0">
                        <div
                          onClick={() => onSelectActivity && onSelectActivity(item)}
                          className="relative aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow cursor-pointer group-hover:scale-[1.02] transition"
                        >
                          <img
                            src={img}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-600 text-white shadow">
                              {catLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 space-y-2.5 min-w-0">
                        
                        {/* Meta: Date & Location */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-md">
                            <Calendar className="w-3.5 h-3.5 text-orange-600" />
                            {item.date} {item.time ? `• ${item.time}` : ''}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                            {item.location?.village || 'इटावा'}, {item.location?.district || 'इटावा'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => onSelectActivity && onSelectActivity(item)}
                          className="text-base sm:text-lg font-black text-slate-900 group-hover:text-orange-600 transition cursor-pointer leading-snug line-clamp-2"
                        >
                          {item.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {item.shortDescription || item.fullDescription}
                        </p>

                        {/* Tags Strip */}
                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.tags.map((t, tIdx) => (
                              <button
                                key={tIdx}
                                onClick={() => onTagClick && onTagClick(t)}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-800 transition cursor-pointer"
                              >
                                <Tag className="w-2.5 h-2.5 opacity-70" />
                                <span>{t}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Right Side */}
                      <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                        <button
                          onClick={() => onSelectActivity && onSelectActivity(item)}
                          className="inline-flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition cursor-pointer"
                        >
                          <span>पूरी जानकारी</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <ShareButtons
                          title={item.title}
                          shortDescription={item.shortDescription}
                          location={item.location?.village || 'इटावा'}
                          date={item.date}
                        />
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {filtered.length > displayCount && (
          <div className="text-center pt-4">
            <button
              onClick={() => setDisplayCount((prev) => prev + 6)}
              className="px-6 py-2.5 rounded-2xl bg-white border border-slate-300 hover:border-orange-500 text-slate-700 hover:text-orange-600 text-xs font-black shadow-sm transition cursor-pointer"
            >
              और गतिविधियां देखें ({filtered.length - displayCount} और शेष)
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
