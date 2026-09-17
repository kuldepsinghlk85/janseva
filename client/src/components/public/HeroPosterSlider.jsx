import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Maximize2,
  X,
  Sparkles,
  Download,
  Calendar,
  Check,
  Volume2
} from 'lucide-react';

export default function HeroPosterSlider() {
  const [posters, setPosters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomPoster, setZoomPoster] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sliderSettings, setSliderSettings] = useState({
    autoSlide: true,
    intervalSeconds: 4.5,
    maxVisible: 6,
    showOnHero: true
  });

  const timerRef = useRef(null);

  // Load posters from API
  useEffect(() => {
    let isMounted = true;
    const loadPosters = async () => {
      try {
        const res = await api.getHeroPosters();
        if (isMounted && res.success && Array.isArray(res.posters) && res.posters.length > 0) {
          setPosters(res.posters);
          if (res.settings) {
            setSliderSettings(prev => ({ ...prev, ...res.settings }));
          }
        }
      } catch (err) {
        console.error('Error fetching hero posters:', err);
      }
    };
    loadPosters();
    return () => { isMounted = false; };
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (!sliderSettings.autoSlide || isPaused || posters.length <= 1) return;

    const intervalMs = (sliderSettings.intervalSeconds || 4.5) * 1000;
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % posters.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [posters.length, isPaused, sliderSettings.autoSlide, sliderSettings.intervalSeconds]);

  if (posters.length === 0) {
    return null;
  }

  const currentPoster = posters[currentIndex] || posters[0];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + posters.length) % posters.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % posters.length);
  };

  const handleShareWhatsApp = (e, poster) => {
    e?.stopPropagation();
    const shareText = `*${poster.title}*\n${poster.subtitle || ''}\n${poster.caption || ''}\n\nमाननीया विधायक श्रीमती सरिता भदौरिया (इटावा 200) जनसेवा पोर्टल पर देखें:\n${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = (e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="relative w-full max-w-sm mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Card with subtle glow border */}
      <div className="relative rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md border-2 border-orange-200/90 shadow-xl hover:shadow-2xl transition duration-500 group">
        
        {/* Top Header Strip (Badge + Auto-slide progress counter) */}
        <div className="px-3.5 py-2 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"></span>
            <span className="tracking-wide">दैनिक पोस्टर व बुलेटिन</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-black/25 text-[10px] font-mono font-black">
              {String(currentIndex + 1).padStart(2, '0')} / {String(posters.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Main Poster Image Container (Aspect Ratio ~ 3:4 / 4:5 vertical) */}
        <div
          onClick={() => setZoomPoster(currentPoster)}
          className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-slate-900 cursor-pointer overflow-hidden select-none"
        >
          {posters.map((p, idx) => (
            <div
              key={p.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover object-top hover:scale-105 transition duration-700"
                onError={(e) => { e.target.src = '/images/poli3.png'; }}
              />

              {/* Subtle Gradient vignette on bottom for legibility */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none"></div>

              {/* Bottom Info Overlay on Poster */}
              <div className="absolute bottom-0 inset-x-0 p-3 text-white z-20">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-orange-500/90 text-white backdrop-blur-xs shadow-xs">
                    {p.category || 'विशेष बुलेटिन'}
                  </span>
                  {p.date && (
                    <span className="text-[10px] text-slate-200 font-semibold flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-orange-400" />
                      <span>{p.date}</span>
                    </span>
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-black line-clamp-1 leading-snug drop-shadow-md">
                  {p.title}
                </h4>
                {p.subtitle && (
                  <p className="text-[10px] text-orange-200 line-clamp-1 font-medium mt-0.5 drop-shadow-sm">
                    {p.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-xs transition opacity-70 hover:opacity-100 cursor-pointer active:scale-95 shadow-md"
            title="पिछला पोस्टर"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-xs transition opacity-70 hover:opacity-100 cursor-pointer active:scale-95 shadow-md"
            title="अगला पोस्टर"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Hover Overlay Zoom Button */}
          <div className="absolute top-2.5 right-2.5 z-30 opacity-0 group-hover:opacity-100 transition duration-300">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomPoster(currentPoster);
              }}
              className="p-2 rounded-xl bg-black/60 hover:bg-orange-600 text-white backdrop-blur-sm transition shadow-lg cursor-pointer"
              title="बड़ा करके देखें (Zoom)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Bar Beneath Poster */}
        <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          {/* Dot Indicators */}
          <div className="flex items-center space-x-1.5">
            {posters.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-5 h-2 bg-orange-600'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`पोस्टर ${idx + 1}`}
              />
            ))}
          </div>

          {/* Quick WhatsApp & Zoom Action */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={(e) => handleShareWhatsApp(e, currentPoster)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer"
              title="व्हाट्सएप पर शेयर करें"
            >
              <Share2 className="w-3 h-3" />
              <span>शेयर</span>
            </button>

            <button
              type="button"
              onClick={() => setZoomPoster(currentPoster)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-[11px] font-bold border border-slate-200 transition cursor-pointer"
              title="पूरा पोस्टर देखें"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">ज़ूम</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full-Size Poster View */}
      {zoomPoster && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-600 text-white">
                  {zoomPoster.category || 'आधिकारिक पोस्टर'}
                </span>
                <span className="text-xs sm:text-sm font-bold truncate max-w-xs sm:max-w-md">
                  {zoomPoster.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setZoomPoster(null)}
                className="p-1.5 rounded-full bg-slate-700 hover:bg-rose-600 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Poster Image */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center p-2 bg-black/40">
              <img
                src={zoomPoster.image}
                alt={zoomPoster.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Modal Footer with Actions */}
            <div className="px-4 py-3 bg-slate-800 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
              <p className="text-slate-300 text-[11px] font-medium max-w-sm">
                {zoomPoster.caption || zoomPoster.subtitle || 'विधायक श्रीमती सरिता भदौरिया, इटावा विधानसभा (200)'}
              </p>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => handleShareWhatsApp(e, zoomPoster)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>व्हाट्सएप शेयर</span>
                </button>

                <a
                  href={zoomPoster.image}
                  download={`etawah_mla_poster_${Date.now()}`}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>डाउनलोड</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
