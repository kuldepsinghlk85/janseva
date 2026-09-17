import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Download,
  Copy,
  Check,
  Trash2,
  Search,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Filter,
  FileText,
  Eye,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminMediaLibrary() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all'); // all | uploaded | system_asset
  const [copiedId, setCopiedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fileInputRef = useRef(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await api.getMediaAll();
      if (res && res.success) {
        setMediaItems(res.data || []);
      }
    } catch (e) {
      console.error('Error loading media:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', msg: `${files.length} नई फोटो सफलतापूर्वक अपलोड हो गई!` });
        loadMedia();
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: 'error', msg: data.message || 'अपलोड में त्रुटि हुई।' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setFeedback({ type: 'error', msg: 'अपलोड विफल रहा।' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyLink = (url, id) => {
    // If relative path, copy relative or absolute based on current host
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleDownload = (item) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.filename || 'image';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (item) => {
    if (!item.canDelete) {
      alert('सिस्टम एसेट्स को हटाया नहीं जा सकता। केवल अपलोड की गई तस्वीरें हटाई जा सकती हैं।');
      return;
    }

    if (!window.confirm(`क्या आप वाकई "${item.filename}" फोटो को हटाना चाहते हैं?`)) return;

    try {
      const res = await api.deleteMediaFile(item.filename);
      if (res && res.success) {
        setFeedback({ type: 'success', msg: 'फोटो हटा दी गई है।' });
        loadMedia();
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: 'error', msg: res?.message || 'हटाने में त्रुटि।' });
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredMedia = mediaItems.filter((item) => {
    const matchSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSource = sourceFilter === 'all' || item.source === sourceFilter;
    return matchSearch && matchSource;
  });

  const totalUploadedCount = mediaItems.filter((i) => i.source === 'uploaded').length;
  const totalSize = mediaItems
    .filter((i) => i.source === 'uploaded')
    .reduce((acc, curr) => acc + (curr.size || 0), 0);

  const formatTotalSize = (bytes) => {
    if (!bytes) return '0 MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Central Media & Image Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">केंद्रीय मीडिया व इमेज लाइब्रेरी</h1>
          <p className="text-orange-100 text-xs sm:text-sm max-w-2xl">
            पोर्टल पर अपलोड होने वाली सभी तस्वीरों का केंद्रीय संग्रह। यहां से तस्वीरें डाउनलोड करें और 1-क्लिक में लिंक कॉपी करके वेबसाइट पर कहीं भी इस्तेमाल करें।
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={uploading}
            className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-5 py-3 rounded-2xl shadow-lg flex items-center space-x-2 transition transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="w-5 h-5 text-orange-600" />
            <span>{uploading ? 'अपलोड हो रहा है...' : 'नई फोटो अपलोड करें'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition ${
            feedback.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">कुल मीडिया फाइल्स</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{mediaItems.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">अपलोड की गई फोटोज</span>
          <p className="text-2xl font-black text-orange-600 mt-1">{totalUploadedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">सिस्टम एसेट्स</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {mediaItems.filter((i) => i.source === 'system_asset').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">अपलोड स्टोरेज आकार</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatTotalSize(totalSize)}</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="फाइल नाम से खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">सभी मीडिया (All Media)</option>
              <option value="uploaded">केवल अपलोड की गई (Uploaded Only)</option>
              <option value="system_asset">सिस्टम एसेट्स (System Assets)</option>
            </select>
          </div>

          <button
            onClick={loadMedia}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold text-slate-600">मीडिया लाइब्रेरी लोड हो रही है...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <ImageIcon className="w-14 h-14 text-slate-300 mx-auto" />
          <p className="text-base font-black text-slate-700">कोई तस्वीर नहीं मिली</p>
          <p className="text-xs text-slate-400">ऊपर "नई फोटो अपलोड करें" बटन दबाकर तस्वीरें जोड़ें।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMedia.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video sm:aspect-square bg-slate-900 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => { e.target.src = '/images/poli1.png'; }}
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shadow-md ${
                        item.source === 'uploaded'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {item.source === 'uploaded' ? 'अपलोड' : 'सिस्टम'}
                    </span>
                  </div>

                  {/* Hover Overlay Button to View Large */}
                  <button
                    onClick={() => setPreviewImage(item)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white cursor-pointer"
                  >
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center space-x-1 text-xs font-bold">
                      <Eye className="w-4 h-4" />
                      <span>बड़ा देखें</span>
                    </div>
                  </button>
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.sizeFormatted}</span>
                      <span>{new Date(item.uploadedAt).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    {/* Copy Link Button */}
                    <button
                      onClick={() => handleCopyLink(item.url, item.id)}
                      className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl font-bold transition cursor-pointer text-[11px] ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-800'
                      }`}
                      title="लिंक कॉपी करें"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'कॉपी हो गया!' : 'लिंक कॉपी'}</span>
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition cursor-pointer"
                      title="फोटो डाउनलोड करें"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* Delete Button (only if canDelete) */}
                    {item.canDelete && (
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 transition cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Large Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 truncate max-w-md">{previewImage.filename}</h4>
                <p className="text-xs text-slate-400">{previewImage.sizeFormatted} • {previewImage.url}</p>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={previewImage.url}
                alt={previewImage.filename}
                className="max-h-[65vh] object-contain rounded-xl"
              />
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleCopyLink(previewImage.url, 'modal')}
                className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>वेबसाइट लिंक कॉपी करें</span>
              </button>

              <button
                onClick={() => handleDownload(previewImage)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>डाउनलोड करें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
