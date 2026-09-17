import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Newspaper, Sparkles, PlusCircle, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

export default function AdminNewsRSS() {
  const { showToast, setAdminTab } = useApp();
  const [newsList, setNewsList] = useState([]);
  const [convertingId, setConvertingId] = useState(null);
  const [newSource, setNewSource] = useState({ name: '', url: '', category: 'विकास कार्य' });
  const [showAddSource, setShowAddSource] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const res = await api.getNews();
    if (res.success) setNewsList(res.news);
  };

  const handleConvertToBlog = async (newsId) => {
    setConvertingId(newsId);
    const res = await api.convertNewsToBlog(newsId, 'Admin (Super Admin)');
    setConvertingId(null);
    if (res.success) {
      showToast('समाचार से AI आधारित ब्लॉग ड्राफ्ट तैयार हो गया! आप ब्लॉग मैनेजर में समीक्षा कर सकते हैं।', 'success');
      loadNews();
    }
  };

  const handleAddSource = async (e) => {
    e.preventDefault();
    if (!newSource.name) return;
    const res = await api.addNewsSource(newSource, 'Admin (Super Admin)');
    if (res.success) {
      showToast('नया RSS स्त्रोत सफलतापूर्वक जोड़ा गया!', 'success');
      setShowAddSource(false);
      setNewSource({ name: '', url: '', category: 'विकास कार्य' });
      loadNews();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Regional News RSS Intelligence & Blog System</h2>
          <p className="text-xs text-slate-500">स्थानीय समाचार पत्रों (अमर उजाला, दैनिक जागरण आदि) के समाचारों से 1-क्लिक में AI ब्लॉग ड्राफ्ट निर्माण</p>
        </div>

        <button
          onClick={() => setShowAddSource(!showAddSource)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add News Feed</span>
        </button>
      </div>

      {showAddSource && (
        <form onSubmit={handleAddSource} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-slate-900">नया समाचार RSS स्त्रोत जोड़ें</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-bold mb-1">समाचार पत्र का नाम</label>
              <input
                type="text"
                placeholder="उदा. दैनिक भास्कर"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold mb-1">RSS फीड URL</label>
              <input
                type="url"
                placeholder="https://news.example.com/rss"
                value={newSource.url}
                onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold mb-1">श्रेणी</label>
              <input
                type="text"
                value={newSource.category}
                onChange={(e) => setNewSource({ ...newSource, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs">
              स्त्रोत सहेजें
            </button>
          </div>
        </form>
      )}

      {/* News Feeds List */}
      <div className="space-y-4">
        {newsList.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  {item.source}
                </span>
                <span className="text-slate-400">• {item.date}</span>
                <span className="text-slate-500 font-medium">स्थान: {item.location}</span>
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-2 w-full md:w-auto justify-end">
              {item.status === 'converted' ? (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ब्लॉग बन चुका है</span>
                </div>
              ) : (
                <button
                  onClick={() => handleConvertToBlog(item.id)}
                  disabled={convertingId === item.id}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{convertingId === item.id ? 'AI तैयार कर रहा है...' : 'Convert to AI Blog Draft'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
