import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Shield,
  Briefcase,
  Building2,
  Building,
  Phone,
  PhoneCall,
  MessageCircle,
  Mail,
  MapPin,
  Tag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Download,
  FileSpreadsheet,
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sliders,
  CheckSquare,
  Square,
  Sparkles,
  Key,
  Lock,
  Camera,
  X
} from 'lucide-react';
import VoiceInputButton from '../components/common/VoiceInputButton';
import ExcelContactImportModal from '../components/admin/ExcelContactImportModal';

export default function AdminPeopleDirectory() {
  const { showToast, currentRole } = useApp() || {};

  // Active Main Tab
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'users' | 'categories'

  // Data States
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    officials: 0,
    workers: 0,
    members: 0,
    citizens: 0,
    users: 0
  });
  const [categories, setCategories] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [villages, setVillages] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);

  // Search Engine & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'official' | 'worker' | 'member' | 'citizen' | 'user'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [villageFilter, setVillageFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Forms
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Quick Inline Add Bar
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickMode, setQuickMode] = useState('single');
  const [quickName, setQuickName] = useState('');
  const [quickMobile, setQuickMobile] = useState('');
  const [quickType, setQuickType] = useState('citizen');
  const [quickRole, setQuickRole] = useState('नागरिक');
  const [quickPaste, setQuickPaste] = useState('');
  const [quickAdding, setQuickAdding] = useState(false);

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameHi, setNewCatNameHi] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  // New User Type / Role Form
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [creatingRole, setCreatingRole] = useState(false);

  // Load Data
  const loadDirectoryData = async () => {
    setLoading(true);
    try {
      const res = await api.getDirectoryAll();
      if (res?.success) {
        setPeople(res.people || []);
        setStats(res.stats || {});
        setCategories(res.categories || []);
        setVillages(res.villages || []);
        setDepartments(res.departments || []);
      }

      // Also load system users
      const usrRes = await api.getSystemUsers();
      if (usrRes?.success && usrRes.data) {
        setSystemUsers(usrRes.data);
      }

      // Load team categories & user types
      const catRes = await api.getTeamCategories();
      if (catRes?.success && catRes.categories) {
        setCategories(prev => Array.from(new Set([...prev, ...catRes.categories.map(c => c.name || c.nameHi)])));
      }
      const typeRes = await api.getUserTypes();
      if (typeRes?.success && typeRes.userTypes) {
        setUserTypes(typeRes.userTypes);
      }
    } catch (err) {
      console.error(err);
      showToast?.('डेटा लोड करने में त्रुटि: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectoryData();
  }, []);

  // Filtered People in Search Engine
  const filteredPeople = useMemo(() => {
    return people.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name && p.name.toLowerCase().includes(q);
        const matchMobile = p.mobile && p.mobile.includes(q);
        const matchFather = p.fatherSpouseName && p.fatherSpouseName.toLowerCase().includes(q);
        const matchRole = p.role && p.role.toLowerCase().includes(q);
        const matchVillage = p.village && p.village.toLowerCase().includes(q);
        const matchDept = p.department && p.department.toLowerCase().includes(q);
        const matchCategory = p.category && p.category.toLowerCase().includes(q);
        if (!matchName && !matchMobile && !matchFather && !matchRole && !matchVillage && !matchDept && !matchCategory) {
          return false;
        }
      }

      if (typeFilter !== 'all' && p.entityType !== typeFilter) return false;
      if (categoryFilter !== 'all' && p.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (villageFilter !== 'all' && p.village.toLowerCase() !== villageFilter.toLowerCase()) return false;
      if (departmentFilter !== 'all' && p.department.toLowerCase() !== departmentFilter.toLowerCase()) return false;
      if (statusFilter !== 'all' && p.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

      return true;
    });
  }, [people, searchQuery, typeFilter, categoryFilter, villageFilter, departmentFilter, statusFilter]);

  // Handle Quick Single Add
  const handleQuickSingleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!quickName.trim() || !quickMobile.trim()) {
      showToast?.('कृपया नाम और मोबाइल नंबर दर्ज करें!', 'error');
      return;
    }
    const cleanMobile = quickMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      showToast?.('कृपया 10-अंकीय मान्य मोबाइल नंबर भरें!', 'error');
      return;
    }

    setQuickAdding(true);
    try {
      const res = await api.createDirectoryPerson({
        entityType: quickType,
        name: quickName.trim(),
        mobile: cleanMobile,
        role: quickRole,
        category: quickType === 'official' ? 'विभागीय अधिकारी (Officials)' : quickRole,
        village: 'इटावा सदर'
      });

      if (res?.success) {
        showToast?.(`${quickName.trim()} को डायरेक्टरी में जोड़ दिया गया!`, 'success');
        setQuickName('');
        setQuickMobile('');
        await loadDirectoryData();
      } else {
        showToast?.(res?.message || 'जोड़ने में त्रुटि', 'error');
      }
    } catch (err) {
      showToast?.('सर्वर त्रुटि: ' + err.message, 'error');
    } finally {
      setQuickAdding(false);
    }
  };

  // Handle Quick Multi-Line Paste Add
  const handleQuickPasteAdd = async () => {
    if (!quickPaste.trim()) {
      showToast?.('कृपया कम से कम एक पंक्ति में नाम व मोबाइल नंबर पेस्ट करें', 'error');
      return;
    }

    const lines = quickPaste.trim().split('\n');
    const records = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const numMatch = trimmed.match(/\b[6-9]\d{9}\b/);
      if (numMatch) {
        const mobile = numMatch[0];
        const name = trimmed.replace(mobile, '').replace(/[,|:-]/g, ' ').trim() || 'नागरिक';
        records.push({
          name,
          mobile,
          village: 'इटावा सदर',
          type: quickRole || 'Citizen'
        });
      }
    }

    if (records.length === 0) {
      showToast?.('कोई वैध 10-अंकीय मोबाइल नंबर नहीं मिला।', 'error');
      return;
    }

    setQuickAdding(true);
    try {
      const res = await api.bulkImportCitizens(records, 'Directory Quick Paste', 'Admin');
      if (res?.success) {
        showToast?.(`सफलतापूर्वक ${res.added} लोग जोड़े गए! (${res.duplicates} पहले से मौजूद)`, 'success');
        setQuickPaste('');
        await loadDirectoryData();
      } else {
        showToast?.(res?.message || 'इम्पोर्ट विफल रहा', 'error');
      }
    } catch (err) {
      showToast?.('सर्वर त्रुटि: ' + err.message, 'error');
    } finally {
      setQuickAdding(false);
    }
  };

  // Create New Category
  const handleCreateCategory = async (e) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) {
      showToast?.('कृपया श्रेणी का नाम लिखें!', 'error');
      return;
    }

    setCreatingCat(true);
    try {
      const res = await api.addTeamCategory({
        name: newCatName.trim(),
        nameHi: newCatNameHi.trim() || newCatName.trim()
      });
      if (res?.success) {
        showToast?.(`नई श्रेणी "${newCatName.trim()}" बना दी गई!`, 'success');
        setNewCatName('');
        setNewCatNameHi('');
        await loadDirectoryData();
      }
    } catch (err) {
      showToast?.('श्रेणी बनाने में त्रुटि: ' + err.message, 'error');
    } finally {
      setCreatingCat(false);
    }
  };

  // Create New Role / User Type
  const handleCreateRole = async (e) => {
    if (e) e.preventDefault();
    if (!newRoleTitle.trim()) {
      showToast?.('कृपया पद/दायित्व का शीर्षक लिखें!', 'error');
      return;
    }

    setCreatingRole(true);
    try {
      const res = await api.addUserType({
        title: newRoleTitle.trim()
      });
      if (res?.success) {
        showToast?.(`नया पद "${newRoleTitle.trim()}" जोड़ दिया गया!`, 'success');
        setNewRoleTitle('');
        await loadDirectoryData();
      }
    } catch (err) {
      showToast?.('पद जोड़ने में त्रुटि: ' + err.message, 'error');
    } finally {
      setCreatingRole(false);
    }
  };

  // Delete Person
  const handleDeletePerson = async (p) => {
    if (!window.confirm(`क्या आप वाकई ${p.name} को डायरेक्टरी से हटाना चाहते हैं?`)) return;
    try {
      const res = await api.deleteDirectoryPerson(p.entityType, p.originalId || p.id);
      if (res?.success) {
        showToast?.(`${p.name} को हटा दिया गया।`, 'success');
        await loadDirectoryData();
      } else {
        showToast?.(res?.message || 'हटाने में त्रुटि', 'error');
      }
    } catch (err) {
      showToast?.('त्रुटि: ' + err.message, 'error');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('क्या आप इस श्रेणी को हटाना चाहते हैं?')) return;
    try {
      const res = await api.deleteTeamCategory(catId);
      if (res?.success) {
        showToast?.('श्रेणी हटा दी गई।', 'success');
        await loadDirectoryData();
      }
    } catch (err) {
      showToast?.('त्रुटि: ' + err.message, 'error');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredPeople.length === 0) {
      showToast?.('निर्यात के लिए कोई डेटा नहीं है', 'error');
      return;
    }

    const headers = ['Name', 'Role/Designation', 'Category', 'Mobile', 'Department', 'Village/Jurisdiction', 'Father/Spouse Name', 'Status'];
    const rows = filteredPeople.map(p => [
      `"${p.name || ''}"`,
      `"${p.role || ''}"`,
      `"${p.category || ''}"`,
      `"${p.mobile || ''}"`,
      `"${p.department || ''}"`,
      `"${p.village || ''}"`,
      `"${p.fatherSpouseName || ''}"`,
      `"${p.status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Etawah_People_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.('डायरेक्टरी सीएसवी फ़ाइल सफलतापूर्वक डाउनलोड हुई!', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider bg-blue-600/40 text-blue-300 border border-blue-400/30 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                All-in-One People & User Registry
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                200 - इटावा विधानसभा
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <span>मास्टर डायरेक्टरी व यूजर सर्च इंजन</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              समस्त नागरिक, पार्टी सदस्य, सक्रिय कार्यकर्ता, प्रशासनिक व विभागीय अधिकारी एवं सिस्टम लॉगिन यूजर्स — सभी एक ही केंद्रीय सर्च इंजन में खोजें, जोड़ें व प्रबंधित करें।
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddPersonModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ नया व्यक्ति / अधिकारी जोड़ें</span>
            </button>

            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>+ नया सिस्टम यूजर</span>
            </button>

            <button
              onClick={() => setShowExcelModal(true)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>एक्सेल अपलोड</span>
            </button>

            <button
              onClick={loadDirectoryData}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
              title="रिफ्रेश करें"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Interactive Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 mt-6 pt-6 border-t border-slate-800/80">
          <div
            onClick={() => { setActiveTab('directory'); setTypeFilter('all'); }}
            className={`p-3 rounded-2xl border cursor-pointer transition ${
              typeFilter === 'all' && activeTab === 'directory'
                ? 'bg-blue-600/30 border-blue-400'
                : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
            }`}
          >
            <span className="text-[10px] text-slate-400 font-semibold block">कुल पंजीकृत लोग</span>
            <div className="text-lg font-black text-white">{stats.total || 0}</div>
          </div>

          <div
            onClick={() => { setActiveTab('directory'); setTypeFilter('official'); }}
            className={`p-3 rounded-2xl border cursor-pointer transition ${
              typeFilter === 'official' && activeTab === 'directory'
                ? 'bg-indigo-600/30 border-indigo-400'
                : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
            }`}
          >
            <span className="text-[10px] text-indigo-300 font-semibold block">🏛️ विभागीय अधिकारी</span>
            <div className="text-lg font-black text-indigo-200">{stats.officials || 0}</div>
          </div>

          <div
            onClick={() => { setActiveTab('directory'); setTypeFilter('worker'); }}
            className={`p-3 rounded-2xl border cursor-pointer transition ${
              typeFilter === 'worker' && activeTab === 'directory'
                ? 'bg-amber-600/30 border-amber-400'
                : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
            }`}
          >
            <span className="text-[10px] text-amber-300 font-semibold block">🚩 कार्यकर्ता / टीम</span>
            <div className="text-lg font-black text-amber-200">{stats.workers || 0}</div>
          </div>

          <div
            onClick={() => { setActiveTab('directory'); setTypeFilter('member'); }}
            className={`p-3 rounded-2xl border cursor-pointer transition ${
              typeFilter === 'member' && activeTab === 'directory'
                ? 'bg-emerald-600/30 border-emerald-400'
                : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
            }`}
          >
            <span className="text-[10px] text-emerald-300 font-semibold block">🤝 पार्टी सदस्य</span>
            <div className="text-lg font-black text-emerald-200">{stats.members || 0}</div>
          </div>

          <div
            onClick={() => { setActiveTab('directory'); setTypeFilter('citizen'); }}
            className={`p-3 rounded-2xl border cursor-pointer transition ${
              typeFilter === 'citizen' && activeTab === 'directory'
                ? 'bg-sky-600/30 border-sky-400'
                : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
            }`}
          >
            <span className="text-[10px] text-sky-300 font-semibold block">👥 आम नागरिक</span>
            <div className="text-lg font-black text-sky-200">{stats.citizens || 0}</div>
          </div>

          <div
            onClick={() => { setActiveTab('users'); }}
            className={`p-3 rounded-2xl border cursor-pointer transition ${
              activeTab === 'users'
                ? 'bg-rose-600/30 border-rose-400'
                : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
            }`}
          >
            <span className="text-[10px] text-rose-300 font-semibold block">🔑 सिस्टम लॉगिन यूजर्स</span>
            <div className="text-lg font-black text-rose-200">{systemUsers.length || stats.users || 0}</div>
          </div>

          <div
            onClick={() => { setActiveTab('categories'); }}
            className={`p-3 rounded-2xl border cursor-pointer transition ${
              activeTab === 'categories'
                ? 'bg-purple-600/30 border-purple-400'
                : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
            }`}
          >
            <span className="text-[10px] text-purple-300 font-semibold block">🏷️ कुल श्रेणियां</span>
            <div className="text-lg font-black text-purple-200">{categories.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>१. मास्टर डायरेक्टरी व सर्च इंजन (People Directory)</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-white/20">
            {filteredPeople.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>२. सिस्टम यूजर्स व स्टाफ लॉगिन (Multi-User Management)</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800">
            {systemUsers.length} सक्रिय यूजर्स
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>३. श्रेणी व पद प्रबंधन (Categories & Roles)</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800">
            {categories.length} श्रेणियां
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: मास्टर डायरेक्टरी व सर्च इंजन */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Comprehensive Search Engine Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
              {/* Search Query Input with Voice Mic */}
              <div className="relative w-full lg:w-96 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="नाम, मोबाइल, पिता का नाम, गाँव, पद या विभाग खोजें..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="absolute right-2">
                    <VoiceInputButton
                      onTranscript={(txt) => setSearchQuery(txt)}
                      mode="replace"
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">सभी श्रेणियां ({categories.length})</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>

                {/* Village / Area Filter */}
                <select
                  value={villageFilter}
                  onChange={(e) => setVillageFilter(e.target.value)}
                  className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">सभी गाँव / क्षेत्र</option>
                  {villages.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </select>

                {/* Department Filter */}
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">सभी विभाग</option>
                  {departments.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">स्थिति: सभी</option>
                  <option value="active">सक्रिय (Active)</option>
                  <option value="verified">सत्यापित (Verified)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(prev => !prev)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                    showQuickAdd ? 'bg-amber-500 text-white border-amber-600' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>त्वरित टेक्स्ट बार</span>
                  {showQuickAdd ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
                  title="वर्तमान फ़िल्टर की गई सूची एक्सेल में डाउनलोड करें"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>निर्यात (.csv)</span>
                </button>
              </div>
            </div>

            {/* Quick Type Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 mr-1">त्वरित फ़िल्टर:</span>
              {[
                { id: 'all', label: `सभी (${stats.total})`, color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
                { id: 'official', label: `🏛️ अधिकारी (${stats.officials})`, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                { id: 'worker', label: `🚩 कार्यकर्ता (${stats.workers})`, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                { id: 'member', label: `🤝 सदस्य (${stats.members})`, color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                { id: 'citizen', label: `👥 नागरिक (${stats.citizens})`, color: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
                { id: 'user', label: `🔑 सिस्टम यूजर (${stats.users})`, color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' }
              ].map(chip => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setTypeFilter(chip.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    typeFilter === chip.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : chip.color
                  }`}
                >
                  {chip.label}
                </button>
              ))}

              {(searchQuery || typeFilter !== 'all' || categoryFilter !== 'all' || villageFilter !== 'all' || departmentFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setCategoryFilter('all');
                    setVillageFilter('all');
                    setDepartmentFilter('all');
                    setStatusFilter('all');
                  }}
                  className="text-xs text-rose-600 hover:underline font-bold ml-auto cursor-pointer"
                >
                  ✕ सभी फ़िल्टर हटाएं
                </button>
              )}
            </div>

            {/* Collapsible Quick Inline Add Bar */}
            {showQuickAdd && (
              <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 space-y-3 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                    <span className="text-xs font-bold text-amber-900">
                      त्वरित टेक्स्ट बार — एक क्लिक में सीधे नाम व मोबाइल लिखकर जोड़ें
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-amber-200 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setQuickMode('single')}
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                        quickMode === 'single' ? 'bg-amber-500 text-white' : 'text-slate-600'
                      }`}
                    >
                      एकल प्रविष्टि (Single)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickMode('paste')}
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                        quickMode === 'paste' ? 'bg-amber-500 text-white' : 'text-slate-600'
                      }`}
                    >
                      मल्टी-लाइन पेस्ट (Paste List)
                    </button>
                  </div>
                </div>

                {quickMode === 'single' ? (
                  <form onSubmit={handleQuickSingleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        placeholder="व्यक्ति का नाम *"
                        className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="tel"
                        maxLength={10}
                        value={quickMobile}
                        onChange={(e) => setQuickMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-अंकीय मोबाइल *"
                        className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <select
                        value={quickType}
                        onChange={(e) => {
                          setQuickType(e.target.value);
                          if (e.target.value === 'official') setQuickRole('विभागीय अधिकारी');
                          else if (e.target.value === 'worker') setQuickRole('कार्यकर्ता');
                          else if (e.target.value === 'member') setQuickRole('सक्रिय सदस्य');
                          else setQuickRole('नागरिक');
                        }}
                        className="w-full text-xs px-2.5 py-2 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="citizen">नागरिक</option>
                        <option value="member">सदस्य</option>
                        <option value="worker">कार्यकर्ता</option>
                        <option value="official">विभागीय अधिकारी</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={quickRole}
                        onChange={(e) => setQuickRole(e.target.value)}
                        placeholder="पद / श्रेणी"
                        className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={quickAdding || !quickName.trim() || quickMobile.length !== 10}
                        className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{quickAdding ? '...' : '+ जोड़ें'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-amber-800">
                      नीचे प्रत्येक पंक्ति में <strong>नाम और मोबाइल नंबर</strong> पेस्ट करें (उदा: <code>राजेश कुमार 9876543210</code> या <code>महेश - 9876543211</code>):
                    </p>
                    <textarea
                      rows={3}
                      value={quickPaste}
                      onChange={(e) => setQuickPaste(e.target.value)}
                      placeholder="राजेश कुमार 9876543210&#10;महेश सिंह 9876543211&#10;सुनील कुमार 9876543212"
                      className="w-full text-xs p-3 bg-white border border-amber-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        प्रत्येक पंक्ति से 10-अंकीय मोबाइल नंबर व नाम स्वतः निकाले जाएंगे
                      </span>
                      <button
                        type="button"
                        onClick={handleQuickPasteAdd}
                        disabled={quickAdding || !quickPaste.trim()}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{quickAdding ? 'जोड़ रहे हैं...' : '+ सभी को जोड़ें'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Master Directory Results Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  खोज परिणाम ({filteredPeople.length} लोग मिले)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                क्लिक करके प्रोफाइल देखें या सीधा व्हाट्सएप करें
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">व्यक्ति / फोटो / नाम</th>
                    <th className="p-3.5">वर्ग (Type)</th>
                    <th className="p-3.5">पद / दायित्व</th>
                    <th className="p-3.5">विभाग / क्षेत्र</th>
                    <th className="p-3.5">गाँव / स्थान</th>
                    <th className="p-3.5">मोबाइल नंबर</th>
                    <th className="p-3.5">स्थिति</th>
                    <th className="p-3.5 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPeople.map((p) => {
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-blue-50/40 transition cursor-pointer"
                        onClick={() => setSelectedPerson(p)}
                      >
                        {/* Name & Photo */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            {p.photo ? (
                              <img
                                src={p.photo}
                                alt={p.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-blue-100 text-blue-800 font-black text-xs flex items-center justify-center border border-slate-200 shrink-0">
                                {p.name ? p.name.charAt(0) : 'न'}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                                <span>{p.name}</span>
                              </div>
                              {p.fatherSpouseName && (
                                <div className="text-[10px] text-slate-500 truncate">
                                  सुपुत्र/पत्नी: {p.fatherSpouseName}
                                </div>
                              )}
                              {p.notes && (
                                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                  {p.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Entity Type Badge */}
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${p.typeBadgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                            {p.typeLabel || p.entityType}
                          </span>
                        </td>

                        {/* Role / Designation */}
                        <td className="p-3.5 font-semibold text-slate-800">
                          <div>{p.role || p.designation || '—'}</div>
                          {p.category && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              श्रेणी: {p.category}
                            </span>
                          )}
                        </td>

                        {/* Department */}
                        <td className="p-3.5 text-slate-600">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{p.department || '—'}</span>
                          </div>
                        </td>

                        {/* Village / Jurisdiction */}
                        <td className="p-3.5 text-slate-600 font-medium">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{p.village || p.jurisdiction || '—'}</span>
                          </div>
                        </td>

                        {/* Mobile Number */}
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          {p.mobile ? (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {p.mobile}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">दर्ज नहीं</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'Active' || p.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {p.status || 'Active'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {p.mobile && (
                              <button
                                type="button"
                                onClick={() => {
                                  const text = encodeURIComponent(`सादर प्रणाम ${p.name} जी,\n\nविधायक श्रीमती सरिता भदौरिया कार्यालय (200 - इटावा विधानसभा) से जनसेवा संवाद हेतु संपर्क किया जा रहा है।`);
                                  window.open(`https://api.whatsapp.com/send?phone=91${p.mobile}&text=${text}`, '_blank');
                                }}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition cursor-pointer"
                                title="व्हाट्सएप संदेश भेजें"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {p.mobile && (
                              <a
                                href={`tel:${p.mobile}`}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition"
                                title="फोन कॉल करें"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedPerson(p)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                              title="विवरण देखें"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePerson(p)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition cursor-pointer"
                              title="डायरेक्टरी से हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredPeople.length === 0 && (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <Users className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">कोई रिकॉर्ड नहीं मिला</p>
                  <p className="text-xs text-slate-400">
                    अपने खोज शब्दों को बदलें या ऊपर दिए गए <strong>"+ नया व्यक्ति जोड़ें"</strong> बटन से नया संपर्क बनाएं।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: सिस्टम यूजर्स व स्टाफ लॉगिन (Multi-User Management) */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-rose-600" />
                  <span>सिस्टम लॉगिन यूजर प्रबंधन (System Admin & Staff Users)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  पोर्टल में लॉगिन करने हेतु अधिकृत एडमिन, विधायक, जनसुनवाई ऑपरेटर और फील्ड स्टाफ बनाएं व नियंत्रित करें
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingUser(null);
                  setShowCreateUserModal(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ नया सिस्टम यूजर बनाएं</span>
              </button>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {systemUsers.map((u) => {
                const isSuperAdmin = u.username === 'admin' || String(u.id) === '1';
                return (
                  <div
                    key={u.id}
                    className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200 hover:border-blue-300 transition space-y-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || '/images/admimadmin.png'}
                          alt={u.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 shadow-xs shrink-0"
                          onError={(e) => { e.currentTarget.src = '/images/poli1.png'; }}
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{u.name}</h4>
                          <div className="text-xs font-mono font-semibold text-blue-600">
                            @{u.username}
                          </div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            {u.role}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {u.status === 'active' ? '● Active' : '○ Inactive'}
                      </span>
                    </div>

                    {/* Department & Contact */}
                    <div className="text-xs space-y-1 text-slate-600 border-t border-slate-200/70 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">विभाग:</span>
                        <span className="font-semibold">{u.department || 'कार्यालय'}</span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">मोबाइल:</span>
                          <span className="font-mono font-semibold">{u.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">पासवर्ड:</span>
                        <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                          {u.password || '••••••••'}
                        </span>
                      </div>
                    </div>

                    {/* Permissions list */}
                    <div className="space-y-1.5 border-t border-slate-200/70 pt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        स्वीकृत अनुमतियां:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(u.permissions || ['all']).map((perm, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700"
                          >
                            ✓ {perm}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 border-t border-slate-200/70 pt-3">
                      <button
                        type="button"
                        onClick={async () => {
                          const newStatus = u.status === 'active' ? 'inactive' : 'active';
                          try {
                            const res = await api.updateSystemUser(u.id, { status: newStatus });
                            if (res?.success) {
                              showToast?.(`यूजर स्टेटस ${newStatus} कर दिया गया`, 'success');
                              await loadDirectoryData();
                            }
                          } catch (err) {
                            showToast?.(err.message, 'error');
                          }
                        }}
                        disabled={isSuperAdmin}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition cursor-pointer"
                      >
                        {u.status === 'active' ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setShowCreateUserModal(true);
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition cursor-pointer"
                      >
                        एडिट करें
                      </button>

                      {!isSuperAdmin && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (!window.confirm(`क्या आप @${u.username} यूजर को हटाना चाहते हैं?`)) return;
                            try {
                              const res = await api.deleteSystemUser(u.id);
                              if (res?.success) {
                                showToast?.('यूजर हटा दिया गया', 'success');
                                await loadDirectoryData();
                              }
                            } catch (err) {
                              showToast?.(err.message, 'error');
                            }
                          }}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: श्रेणी व पद प्रबंधन (Categories & Roles) */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Categories Creator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <span>कैटेगरी / श्रेणी मास्टर (Custom Categories)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  नागरिकों, सदस्यों और अधिकारियों को वर्गीकृत करने हेतु नई श्रेणियां बनाएं
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                {categories.length} सक्रिय
              </span>
            </div>

            {/* Create Category Form */}
            <form onSubmit={handleCreateCategory} className="bg-purple-50/50 rounded-2xl p-4 border border-purple-200 space-y-3">
              <span className="text-xs font-bold text-purple-900 block">
                + नई श्रेणी / वर्ग जोड़ें:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="श्रेणी का नाम (उदा: व्यापार प्रकोष्ठ, किसान मोर्चा) *"
                  className="text-xs px-3 py-2 bg-white rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="text"
                  value={newCatNameHi}
                  onChange={(e) => setNewCatNameHi(e.target.value)}
                  placeholder="अंग्रेज़ी/वैकल्पिक नाम (उदा: Traders Wing)"
                  className="text-xs px-3 py-2 bg-white rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={creatingCat || !newCatName.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{creatingCat ? 'बना रहे हैं...' : '+ श्रेणी सेव करें'}</span>
                </button>
              </div>
            </form>

            {/* Existing Categories List */}
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              <span className="text-xs font-bold text-slate-700 block">मौजूदा सक्रिय श्रेणियां:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((cat, idx) => {
                  const count = people.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between hover:border-purple-300 transition"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{cat}</div>
                        <span className="text-[10px] text-slate-400">{count} लोग इस श्रेणी में जुड़े हैं</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-purple-700 border border-slate-200 shadow-xs">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Roles & Designations Creator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>पद एवं दायित्व मास्टर (Roles & Designations)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  बूथ, मंडल, संगठन व प्रशासनिक दायित्वों के पद निर्धारित करें
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                {userTypes.length} पद
              </span>
            </div>

            {/* Create Role Form */}
            <form onSubmit={handleCreateRole} className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200 space-y-3">
              <span className="text-xs font-bold text-emerald-900 block">
                + नया पद / दायित्व जोड़ें:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  placeholder="पद का शीर्षक (उदा: सेक्टर प्रभारी, ग्राम प्रधान, खंड विकास अधिकारी) *"
                  className="flex-1 text-xs px-3 py-2 bg-white rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  disabled={creatingRole || !newRoleTitle.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{creatingRole ? '...' : '+ पद जोड़ें'}</span>
                </button>
              </div>
            </form>

            {/* Existing Roles List */}
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              <span className="text-xs font-bold text-slate-700 block">मौजूदा सक्रिय पद / दायित्व:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userTypes.map((ut, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between hover:border-emerald-300 transition"
                  >
                    <div className="font-bold text-xs text-slate-800 truncate">
                      {ut.title || ut.name}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      सक्रिय
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: नया व्यक्ति / अधिकारी जोड़ें */}
      {/* ========================================================================= */}
      {showAddPersonModal && (
        <AddPersonFullModal
          isOpen={showAddPersonModal}
          onClose={() => setShowAddPersonModal(false)}
          categories={categories}
          userTypes={userTypes}
          onSuccess={async () => {
            setShowAddPersonModal(false);
            await loadDirectoryData();
          }}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: नया सिस्टम यूजर बनाएं / एडिट करें */}
      {/* ========================================================================= */}
      {showCreateUserModal && (
        <CreateSystemUserModal
          isOpen={showCreateUserModal}
          editingUser={editingUser}
          onClose={() => {
            setShowCreateUserModal(false);
            setEditingUser(null);
          }}
          onSuccess={async () => {
            setShowCreateUserModal(false);
            setEditingUser(null);
            await loadDirectoryData();
          }}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: एक्सेल से पूरी लिस्ट एक साथ अपलोड करें */}
      {/* ========================================================================= */}
      {showExcelModal && (
        <ExcelContactImportModal
          isOpen={showExcelModal}
          onClose={() => setShowExcelModal(false)}
          onSuccess={async () => {
            setShowExcelModal(false);
            await loadDirectoryData();
          }}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: व्यक्ति का संपूर्ण विवरण कार्ड (Person Detail Card) */}
      {/* ========================================================================= */}
      {selectedPerson && (
        <PersonDetailModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          onDelete={() => {
            handleDeletePerson(selectedPerson);
            setSelectedPerson(null);
          }}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-Component: Comprehensive Add Person Modal (Citizen, Member, Worker, Official)
// -----------------------------------------------------------------------------
function AddPersonFullModal({ isOpen, onClose, categories, userTypes, onSuccess, showToast }) {
  const [entityType, setEntityType] = useState('citizen'); // 'citizen' | 'member' | 'worker' | 'official'
  const [name, setName] = useState('');
  const [fatherSpouseName, setFatherSpouseName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [village, setVillage] = useState('इटावा सदर');
  const [booth, setBooth] = useState('');
  const [photo, setPhoto] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (entityType === 'official') {
      setCategory('विभागीय अधिकारी (Officials)');
      setDepartment('राजस्व विभाग');
      setRole('उपजिलाधिकारी (SDM)');
    } else if (entityType === 'worker') {
      setCategory('Political Workers');
      setRole('कार्यकर्ता');
    } else if (entityType === 'member') {
      setCategory('पार्टी सदस्य (Members)');
      setRole('सक्रिय सदस्य');
    } else {
      setCategory('नागरिक (Citizens)');
      setRole('आम नागरिक');
    }
  }, [entityType]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data?.success && data?.url) {
        setPhoto(data.url);
        showToast?.('फोटो सफलतापूर्वक अपलोड हो गई!', 'success');
      } else {
        showToast?.(data?.message || 'फोटो अपलोड विफल', 'error');
      }
    } catch (err) {
      showToast?.('फोटो अपलोड में त्रुटि: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast?.('कृपया व्यक्ति का नाम अवश्य भरें!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createDirectoryPerson({
        entityType,
        name: name.trim(),
        fatherSpouseName: fatherSpouseName.trim(),
        mobile: mobile.replace(/\D/g, ''),
        email: email.trim(),
        role: role.trim(),
        designation: role.trim(),
        category: category || entityType,
        department: department.trim(),
        jurisdiction: jurisdiction.trim() || village,
        village: village.trim(),
        booth: booth.trim(),
        photo,
        notes: notes.trim(),
        status: 'Active'
      });

      if (res?.success) {
        showToast?.(res.message || 'व्यक्ति सफलतापूर्वक जोड़ा गया!', 'success');
        onSuccess?.();
      } else {
        showToast?.(res?.message || 'जोड़ने में त्रुटि', 'error');
      }
    } catch (err) {
      showToast?.('त्रुटि: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-blue-300" />
            <div>
              <h3 className="text-base font-bold">नया व्यक्ति / अधिकारी / सदस्य जोड़ें</h3>
              <p className="text-xs text-blue-200">
                डायरेक्टरी में व्यक्ति का वर्ग, फोटो, पद, गाँव व पूर्ण विवरण दर्ज करें
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Entity Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              व्यक्ति का प्रकार / वर्ग (Who is this person?) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'citizen', label: '👥 आम नागरिक', desc: 'मतदाता / नागरिक' },
                { id: 'member', label: '🤝 पार्टी सदस्य', desc: 'सक्रिय सदस्य' },
                { id: 'worker', label: '🚩 कार्यकर्ता / टीम', desc: 'बूथ / मंडल संगठन' },
                { id: 'official', label: '🏛️ विभागीय अधिकारी', desc: 'SDM, BDO, पुलिस, JE' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setEntityType(t.id)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    entityType === t.id
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{t.label}</div>
                  <div className="text-[10px] text-slate-500">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload & Preview */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="relative shrink-0">
              {photo ? (
                <img src={photo} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-sm" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                  फोटो
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                व्यक्ति की फोटो (Passport / Avatar):
              </label>
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow-xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{uploading ? 'अपलोड हो रहा है...' : 'फोटो चुनें / अपलोड'}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photo && (
                  <button type="button" onClick={() => setPhoto('')} className="text-xs text-rose-600 hover:underline">
                    हटाएं
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name & Father/Spouse Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                व्यक्ति का पूरा नाम *
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा: श्री राम शरण"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    onTranscript={(txt) => setName(txt)}
                    mode="replace"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                पिता / पति का नाम (पहचान हेतु)
              </label>
              <input
                type="text"
                value={fatherSpouseName}
                onChange={(e) => setFatherSpouseName(e.target.value)}
                placeholder="उदा: श्री बाबूराम"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                मोबाइल नंबर (10 अंक)
              </label>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ईमेल आईडी (वैकल्पिक)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                कैटेगरी / श्रेणी (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">-- श्रेणी चुनें --</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                पद / दायित्व (Role / Designation)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="उदा: एसडीएम सदर, बूथ अध्यक्ष, ग्राम प्रधान"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Official Department & Jurisdiction (for Officials) */}
          {entityType === 'official' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-indigo-50/70 p-3 rounded-2xl border border-indigo-200">
              <div>
                <label className="text-xs font-bold text-indigo-900 block mb-1">
                  संबंधित विभाग (Department)
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="उदा: राजस्व, विकास, विद्युत, पुलिस"
                  className="w-full text-xs px-3 py-2 bg-white border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-900 block mb-1">
                  कार्यक्षेत्र / तहसील / थाना (Jurisdiction)
                </label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="उदा: इटावा सदर तहसील / बढ़पुरा ब्लॉक"
                  className="w-full text-xs px-3 py-2 bg-white border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Village & Booth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                गाँव / मोहल्ला / स्थान
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="उदा: बढ़पुरा, उझियानी, इटावा नगर"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                बूथ संख्या / वार्ड संख्या
              </label>
              <input
                type="text"
                value={booth}
                onChange={(e) => setBooth(e.target.value)}
                placeholder="उदा: बूथ संख्या 21 / वार्ड 04"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              विशेष टिप्पणी / विवरण (Notes)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="व्यक्ति के संदर्भ में कोई विशेष विवरण या निर्देश..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'सेव हो रहा है...' : 'डायरेक्टरी में सुरक्षित करें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-Component: Create / Edit System User Modal
// -----------------------------------------------------------------------------
function CreateSystemUserModal({ isOpen, editingUser, onClose, onSuccess, showToast }) {
  const [name, setName] = useState(editingUser?.name || '');
  const [username, setUsername] = useState(editingUser?.username || '');
  const [password, setPassword] = useState(editingUser?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(editingUser?.role || 'Staff Operator');
  const [department, setDepartment] = useState(editingUser?.department || 'विधानसभा कार्यालय');
  const [phone, setPhone] = useState(editingUser?.phone || '');
  const [status, setStatus] = useState(editingUser?.status || 'active');
  const [permissions, setPermissions] = useState(editingUser?.permissions || ['view_all', 'manage_grievances']);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || '');
      setUsername(editingUser.username || '');
      setPassword(editingUser.password || '');
      setRole(editingUser.role || 'Staff Operator');
      setDepartment(editingUser.department || 'विधानसभा कार्यालय');
      setPhone(editingUser.phone || '');
      setStatus(editingUser.status || 'active');
      setPermissions(editingUser.permissions || ['view_all', 'manage_grievances']);
    }
  }, [editingUser]);

  const allPermissions = [
    { id: 'view_all', label: 'समस्त डैशबोर्ड व डेटा देखना (View All)' },
    { id: 'manage_grievances', label: 'जनसंवाद व समस्याएं निस्तारण (Grievances)' },
    { id: 'broadcast_alerts', label: 'व्हाट्सएप व संदेश प्रसारण (Communication)' },
    { id: 'manage_citizens', label: 'नागरिक व संपर्क डायरेक्टरी प्रबंधन' },
    { id: 'manage_members', label: 'कार्यकर्ता व सदस्य प्रबंधन' },
    { id: 'manage_content', label: 'वेबसाइट, ब्लॉग व समाचार प्रबंधन' },
    { id: 'view_analytics', label: 'रिपोर्ट्स व ऑडिट लॉग्स' }
  ];

  const togglePermission = (pId) => {
    if (permissions.includes(pId)) {
      setPermissions(permissions.filter(p => p !== pId));
    } else {
      setPermissions([...permissions, pId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      showToast?.('नाम और यूजरनेम अनिवार्य हैं!', 'error');
      return;
    }
    if (!editingUser && !password.trim()) {
      showToast?.('पासवर्ड अनिवार्य है!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        const res = await api.updateSystemUser(editingUser.id, {
          name: name.trim(),
          username: username.trim().toLowerCase(),
          password: password.trim(),
          role,
          department,
          phone,
          status,
          permissions
        });
        if (res?.success) {
          showToast?.('सिस्टम यूजर सफलतापूर्वक अपडेट हो गया!', 'success');
          onSuccess?.();
        } else {
          showToast?.(res?.message || 'अपडेट विफल', 'error');
        }
      } else {
        const res = await api.createSystemUser({
          name: name.trim(),
          username: username.trim().toLowerCase(),
          password: password.trim(),
          role,
          department,
          phone,
          status,
          permissions
        });
        if (res?.success) {
          showToast?.('नया सिस्टम यूजर सफलतापूर्वक बनाया गया!', 'success');
          onSuccess?.();
        } else {
          showToast?.(res?.message || 'यूजर बनाने में त्रुटि', 'error');
        }
      }
    } catch (err) {
      showToast?.('त्रुटि: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-rose-900 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-base font-bold">
                {editingUser ? 'सिस्टम यूजर विवरण एडिट करें' : 'नया एडमिन / सिस्टम यूजर बनाएं'}
              </h3>
              <p className="text-xs text-rose-200">
                लॉगिन क्रेडेंशियल व अनुमतियां निर्धारित करें
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">पूरा नाम *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="उदा: राकेश कुमार शर्मा"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                यूजरनेम (Login Username) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-slate-400 font-bold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="rakesh_staff"
                  className="w-full text-xs pl-7 pr-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                लॉगिन पासवर्ड *
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="कम से कम 6 अक्षर"
                  className="w-full text-xs pl-3 pr-8 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  required={!editingUser}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">भूमिका (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="Super Admin">सुपर एडमिन (Super Admin)</option>
                <option value="MLA User">विधायक अधिकृत यूजर (MLA User)</option>
                <option value="Staff Operator">कार्यालय ऑपरेटर (Staff Operator)</option>
                <option value="Grievance Operator">जनसुनवाई अधिकारी (Grievance Officer)</option>
                <option value="Field Coordinator">क्षेत्रीय समन्वयक (Field Coordinator)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">विभाग / प्रकोष्ठ</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="उदा: जनसुनवाई / मीडिया"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">मोबाइल नंबर</label>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="10-अंकीय नंबर"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Permissions Checkboxes */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <label className="text-xs font-bold text-slate-700 block">
              सिस्टम अनुमतियां (Permissions):
            </label>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {allPermissions.map((perm) => (
                <label key={perm.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm.id) || permissions.includes('all')}
                    onChange={() => togglePermission(perm.id)}
                    className="w-3.5 h-3.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'सहेज रहे हैं...' : editingUser ? 'अपडेट करें' : 'यूजर बनाएं'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-Component: Person Detail Card Modal
// -----------------------------------------------------------------------------
function PersonDetailModal({ person, onClose, onDelete }) {
  if (!person) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative inline-block mx-auto mb-3">
            {person.photo ? (
              <img
                src={person.photo}
                alt={person.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 text-white flex items-center justify-center text-2xl font-black border-4 border-white/30 mx-auto">
                {person.name?.charAt(0) || 'न'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>

          <h3 className="text-lg font-extrabold text-white">{person.name}</h3>
          {person.fatherSpouseName && (
            <p className="text-xs text-blue-200">सुपुत्र/पत्नी: {person.fatherSpouseName}</p>
          )}
          <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
            {person.role || person.category || person.typeLabel}
          </span>
        </div>

        <div className="p-6 space-y-3.5 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">वर्ग (Category):</span>
            <span className="font-bold text-slate-800">{person.category || person.typeLabel}</span>
          </div>

          {person.department && (
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">विभाग:</span>
              <span className="font-bold text-slate-800">{person.department}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">गाँव / क्षेत्र:</span>
            <span className="font-bold text-slate-800">{person.village || person.jurisdiction || '—'}</span>
          </div>

          {person.mobile && (
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">मोबाइल नंबर:</span>
              <span className="font-mono font-bold text-blue-600 text-sm">{person.mobile}</span>
            </div>
          )}

          {person.email && (
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">ईमेल:</span>
              <span className="font-mono font-semibold text-slate-700">{person.email}</span>
            </div>
          )}

          {person.notes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-0.5">विवरण / टिप्पणी:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">{person.notes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3">
            {person.mobile && (
              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(`सादर प्रणाम ${person.name} जी,\n\nविधायक श्रीमती सरिता भदौरिया कार्यालय से जनसेवा संवाद हेतु संपर्क किया जा रहा है।`);
                  window.open(`https://api.whatsapp.com/send?phone=91${person.mobile}&text=${text}`, '_blank');
                }}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>व्हाट्सएप करें</span>
              </button>
            )}

            {person.mobile ? (
              <a
                href={`tel:${person.mobile}`}
                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>कॉल करें</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                बंद करें
              </button>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onDelete}
              className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>डायरेक्टरी से हमेशा के लिए हटाएं</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
