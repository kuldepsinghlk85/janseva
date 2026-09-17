import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, X, Eye, Video, Share2, Image as ImageIcon, Volume2, Check } from 'lucide-react';

export default function FestivalBanner() {
  const { settings } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const festival = settings?.festival;

  if (!festival || !festival.active || dismissed) return null;

  const getEmbedYoutube = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getEmbedYoutube(festival.videoUrl);
  const posterUrl = festival.bannerImage || festival.posterImage;

  const handleWhatsAppShare = () => {
    const text = `*${festival.title}*\n\n${festival.message || ''}\n\n${festival.fullMessage ? festival.fullMessage + '\n\n' : ''}— कार्यालय श्रीमती सरिता भदौरिया (विधायक, इटावा 200)\nवेबसाइट: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyShare = () => {
    const text = `${festival.title}\n\n${festival.message || ''}\n\n${festival.fullMessage ? festival.fullMessage + '\n\n' : ''}— कार्यालय श्रीमती सरिता भदौरिया (विधायक, इटावा 200)\nवेबसाइट: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-lg relative overflow-hidden border-b border-amber-400/40 animate-fadeIn">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-center md:text-left flex-1 min-w-0">
            {posterUrl ? (
              <div 
                onClick={() => setShowModal(true)}
                className="w-12 h-12 rounded-xl overflow-hidden shadow-inner border-2 border-white/40 flex-shrink-0 cursor-pointer hover:scale-105 transition transform relative group"
                title="पोस्टर देखें"
              >
                <img src={posterUrl} alt={festival.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-2xl shadow-inner border border-white/30">
                🪔
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest bg-white/30 px-2 py-0.5 rounded-full text-amber-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>विशेष पर्व शुभकामना</span>
                </span>
                {festival.startDate && (
                  <span className="text-[11px] text-orange-200 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3 h-3" />
                    {festival.startDate} {festival.endDate ? `से ${festival.endDate}` : ''}
                  </span>
                )}
                {festival.videoUrl && (
                  <span className="text-[10px] bg-red-700/80 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>वीडियो संदेश</span>
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-black tracking-tight mt-0.5 truncate">{festival.title}</h3>
              <p className="text-xs text-orange-100 max-w-3xl mt-0.5 line-clamp-1">{festival.message}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {(posterUrl || festival.videoUrl || festival.fullMessage) && (
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 text-xs font-black shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-orange-600" />
                <span>पोस्टर व वीडियो देखें</span>
              </button>
            )}

            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              title="व्हाट्सएप पर शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">शेयर करें</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
              title="बैनर छिपाएं"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Festival Detail Modal (Poster + Video + Message + Share) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-orange-100 overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 p-5 text-white relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-black tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-amber-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>त्यौहार व विशेष दिवस शुभकामना</span>
                </span>
                {festival.startDate && (
                  <span className="text-xs text-orange-200 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3 h-3" />
                    {festival.startDate} {festival.endDate ? `से ${festival.endDate}` : ''}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{festival.title}</h2>
              <p className="text-xs text-orange-100 mt-1 font-medium">कार्यालय श्रीमती सरिता भदौरिया (विधायक, इटावा सदर - 200)</p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Poster Image */}
              {posterUrl && (
                <div className="rounded-2xl overflow-hidden border border-orange-200 shadow-md bg-orange-50">
                  <div className="p-2 bg-orange-100/60 border-b border-orange-200 flex items-center justify-between text-xs font-bold text-orange-900">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                      विशेष पर्व पोस्टर
                    </span>
                    <a
                      href={posterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-700 hover:text-orange-900 underline text-[11px]"
                    >
                      पूर्ण आकार में देखें
                    </a>
                  </div>
                  <img
                    src={posterUrl}
                    alt={festival.title}
                    className="w-full max-h-96 object-contain bg-slate-900/5 mx-auto"
                  />
                </div>
              )}

              {/* Video Player */}
              {embedUrl ? (
                <div className="rounded-2xl overflow-hidden border border-red-200 shadow-md bg-black">
                  <div className="p-2 bg-red-100/80 border-b border-red-200 flex items-center justify-between text-xs font-bold text-red-900">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      विधायक जी का विशेष वीडियो संदेश
                    </span>
                  </div>
                  <div className="aspect-video w-full">
                    <iframe
                      src={embedUrl}
                      title="Festival Video Message"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ) : festival.videoUrl ? (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">वीडियो संदेश लिंक उपलब्ध है</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{festival.videoUrl}</p>
                    </div>
                  </div>
                  <a
                    href={festival.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow"
                  >
                    देखें
                  </a>
                </div>
              ) : null}

              {/* Wishes Message */}
              {festival.message && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <p className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1">शुभकामना संदेश</p>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed italic">
                    "{festival.message}"
                  </p>
                </div>
              )}

              {/* Detailed Speech / Full Message */}
              {festival.fullMessage && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                    विस्तृत संदेश / भाषण
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {festival.fullMessage}
                  </p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWhatsAppShare}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>व्हाट्सएप पर शेयर करें</span>
                  </button>
                  <button
                    onClick={handleCopyShare}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'कॉपी हो गया!' : 'संदेश कॉपी करें'}</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

