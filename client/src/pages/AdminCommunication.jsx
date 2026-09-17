import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  PhoneCall,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Smartphone,
  MessageCircle,
  Printer,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Building,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Upload,
  X,
  Save,
  Lock,
  Eye,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Plus,
  FileSpreadsheet,
  UserPlus,
  ListPlus,
  Camera,
  Check,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import VoiceInputButton from '../components/common/VoiceInputButton';
import ExcelContactImportModal from '../components/admin/ExcelContactImportModal';
import AddContactModal from '../components/admin/AddContactModal';

export default function AdminCommunication() {

  const { showToast } = useApp() || {};

  // Broadcast state
  const [broadcastType, setBroadcastType] = useState('whatsapp'); // 'whatsapp', 'sms'
  const [targetGroup, setTargetGroup] = useState('all');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  // Jan Samvad Grievance state
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'in_progress', 'resolved', 'forwarded_dept'
  const [searchFilter, setSearchFilter] = useState('');

  // Active Role State (For demonstrating and enforcing RBAC)
  const [currentRole, setCurrentRole] = useState('super_admin'); // 'super_admin', 'grievance_officer', 'field_coordinator', 'viewer'
  const [rolePermissions, setRolePermissions] = useState({});
  const [showRoleMatrixModal, setShowRoleMatrixModal] = useState(false);

  // Action Modal State
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [actionStatus, setActionStatus] = useState('in_progress');
  const [actionNote, setActionNote] = useState('');
  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [savingAction, setSavingAction] = useState(false);

  // Print Case File State
  const [printGrievance, setPrintGrievance] = useState(null);

  // Active Main Tab: 'grievances' vs 'direct_mla_contact'
  const [activeTab, setActiveTab] = useState('direct_mla_contact'); // default to user's feature

  // Direct WhatsApp Connect State
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContactMobile, setSelectedContactMobile] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualMobile, setManualMobile] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [directMessageText, setDirectMessageText] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Contact Creation Modals & Quick Bar States
  const [showExcelImportModal, setShowExcelImportModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showQuickAddBar, setShowQuickAddBar] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState('single'); // 'single' | 'paste'
  const [quickName, setQuickName] = useState('');
  const [quickMobile, setQuickMobile] = useState('');
  const [quickRole, setQuickRole] = useState('Citizen');
  const [quickVillage, setQuickVillage] = useState('इटावा सदर');
  const [quickPasteText, setQuickPasteText] = useState('');
  const [quickAdding, setQuickAdding] = useState(false);

  // Quick Add Single Citizen
  const handleQuickSingleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!quickName.trim() || !quickMobile.trim()) {
      showToast?.('कृपया नाम और मोबाइल नंबर भरें', 'error');
      return;
    }
    const cleanMobile = quickMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      showToast?.('कृपया 10-अंकीय वैध मोबाइल नंबर दर्ज करें', 'error');
      return;
    }

    setQuickAdding(true);
    try {
      const res = await api.registerCitizen({
        name: quickName.trim(),
        mobile: cleanMobile,
        type: quickRole,
        category: quickRole,
        village: quickVillage,
        area: 'इटावा विधानसभा (200)',
        source: 'Quick Text Bar'
      });

      if (res?.success) {
        showToast?.(`संपर्क ${quickName.trim()} तुरंत डायरेक्टरी में जुड़ गया!`, 'success');
        setQuickName('');
        setQuickMobile('');
        await loadContacts();
      } else {
        showToast?.(res?.message || 'जोड़ने में त्रुटि हुई', 'error');
      }
    } catch (err) {
      showToast?.('सर्वर से संपर्क नहीं हो सका: ' + err.message, 'error');
    } finally {
      setQuickAdding(false);
    }
  };

  // Quick Paste Multi-Line Add
  const handleQuickPasteAdd = async () => {
    if (!quickPasteText.trim()) {
      showToast?.('कृपया कम से कम एक पंक्ति में नाम व मोबाइल नंबर पेस्ट करें', 'error');
      return;
    }

    const lines = quickPasteText.trim().split('\n');
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
          village: quickVillage || 'इटावा सदर',
          type: quickRole || 'Citizen'
        });
      }
    }

    if (records.length === 0) {
      showToast?.('टेक्स्ट में कोई वैध 10-अंकीय मोबाइल नंबर नहीं मिला।', 'error');
      return;
    }

    setQuickAdding(true);
    try {
      const res = await api.bulkImportCitizens(records, 'Quick Text Paste', 'Admin');
      if (res?.success) {
        showToast?.(`सफलतापूर्वक ${res.added} संपर्क डायरेक्टरी में जोड़े गए! (${res.duplicates} पहले से मौजूद थे)`, 'success');
        setQuickPasteText('');
        await loadContacts();
      } else {
        showToast?.(res?.message || 'इम्पोर्ट विफल रहा', 'error');
      }
    } catch (err) {
      showToast?.('सर्वर त्रुटि: ' + err.message, 'error');
    } finally {
      setQuickAdding(false);
    }
  };


  useEffect(() => {
    loadGrievances();
    loadRoles();
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoadingContacts(true);
    try {
      const res = await api.getCommunicationContacts();
      if (res?.success && res.contacts) {
        setContacts(res.contacts);
      }
    } catch (err) {
      console.error('Failed to load contacts', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const loadGrievances = async () => {
    setLoading(true);
    try {
      const res = await api.getJanSamvadGrievances();
      if (res?.success && res.data) {
        setGrievances(res.data);
      }
    } catch (err) {
      console.error('Failed to load grievances', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const res = await api.getJanSamvadRoles();
      if (res?.success && res.data) {
        setRolePermissions(res.data);
      }
    } catch (err) {
      console.error('Failed to load roles', err);
    }
  };

  // Send Broadcast Alert
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      showToast?.('कृपया संदेश दर्ज करें!', 'error');
      return;
    }
    setSending(true);
    try {
      const res = await api.sendAlert({
        title: broadcastType === 'whatsapp' ? 'व्हाट्सएप जन-अलर्ट' : 'एसएमएस बल्क अलर्ट',
        type: broadcastType === 'whatsapp' ? 'WhatsApp Broadcast' : 'SMS Bulk Alert',
        recipients: targetGroup === 'all' ? 'समस्त पंजीकृत नागरिक (1,420)' : targetGroup,
        message: messageText,
        user: `Admin (${currentRole})`
      });
      if (res?.success) {
        showToast?.(`${broadcastType.toUpperCase()} संदेश सफलतापूर्वक 1,420 नागरिकों को प्रेषित किया गया!`);
        setMessageText('');
      }
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  // Open Action Modal
  const openActionModal = (item) => {
    setSelectedGrievance(item);
    setActionStatus(item.status || 'in_progress');
    setActionNote(item.actionTakenNote || item.officialRemarks || '');
    setAssignedDepartment(item.department || item.category || '');
    setAssignedStaff(item.assignedStaff || '');
  };

  // Save Action with RBAC Validation
  const handleSaveAction = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    // Check Role Permission
    const roleConfig = rolePermissions[currentRole];
    if (roleConfig && actionStatus !== selectedGrievance.status) {
      const allowed = roleConfig.canUpdateStatus || [];
      if (!allowed.includes(actionStatus)) {
        showToast?.(`आपके पद (${roleConfig.roleName}) के पास इस स्थिति (${actionStatus}) में बदलने की अनुमति नहीं है!`, 'error');
        return;
      }
    }

    setSavingAction(true);
    try {
      const res = await api.updateJanSamvadAction(selectedGrievance.id, {
        status: actionStatus,
        actionTakenNote: actionNote,
        officialRemarks: actionNote,
        assignedStaff,
        department: assignedDepartment,
        userRole: currentRole,
        user: `Staff (${currentRole})`
      });

      if (res?.success) {
        showToast?.('कार्रवाई विवरण एवं स्थिति सफलतापूर्वक अपडेट कर दी गई!');
        setSelectedGrievance(null);
        loadGrievances();
      } else {
        showToast?.(res?.message || 'कार्रवाई सहेजने में त्रुटि आई', 'error');
      }
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setSavingAction(false);
    }
  };

  // Trigger Print Dialog
  const triggerPrintCase = (item) => {
    setPrintGrievance(item);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Filtered List
  const filteredGrievances = grievances.filter(g => {
    const matchesStatus = statusFilter === 'all' || (g.status || '').toLowerCase() === statusFilter.toLowerCase();
    const q = searchFilter.trim().toLowerCase();
    const matchesSearch = !q ||
      (g.citizenName && g.citizenName.toLowerCase().includes(q)) ||
      (g.mobile && g.mobile.includes(q)) ||
      (g.tokenNumber && g.tokenNumber.toLowerCase().includes(q)) ||
      (g.village && g.village.toLowerCase().includes(q)) ||
      (g.subject && g.subject.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = grievances.filter(g => g.status === 'pending').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Citizen Communication Suite</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            <span>कम्युनिकेशन एवं जनसंवाद (Communication & Broadcast)</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            व्हाट्सएप संदेश, एसएमएस अलर्ट एवं नागरिकों की समस्याओं, दस्तावेजों और पत्रों का केंद्रीकृत निवारण प्रबंधन।
          </p>
        </div>

        {/* Role Switcher & Permissions Manager */}
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-sm text-xs">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span className="font-bold text-slate-500">सक्रिय भूमिका:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="super_admin">सुपर एडमिन (Super Admin)</option>
              <option value="grievance_officer">जनसंवाद निवारण अधिकारी (Officer)</option>
              <option value="field_coordinator">क्षेत्रीय समन्वयक (Coordinator)</option>
              <option value="viewer">विभागीय दर्शक (Viewer)</option>
            </select>
          </div>

          <button
            onClick={() => setShowRoleMatrixModal(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            title="रोल व स्थिति प्रबंधन अनुमतियां देखें"
          >
            <Lock className="w-3.5 h-3.5 text-orange-400" />
            <span>रोल अनुमतियां</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('direct_mla_contact')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'direct_mla_contact'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>विधायक सीधा संपर्क (Direct WhatsApp Connect)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'direct_mla_contact' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}>
              Live
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('grievances')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'grievances'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-orange-300" />
            <span>जनसंवाद एवं शिकायत निवारण पटल</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'grievances' ? 'bg-orange-800 text-orange-100' : 'bg-orange-100 text-orange-700'
            }`}>
              {pendingCount} लंबित
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-semibold px-2">
          {activeTab === 'direct_mla_contact'
            ? 'मोबाइल नंबर डालकर या खोजकर सीधे व्हाट्सएप संदेश भेजें'
            : 'नागरिक शिकायतों, दस्तावेजों और विभागीय निर्देशों का निवारण'}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ==================== TAB 1: DIRECT MLA WHATSAPP CONNECT ================= */}
      {/* ========================================================================= */}
      {activeTab === 'direct_mla_contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Direct Message Composer & Single Quick Mobile Input */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Number WhatsApp Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      व्यक्ति का मोबाइल नंबर डालकर सीधा व्हाट्सएप
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      किसी भी नागरिक का 10 अंकों का मोबाइल नंबर दर्ज कर तुरंत संवाद करें
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      नागरिक का नाम (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="उदा: श्री रामेश्वर दयाल"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      मोबाइल नंबर (10 Digit) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+91</span>
                      <input
                        type="tel"
                        maxLength="10"
                        value={manualMobile}
                        onChange={(e) => setManualMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full text-xs pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Templates */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      संदेश सामग्री (Hindi / English) *
                    </label>
                    <VoiceInputButton
                      onTranscript={(txt) => setDirectMessageText(prev => prev ? prev + ' ' + txt : txt)}
                      mode="append"
                      size="sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <button
                      type="button"
                      onClick={() => setDirectMessageText("सादर प्रणाम! विधायक कार्यालय इटावा (200) से जनसेवा संवाद हेतु संपर्क किया जा रहा है। यदि आपके गाँव या क्षेत्र में कोई समस्या या सुझाव हो, तो कृपया हमें अवश्य अवगत कराएं।")}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition"
                    >
                      🌿 कुशलक्षेम व सुझाव
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectMessageText("सादर प्रणाम! आपके क्षेत्र के विकास कार्यों की समीक्षा व जनसुनवाई हेतु विधायक शिविर आयोजित हो रहा है। आपकी उपस्थिति सादर प्रार्थनीय है।")}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition"
                    >
                      🏛️ शिविर निमंत्रण
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectMessageText("सादर प्रणाम! आपके द्वारा दिए गए प्रार्थना पत्र / समस्या पर त्वरित संज्ञान लेकर संबंधित विभाग को आवश्यक निर्देश दे दिए गए हैं।")}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition"
                    >
                      ✅ समस्या निस्तारण
                    </button>
                  </div>
                  <textarea
                    rows="5"
                    value={directMessageText}
                    onChange={(e) => setDirectMessageText(e.target.value)}
                    placeholder="आदरणीय क्षेत्रवासी, सादर प्रणाम! विधायक श्रीमती सरिता भदौरिया कार्यालय से संपर्क किया जा रहा है..."
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>{directMessageText.length} वर्ण</span>
                    <span>विधायक कार्यालय अधिकृत संदेश</span>
                  </div>
                </div>

                {/* Direct Single WhatsApp Trigger */}
                <button
                  type="button"
                  onClick={async () => {
                    if (!manualMobile || manualMobile.length < 10) {
                      showToast?.('कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें!', 'error');
                      return;
                    }
                    if (!directMessageText.trim()) {
                      showToast?.('कृपया संदेश सामग्री दर्ज करें!', 'error');
                      return;
                    }
                    const greeting = manualName ? `सादर प्रणाम ${manualName} जी,\n\n` : `सादर प्रणाम,\n\n`;
                    const fullMsg = `${greeting}${directMessageText}\n\n— श्रीमती सरिता भदौरिया (विधायक, 200 - इटावा विधानसभा)`;
                    
                    window.open(`https://api.whatsapp.com/send?phone=91${manualMobile}&text=${encodeURIComponent(fullMsg)}`, '_blank');
                    
                    try {
                      await api.logDirectMessage({
                        recipients: { name: manualName || 'नागरिक', mobile: manualMobile },
                        message: fullMsg,
                        user: `MLA / Office (${currentRole})`
                      });
                      showToast?.('व्हाट्सएप चैट विंडो सफलतापूर्वक खोल दी गई!');
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>सीधा व्हाट्सएप संदेश भेजें (Open WhatsApp Chat)</span>
                </button>
              </div>
            </div>

            {/* Quick Summary of Selected Contacts */}
            {selectedContactIds.length > 0 && (
              <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900">
                      चयनित नागरिक ({selectedContactIds.length} लोग)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedContactIds([])}
                    className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                  >
                    चयन रद्द करें
                  </button>
                </div>

                <p className="text-[11px] text-emerald-800">
                  इन सभी <strong>{selectedContactIds.length}</strong> नागरिकों को व्यक्तिगत संदेश क्रमिक रूप से भेजा जा सकता है।
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (!directMessageText.trim()) {
                      showToast?.('कृपया पहले संदेश सामग्री लिखें!', 'error');
                      return;
                    }
                    setActiveBatchIndex(0);
                    setShowBatchModal(true);
                  }}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>चयनित {selectedContactIds.length} लोगों को क्रमिक व्हाट्सएप भेजें</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Searchable Directory & Multi-Select Contact List */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>नागरिक एवं संपर्क डायरेक्टरी (Search & Multi-Select Directory)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  नाम या मोबाइल नंबर से खोजें और एक या अनेक नागरिकों को चुनकर व्हाट्सएप करें
                </p>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {contacts.length} कुल पंजीकृत संपर्क
              </span>
            </div>

            {/* Quick Contact Creation Action Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <span className="text-emerald-700 font-extrabold">+ नया संपर्क जोड़ें:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddBar(prev => !prev)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                    showQuickAddBar
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white hover:bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                  title="एक क्लिक में नाम व मोबाइल नंबर लिखकर जोड़ें"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>⚡ त्वरित टेक्स्ट बार</span>
                  {showQuickAddBar ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowExcelImportModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg border border-emerald-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  title="MS Excel या CSV फ़ाइल से पूरी सूची एक साथ अपलोड करें"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>📊 एक्सेल से लिस्ट अपलोड</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddContactModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg border border-blue-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  title="फोटो, पद, गाँव व विवरण सहित नया संपर्क जोड़ें"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>👤 नया संपर्क (+ Photo)</span>
                </button>
              </div>
            </div>

            {/* Collapsible Quick Inline Text Bar */}
            {showQuickAddBar && (
              <div className="bg-amber-50/60 border-2 border-amber-200 rounded-xl p-3.5 space-y-3 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                    <span className="text-xs font-bold text-amber-900">
                      त्वरित टेक्स्ट बार — नाम व मोबाइल लिखकर सीधे डायरेक्टरी में जोड़ें
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-amber-200 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setQuickAddMode('single')}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                        quickAddMode === 'single'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-amber-800'
                      }`}
                    >
                      एकल प्रविष्टि (Single)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickAddMode('paste')}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                        quickAddMode === 'paste'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-amber-800'
                      }`}
                    >
                      मल्टी-लाइन पेस्ट (Paste List)
                    </button>
                  </div>
                </div>

                {quickAddMode === 'single' ? (
                  <form onSubmit={handleQuickSingleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        placeholder="नागरिक का नाम *"
                        className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                        className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <select
                        value={quickRole}
                        onChange={(e) => setQuickRole(e.target.value)}
                        className="w-full text-xs px-2 py-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Citizen">नागरिक (Citizen)</option>
                        <option value="Supporter">समर्थक (Supporter)</option>
                        <option value="Karyakarta">कार्यकर्ता (Karyakarta)</option>
                        <option value="Booth President">बूथ अध्यक्ष (Booth Pres.)</option>
                        <option value="Gram Pradhan">ग्राम प्रधान (Pradhan)</option>
                        <option value="Youth Wing">युवा मोर्चा (Youth)</option>
                        <option value="VIP / Prominent">विशिष्ट नागरिक (VIP)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={quickAdding || !quickName.trim() || quickMobile.length !== 10}
                        className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{quickAdding ? '...' : '+ जोड़ें'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-amber-800">
                      नीचे प्रत्येक पंक्ति में <strong>नाम और मोबाइल नंबर</strong> पेस्ट करें (उदा: <code>अमित कुमार 9876543210</code> या <code>सुनील - 9876543211</code>):
                    </p>
                    <textarea
                      rows={3}
                      value={quickPasteText}
                      onChange={(e) => setQuickPasteText(e.target.value)}
                      placeholder="राजेश कुमार 9876543210&#10;महेश सिंह 9876543211&#10;अमित शर्मा 9876543212"
                      className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        प्रत्येक पंक्ति से 10-अंकीय मोबाइल नंबर व नाम स्वतः निकाले जाएंगे
                      </span>
                      <button
                        type="button"
                        onClick={handleQuickPasteAdd}
                        disabled={quickAdding || !quickPasteText.trim()}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>{quickAdding ? 'जोड़ रहे हैं...' : '+ सभी को डायरेक्टरी में जोड़ें'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Search Bar & Batch Controls */}
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="नाम, मोबाइल नंबर या गाँव खोजें..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Select All Toggle */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const filtered = contacts.filter(c => {
                      const q = contactSearch.trim().toLowerCase();
                      return !q || c.name.toLowerCase().includes(q) || c.mobile.includes(q) || c.village.toLowerCase().includes(q);
                    });
                    if (selectedContactIds.length === filtered.length && filtered.length > 0) {
                      setSelectedContactIds([]);
                    } else {
                      setSelectedContactIds(filtered.map(c => c.id || c.mobile));
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>सभी चुनें ({contacts.filter(c => {
                    const q = contactSearch.trim().toLowerCase();
                    return !q || c.name.toLowerCase().includes(q) || c.mobile.includes(q) || c.village.toLowerCase().includes(q);
                  }).length})</span>
                </button>
              </div>
            </div>

            {/* Contacts Directory Table / List */}
            <div className="overflow-hidden border border-slate-200 rounded-2xl max-h-[550px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-10 text-center">चुनें</th>
                    <th className="p-3">नागरिक का नाम</th>
                    <th className="p-3">मोबाइल नंबर</th>
                    <th className="p-3">गाँव / क्षेत्र</th>
                    <th className="p-3">श्रेणी / स्रोत</th>
                    <th className="p-3 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts
                    .filter(c => {
                      const q = contactSearch.trim().toLowerCase();
                      return !q || c.name.toLowerCase().includes(q) || c.mobile.includes(q) || c.village.toLowerCase().includes(q);
                    })
                    .map((c) => {
                      const cid = c.id || c.mobile;
                      const isSelected = selectedContactIds.includes(cid);
                      return (
                        <tr
                          key={cid}
                          className={`hover:bg-slate-50 transition cursor-pointer ${
                            isSelected ? 'bg-emerald-50/50' : ''
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedContactIds(prev => prev.filter(id => id !== cid));
                            } else {
                              setSelectedContactIds(prev => [...prev, cid]);
                            }
                          }}
                        >
                          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedContactIds(prev => [...prev, cid]);
                                } else {
                                  setSelectedContactIds(prev => prev.filter(id => id !== cid));
                                }
                              }}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              {c.photo ? (
                                <img
                                  src={c.photo}
                                  alt={c.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                                  {c.name ? c.name.charAt(0) : 'न'}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">{c.name}</div>
                                {c.fatherSpouseName && (
                                  <div className="text-[10px] text-slate-400 truncate">
                                    सुपुत्र/पत्नी: {c.fatherSpouseName}
                                  </div>
                                )}
                                {c.token && (
                                  <span className="text-[10px] font-mono font-normal text-slate-400">टोकन: {c.token}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono font-semibold text-slate-700">
                            {c.mobile}
                          </td>
                          <td className="p-3 text-slate-600 font-medium">
                            {c.village}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {c.category}
                            </span>
                          </td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                setManualName(c.name);
                                setManualMobile(c.mobile);
                                setSelectedContactIds([cid]);
                                if (!directMessageText) {
                                  setDirectMessageText("सादर प्रणाम! विधायक कार्यालय इटावा (200) से जनसेवा संवाद हेतु संपर्क किया जा रहा है।");
                                }
                                showToast?.(`${c.name} को संदेश लिखने हेतु चुना गया`);
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition inline-flex items-center gap-1 cursor-pointer"
                              title="संदेश लिखें"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>चैट करें</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {contacts.filter(c => {
                const q = contactSearch.trim().toLowerCase();
                return !q || c.name.toLowerCase().includes(q) || c.mobile.includes(q) || c.village.toLowerCase().includes(q);
              }).length === 0 && (
                <div className="text-center py-10 text-xs text-slate-500">
                  कोई संपर्क नहीं मिला।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ==================== TAB 2: GRIEVANCES & BROADCAST SUITE ================ */}
      {/* ========================================================================= */}
      {activeTab === 'grievances' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ===================== LEFT: BROADCAST SENDER FORM ===================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-orange-600" />
              <span>पब्लिक ब्रॉडकास्ट संदेश भेजें</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Active Gateway
            </span>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">माध्यम चुनें (Channel)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastType('whatsapp')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    broadcastType === 'whatsapp'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5"></span>
                  <span>WhatsApp Broadcast</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastType('sms')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    broadcastType === 'sms'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>📲 SMS Bulk Alert</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">लक्षित वर्ग (Target Audience)</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full text-xs p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="all">समस्त पंजीकृत नागरिक (1,420)</option>
                <option value="farmers">किसान वर्ग (कृषि योजनाएं)</option>
                <option value="youth">युवा वर्ग (रोजगार व शिक्षा)</option>
                <option value="women">महिला समूह (कल्याणकारी योजनाएं)</option>
                <option value="booth_agents">बूथ प्रभारी व कार्यकर्ता</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">संदेश सामग्री (Hindi / English)</label>
                <VoiceInputButton onTranscript={(txt) => setMessageText(prev => prev ? prev + ' ' + txt : txt)} />
              </div>
              <textarea
                rows="4"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="आदरणीय क्षेत्रवासी, सादर प्रणाम! कल दिनांक 16 सितंबर को ग्राम रामपुर में विधायक जनसुनवाई शिविर का आयोजन होगा..."
                className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'संदेश प्रेषित...' : 'सिस्टम ब्रॉडकास्ट'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!messageText.trim()) {
                    showToast?.('कृपया पहले संदेश दर्ज करें!', 'error');
                    return;
                  }
                  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
                  window.open(waUrl, '_blank');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर शेयर</span>
              </button>
            </div>
          </form>
        </div>

        {/* ===================== RIGHT: GRIEVANCES & QUERIES LIST ===================== */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>नागरिक समस्याएं एवं जनसंवाद पत्र (Queries & Grievances)</span>
            </h3>
            <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              {pendingCount} लंबित पत्र
            </span>
          </div>

          {/* Search and Status Filters */}
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="नाम, टोकन, मोबाइल या गाँव खोजें..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-[11px] w-full sm:w-auto justify-end">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                सभी ({grievances.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  statusFilter === 'pending' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'
                }`}
              >
                लंबित ({grievances.filter(g => g.status === 'pending').length})
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  statusFilter === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'
                }`}
              >
                प्रगति पर ({grievances.filter(g => g.status === 'in_progress').length})
              </button>
              <button
                onClick={() => setStatusFilter('resolved')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  statusFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                निस्तारित ({grievances.filter(g => g.status === 'resolved').length})
              </button>
            </div>
          </div>

          {/* Grievance Cards List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredGrievances.length > 0 ? (
              filteredGrievances.map((q) => (
                <div key={q.id} className="p-4 border rounded-xl bg-slate-50 hover:bg-white transition space-y-2 border-slate-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{q.citizenName}</h4>
                        <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                          {q.tokenNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {q.village} • मो: {q.mobile} {q.department && `• विभाग: ${q.department}`}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      q.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : q.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : q.status === 'forwarded_dept'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {q.status === 'resolved' && 'निस्तारित'}
                      {q.status === 'in_progress' && 'प्रगति पर'}
                      {q.status === 'forwarded_dept' && 'अग्रेषित'}
                      {q.status === 'pending' && 'लंबित'}
                      {q.status === 'reviewed' && 'समीक्षित'}
                      {q.status === 'rejected' && 'अस्वीकृत'}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    {q.subject}
                  </p>

                  {/* Attached Documents badge if available */}
                  {q.attachedDocuments?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold bg-blue-50/60 px-2 py-1 rounded">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{q.attachedDocuments.length} जरूरी दस्तावेज / फोटो संलग्न</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-400">दिनांक: {q.dateDisplay || '15 मार्च 2026'}</span>
                    
                    <div className="flex items-center gap-2">
                      {/* Direct WhatsApp Response */}
                      <a
                        href={`https://api.whatsapp.com/send?phone=91${q.mobile}&text=${encodeURIComponent(`सादर प्रणाम ${q.citizenName} जी, विधायक कार्यालय (इटावा 200) से आपके जनसंवाद पत्र ("${q.subject}" - टोकन: ${q.tokenNumber}) के संबंध में संपर्क किया जा रहा है। वर्तमान स्थिति: ${q.status === 'resolved' ? 'निस्तारित' : q.status === 'in_progress' ? 'प्रगति पर' : 'लंबित'}।`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                        title="नागरिक को व्हाट्सएप भेजें"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp जवाब</span>
                      </a>

                      {/* Print Case File */}
                      <button
                        onClick={() => triggerPrintCase(q)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
                        title="दस्तावेज व रिपोर्ट प्रिंट करें"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>प्रिंट</span>
                      </button>

                      {/* Action Modal Trigger */}
                      <button
                        onClick={() => openActionModal(q)}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 transition"
                      >
                        कार्रवाई करें →
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">कोई पत्र या शिकायत नहीं मिली।</p>
              </div>
            )}
          </div>
        </div>

      </div>
      )}

      {/* ========================================================================= */}
      {/* =================== MULTI-CONTACT BATCH WHATSAPP MODAL ================== */}
      {/* ========================================================================= */}
      {showBatchModal && selectedContactIds.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowBatchModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  बहु-नागरिक क्रमिक व्हाट्सएप सहायक (Multi WhatsApp Queue)
                </h3>
                <p className="text-xs text-slate-500">
                  चयनित {selectedContactIds.length} नागरिकों को विधायक स्तर का संदेश भेजें
                </p>
              </div>
            </div>

            <div className="my-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">वर्तमान नागरिक ({activeBatchIndex + 1} / {selectedContactIds.length}):</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {contacts.filter(c => selectedContactIds.includes(c.id || c.mobile))[activeBatchIndex]?.name}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">मोबाइल नंबर:</span>
                <span className="font-mono font-bold text-slate-800">
                  +91 {contacts.filter(c => selectedContactIds.includes(c.id || c.mobile))[activeBatchIndex]?.mobile}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">गाँव / क्षेत्र:</span>
                <span className="text-slate-800">
                  {contacts.filter(c => selectedContactIds.includes(c.id || c.mobile))[activeBatchIndex]?.village}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                भेजा जाने वाला संदेश प्रीव्यू:
              </label>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 max-h-32 overflow-y-auto whitespace-pre-wrap">
                {`सादर प्रणाम ${contacts.filter(c => selectedContactIds.includes(c.id || c.mobile))[activeBatchIndex]?.name || 'नागरिक'} जी,\n\n${directMessageText}\n\n— श्रीमती सरिता भदौरिया (विधायक, 200 - इटावा विधानसभा)`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={async () => {
                  const targetList = contacts.filter(c => selectedContactIds.includes(c.id || c.mobile));
                  const target = targetList[activeBatchIndex];
                  if (!target) return;
                  const finalMsg = `सादर प्रणाम ${target.name} जी,\n\n${directMessageText}\n\n— श्रीमती सरिता भदौरिया (विधायक, 200 - इटावा विधानसभा)`;
                  window.open(`https://api.whatsapp.com/send?phone=91${target.mobile}&text=${encodeURIComponent(finalMsg)}`, '_blank');
                  
                  if (activeBatchIndex + 1 < targetList.length) {
                    setActiveBatchIndex(prev => prev + 1);
                  } else {
                    await api.logDirectMessage({
                      recipients: targetList,
                      message: finalMsg,
                      user: `MLA / Office (${currentRole})`
                    });
                    showToast?.('सभी चयनित नागरिकों को व्हाट्सएप संदेश प्रेषित कर दिया गया!', 'success');
                    setShowBatchModal(false);
                    setSelectedContactIds([]);
                  }
                }}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>व्हाट्सएप खोलें और अगला</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetList = contacts.filter(c => selectedContactIds.includes(c.id || c.mobile));
                  if (activeBatchIndex + 1 < targetList.length) {
                    setActiveBatchIndex(prev => prev + 1);
                  } else {
                    setShowBatchModal(false);
                  }
                }}
                className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                इन्हें छोड़ें (Skip)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================== 1. ACTION & STATUS MODAL ======================= */}
      {/* ========================================================================= */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                  {selectedGrievance.tokenNumber}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  जनसंवाद समस्या पर कार्रवाई व स्थिति अपडेट
                </h3>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Citizen Summary Info */}
            <div className="my-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">नागरिक का नाम:</span>
                <span className="font-bold text-slate-900">{selectedGrievance.citizenName} ({selectedGrievance.fatherSpouseName || ''})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">स्थान / गाँव:</span>
                <span className="font-bold text-slate-800">{selectedGrievance.village}, {selectedGrievance.block}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">मोबाइल:</span>
                <span className="font-mono text-slate-800">{selectedGrievance.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">विषय:</span>
                <span className="font-bold text-slate-900">{selectedGrievance.subject}</span>
              </div>
              {selectedGrievance.description && (
                <div className="pt-2 border-t border-slate-200 mt-2 text-slate-700">
                  <strong>विवरण:</strong> {selectedGrievance.description}
                </div>
              )}
            </div>

            {/* Attached Documents Preview */}
            {selectedGrievance.attachedDocuments?.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">संलग्न जरूरी दस्तावेज:</label>
                <div className="flex flex-wrap gap-2">
                  {selectedGrievance.attachedDocuments.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-50 border rounded-xl flex items-center gap-2 hover:border-blue-400 text-xs text-blue-600 font-bold"
                    >
                      <img src={doc.url} alt="doc" className="w-10 h-10 object-cover rounded" />
                      <span>{doc.name} (देखें)</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action Form */}
            <form onSubmit={handleSaveAction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    अद्यतन स्थिति चुनें (Select New Status) *
                  </label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">⏱️ लंबित (Pending)</option>
                    <option value="reviewed">👁️ समीक्षित (Under Review)</option>
                    <option value="in_progress">⏳ कार्रवाई प्रगति पर (In Progress)</option>
                    <option value="forwarded_dept">↗ संबंधित विभाग को प्रेषित (Forwarded)</option>
                    <option value="resolved">✓ पूर्णतः निस्तारित (Resolved)</option>
                    <option value="rejected">✕ अस्वीकृत (Rejected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    संबंधित विभाग / संस्था
                  </label>
                  <input
                    type="text"
                    value={assignedDepartment}
                    onChange={(e) => setAssignedDepartment(e.target.value)}
                    placeholder="उदा: ग्राम्य विकास, विद्युत, PWD..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कार्यालय सहायक / अधिकृत अधिकारी (Assigned Staff)
                </label>
                <input
                  type="text"
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  placeholder="उदा: श्री अजय कुमार (कार्यालय सहायक)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कार्रवाई आख्या / कार्यालयीय टिप्पणी (Action Taken Remarks) *
                </label>
                <textarea
                  rows="3"
                  required
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="समस्या पर क्या कार्रवाई की गई अथवा किस अधिकारी को आदेशित किया गया, यहाँ दर्ज करें..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => triggerPrintCase(selectedGrievance)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>रिपोर्ट प्रिंट करें</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGrievance(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={savingAction}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingAction ? 'सहेजा जा रहा है...' : 'स्थिति व कार्रवाई सहेजें'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================== 2. PRINTABLE OFFICIAL CASE FILE ================ */}
      {/* ========================================================================= */}
      {printGrievance && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 z-[9999] text-black text-sm">
          {/* Official Letterhead */}
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center text-center">
            <div className="text-left">
              <h2 className="text-xl font-extrabold">कार्यालय विधायिका</h2>
              <p className="text-xs font-bold">200 - इटावा विधानसभा, उत्तर प्रदेश</p>
              <p className="text-[11px]">केंद्रीय कैंप कार्यालय: सिविल लाइंस, इटावा</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold border border-black px-2 py-0.5 rounded">
                जनसंवाद संदर्भ पत्र
              </span>
              <p className="text-xs mt-1">टोकन: <strong>{printGrievance.tokenNumber}</strong></p>
              <p className="text-[11px]">दिनांक: {printGrievance.dateDisplay || new Date().toLocaleDateString('hi-IN')}</p>
            </div>
          </div>

          {/* Grievance Summary Box */}
          <div className="border border-black p-4 rounded mb-6 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>आवेदक का नाम:</strong> {printGrievance.citizenName}</div>
              <div><strong>पिता/पति:</strong> {printGrievance.fatherSpouseName || '-'}</div>
              <div><strong>गाँव / क्षेत्र:</strong> {printGrievance.village}, {printGrievance.block}</div>
              <div><strong>मोबाइल:</strong> {printGrievance.mobile}</div>
              <div><strong>विभाग / श्रेणी:</strong> {printGrievance.department || printGrievance.category}</div>
              <div><strong>वर्तमान स्थिति:</strong> {printGrievance.status}</div>
            </div>

            <div className="pt-2 border-t border-black mt-2">
              <strong>समस्या का विषय:</strong> {printGrievance.subject}
            </div>
            <div>
              <strong>विवरण:</strong> {printGrievance.description}
            </div>
          </div>

          {/* Attached Document Photo Preview on Print Sheet */}
          {printGrievance.attachedDocuments?.length > 0 && (
            <div className="border border-black p-4 rounded mb-6 text-xs">
              <h4 className="font-bold mb-2">संलग्न दस्तावेज / प्रार्थना पत्र की प्रति:</h4>
              <div className="flex gap-4">
                {printGrievance.attachedDocuments.map((d, idx) => (
                  <div key={idx} className="border border-gray-400 p-1">
                    <img src={d.url} alt="attached" className="max-h-48 max-w-xs object-contain" />
                    <span className="block text-[10px] text-center mt-1">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Referral Order to Department */}
          <div className="border border-black p-4 rounded mb-8 text-xs leading-relaxed">
            <h4 className="font-bold mb-1">कार्यालयीय आदेश / संदर्भित निर्देश (Action Order):</h4>
            <p className="mb-2">
              <strong>प्रति:</strong> संबंधित विभागाध्यक्ष / अधिकारी, {printGrievance.department || 'संबंधित विभाग'}, जनपद इटावा।
            </p>
            <p>
              महोदय, उपर्युक्त प्रकरण जनसंवाद पटल पर प्राप्त हुआ है। प्रकरण जनहित एवं आवश्यक प्राथमिकता से संबंधित है। कृपया प्रकरण का स्थलीय निरीक्षण कर नियमानुसार त्वरित निस्तारण सुनिश्चित करें एवं की गई कार्रवाई से अधोहस्ताक्षरी कार्यालय को अवगत कराएं।
            </p>
            {printGrievance.actionTakenNote && (
              <p className="mt-2 text-blue-900">
                <strong>पूर्व कार्रवाई आख्या:</strong> {printGrievance.actionTakenNote}
              </p>
            )}
          </div>

          {/* Signature Block */}
          <div className="flex justify-between items-end pt-12 text-xs">
            <div>
              <p>प्रतिलिपि: आवेदक {printGrievance.citizenName} को सूचनार्थ।</p>
              <p>कंप्यूटर जनरेटेड अधिकृत जनसंवाद प्रपत्र</p>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-black mb-1"></div>
              <p className="font-bold">अधिकृत हस्ताक्षर / मुहर</p>
              <p className="text-[11px]">विधायक कैंप कार्यालय, इटावा (200)</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================== 3. ROLE PERMISSION MATRIX MODAL ================ */}
      {/* ========================================================================= */}
      {showRoleMatrixModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    जनसंवाद रोल व स्थिति प्रबंधन अनुमति व्यवस्था (RBAC Matrix)
                  </h3>
                  <p className="text-xs text-slate-500">
                    निर्धारित करें कि किस उपयोगकर्ता पद के पास कौन-कौन सी स्थिति बदलने का अधिकार होगा।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleMatrixModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 border">उपयोगकर्ता पद (Staff Role)</th>
                    <th className="p-3 border text-center">लंबित → समीक्षित</th>
                    <th className="p-3 border text-center">प्रगति पर</th>
                    <th className="p-3 border text-center">विभाग को अग्रेषित</th>
                    <th className="p-3 border text-center">पूर्णतः निस्तारित</th>
                    <th className="p-3 border text-center">रिपोर्ट प्रिंट</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {Object.entries(rolePermissions).map(([key, config]) => (
                    <tr key={key} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 border">
                        <div>{config.roleName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{key}</span>
                      </td>
                      <td className="p-3 text-center border">
                        {config.canUpdateStatus?.includes('reviewed') ? (
                          <span className="text-emerald-600 font-bold">✓ अधिकृत</span>
                        ) : (
                          <span className="text-slate-400">✕</span>
                        )}
                      </td>
                      <td className="p-3 text-center border">
                        {config.canUpdateStatus?.includes('in_progress') ? (
                          <span className="text-emerald-600 font-bold">✓ अधिकृत</span>
                        ) : (
                          <span className="text-slate-400">✕</span>
                        )}
                      </td>
                      <td className="p-3 text-center border">
                        {config.canUpdateStatus?.includes('forwarded_dept') ? (
                          <span className="text-emerald-600 font-bold">✓ अधिकृत</span>
                        ) : (
                          <span className="text-slate-400">✕</span>
                        )}
                      </td>
                      <td className="p-3 text-center border">
                        {config.canUpdateStatus?.includes('resolved') ? (
                          <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">✓ पूर्ण अधिकार</span>
                        ) : (
                          <span className="text-rose-500 font-semibold">केवल सुपर एडमिन</span>
                        )}
                      </td>
                      <td className="p-3 text-center border">
                        {config.canPrintReport ? (
                          <span className="text-emerald-600 font-bold">✓ हां</span>
                        ) : (
                          <span className="text-slate-400">✕</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowRoleMatrixModal(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                समझ गए (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Contact Import Modal */}
      <ExcelContactImportModal
        isOpen={showExcelImportModal}
        onClose={() => setShowExcelImportModal(false)}
        onSuccess={loadContacts}
        showToast={showToast}
      />

      {/* Detailed Add Contact Modal (+ Photo, Role, Village) */}
      <AddContactModal
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        onSuccess={loadContacts}
        showToast={showToast}
      />
    </div>
  );
}

