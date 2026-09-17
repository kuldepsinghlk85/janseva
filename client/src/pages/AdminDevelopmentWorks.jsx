import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { PlusCircle, Search, Filter, HardHat, CheckCircle2, Clock, Trash2, Edit, X, MessageCircle } from 'lucide-react';
import ImageUploadInput from '../components/common/ImageUploadInput';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminDevelopmentWorks() {
  const { showToast } = useApp();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVillage, setFilterVillage] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    village: 'रामपुर',
    category: 'सड़क एवं परिवहन',
    department: 'लोक निर्माण विभाग (PWD)',
    budget: '₹ 1.25 करोड़',
    status: 'In Progress',
    description: '',
    impact: 'ग्रामीणों को सीधा लाभ',
    imageUrl: '/images/assets/work_rampur_road.jpg'
  });

  useEffect(() => {
    loadWorks();
  }, [filterVillage, filterCategory, filterStatus, search]);

  const loadWorks = async () => {
    setLoading(true);
    const res = await api.getDevelopmentWorks({
      village: filterVillage,
      category: filterCategory,
      status: filterStatus,
      search
    });
    if (res.success) {
      setWorks(res.works);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await api.createDevelopmentWork(formData, 'Admin (Super Admin)');
    if (res.success) {
      showToast('नया विकास कार्य सफलतापूर्वक जोड़ा गया!', 'success');
      setShowModal(false);
      loadWorks();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('क्या आप वाकई इस विकास कार्य को हटाना चाहते हैं?')) return;
    const res = await api.deleteDevelopmentWork(id, 'Admin (Super Admin)');
    if (res.success) {
      showToast('विकास कार्य हटाया गया।', 'info');
      loadWorks();
    }
  };

  const handleShareWhatsApp = (w) => {
    const text = `*विकास कार्य सूचना - जनसेवा पोर्टल*\n\n📌 *कार्य:* ${w.title}\n📍 *स्थान:* ${w.village}\n📂 *श्रेणी:* ${w.category}\n🏢 *विभाग:* ${w.department || 'लोक निर्माण विभाग'}\n💰 *स्वीकृत बजट:* ${w.budget}\n📊 *स्थिति:* ${w.status}\n\n📝 *विवरण:* ${w.description || 'विधानसभा क्षेत्र के सर्वांगीण विकास हेतु निरंतर कार्य प्रगति पर है।'}\n\n🔗 अधिक जानकारी देखें: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const [villagesList, setVillagesList] = useState(['रामपुर', 'सैफई', 'बकेवर', 'तकरोई', 'पिलखर', 'जसवंतनगर', 'भरथना', 'उदी', 'चकरनगर']);
  const [categoriesList, setCategoriesList] = useState(['सड़क एवं परिवहन', 'शिक्षा', 'स्वास्थ्य', 'पेयजल', 'महिला सशक्तिकरण', 'कृषि एवं ग्रामीण विकास', 'बिजली', 'सरकारी योजनाएँ']);

  useEffect(() => {
    const loadMaster = async () => {
      try {
        const [vRes, cRes] = await Promise.all([
          api.getVillages(),
          api.getMasterCategories('work')
        ]);
        if (vRes && vRes.success && vRes.data) {
          setVillagesList(vRes.data.map(v => v.nameHi || v.name));
        }
        if (cRes && cRes.success && cRes.data) {
          setCategoriesList(cRes.data.map(c => c.nameHi || c.name));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadMaster();
  }, []);

  const handleQuickAddVillage = async () => {
    const name = window.prompt('नया गाँव दर्ज करें:');
    if (!name || !name.trim()) return;
    const res = await api.addVillage({ nameHi: name.trim() });
    if (res && res.success) {
      setVillagesList(prev => [...prev, name.trim()]);
      setFormData(prev => ({ ...prev, village: name.trim() }));
      showToast(`गाँव "${name.trim()}" जोड़ा गया!`, 'success');
    }
  };

  const handleQuickAddCategory = async () => {
    const name = window.prompt('नई विकास कार्य श्रेणी दर्ज करें:');
    if (!name || !name.trim()) return;
    const res = await api.addMasterCategory({ nameHi: name.trim(), type: 'work' });
    if (res && res.success) {
      setCategoriesList(prev => [...prev, name.trim()]);
      setFormData(prev => ({ ...prev, category: name.trim() }));
      showToast(`श्रेणी "${name.trim()}" जोड़ी गई!`, 'success');
    }
  };

  const villages = ['All', ...villagesList];
  const categories = ['All', ...categoriesList];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">MLA Development Works & Timeline Manager</h2>
          <p className="text-xs text-slate-500">विधानसभा क्षेत्र के सभी विकास कार्यों, लागत एवं स्थिति का डिजिटल रिकॉर्ड</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Work</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-600 mb-1">Search Works</label>
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="शीर्षक, गांव या विभाग खोजें..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <VoiceInputButton
                onTranscript={(text) => setSearch(text)}
                mode="replace"
                buttonTitle="बोलकर खोजें"
                size="sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Village (गाँव)</label>
          <select
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
          >
            {villages.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Category (श्रेणी)</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Status (स्थिति)</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed (पूर्ण)</option>
            <option value="In Progress">In Progress (प्रगतिरत)</option>
            <option value="Approved">Approved (स्वीकृत)</option>
            <option value="Not Started">Not Started (प्रारंभ नहीं)</option>
          </select>
        </div>
      </div>

      {/* Works Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">कार्य का नाम (Title)</th>
                <th className="p-3.5">गाँव (Village)</th>
                <th className="p-3.5">श्रेणी (Category)</th>
                <th className="p-3.5">विभाग (Department)</th>
                <th className="p-3.5">बजट (Budget)</th>
                <th className="p-3.5">स्थिति (Status)</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {works.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5 max-w-xs">
                    <div className="font-bold text-slate-900">{w.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{w.date}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-orange-700">{w.village}</td>
                  <td className="p-3.5">{w.category}</td>
                  <td className="p-3.5 text-slate-500">{w.department}</td>
                  <td className="p-3.5 font-bold text-slate-900">{w.budget}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      w.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      w.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      w.status === 'Approved' ? 'bg-purple-100 text-purple-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleShareWhatsApp(w)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                      title="व्हाट्सएप पर साझा करें"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Work Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-4">नया विकास कार्य दर्ज करें</h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">कार्य का शीर्षक (Work Title) *</label>
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
                  placeholder="उदा. ग्राम रामपुर में मुख्य सड़क निर्माण"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">गाँव (Village) *</label>
                    <button
                      type="button"
                      onClick={handleQuickAddVillage}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      + नया गाँव
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    list="dev-villages-list"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                  <datalist id="dev-villages-list">
                    {villagesList.map((v, i) => (
                      <option key={i} value={v} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">बजट (Budget)</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">श्रेणी (Category) *</label>
                    <button
                      type="button"
                      onClick={handleQuickAddCategory}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      + नई श्रेणी
                    </button>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    {categoriesList.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">स्थिति (Status)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Completed">Completed (पूर्ण)</option>
                    <option value="In Progress">In Progress (प्रगतिरत)</option>
                    <option value="Approved">Approved (स्वीकृत)</option>
                    <option value="Not Started">Not Started (प्रारंभ नहीं)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">कार्य विवरण (Description)</label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, description: prev.description ? `${prev.description} ${text}` : text }))}
                    mode="append"
                    buttonTitle="बोलकर विवरण लिखें"
                    size="sm"
                  />
                </div>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="कार्य का संक्षिप्त विवरण दर्ज करें..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <ImageUploadInput
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  label="विकास कार्य का फोटो (Work Photo)"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition shadow"
                >
                  विकास कार्य सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
