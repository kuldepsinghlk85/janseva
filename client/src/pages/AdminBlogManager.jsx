import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { FileText, PlusCircle, Eye, EyeOff, Archive, Calendar, Trash2, Edit, X, MessageCircle } from 'lucide-react';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminBlogManager() {
  const { showToast } = useApp();
  const [blogs, setBlogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'विकास कार्य',
    village: 'इटावा सदर',
    excerpt: '',
    content: '',
    status: 'published'
  });

  useEffect(() => {
    loadBlogs();
  }, [statusFilter]);

  const loadBlogs = async () => {
    const res = await api.getBlogs({ status: statusFilter });
    if (res.success) setBlogs(res.blogs);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const res = await api.updateBlog(id, { status: newStatus }, 'Admin (Super Admin)');
    if (res.success) {
      showToast(`ब्लॉग स्टेटस बदला गया: ${newStatus}`, 'info');
      loadBlogs();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('क्या आप वाकई इस ब्लॉग को हटाना चाहते हैं?')) return;
    const res = await api.deleteBlog(id, 'Admin (Super Admin)');
    if (res.success) {
      showToast('ब्लॉग हटा दिया गया।', 'info');
      loadBlogs();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await api.createBlog(formData, 'Admin (Super Admin)');
    if (res.success) {
      showToast('नया ब्लॉग लेख सफलतापूर्वक प्रकाशित/सहेजा गया!', 'success');
      setShowModal(false);
      setFormData({ title: '', category: 'विकास कार्य', village: 'इटावा सदर', excerpt: '', content: '', status: 'published' });
      loadBlogs();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Blog & Content Management System</h2>
          <p className="text-xs text-slate-500">
            प्रत्येक लेख को प्रकाशित (Published), छिपाया (Hidden), संग्रहीत (Archived) या निर्धारित (Scheduled) किया जा सकता है।
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {['All', 'published', 'hidden', 'archived', 'scheduled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl capitalize transition ${
              statusFilter === st
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {st} ({blogs.filter(b => st === 'All' || b.status === st).length})
          </button>
        ))}
      </div>

      {/* Blogs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-orange-600">{b.category}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                  b.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                  b.status === 'hidden' ? 'bg-slate-200 text-slate-700' :
                  b.status === 'archived' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {b.status}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{b.title}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{b.excerpt || b.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">{b.date}</span>

              {/* Status Actions */}
              <div className="flex items-center space-x-1">
                {b.status !== 'published' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'published')}
                    className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                    title="Publish to Website"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
                {b.status === 'published' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'hidden')}
                    className="p-1 rounded text-slate-500 hover:bg-slate-100"
                    title="Hide from Website"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                )}
                {b.status !== 'archived' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'archived')}
                    className="p-1 rounded text-amber-600 hover:bg-amber-50"
                    title="Archive"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const waText = `*${b.title}*\n📂 श्रेणी: ${b.category || 'विकास लेख'}\n\n${b.excerpt || b.content?.slice(0, 150) || ''}\n\nकार्यालय विधायक श्रीमती सरिता भदौरिया (इटावा 200)\nपूरी जानकारी पढ़ें: ${window.location.origin}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`, '_blank');
                  }}
                  className="p-1 rounded text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                  title="व्हाट्सएप पर शेयर करें"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-3">नया लेख / ब्लॉग लिखें</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">शीर्षक (Title) *</label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, title: prev.title ? `${prev.title} ${text}` : text }))}
                    mode="append"
                    buttonTitle="बोलकर शीर्षक लिखें"
                    size="sm"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="उदा. ग्राम रामपुर में विकास कार्यों की समीक्षा"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">श्रेणी (Category)</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">स्थिति (Status)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="published">Published (प्रकाशित)</option>
                    <option value="hidden">Hidden (अदृश्य)</option>
                    <option value="archived">Archived (संग्रहीत)</option>
                    <option value="scheduled">Scheduled (निर्धारित)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">संक्षिप्त विवरण (Excerpt)</label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, excerpt: prev.excerpt ? `${prev.excerpt} ${text}` : text }))}
                    mode="append"
                    buttonTitle="बोलकर विवरण लिखें"
                    size="sm"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">पूरा लेख (Full Content)</label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, content: prev.content ? `${prev.content} ${text}` : text }))}
                    mode="append"
                    buttonTitle="बोलकर पूरा लेख लिखें"
                    size="sm"
                  />
                </div>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="विस्तृत लेख यहाँ लिखें..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition shadow">
                  ब्लॉग प्रकाशित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
