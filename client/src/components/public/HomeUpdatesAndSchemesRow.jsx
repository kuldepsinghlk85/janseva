import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  ArrowRight,
  MapPin,
  Calendar,
  Home,
  Flame,
  Droplets,
  HeartPulse,
  Users,
  Car,
  ChevronRight,
  Sparkles,
  Share2
} from 'lucide-react';


export default function HomeUpdatesAndSchemesRow({ activities = [], onSelectActivity }) {
  const { navigateToPublicPage } = useApp();
  const [selectedPill, setSelectedPill] = useState('All');

  const pills = [
    { key: 'All', label: 'सभी' },
    { key: 'विकास कार्य', label: 'विकास कार्य' },
    { key: 'जनसंवाद', label: 'जनसंवाद' },
    { key: 'योजनाएं', label: 'योजनाएं' },
    { key: 'मीडिया', label: 'मीडिया' },
    { key: 'वीडियो', label: 'वीडियो' },
    { key: 'फोटो', label: 'फोटो' }
  ];

  // Default fallback 4 cards exactly matching the image
  const defaultUpdates = [
    {
      id: 1,
      date: '15 सितंबर 2026',
      title: 'ग्राम रामपुर में सड़क निर्माण कार्य का निरीक्षण',
      category: 'सड़क',
      village: 'रामपुर, इटावा',
      image: '/images/assets/work_rampur_road.jpg',
      shortDescription: 'रामपुर-वैदपुरा नवनिर्मित डामरीकृत संपर्क मार्ग का स्थलीय निरीक्षण कर गुणवत्ता की जांच की गई।'
    },
    {
      id: 2,
      date: '14 सितंबर 2026',
      title: 'विद्यालय परिसर में बच्चों से संवाद',
      category: 'शिक्षा',
      village: 'भरथना, इटावा',
      image: '/images/assets/work_school_children.jpg',
      shortDescription: 'प्राथमिक विद्यालय में ऑपरेशन कायाकल्प के अंतर्गत बच्चों से संवाद व पाठ्य सामग्री वितरण।'
    },
    {
      id: 3,
      date: '12 सितंबर 2026',
      title: 'महिला स्वयं सहायता समूह के साथ बैठक',
      category: 'महिला सशक्तिकरण',
      village: 'सैफई, इटावा',
      image: '/images/assets/work_health_camp.jpg',
      shortDescription: 'ग्रामीण महिलाओं के आर्थिक स्वावलंबन व आजीविका संवर्धन हेतु समीक्षा बैठक संपन्न।'
    },
    {
      id: 4,
      date: '10 सितंबर 2026',
      title: 'स्वास्थ्य शिविर का शुभारंभ',
      category: 'स्वास्थ्य',
      village: 'जसवंतनगर, इटावा',
      image: '/images/assets/work_street_lights.jpg',
      shortDescription: 'मुफ्त स्वास्थ्य जांच एवं दवा वितरण शिविर का विधिवत उद्घाटन कर जन-जन को स्वास्थ्य लाभ दिया।'
    }
  ];

  // Use dynamic activities if available, normalized to 4 items
  const displayUpdates = (activities && activities.length >= 4)
    ? activities.slice(0, 4).map((a, idx) => ({
        id: a.id,
        date: a.date || defaultUpdates[idx].date,
        title: a.title || defaultUpdates[idx].title,
        category: a.categoryHi || a.category || defaultUpdates[idx].category,
        village: (a.location?.village ? `${a.location.village}, इटावा` : defaultUpdates[idx].village),
        image: (Array.isArray(a.images) && a.images.length) ? a.images[0] : defaultUpdates[idx].image,
        shortDescription: a.shortDescription || a.title,
        raw: a
      }))
    : defaultUpdates;

  // 6 Important Government Schemes matching Image
  const schemesList = [
    {
      id: 'pmay',
      name: 'प्रधानमंत्री आवास योजना',
      icon: Home,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'ujjwala',
      name: 'उज्ज्वला योजना',
      icon: Flame,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'jaljeevan',
      name: 'जल जीवन मिशन',
      icon: Droplets,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
    },
    {
      id: 'ayushman',
      name: 'आयुष्मान भारत',
      icon: HeartPulse,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'pmkisan',
      name: 'PM किसान सम्मान निधि',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'transport',
      name: 'सड़क परिवहन और अवसंरचना',
      icon: Car,
      color: 'text-slate-700 bg-slate-100 border-slate-200'
    }
  ];

  return (
    <section className="py-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: ताजा अपडेट (8 cols on desktop) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header with Title, Category Pills & "और देखें" */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    ताजा अपडेट
                  </h3>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {pills.map((pill) => (
                      <button
                        key={pill.key}
                        onClick={() => setSelectedPill(pill.key)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          selectedPill === pill.key
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigateToPublicPage('timeline')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>और देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Photo Cards in a Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {displayUpdates.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectActivity && onSelectActivity(item.raw || item)}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-3 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {item.date}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    {/* Bottom pill & location */}
                    <div className="p-3 pt-0 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 flex-shrink-0">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5 truncate">
                          <MapPin className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />
                          <span className="truncate">{item.village}</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const text = `*${item.title}*\n📍 ${item.village} | 📅 ${item.date}\n\nकार्यालय विधायक श्रीमती सरिता भदौरिया (इटावा 200)\nपूरी जानकारी देखें: ${window.location.origin}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                          api.trackShare('WhatsApp', 'activity', item.id, item.title);
                        }}
                        className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer flex-shrink-0"
                        title="व्हाट्सएप पर शेयर करें"
                      >
                        <Share2 className="w-3 h-3 text-emerald-600" />
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => navigateToPublicPage('timeline')}
                className="text-xs font-bold text-slate-700 hover:text-orange-600 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>सभी विकास यात्रा व दैनिक गतिविधियों का नया पन्ना खोलें →</span>
              </button>
            </div>
          </div>

          {/* RIGHT: महत्वपूर्ण सरकारी योजनाएं (4 cols on desktop) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  महत्वपूर्ण सरकारी योजनाएं
                </h3>
                <button
                  onClick={() => navigateToPublicPage('schemes')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>और देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 6 Schemes in 2x3 Grid */}
              <div className="grid grid-cols-3 gap-3">
                {schemesList.map((sc) => {
                  const Icon = sc.icon;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => navigateToPublicPage('schemes')}
                      className="bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col items-center text-center justify-center space-y-2 group hover:border-orange-300 hover:shadow-md transition cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${sc.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-snug line-clamp-2">
                        {sc.name}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => navigateToPublicPage('schemes')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
              >
                <span>सभी योजनाएं देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
