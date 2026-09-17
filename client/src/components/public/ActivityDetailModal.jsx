import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Tag, Share2, ExternalLink, Play, Eye, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import ShareButtons from './ShareButtons';

export default function ActivityDetailModal({ activity, onClose, onTagClick }) {
  if (!activity) return null;

  const { currentUser } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Automatic Readership & View Tracking
  useEffect(() => {
    if (activity && activity.id) {
      const deviceName = typeof navigator !== 'undefined' && navigator.userAgent.includes('Mobile')
        ? 'Mobile / Phone'
        : 'Desktop / PC';

      api.trackRead({
        entityId: activity.id,
        entityType: 'activity',
        title: activity.title,
        category: activity.categoryHi || activity.category || 'विकास गतिविधि',
        readerName: currentUser ? currentUser.name : 'अतिथि पाठक (Guest)',
        readerMobile: currentUser ? currentUser.mobile : null,
        readerRole: currentUser ? (currentUser.role || 'Citizen') : 'Guest',
        device: deviceName
      });
    }
  }, [activity?.id, currentUser]);


  const images = Array.isArray(activity.images) && activity.images.length
    ? activity.images
    : ['/images/assets/work_rampur_road.jpg'];

  const categoryLabels = {
    Inauguration: 'लोकार्पण / उद्घाटन',
    Inspection: 'स्थलीय निरीक्षण',
    'Public Meeting': 'जनसंवाद चौपाल',
    'Development Work': 'विकास कार्य',
    'Government Scheme': 'सरकारी योजना',
    Other: 'अन्य गतिविधि'
  };

  const currentCategory = activity.categoryHi || categoryLabels[activity.category] || activity.category;

  const getEmbedYoutube = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const youtubeEmbedUrl = getEmbedYoutube(activity.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Sticky Modal Top Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
              {currentCategory}
            </span>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              इटावा विधानसभा (200) विकास अभिलेख
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1">
          
          {/* Main Hero Media Gallery */}
          <div className="space-y-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={images[activeImageIndex]}
                alt={activity.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/images/poli1.png'; }}
              />

              {images.length > 1 && (
                <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition pointer-events-auto shadow-lg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition pointer-events-auto shadow-lg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition flex-shrink-0 cursor-pointer ${
                      activeImageIndex === i ? 'border-orange-500 scale-105 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Activity Metadata Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center space-x-1.5 font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                <span>{activity.date}</span>
              </div>
              {activity.time && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activity.time}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 font-semibold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>
                  {activity.location?.village || activity.village || 'रामपुर'}, {activity.location?.block || 'इटावा'} ({activity.location?.district || 'इटावा'})
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {activity.title}
            </h2>
          </div>

          {/* Full Rich Description */}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3 font-medium bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
            {activity.fullDescription || activity.shortDescription}
          </div>

          {/* Embedded Video Section (if available) */}
          {youtubeEmbedUrl ? (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-red-600" />
                <span>कार्यक्रम का वीडियो कवरेज</span>
              </h4>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                <iframe
                  src={youtubeEmbedUrl}
                  title="Activity Video"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          ) : null}

          {/* Related External Links */}
          {activity.externalLinks && activity.externalLinks.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>संबंधित शासकीय एवं विभागीय लिंक</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activity.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url || link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 flex items-center justify-between text-xs font-bold text-slate-800 transition group"
                  >
                    <span className="truncate">{link.title || link.url || link}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 flex-shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-500" />
                <span>टैग्स (क्लिक करके संबंधित गतिविधियां देखें):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activity.tags.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (onTagClick) onTagClick(t);
                      onClose();
                    }}
                    className="text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1 rounded-full transition cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Social & WhatsApp Sharing Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-green-50 border border-orange-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-slate-900">इस गतिविधि को साझा करें</h4>
              <p className="text-[11px] text-slate-500">विधानसभा के नागरिकों तक विकास कार्य की जानकारी पहुंचाएं।</p>
            </div>
            <ShareButtons
              title={activity.title}
              shortDescription={activity.shortDescription || activity.fullDescription?.slice(0, 100)}
              location={activity.location?.village || 'इटावा'}
              date={activity.date}
              onShareSuccess={(channel) => {
                api.trackShare(channel, 'activity', activity.id, activity.title);
              }}
            />

          </div>

        </div>
      </div>
    </div>
  );
}
