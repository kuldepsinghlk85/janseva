import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Users, UserPlus, Search, Filter, Phone, MapPin, CheckCircle, Trash2, Edit, Tag, ShieldCheck, Mail, Calendar, Plus, X } from 'lucide-react';
import ImageUploadInput from '../components/common/ImageUploadInput';

export default function AdminMemberManagement() {
  const { showToast } = useApp();
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);

  // Forms
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'बूथ अध्यक्ष (Booth President)',
    area: 'इटावा सदर',
    booth: '',
    mobile: '',
    email: '',
    category: 'Booth Agents',
    avatar: '/images/poli1.png',
    status: 'Active'
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameHi, setNewCategoryNameHi] = useState('');
  const [newUserTypeTitle, setNewUserTypeTitle] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getTeam();
      if (res.success) {
        if (res.members) setMembers(res.members);
        if (res.categories) setCategories(res.categories);
        if (res.userTypes) setUserTypes(res.userTypes);
      }
    } catch (err) {
      console.error('Error loading team data:', err);
    }
  };

  // Member handlers
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.mobile) {
      showToast('कृपया नाम और मोबाइल नंबर दर्ज करें!', 'error');
      return;
    }
    const res = await api.addTeamMember(newMember, 'Admin');
    if (res.success) {
      showToast('नया सदस्य/कार्यकर्ता सफलतापूर्वक जोड़ा गया!', 'success');
      setShowAddMemberModal(false);
      setNewMember({
        name: '',
        role: userTypes[0]?.title || 'बूथ अध्यक्ष (Booth President)',
        area: 'इटावा सदर',
        booth: '',
        mobile: '',
        email: '',
        category: categories[0]?.name || 'Booth Agents',
        avatar: '/images/poli1.png',
        status: 'Active'
      });
      loadData();
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('क्या आप निश्चित रूप से इस सदस्य को हटाना चाहते हैं?')) return;
    const res = await api.deleteTeamMember(id);
    if (res.success) {
      showToast('सदस्य हटा दिया गया!', 'success');
      loadData();
    }
  };

  // Category handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = await api.addTeamCategory({
      name: newCategoryName.trim(),
      nameHi: newCategoryNameHi.trim() || newCategoryName.trim()
    });
    if (res.success) {
      showToast('नई श्रेणी सफलतापूर्वक जोड़ी गई!', 'success');
      setNewCategoryName('');
      setNewCategoryNameHi('');
      loadData();
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('क्या आप निश्चित रूप से इस श्रेणी को हटाना चाहते हैं?')) return;
    const res = await api.deleteTeamCategory(id);
    if (res.success) {
      showToast('श्रेणी हटा दी गई!', 'info');
      loadData();
    }
  };

  // User Type handlers
  const handleAddUserType = async (e) => {
    e.preventDefault();
    if (!newUserTypeTitle.trim()) return;
    const res = await api.addUserType({ title: newUserTypeTitle.trim() });
    if (res.success) {
      showToast('नया यूजर टाइप/पद सफलतापूर्वक जोड़ा गया!', 'success');
      setNewUserTypeTitle('');
      loadData();
    }
  };

  const handleDeleteUserType = async (id) => {
    if (!window.confirm('क्या आप निश्चित रूप से इस यूजर टाइप को हटाना चाहते हैं?')) return;
    const res = await api.deleteUserType(id);
    if (res.success) {
      showToast('यूजर टाइप हटा दिया गया!', 'info');
      loadData();
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesCategory = filter === 'all' || (m.category || '').toLowerCase() === filter.toLowerCase();
    const matchesSearch = !searchTerm ||
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.area || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.mobile || '').includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Team & Organization Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>कार्यकर्ता, श्रेणी एवं पद प्रबंधन (Member Management)</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            नए सदस्य जोड़ें, संगठन की नई श्रेणियां बनाएं, और यूजर के पदों/टाइप्स को आवश्यकतानुसार जोड़ें या हटाएं।
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>श्रेणियां प्रबंधित करें</span>
          </button>

          <button
            onClick={() => setShowUserTypeModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>पद / यूजर टाइप प्रबंधित करें</span>
          </button>

          <button
            onClick={() => setShowAddMemberModal(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ नया सदस्य जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Dynamic Category Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            सभी ({members.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id || c.name}
              onClick={() => setFilter(c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filter.toLowerCase() === c.name.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {c.nameHi || c.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="नाम, मोबाइल, बूथ या पद खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 bg-slate-100 flex-shrink-0 shadow-sm">
                  <img src={m.avatar || '/images/poli1.png'} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-black text-slate-900 truncate">{m.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 ml-1">
                      {m.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-blue-600 truncate mt-0.5">{m.role}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{m.area} {m.booth ? `(बूथ: ${m.booth})` : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{m.mobile}</span>
                </div>
                {m.email && (
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {m.category}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDeleteMember(m.id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                  title="सदस्य हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: ADD MEMBER */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>नया सदस्य / कार्यकर्ता पंजीकृत करें</span>
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              {/* Member Photo with Universal Image Uploader */}
              <ImageUploadInput
                value={newMember.avatar}
                onChange={(url) => setNewMember({ ...newMember, avatar: url })}
                label="सदस्य का फोटो अपलोड करें (Member Photo)"
                hint="पासपोर्ट साइज चित्र"
                aspectRatio="square"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">पूरा नाम (Full Name) *</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="उदा. अमित कुमार त्रिपाठी"
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी (Category) *</label>
                  <select
                    value={newMember.category}
                    onChange={(e) => setNewMember({ ...newMember, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.nameHi || c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">पद / यूजर प्रकार (Role / Type) *</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl bg-white"
                  >
                    {userTypes.map((u) => (
                      <option key={u.id || u.title} value={u.title}>
                        {u.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर *</label>
                  <input
                    type="tel"
                    required
                    value={newMember.mobile}
                    onChange={(e) => setNewMember({ ...newMember, mobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full text-xs px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ईमेल (वैकल्पिक)</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="amit@janseva.org"
                    className="w-full text-xs px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">क्षेत्र / कार्यक्षेत्र</label>
                  <input
                    type="text"
                    value={newMember.area}
                    onChange={(e) => setNewMember({ ...newMember, area: e.target.value })}
                    placeholder="उदा. ग्राम रामपुर / इटावा सदर"
                    className="w-full text-xs px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">बूथ संख्या / सेक्टर</label>
                  <input
                    type="text"
                    value={newMember.booth}
                    onChange={(e) => setNewMember({ ...newMember, booth: e.target.value })}
                    placeholder="उदा. बूथ 14"
                    className="w-full text-xs px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow cursor-pointer"
                >
                  सदस्य सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE CATEGORIES */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <span>संगठन श्रेणियां प्रबंधित करें</span>
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleAddCategory} className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
              <label className="block text-xs font-bold text-blue-900">नयी श्रेणी जोड़ें</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="श्रेणी का नाम (उदा. युवा मोर्चा)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border rounded-xl bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                >
                  + जोड़ें
                </button>
              </div>
            </form>

            {/* Existing Categories List */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              <label className="block text-xs font-bold text-slate-700">मौजूदा श्रेणियां ({categories.length})</label>
              {categories.map((c) => (
                <div key={c.id || c.name} className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-50 text-xs font-semibold">
                  <span>{c.nameHi || c.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(c.id || c.name)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="श्रेणी हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MANAGE USER TYPES */}
      {showUserTypeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>यूजर के प्रकार / पद प्रबंधित करें</span>
              </h3>
              <button onClick={() => setShowUserTypeModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New User Type Form */}
            <form onSubmit={handleAddUserType} className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
              <label className="block text-xs font-bold text-purple-900">नया पद / प्रकार जोड़ें</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="पद का नाम (उदा. मंडल आईटी प्रभारी)"
                  value={newUserTypeTitle}
                  onChange={(e) => setNewUserTypeTitle(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border rounded-xl bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
                >
                  + जोड़ें
                </button>
              </div>
            </form>

            {/* Existing User Types List */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              <label className="block text-xs font-bold text-slate-700">सक्रिय पद व प्रकार ({userTypes.length})</label>
              {userTypes.map((u) => (
                <div key={u.id || u.title} className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-50 text-xs font-semibold">
                  <span>{u.title}</span>
                  <button
                    onClick={() => handleDeleteUserType(u.id || u.title)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="पद हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowUserTypeModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
