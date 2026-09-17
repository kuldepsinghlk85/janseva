import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { ministersData } from '../../data/ministersData';

import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Clock
} from 'lucide-react';

export default function HomeActivitiesAndMinistersSection({ activities = [], onSelectActivity }) {
  const { navigateToPublicPage, showToast } = useApp();

  // Pick exactly 2 latest activities as requested ("केवल दो खबरें")
  const defaultActivities = [
    {
      id: 1,
      title: 'इटावा सदर नवीन जन-सुविधा केंद्र लोकार्पण',
      category: 'लोकार्पण',
      categoryEn: 'Inauguration',
      date: '2026-09-16',
      time: '10:00 AM',
      location: { village: 'इटावा सदर', district: 'इटावा' },
      shortDescription: 'इटावा सदर में अत्याधुनिक जन-सुविधा केंद्र का वैदिक मंत्रोच्चार के साथ भव्य उद्घाटन संपन्न। नागरिकों को एक ही छत के नीचे प्रमाण पत्र व जनसेवाएं प्राप्त होंगी।',
      images: ['/images/assets/work_school_children.jpg'],
      tags: ['#Inauguration', '#Etawah', '#JanSeva']
    },
    {
      id: 2,
      title: 'ग्राम रामपुर से वैदपुरा 8.5 किमी नवनिर्मित संपर्क मार्ग का भव्य लोकार्पण',
      category: 'लोकार्पण',
      categoryEn: 'Inauguration',
      date: '2026-09-16',
      time: '11:30 AM',
      location: { village: 'रामपुर', district: 'इटावा' },
      shortDescription: 'विधायक श्रीमती सरिता भदौरिया द्वारा रामपुर-वैदपुरा डामरीकृत संपर्क मार्ग का लोकार्पण। ₹1.85 करोड़ की लागत से बना यह मार्ग 12 गांवों को जोड़ेगा।',
      images: ['/images/assets/work_rampur_road.jpg'],
      tags: ['#Road', '#Development', '#Rampur']
    }
  ];

  const displayActivities = (activities && activities.length >= 2) 
    ? activities.slice(0, 2) 
    : (activities && activities.length === 1) 
      ? [activities[0], defaultActivities[1]] 
      : defaultActivities;

  // Ministers Carousel: Exactly 2 links/cards sliding at a time ("एक स्लाइड के रूप में दो लिंक चलते रहें")
  const totalSlides = Math.ceil(ministersData.length / 2);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const currentMinisters = ministersData.slice(currentSlide * 2, currentSlide * 2 + 2);

  const handleWhatsAppShare = (act) => {
    const text = `*${act.title}*\n\n${act.shortDescription || ''}\n\n📍 स्थान: ${act.location?.village || 'इटावा'}, दिनांक: ${act.date}\n— कार्यालय श्रीमती सरिता भदौरिया (सदर विधायक, इटावा 200)\nवेबसाइट: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    api.trackShare('WhatsApp', 'activity', act.id, act.title);
  };


  const handleCopyLink = (act) => {
    const text = `${window.location.origin}/#timeline-page`;
    navigator.clipboard.writeText(text);
    setCopiedId(act.id);
    if (showToast) showToast('गतिविधि लिंक कॉपी हो गया!', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'लोकार्पण':
      case 'Inauguration':
        return 'bg-emerald-600 text-white';
      case 'शिलान्यास':
      case 'Foundation Stone':
        return 'bg-orange-600 text-white';
      case 'निरीक्षण':
      case 'Inspection':
        return 'bg-amber-500 text-white';
      case 'जनसंवाद चौपाल':
      case 'Public Meeting':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <section className="py-10 sm:py-12 bg-gradient-to-b from-white via-slate-50/50 to-orange-50/20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Combined Single Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ============================================================ */}
          {/* COLUMN 1: केवल दो खबरें / विकास गतिविधियां (Activities Side) */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                      ताज़ा विकास गतिविधियां (Latest 2 Updates)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    इटावा विकास यात्रा समाचार
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    विधानसभा क्षेत्र के 2 नवीनतम विकास एवं जनसंवाद कार्य
                  </p>
                </div>

                {/* 'More' Button to open dedicated Timeline Page */}
                <button
                  onClick={() => navigateToPublicPage('timeline')}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 text-xs font-black transition flex items-center gap-1 shadow-xs cursor-pointer flex-shrink-0"
                  title="विकास यात्रा टाइमलाइन का पूरा विवरण नए पन्ने पर देखें"
                >
                  <span>और देखें (More)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* The 2 Activities List */}
              <div className="space-y-4 pt-4">
                {displayActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-orange-200 hover:shadow-sm transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${getCategoryBadgeClass(act.category || act.categoryEn)}`}>
                            {act.category || 'लोकार्पण'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-orange-500" />
                            {act.date} {act.time ? `• ${act.time}` : ''}
                          </span>
                          {act.location?.village && (
                            <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-500" />
                              {act.location.village}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => onSelectActivity && onSelectActivity(act)}
                          className="text-sm sm:text-base font-black text-slate-900 hover:text-orange-600 transition cursor-pointer leading-snug"
                        >
                          {act.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {act.shortDescription || act.fullDescription}
                        </p>
                      </div>

                      {/* Thumbnail Image */}
                      {act.images && act.images.length > 0 && (
                        <div
                          onClick={() => onSelectActivity && onSelectActivity(act)}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-200 cursor-pointer shadow-xs group"
                        >
                          <img
                            src={act.images[0]}
                            alt={act.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons Bar */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectActivity && onSelectActivity(act)}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>पूरी जानकारी</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleWhatsAppShare(act)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                          title="व्हाट्सएप पर शेयर करें"
                        >
                          <Share2 className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => handleCopyLink(act)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                          title="लिंक कॉपी करें"
                        >
                          {copiedId === act.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Link to Full Page */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => navigateToPublicPage('timeline')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow cursor-pointer"
              >
                <span>समस्त विकास टाइमलाइन का पूरा विवरण नए पन्ने पर देखें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* COLUMN 2: हमारे मंत्री की स्लाइड के रूप में दो लिंक चलते रहें */}
          {/* ============================================================ */}
          <div
            className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                      नेतृत्व एवं मंत्री सोशल अपडेट (Sliding 2 Links)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    हमारे बड़े नेता व मंत्री
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    देश व प्रदेश के शीर्ष नेतृत्व के महत्वपूर्ण विचार व मार्गदर्शन
                  </p>
                </div>

                {/* 'More' Button to open dedicated Leaders Page */}
                <button
                  onClick={() => navigateToPublicPage('leaders')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-black transition flex items-center gap-1 shadow-xs cursor-pointer flex-shrink-0"
                  title="मंत्रियों के सभी सोशल मीडिया लिंक नए पन्ने पर देखें"
                >
                  <span>और देखें (More)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Slider / Carousel with 2 links/cards visible at a time */}
              <div className="relative pt-4 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn transition-all duration-500">
                  {currentMinisters.map((leader) => (
                    <div
                      key={leader.id}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-blue-200 hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                    >
                      <div>
                        {/* Leader Info Header */}
                        <div className="p-3 bg-white border-b border-slate-100 flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-orange-400 bg-slate-100 flex-shrink-0 shadow-xs">
                            <img
                              src={leader.avatar}
                              alt={leader.author}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => { e.target.src = '/images/assets/modi_portrait.jpg'; }}
                            />
                          </div>
                          <div className="overflow-hidden min-w-0">
                            <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1">
                              <span>{leader.author}</span>
                              <span className="text-[10px] text-blue-500">✓</span>
                            </div>
                            <div className="text-[10px] text-orange-700 font-semibold truncate">
                              {leader.role || leader.handle}
                            </div>
                          </div>
                        </div>

                        {/* Image / Graphic */}
                        {leader.image && (
                          <div className="aspect-[16/10] bg-slate-200 overflow-hidden relative">
                            <img
                              src={leader.image}
                              alt="Post graphic"
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/images/assets/social_rally.jpg'; }}
                            />
                            <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold rounded-md">
                              {leader.date || 'हालिया'}
                            </span>
                          </div>
                        )}

                        {/* Quote / Message */}
                        <div className="p-3">
                          <p className="text-xs text-slate-800 font-medium leading-relaxed line-clamp-3">
                            "{leader.text}"
                          </p>
                        </div>
                      </div>

                      {/* Footer: Metrics & Direct Link */}
                      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <div className="flex items-center space-x-2.5 text-[11px]">
                          <span className="flex items-center gap-0.5 text-rose-600">
                            <Heart className="w-3 h-3 fill-rose-600" />
                            {leader.likes}
                          </span>
                          <span className="flex items-center gap-0.5 text-blue-600">
                            <MessageCircle className="w-3 h-3" />
                            {leader.comments}
                          </span>
                        </div>

                        <a
                          href={leader.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 hover:underline"
                        >
                          <span>पोस्ट देखें</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider Controls (Prev, Next, Indicators) */}
                <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? 'w-5 bg-blue-600' : 'w-2 bg-slate-200'
                        }`}
                        title={`स्लाइड ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handlePrevSlide}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                      title="पिछली स्लाइड"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-500 px-1">
                      {currentSlide + 1} / {totalSlides}
                    </span>
                    <button
                      onClick={handleNextSlide}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                      title="अगली स्लाइड"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Link to Full Page */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => navigateToPublicPage('leaders')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow cursor-pointer"
              >
                <span>सभी मंत्रियों के सोशल मीडिया लिंक नए पन्ने पर देखें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
