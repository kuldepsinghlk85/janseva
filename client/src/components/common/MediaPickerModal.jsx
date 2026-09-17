import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Search, Check, X, RefreshCw, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function MediaPickerModal({ isOpen, onClose, onSelect, title = 'मीडिया लाइब्रेरी से चित्र चुनें' }) {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await api.getMediaAll();
      if (res && res.success) {
        setMediaItems(res.data || []);
      }
    } catch (e) {
      console.error('Error fetching media for picker:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filtered = mediaItems.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <h3 className="text-sm sm:text-base font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Refresh */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="तस्वीर का नाम खोजें..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={loadMedia}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-white transition cursor-pointer"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Images Grid */}
        <div className="p-4 overflow-y-auto flex-1 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-orange-600" />
              <p className="text-xs font-bold">तस्वीरें लोड हो रही हैं...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-1">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-bold">कोई तस्वीर नहीं मिली</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filtered.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedUrl(item.url)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition flex flex-col group ${
                      isSelected
                        ? 'border-orange-600 ring-2 ring-orange-500/50 shadow-md'
                        : 'border-slate-200 hover:border-orange-400'
                    }`}
                  >
                    <div className="aspect-square bg-slate-900 overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onError={(e) => { e.target.src = '/images/poli1.png'; }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-orange-600/30 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-1.5 bg-white text-[10px] text-slate-600 truncate font-semibold">
                      {item.filename}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 truncate max-w-xs font-medium">
            {selectedUrl ? `चयनित: ${selectedUrl}` : 'कृपया एक तस्वीर चुनें'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              रद्द करें
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow transition cursor-pointer disabled:opacity-50"
            >
              तस्वीर चुनें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
