import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Briefcase, PlusCircle, UserCheck, Trash2, X } from 'lucide-react';

export default function AdminTeamManagement() {
  const { showToast } = useApp();
  const [team, setTeam] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Booth Agent',
    area: 'इटावा सदर',
    mobile: ''
  });

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const res = await api.getTeam();
    if (res.success) {
      setTeam(res.members);
      setCategories(res.categories || []);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    const res = await api.addTeamMember(formData, 'Admin (Super Admin)');
    if (res.success) {
      showToast('टीम सदस्य सफलतापूर्वक जोड़ा गया!', 'success');
      setShowModal(false);
      setFormData({ name: '', role: 'Booth Agent', area: 'इटावा सदर', mobile: '' });
      loadTeam();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('क्या आप इस सदस्य को हटाना चाहते हैं?')) return;
    const res = await api.deleteTeamMember(id, 'Admin (Super Admin)');
    if (res.success) {
      showToast('सदस्य हटाया गया।', 'info');
      loadTeam();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">MLA Team & Organization Management</h2>
          <p className="text-xs text-slate-500">बूथ एजेंट, राजनीतिक कार्यकर्ता, सोशल मीडिया टीम एवं कार्यालय स्टाफ का संगठन ढांचा</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
              <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                {m.role}
              </div>
              <div className="text-[11px] text-slate-500">{m.area}</div>
              {m.mobile && <div className="text-[10px] font-mono text-slate-400">📱 {m.mobile}</div>}
            </div>

            <button
              onClick={() => handleDelete(m.id)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-3">नया टीम सदस्य जोड़ें</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">नाम (Name) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">भूमिका (Role / Category)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">क्षेत्र / बूथ (Area)</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर (Mobile)</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition shadow">
                  सदस्य जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
