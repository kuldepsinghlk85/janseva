import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MapPin, Calendar, ArrowRight, Share2, Eye, X, CheckCircle } from 'lucide-react';

export default function LatestUpdates() {
  const [filter, setFilter] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [sharedToast, setSharedToast] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const res = await api.getBlogs({ publicOnly: 'true' });
    if (res.success) {
      setBlogs(res.blogs);
    }
  };

  const handleShare = async (blog) => {
    await api.trackShare('whatsapp', 'blog', blog.id);
    const url = window.location.href;
    const text = `*${blog.title}*\n${blog.excerpt}\n\nकार्यालय श्रीमती सरिता भदौरिया (विधायक, इटावा 200)\nपढ़ें: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 3000);
  };

  const tabs = [
    { id: 'all', label: 'सभी' },
    { id: 'photos', label: 'फोटो' },
    { id: 'videos', label: 'वीडियो' },
    { id: 'social', label: 'सोशल मीडिया' }
  ];

  return (
    <section id="development" className="py-12 bg-white relative">
      <div id="updates" className="absolute -top-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">विकास एवं जनसंवाद</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              ताजा विकास अपडेट
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 sm:pb-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <a
              href="#updates"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 whitespace-nowrap px-2"
            >
              <span>देखें सभी</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Updates Cards Grid (Image 2 Style with Cropped Photos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {blogs.slice(0, 4).map((item, idx) => {
            const fallbackImages = [
              '/images/assets/work_rampur_road.jpg',
              '/images/assets/work_school_children.jpg',
              '/images/assets/work_women_shg.jpg',
              '/images/assets/work_health_camp.jpg'
            ];
            const cardImg = item.image || fallbackImages[idx % fallbackImages.length];

            return (
              <div
                key={item.id}
                onClick={() => setSelectedBlog(item)}
                className="group bg-slate-50 hover:bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-slate-200">
                    <img
                      src={cardImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = '/images/poli1.png';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-600/90 text-white backdrop-blur-sm shadow-sm">
                        {item.category || 'विकास कार्य'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date || '15 सितंबर 2026'}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-orange-600 transition">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.excerpt || item.content}
                    </p>
                  </div>
                </div>

                {/* Card Footer Location */}
                <div className="px-4 py-3 bg-white group-hover:bg-orange-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-slate-600 group-hover:text-orange-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{item.village || 'इटावा'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Blog Article Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header Image */}
            <div className="relative aspect-video w-full bg-slate-900">
              <img
                src={selectedBlog.image || '/images/poli3.png'}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/images/poli1.png'; }}
              />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-orange-600 text-white">
                  {selectedBlog.category}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedBlog.village}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedBlog.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {selectedBlog.views || 1240} बार देखा गया
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {selectedBlog.title}
              </h2>

              <p className="text-sm font-semibold text-orange-700 bg-orange-50 p-3 rounded-xl border border-orange-100">
                {selectedBlog.excerpt}
              </p>

              <div className="prose prose-slate text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedBlog.content}
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  {selectedBlog.author || 'कार्यालय श्रीमती सरिता भदौरिया'}
                </div>

                <button
                  onClick={() => handleShare(selectedBlog)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp पर साझा करें</span>
                </button>
              </div>

              {sharedToast && (
                <div className="p-2 bg-green-100 text-green-800 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>साझा करने के लिए WhatsApp खोला गया!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
