import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Copy,
  Layers
} from 'lucide-react';
import ShareButtons from './ShareButtons';


export default function HomepageFeatureCard({ activities = [], activity, onReadMore }) {
  // Normalize activities array (supports both activities array and single activity prop)
  const items = Array.isArray(activities) && activities.length > 0
    ? activities
    : activity
      ? [activity]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const totalItems = items.length;

  // Auto-advance slider every 5 seconds if not paused and more than 1 activity
  useEffect(() => {
    if (totalItems <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalItems, isPaused]);

  // Keep index within bounds if list changes
  useEffect(() => {
    if (currentIndex >= totalItems && totalItems > 0) {
      setCurrentIndex(0);
    }
  }, [totalItems, currentIndex]);

  if (!items.length) return null;

  const current = items[currentIndex] || items[0];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const mainImage = Array.isArray(current.images) && current.images.length
    ? current.images[0]
    : '/images/assets/work_rampur_road.jpg';

  const categoryLabels = {
    Inauguration: 'लोकार्पण',
    Inspection: 'स्थलीय निरीक्षण',
    'Public Meeting': 'जनसंवाद चौपाल',
    'Development Work': 'विकास कार्य',
    'Government Scheme': 'सरकारी योजना',
    'Village Visit': 'ग्राम भ्रमण'
  };

  const categoryBadge = current.categoryHi || categoryLabels[current.category] || current.category || 'लोकार्पण';

  const handleShareWhatsApp = (e) => {
    e?.stopPropagation();
    const text = `*${current.title}*\n\n${current.shortDescription || ''}\n\n📍 स्थान: ${current.location?.village || 'इटावा'}, दिनांक: ${current.date}\n— कार्यालय श्रीमती सरिता भदौरिया (सदर विधायक, इटावा 200)\nवेबसाइट: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    api.trackShare('WhatsApp', 'activity', current.id, current.title);
  };


  const handleShareFacebook = (e) => {
    e?.stopPropagation();
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareTwitter = (e) => {
    e?.stopPropagation();
    const text = `${current.title} - विधायक श्रीमती सरिता भदौरिया (इटावा 200)`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleCopyLink = (e) => {
    e?.stopPropagation();
    const url = window.location.origin + '/#timeline-page';
    navigator.clipboard.writeText(url);
    setCopiedId(current.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div
      className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-y border-orange-200/80 py-4 sm:py-6 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar with Slider Counter & Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ताजा दैनिक जन-गतिविधि (LATEST MLA ACTIVITY)</span>
            </div>

            {totalItems > 1 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-orange-800 bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-300">
                <Layers className="w-3 h-3 text-orange-600" />
                <span>स्लाइड {currentIndex + 1} / {totalItems}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Slider Dots / Number Tabs (2 to 4 activities) */}
            {totalItems > 1 && (
              <div className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-orange-200 shadow-xs">
                {items.map((it, idx) => (
                  <button
                    key={it.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'bg-orange-600 text-white shadow-xs scale-105'
                        : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                    title={`स्लाइड #${idx + 1}: ${it.title}`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            )}

            <span className="text-xs font-bold text-slate-600 hidden md:inline">
              📍 {current.location?.village || 'इटावा नगर'} विधानसभा (200)
            </span>
          </div>
        </div>

        {/* Feature Slider Container */}
        <div className="relative bg-white rounded-3xl p-5 sm:p-6 border border-orange-200 shadow-xl transition-all duration-300 hover:border-orange-400">
          
          {/* Slider Prev Arrow */}
          {totalItems > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-orange-600 text-slate-700 hover:text-white shadow-lg border border-slate-200 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs group"
              title="पिछली गतिविधि"
            >
              <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {/* Slider Next Arrow */}
          {totalItems > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-orange-600 text-slate-700 hover:text-white shadow-lg border border-slate-200 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs group"
              title="अगली गतिविधि"
            >
              <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {/* Active Card Content */}
          <div className="flex flex-col lg:flex-row items-center gap-6 group">
            
            {/* Large Image on Left */}
            <div className="w-full lg:w-5/12 flex-shrink-0">
              <div
                onClick={() => onReadMore && onReadMore(current)}
                className="relative aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-md bg-slate-100 cursor-pointer"
              >
                <img
                  key={current.id}
                  src={mainImage}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 animate-fadeIn"
                  onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                />
                
                {/* Category Badge matching Image */}
                <div className="absolute top-3 left-3">
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-orange-600 text-white shadow-md">
                    {categoryBadge}
                  </span>
                </div>

                {/* Slide Number Badge */}
                {totalItems > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                    {currentIndex + 1} / {totalItems}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Content on Right */}
            <div className="w-full lg:w-7/12 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Date and Location Line */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    {current.date}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {current.location?.village || 'इटावा नगर'}, {current.location?.district || 'इटावा'}
                  </span>
                </div>

                {/* Big Title */}
                <h3
                  onClick={() => onReadMore && onReadMore(current)}
                  className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug hover:text-orange-600 transition cursor-pointer"
                >
                  {current.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {current.shortDescription || current.fullDescription}
                </p>
              </div>

              {/* Bottom Actions & Social Share Buttons matching image */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onReadMore && onReadMore(current)}
                  className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
                >
                  <span>पूरा विवरण पढ़ें (Read More)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Share Buttons: WhatsApp, Facebook, Twitter, Copy Link */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {/* WhatsApp */}
                  <button
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    title="व्हाट्सएप पर साझा करें"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={handleShareFacebook}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    title="फेसबुक पर साझा करें"
                  >
                    <span>f Facebook</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    onClick={handleShareTwitter}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    title="ट्विटर (X) पर साझा करें"
                  >
                    <span>𝕏 Twitter</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition cursor-pointer"
                    title="लिंक कॉपी करें"
                  >
                    {copiedId === current.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">कॉपी हुआ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>लिंक कॉपी</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Progress Indicators Bar at Bottom */}
          {totalItems > 1 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-8 bg-orange-600' : 'w-2 bg-slate-200 hover:bg-orange-300'
                    }`}
                    title={`स्लाइड ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {isPaused ? '⏸️ थमा हुआ (माउस ऊपर है)' : '▶️ 5 सेकंड में ऑटो-स्लाइड'}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
