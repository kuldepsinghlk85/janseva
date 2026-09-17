import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  MapPin,
  Tag,
  Layers,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Building2,
  FolderTree,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  Check,
  X,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Database,
  Eye,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminMasterDataManager() {
  const [activeTab, setActiveTab] = useState('villages'); // 'villages' | 'excel' | 'hierarchy' | 'categories' | 'tags'
  const [villages, setVillages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tehsilBlocks, setTehsilBlocks] = useState([]);
  const [hierarchy, setHierarchy] = useState({ tehsils: [], blocks: [], states: [], districts: [], assemblies: [] });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Filters for Explorer
  const [selectedTehsil, setSelectedTehsil] = useState('All');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [villageModal, setVillageModal] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);

  // Excel Importer State
  const [excelFile, setExcelFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseStats, setParseStats] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMode, setImportMode] = useState('file'); // 'file' | 'paste'
  const [pastedText, setPastedText] = useState('');

  // Form State for Single Village
  const defaultVillageForm = {
    state: 'Uttar Pradesh',
    district: 'Etawah',
    assembly: 'Etawah Assembly',
    tehsil: 'Etawah',
    block: 'Barhpura',
    village: '',
    nameHi: '',
    villageCategory: 'Village',
    sampleTag: 'Development',
    pincode: '206001'
  };
  const [villageForm, setVillageForm] = useState(defaultVillageForm);

  const [newCategory, setNewCategory] = useState({
    nameHi: '',
    name: '',
    type: 'both',
    color: 'orange'
  });

  const [newTag, setNewTag] = useState({
    name: ''
  });

  // User's default sample rows for reference & template download
  const sampleExcelData = useMemo(() => [
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Etawah', Block: 'Barhpura', Village: 'Aarazi Jadhonpur', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Etawah', Block: 'Barhpura', Village: 'Ajabpur Jhingupur', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Etawah', Block: 'Basrehar', Village: 'Ahladpur', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Etawah', Block: 'Basrehar', Village: 'Akbarpur', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Etawah', Block: 'Basrehar', Village: 'Amritpur', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Saifai', Block: 'Saifai', Village: 'Atirajpur', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Saifai', Block: 'Saifai', Village: 'Ujhiyani', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Jaswantnagar', Block: 'Jaswantnagar', Village: 'Ajnoura', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Chakarnagar', Block: 'Chakarnagar', Village: 'Acharoli', Village_Category: 'Village', Sample_Tag: 'Development' },
    { State: 'Uttar Pradesh', District: 'Etawah', Assembly: 'Etawah Assembly', Tehsil: 'Chakarnagar', Block: 'Chakarnagar', Village: 'Andawa', Village_Category: 'Village', Sample_Tag: 'Development' }
  ], []);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [res, tbRes] = await Promise.all([
        api.getAllMasterData(),
        api.getTehsilBlocks()
      ]);
      if (res && res.success && res.data) {
        setVillages(res.data.villages || []);
        setCategories(res.data.categories || []);
        setTags(res.data.tags || []);
        if (res.data.hierarchy) {
          setHierarchy(res.data.hierarchy);
        }
      }
      if (tbRes && tbRes.success && tbRes.data) {
        setTehsilBlocks(tbRes.data);
      }
    } catch (e) {
      console.error('Error loading master data:', e);
      showFeedback('मास्टर डेटा लोड करने में त्रुटि', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Distinct Tehsils & Blocks for Filter Dropdowns
  const tehsilsList = useMemo(() => {
    const set = new Set();
    tehsilBlocks.forEach(tb => { if (tb.tehsil) set.add(tb.tehsil); });
    villages.forEach(v => {
      if (v.tehsil) set.add(v.tehsil);
    });
    return Array.from(set);
  }, [villages, tehsilBlocks]);

  const blocksList = useMemo(() => {
    const set = new Set();
    tehsilBlocks.forEach(tb => {
      if (selectedTehsil === 'All' || tb.tehsil.toLowerCase() === selectedTehsil.toLowerCase()) {
        if (tb.block) set.add(tb.block);
      }
    });
    villages.forEach(v => {
      if (selectedTehsil === 'All' || (v.tehsil || '').toLowerCase() === selectedTehsil.toLowerCase()) {
        if (v.block) set.add(v.block);
      }
    });
    return Array.from(set);
  }, [villages, selectedTehsil, tehsilBlocks]);

  const categoriesFilterList = useMemo(() => {
    const set = new Set();
    villages.forEach(v => {
      if (v.villageCategory) set.add(v.villageCategory);
    });
    return Array.from(set);
  }, [villages]);

  // Filtered Villages
  const filteredVillages = useMemo(() => {
    return villages.filter(v => {
      const matchTehsil = selectedTehsil === 'All' || (v.tehsil || '').toLowerCase() === selectedTehsil.toLowerCase();
      const matchBlock = selectedBlock === 'All' || (v.block || '').toLowerCase() === selectedBlock.toLowerCase();
      const matchCategory = selectedCategory === 'All' || (v.villageCategory || '').toLowerCase() === selectedCategory.toLowerCase();
      
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || (
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.nameHi && v.nameHi.toLowerCase().includes(q)) ||
        (v.block && v.block.toLowerCase().includes(q)) ||
        (v.tehsil && v.tehsil.toLowerCase().includes(q)) ||
        (v.sampleTag && v.sampleTag.toLowerCase().includes(q))
      );

      return matchTehsil && matchBlock && matchCategory && matchSearch;
    });
  }, [villages, selectedTehsil, selectedBlock, selectedCategory, searchTerm]);

  // =================== EXCEL IMPORTER HANDLERS ===================
  
  // Parse raw sheet data
  const processRawRows = (rawRows) => {
    const normalizedRows = [];
    const tehsilsSet = new Set();
    const blocksSet = new Set();
    const villagesSet = new Set();

    rawRows.forEach(row => {
      // Find keys case-insensitively
      const getVal = (possibleKeys) => {
        for (const k of Object.keys(row)) {
          const cleanK = k.trim().toLowerCase().replace(/[\s_-]+/g, '');
          for (const pk of possibleKeys) {
            if (cleanK === pk.toLowerCase().replace(/[\s_-]+/g, '')) {
              return row[k];
            }
          }
        }
        return '';
      };

      const state = String(getVal(['state', 'राज्य']) || 'Uttar Pradesh').trim();
      const district = String(getVal(['district', 'जिला']) || 'Etawah').trim();
      const assembly = String(getVal(['assembly', 'विधानसभा']) || 'Etawah Assembly').trim();
      const tehsil = String(getVal(['tehsil', 'तहसील']) || 'Etawah').trim();
      const block = String(getVal(['block', 'विकासखंड', 'ब्लॉक']) || 'Barhpura').trim();
      const village = String(getVal(['village', 'particular', 'गाँव', 'ग्राम', 'क्षेत्र', 'वार्ड']) || '').trim();
      const villageCategory = String(getVal(['village_category', 'villagecategory', 'category', 'श्रेणी']) || 'Village').trim();
      const sampleTag = String(getVal(['sample_tag', 'sampletag', 'tag', 'टैग']) || 'Development').trim();

      if (village) {
        normalizedRows.push({
          State: state,
          District: district,
          Assembly: assembly,
          Tehsil: tehsil,
          Block: block,
          Village: village,
          Village_Category: villageCategory,
          Sample_Tag: sampleTag
        });
        tehsilsSet.add(tehsil);
        blocksSet.add(block);
        villagesSet.add(village);
      }
    });

    setParsedRows(normalizedRows);
    setParseStats({
      totalRows: normalizedRows.length,
      tehsilsCount: tehsilsSet.size,
      blocksCount: blocksSet.size,
      villagesCount: villagesSet.size,
      tehsils: Array.from(tehsilsSet),
      blocks: Array.from(blocksSet)
    });
  };

  // Handle File Input (.xlsx, .xls, .csv)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        processRawRows(json);
        showFeedback(`एक्सेल फाइल से ${json.length} पंक्तियाँ लोड हुईं!`);
      } catch (err) {
        console.error('Failed to parse Excel file:', err);
        showFeedback('एक्सेल फाइल पढ़ने में त्रुटि। कृपया मान्य .xlsx या .csv फाइल अपलोड करें।', 'error');
      }
    };

    reader.readAsBinaryString(file);
  };

  // Handle Direct Paste from Excel
  const handlePasteProcess = () => {
    if (!pastedText.trim()) {
      showFeedback('कृपया एक्सेल से कॉपी किया गया डेटा पेस्ट करें', 'error');
      return;
    }

    try {
      const lines = pastedText.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      // Check delimiter (Tab or Comma)
      const firstLine = lines[0];
      const delimiter = firstLine.includes('\t') ? '\t' : ',';

      const headers = lines[0].split(delimiter).map(h => h.trim());
      const rawRows = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim());
        const rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });
        rawRows.push(rowObj);
      }

      processRawRows(rawRows);
      showFeedback(`${rawRows.length} पंक्तियाँ सफलतापूर्वक पार्स हुईं!`);
    } catch (err) {
      console.error(err);
      showFeedback('पेस्ट किया गया डेटा पार्स नहीं हो सका', 'error');
    }
  };

  // Load Demo Data into Preview
  const handleLoadDemoData = () => {
    processRawRows(sampleExcelData);
    showFeedback('सैंपल एक्सेल डेटा लोड किया गया!');
  };

  // Commit Parsed Rows to Database
  const handleSaveToDatabase = async () => {
    if (parsedRows.length === 0) {
      showFeedback('डेटाबेस में सहेजने के लिए कोई डेटा नहीं है', 'error');
      return;
    }

    setIsImporting(true);
    try {
      const res = await api.bulkImportMasterData(parsedRows);
      if (res && res.success) {
        showFeedback(`सफलतापूर्वक डेटाबेस में भरा गया! ${res.added || 0} नए गाँव जोड़े गए, ${res.updated || 0} अपडेट हुए।`);
        setParsedRows([]);
        setExcelFile(null);
        setParseStats(null);
        setPastedText('');
        await loadData();
        setActiveTab('villages'); // Jump to Explorer to view results
      } else {
        showFeedback(res.message || 'डेटाबेस में सहेजने में विफल', 'error');
      }
    } catch (err) {
      console.error('Import failed:', err);
      showFeedback('सर्वर त्रुटि: डेटा आयात विफल', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(sampleExcelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Master_Data_Template');
      XLSX.writeFile(wb, 'Etawah_Assembly_Master_Data_Template.xlsx');
      showFeedback('एक्सेल टेम्पलेट सफलतापूर्वक डाउनलोड हुआ!');
    } catch (err) {
      console.error(err);
      showFeedback('टेम्पलेट डाउनलोड में समस्या आई', 'error');
    }
  };

  // Export current list to Excel
  const handleExportCurrent = () => {
    try {
      const exportData = filteredVillages.map((v, i) => ({
        'S.No.': i + 1,
        'State': v.state || 'Uttar Pradesh',
        'District': v.district || 'Etawah',
        'Assembly': v.assembly || 'Etawah Assembly',
        'Tehsil': v.tehsil || '',
        'Block': v.block || '',
        'Village': v.name || v.nameHi || '',
        'Village_Category': v.villageCategory || 'Village',
        'Sample_Tag': v.sampleTag || 'Development',
        'Pincode': v.pincode || ''
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Villages_Master');
      XLSX.writeFile(wb, `Etawah_Master_Villages_${Date.now()}.xlsx`);
      showFeedback('मास्टर डेटा एक्सेल में एक्सपोर्ट हो गया!');
    } catch (err) {
      console.error(err);
      showFeedback('एक्सपोर्ट विफल रहा', 'error');
    }
  };

  // =================== VILLAGE CRUD ===================
  const handleOpenAddVillage = () => {
    setEditingVillage(null);
    setVillageForm(defaultVillageForm);
    setVillageModal(true);
  };

  const handleOpenEditVillage = (v) => {
    setEditingVillage(v);
    setVillageForm({
      state: v.state || 'Uttar Pradesh',
      district: v.district || 'Etawah',
      assembly: v.assembly || 'Etawah Assembly',
      tehsil: v.tehsil || 'Etawah',
      block: v.block || 'Barhpura',
      village: v.name || v.nameHi || '',
      nameHi: v.nameHi || v.name || '',
      villageCategory: v.villageCategory || 'Village',
      sampleTag: v.sampleTag || 'Development',
      pincode: v.pincode || '206001'
    });
    setVillageModal(true);
  };

  const handleSaveVillageForm = async (e) => {
    e.preventDefault();
    if (!villageForm.village.trim()) {
      showFeedback('कृपया गाँव या पर्टिकुलर का नाम दर्ज करें', 'error');
      return;
    }

    try {
      if (editingVillage) {
        const res = await api.updateVillage(editingVillage.id, {
          ...villageForm,
          name: villageForm.village,
          nameHi: villageForm.nameHi || villageForm.village
        });
        if (res && res.success) {
          showFeedback('गाँव विवरण सफलतापूर्वक अपडेट किया गया!');
          setVillageModal(false);
          loadData();
        }
      } else {
        const res = await api.addVillage({
          ...villageForm,
          name: villageForm.village,
          nameHi: villageForm.nameHi || villageForm.village
        });
        if (res && res.success) {
          showFeedback('नया गाँव सफलतापूर्वक मास्टर डेटा में जोड़ा गया!');
          setVillageModal(false);
          loadData();
        }
      }
    } catch (err) {
      console.error(err);
      showFeedback('सहेजने में विफल', 'error');
    }
  };

  const handleDeleteVillage = async (id, name) => {
    if (!window.confirm(`क्या आप वाकई "${name}" को मास्टर डेटा से हटाना चाहते हैं?`)) return;
    try {
      const res = await api.deleteVillage(id);
      if (res && res.success) {
        showFeedback('गाँव हटा दिया गया है');
        loadData();
      }
    } catch (err) {
      showFeedback('हटाने में त्रुटि', 'error');
    }
  };

  // =================== CATEGORIES CRUD ===================
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.nameHi.trim()) return;

    try {
      const res = await api.addMasterCategory(newCategory);
      if (res && res.success) {
        showFeedback(`श्रेणी "${newCategory.nameHi}" जोड़ी गई!`);
        setCategoryModal(false);
        setNewCategory({ nameHi: '', name: '', type: 'both', color: 'orange' });
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id, nameHi) => {
    if (!window.confirm(`क्या आप वाकई "${nameHi}" श्रेणी को हटाना चाहते हैं?`)) return;
    try {
      const res = await api.deleteMasterCategory(id);
      if (res && res.success) {
        showFeedback('श्रेणी हटा दी गई है।');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // =================== TAGS CRUD ===================
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.name.trim()) return;

    try {
      const res = await api.addTag(newTag);
      if (res && res.success) {
        showFeedback(`टैग #${newTag.name.replace(/^#/, '')} जोड़ा गया!`);
        setTagModal(false);
        setNewTag({ name: '' });
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTag = async (id, name) => {
    if (!window.confirm(`क्या आप वाकई #${name} टैग को हटाना चाहते हैं?`)) return;
    try {
      const res = await api.deleteTag(id);
      if (res && res.success) {
        showFeedback('टैग हटा दिया गया है।');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-sm font-bold text-white transition-all animate-bounce ${
            feedback.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        >
          {feedback.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Main Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5 text-yellow-300" />
            <span>इटावा 200 मास्टर डेटा व एक्सेल ऑटो-इम्पोर्टर</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            पर्टिकुलर, तहसील, ब्लॉक व गाँव मास्टर डेटा
          </h1>
          <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            MS Excel फाइल अपलोड करके संपूर्ण डेटाबेस स्वतः भरें, पर्टिकुलर/गाँव, तहसील और ब्लॉक संरचना को वास्तविक समय में देखें और प्रबंधित करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>MS Excel से डेटा भरें</span>
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/30 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>टेम्पलेट डाउनलोड</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <div className="text-2xl font-black text-orange-600">{villages.length}</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">कुल गाँव / पर्टिकुलर</div>
          <div className="text-[10px] text-slate-400 font-semibold">Total Records</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <div className="text-2xl font-black text-indigo-600">{tehsilsList.length}</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">तहसीलें (Tehsils)</div>
          <div className="text-[10px] text-slate-400 font-semibold">इटावा, सैफई, चकरनगर...</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <div className="text-2xl font-black text-emerald-600">{blocksList.length}</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">विकास खंड (Blocks)</div>
          <div className="text-[10px] text-slate-400 font-semibold">बढ़पुरा, बसरेहर, सैफई...</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <div className="text-2xl font-black text-purple-600">{categories.length}</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">श्रेणियां (Categories)</div>
          <div className="text-[10px] text-slate-400 font-semibold">Village, Ward, Scheme</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-black text-amber-600">{tags.length}</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">सक्रिय टैग्स (Tags)</div>
          <div className="text-[10px] text-slate-400 font-semibold">#Development, #Road...</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'villages', label: 'तहसील, ब्लॉक व गाँव डेटा (Explorer)', icon: MapPin, count: villages.length },
          { id: 'tehsil-blocks', label: 'तहसील व ब्लॉक मास्टर (8)', icon: Building2, count: tehsilBlocks.length || 8, badge: 'MAP', badgeColor: 'bg-indigo-600 text-white' },
          { id: 'excel', label: 'MS Excel अपलोड व ऑटो-इम्पोर्ट', icon: FileSpreadsheet, badge: 'AUTO-LOAD', badgeColor: 'bg-emerald-600 text-white' },
          { id: 'hierarchy', label: 'तहसील-ब्लॉक ट्री संरचना', icon: FolderTree },
          { id: 'categories', label: 'श्रेणी मास्टर', icon: Layers, count: categories.length },
          { id: 'tags', label: 'टैग मास्टर', icon: Tag, count: tags.length }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${t.badgeColor || 'bg-black/20 text-white'}`}>
                  {t.badge}
                </span>
              )}
              {t.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 2: MS EXCEL UPLOADER & AUTO-IMPORT MODULE            */}
      {/* ======================================================== */}
      {activeTab === 'excel' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Instructions & Template Helper Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-extrabold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>स्वचालित डेटाबेस भरण प्रणाली (Automatic DB Ingestion)</span>
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  MS Excel (.xlsx) से मास्टर डेटा अपलोड करें
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  यह मॉड्यूल आपके एक्सेल शीट के सभी कॉलम (State, District, Assembly, Tehsil, Block, Village, Village_Category, Sample_Tag) को स्वतः पढ़कर डेटाबेस में भर देगा।
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>टेम्पलेट एक्सेल डाउनलोड करें</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemoData}
                  className="px-4 py-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                  title="स्क्रीनशॉट वाले 10 रिकॉर्ड प्रीव्यू में लोड करें"
                >
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>सैंपल डेटा लोड करें</span>
                </button>
              </div>
            </div>

            {/* Expected Format Display Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-xs font-black text-slate-800 mb-2 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>मान्य एक्सेल कॉलम संरचना (Expected Columns):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
                {['State', 'District', 'Assembly', 'Tehsil', 'Block', 'Village', 'Village_Category', 'Sample_Tag'].map((col, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-black text-slate-900 text-[11px] block">{col}</span>
                    <span className="text-[10px] text-slate-400 font-medium">स्तंभ #{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Mode Selector (File Upload vs Direct Paste) */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setImportMode('file')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  importMode === 'file'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1. कंप्यूटर से एक्सेल फाइल अपलोड करें (.xlsx / .csv)
              </button>
              <button
                type="button"
                onClick={() => setImportMode('paste')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  importMode === 'paste'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                2. एक्सेल से कॉपी-पेस्ट करें (Direct Paste)
              </button>
            </div>

            {/* Mode 1: Drag & Drop File Upload */}
            {importMode === 'file' && (
              <div className="border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-3xl p-8 bg-orange-50/30 text-center transition">
                <input
                  type="file"
                  id="excelFileInput"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="excelFileInput"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">
                      {excelFile ? excelFile.name : 'एक्सेल फाइल यहाँ ड्रैग करें या चुनने के लिए क्लिक करें'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      समर्थित प्रारूप: .xlsx, .xls, .csv (अधिकतम 10 MB)
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-black shadow-sm">
                    {excelFile ? 'दूसरी फाइल चुनें' : 'फाइल ब्राउज़ करें'}
                  </span>
                </label>
              </div>
            )}

            {/* Mode 2: Direct Paste from Excel */}
            {importMode === 'paste' && (
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-700">
                  एक्सेल से पंक्तियों को कॉपी करें और नीचे पेस्ट करें:
                </label>
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="State	District	Assembly	Tehsil	Block	Village	Village_Category	Sample_Tag&#10;Uttar Pradesh	Etawah	Etawah Assembly	Etawah	Barhpura	Aarazi Jadhonpur	Village	Development&#10;Uttar Pradesh	Etawah	Etawah Assembly	Etawah	Barhpura	Ajabpur Jhingupur	Village	Development"
                  className="w-full p-3 font-mono text-xs rounded-2xl border border-slate-300 focus:outline-none focus:border-orange-500 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handlePasteProcess}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer"
                >
                  पेस्ट किया गया डेटा पार्स व जांचें
                </button>
              </div>
            )}

          </div>

          {/* Parsed Data Preview & Commit Section */}
          {parsedRows.length > 0 && parseStats && (
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/80 shadow-lg space-y-4 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>डेटा सफलतापूर्वक तैयार! (Ready for Database Ingestion)</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    एक्सेल डेटा प्रीव्यू ({parseStats.totalRows} पंक्तियाँ मान्य पाई गईं)
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold mt-1">
                    <span>तहसीलें: <strong className="text-indigo-600">{parseStats.tehsilsCount}</strong> ({parseStats.tehsils.join(', ')})</span>
                    <span>•</span>
                    <span>ब्लॉक: <strong className="text-emerald-600">{parseStats.blocksCount}</strong> ({parseStats.blocks.slice(0, 5).join(', ')}...)</span>
                    <span>•</span>
                    <span>गाँव: <strong className="text-orange-600">{parseStats.villagesCount}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => { setParsedRows([]); setParseStats(null); setExcelFile(null); }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    रद्द करें
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToDatabase}
                    disabled={isImporting}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
                  >
                    {isImporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4" />
                    )}
                    <span>{isImporting ? 'डेटाबेस में भरा जा रहा है...' : 'डेटाबेस में सारे नाम अपने आप भरें'}</span>
                  </button>
                </div>
              </div>

              {/* Table of Parsed Rows */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-black sticky top-0 border-b border-slate-200 shadow-2xs z-10">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">State</th>
                      <th className="p-3">District</th>
                      <th className="p-3">Assembly</th>
                      <th className="p-3">Tehsil</th>
                      <th className="p-3">Block</th>
                      <th className="p-3 font-extrabold text-orange-700">Village / Particular</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Sample Tag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {parsedRows.slice(0, 50).map((r, i) => (
                      <tr key={i} className="hover:bg-orange-50/50 transition">
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{i + 1}</td>
                        <td className="p-3 text-slate-600">{r.State}</td>
                        <td className="p-3 text-slate-600">{r.District}</td>
                        <td className="p-3 text-slate-600">{r.Assembly}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[11px]">
                            {r.Tehsil}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            {r.Block}
                          </span>
                        </td>
                        <td className="p-3 font-black text-slate-900">
                          {r.Village}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {r.Village_Category}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            #{r.Sample_Tag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedRows.length > 50 && (
                <p className="text-center text-xs text-slate-400 font-medium">
                  + {parsedRows.length - 50} अन्य पंक्तियाँ डेटाबेस में शामिल होने के लिए तैयार हैं...
                </p>
              )}

            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: MASTER EXPLORER (VILLAGES, TEHSIL, BLOCK DATA)    */}
      {/* ======================================================== */}
      {activeTab === 'villages' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Action Bar & Filters Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  विधानसभा पर्टिकुलर, तहसील व ब्लॉक डेटाबेस
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  कुल {filteredVillages.length} गाँव/पर्टिकुलर सूचीबद्ध हैं। किसी भी रिकॉर्ड को संपादित करें या खोजें।
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleExportCurrent}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  title="वर्तमान सूची को एक्सेल में एक्सपोर्ट करें"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>एक्सेल एक्सपोर्ट (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddVillage}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया गाँव जोड़ें</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Search with Voice */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="गाँव, ब्लॉक, तहसील खोजें..."
                  className="w-full pl-9 pr-10 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-slate-50"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <VoiceInputButton
                    onTranscript={(text) => setSearchTerm(text)}
                    tooltip="बोलकर खोजें"
                  />
                </div>
              </div>

              {/* Tehsil Filter */}
              <div>
                <select
                  value={selectedTehsil}
                  onChange={(e) => {
                    setSelectedTehsil(e.target.value);
                    setSelectedBlock('All'); // Reset block
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                >
                  <option value="All">तहसील: सभी (All Tehsils)</option>
                  {tehsilsList.map((t, idx) => (
                    <option key={idx} value={t}>{t} तहसील</option>
                  ))}
                </select>
              </div>

              {/* Block Filter */}
              <div>
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                >
                  <option value="All">विकास खंड: सभी (All Blocks)</option>
                  {blocksList.map((b, idx) => (
                    <option key={idx} value={b}>{b} ब्लॉक</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                >
                  <option value="All">श्रेणी: सभी (All Categories)</option>
                  {categoriesFilterList.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          {/* Villages Data Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-2 text-orange-500" />
                <p className="text-xs font-bold">मास्टर डेटा लोड हो रहा है...</p>
              </div>
            ) : filteredVillages.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">कोई रिकॉर्ड नहीं मिला</p>
                <p className="text-xs text-slate-500 mt-1">फिल्टर बदलें या एक्सेल फाइल से डेटा अपलोड करें</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('excel')}
                  className="mt-3 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
                >
                  एक्सेल इम्पोर्ट खोलें
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-12">#</th>
                      <th className="p-3">गाँव / पर्टिकुलर</th>
                      <th className="p-3">तहसील</th>
                      <th className="p-3">विकास खंड (Block)</th>
                      <th className="p-3">विधानसभा</th>
                      <th className="p-3">जनपद</th>
                      <th className="p-3">श्रेणी</th>
                      <th className="p-3">टैग</th>
                      <th className="p-3 text-right">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {filteredVillages.map((v, idx) => (
                      <tr key={v.id || idx} className="hover:bg-orange-50/50 transition">
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-black text-slate-900">{v.name || v.nameHi}</div>
                          {v.nameHi && v.name !== v.nameHi && (
                            <div className="text-[10px] text-slate-400 font-medium">{v.nameHi}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-bold text-[11px] border border-indigo-200/60">
                            {v.tehsil || 'इटावा'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200/60">
                            {v.block || 'इटावा सदर'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px]">{v.assembly || 'इटावा (200)'}</td>
                        <td className="p-3 text-slate-600 text-[11px]">{v.district || 'इटावा'}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {v.villageCategory || 'Village'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                            #{v.sampleTag || 'Development'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenEditVillage(v)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="संपादित करें"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVillage(v.id, v.name || v.nameHi)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: HIERARCHY TREE VIEW                               */}
      {/* ======================================================== */}
      {activeTab === 'hierarchy' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <FolderTree className="w-5 h-5 text-orange-600" />
              <span>प्रशासनिक संरचना: तहसील → ब्लॉक → गाँव</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              इटावा विधानसभा (200) के अंतर्गत विभिन्न तहसीलों और उनसे संबद्ध विकास खंडों की सूची
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hierarchy.tehsils && hierarchy.tehsils.length > 0 ? (
              hierarchy.tehsils.map((tehsil, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                        T{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{tehsil.name} तहसील</h4>
                        <span className="text-[10px] text-slate-500 font-bold">{tehsil.district || 'इटावा'} जनपद</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
                      {tehsil.villageCount} गाँव / पर्टिकुलर
                    </span>
                  </div>

                  {/* Child Blocks */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-600">संबद्ध विकास खंड (Blocks):</div>
                    <div className="flex flex-wrap gap-2">
                      {tehsil.blocks && tehsil.blocks.map((b, bIdx) => (
                        <div key={bIdx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{b.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({b.villageCount})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-slate-400">
                संरचना लोड हो रही है...
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: TEHSIL & BLOCK MASTER WITH TAGS                     */}
      {/* ======================================================== */}
      {activeTab === 'tehsil-blocks' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-black mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>जनपद इटावा - 8 तहसील एवं विकास खंड (Block) मैपिंग व टैग्स</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                आधिकारिक तहसील व ब्लॉक संरचना एवं जनरेटेड टैग्स
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                आपके द्वारा दी गई 8 प्रमुख ब्लॉक-तहसील मैपिंग और उनके स्वचालित रूप से तैयार किए गए टैग्स
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>एक्सेल से और डेटा जोड़ें</span>
            </button>
          </div>

          {/* Cards of the 8 official pairs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(tehsilBlocks.length > 0 ? tehsilBlocks : [
              { district: 'Etawah', tehsil: 'Etawah', block: 'Barhpura', tehsilHi: 'इटावा', blockHi: 'बढ़पुरा' },
              { district: 'Etawah', tehsil: 'Etawah', block: 'Basrehar', tehsilHi: 'इटावा', blockHi: 'बसरेहर' },
              { district: 'Etawah', tehsil: 'Saifai', block: 'Saifai', tehsilHi: 'सैफई', blockHi: 'सैफई' },
              { district: 'Etawah', tehsil: 'Jaswantnagar', block: 'Jaswantnagar', tehsilHi: 'जसवंतनगर', blockHi: 'जसवंतनगर' },
              { district: 'Etawah', tehsil: 'Chakarnagar', block: 'Chakarnagar', tehsilHi: 'चकरनगर', blockHi: 'चकरनगर' },
              { district: 'Etawah', tehsil: 'Bharthana', block: 'Bharthana', tehsilHi: 'भरथना', blockHi: 'भरथना' },
              { district: 'Etawah', tehsil: 'Mahewa', block: 'Mahewa', tehsilHi: 'महेवा', blockHi: 'महेवा' },
              { district: 'Etawah', tehsil: 'Takha', block: 'Takha', tehsilHi: 'ताखा', blockHi: 'ताखा' }
            ]).map((tb, idx) => {
              const count = villages.filter(v => 
                (v.block && v.block.toLowerCase() === tb.block.toLowerCase()) ||
                (v.block && v.block.toLowerCase() === (tb.blockHi || '').toLowerCase())
              ).length;

              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center space-x-1.5">
                          <span>{tb.block} ({tb.blockHi || tb.block})</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">ब्लॉक</span>
                        </h4>
                        <div className="text-[11px] text-slate-500 font-semibold flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-indigo-500" />
                          <span>तहसील: <strong>{tb.tehsil}</strong> ({tb.tehsilHi || tb.tehsil})</span>
                          <span>•</span>
                          <span>जनपद: <strong>{tb.district}</strong></span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-black">
                      {count} गाँव
                    </span>
                  </div>

                  {/* Generated Tags */}
                  <div className="pt-2 border-t border-slate-200/70 space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                      संबंधित ऑटो-जनरेटेड टैग्स (Generated Tags):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-800 text-[10px] font-bold">
                        #{tb.tehsil}_Tehsil
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-800 text-[10px] font-bold">
                        #तहसील_{tb.tehsilHi || tb.tehsil}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        #{tb.block}_Block
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        #ब्लॉक_{tb.blockHi || tb.block}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-800 text-[10px] font-bold">
                        #{tb.block}
                      </span>
                    </div>
                  </div>

                  {/* Filter in Explorer button */}
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTehsil(tb.tehsil);
                        setSelectedBlock(tb.block);
                        setActiveTab('villages');
                      }}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>इस ब्लॉक के गाँव देखें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CATEGORIES CRUD                                   */}
      {/* ======================================================== */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">श्रेणी मास्टर (Categories)</h3>
              <p className="text-xs text-slate-500 font-medium">जन-गतिविधि, विकास कार्य व गाँव पर्टिकुलर श्रेणियां</p>
            </div>
            <button
              type="button"
              onClick={() => setCategoryModal(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नई श्रेणी जोड़ें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((c) => (
              <div key={c.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900">{c.nameHi || c.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{c.name} • {c.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c.id, c.nameHi || c.name)}
                  className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                  title="हटाएं"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: TAGS CRUD                                         */}
      {/* ======================================================== */}
      {activeTab === 'tags' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">टैग मास्टर (Tags)</h3>
              <p className="text-xs text-slate-500 font-medium">न्यूज़, कार्य एवं पर्टिकुलर टैगिंग मास्टर</p>
            </div>
            <button
              type="button"
              onClick={() => setTagModal(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नया टैग जोड़ें</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <div key={t.id} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                <span>#{t.name}</span>
                <span className="text-[10px] text-slate-400">({t.count || 1})</span>
                <button
                  type="button"
                  onClick={() => handleDeleteTag(t.id, t.name)}
                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT VILLAGE / PARTICULAR                    */}
      {/* ======================================================== */}
      {villageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black">
                  {editingVillage ? 'गाँव / पर्टिकुलर संपादित करें' : 'नया गाँव / पर्टिकुलर जोड़ें'}
                </h3>
                <p className="text-xs text-orange-100">
                  तहसील, ब्लॉक एवं श्रेणी के साथ मास्टर डेटा में दर्ज करें
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVillageModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVillageForm} className="p-6 space-y-4">
              
              {/* Village Name with Voice */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800">
                    गाँव / पर्टिकुलर का नाम (Village / Particular Name) *
                  </label>
                  <VoiceInputButton
                    onTranscript={(text) => setVillageForm(prev => ({ ...prev, village: text, nameHi: text }))}
                    tooltip="बोलकर नाम दर्ज करें"
                  />
                </div>
                <input
                  type="text"
                  value={villageForm.village}
                  onChange={(e) => setVillageForm({ ...villageForm, village: e.target.value, nameHi: e.target.value })}
                  placeholder="उदा. Aarazi Jadhonpur / अराजी जाधोनपुर"
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              {/* Tehsil & Block Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">तहसील (Tehsil) *</label>
                  <input
                    type="text"
                    value={villageForm.tehsil}
                    onChange={(e) => setVillageForm({ ...villageForm, tehsil: e.target.value })}
                    placeholder="उदा. Etawah / Saifai / Jaswantnagar"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">विकास खंड (Block) *</label>
                  <input
                    type="text"
                    value={villageForm.block}
                    onChange={(e) => setVillageForm({ ...villageForm, block: e.target.value })}
                    placeholder="उदा. Barhpura / Basrehar / Saifai"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              {/* Category & Tag Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">गाँव की श्रेणी (Village Category)</label>
                  <select
                    value={villageForm.villageCategory}
                    onChange={(e) => setVillageForm({ ...villageForm, villageCategory: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="Village">Village (ग्राम)</option>
                    <option value="Ward">Ward (शहरी वार्ड)</option>
                    <option value="Gram Panchayat">Gram Panchayat (ग्राम पंचायत)</option>
                    <option value="Urban">Urban (शहरी क्षेत्र)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">सैंपल टैग (Sample Tag)</label>
                  <input
                    type="text"
                    value={villageForm.sampleTag}
                    onChange={(e) => setVillageForm({ ...villageForm, sampleTag: e.target.value })}
                    placeholder="उदा. Development, Agriculture"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* State & District (Read-only / Pre-filled) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">विधानसभा (Assembly)</label>
                  <input
                    type="text"
                    value={villageForm.assembly}
                    onChange={(e) => setVillageForm({ ...villageForm, assembly: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500">जनपद (District)</label>
                  <input
                    type="text"
                    value={villageForm.district}
                    onChange={(e) => setVillageForm({ ...villageForm, district: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500">राज्य (State)</label>
                  <input
                    type="text"
                    value={villageForm.state}
                    onChange={(e) => setVillageForm({ ...villageForm, state: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setVillageModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-black shadow-md transition cursor-pointer"
                >
                  {editingVillage ? 'परिवर्तन सहेजें' : 'मास्टर डेटा में जोड़ें'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD CATEGORY                                      */}
      {/* ======================================================== */}
      {categoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">नई मास्टर श्रेणी जोड़ें</h3>
              <button onClick={() => setCategoryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700">श्रेणी का नाम (हिंदी) *</label>
                <input
                  type="text"
                  value={newCategory.nameHi}
                  onChange={(e) => setNewCategory({ ...newCategory, nameHi: e.target.value, name: e.target.value })}
                  placeholder="उदा. सड़क व नाली निर्माण"
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700">प्रकार (Type)</label>
                <select
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
                >
                  <option value="both">दोनों (Activity & Work)</option>
                  <option value="activity">जन-गतिविधि (Activity)</option>
                  <option value="work">विकास कार्य (Development Work)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
                >
                  श्रेणी सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD TAG                                           */}
      {/* ======================================================== */}
      {tagModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">नया मास्टर टैग जोड़ें</h3>
              <button onClick={() => setTagModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTag} className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700">टैग नाम (बिना # के) *</label>
                <input
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ name: e.target.value })}
                  placeholder="उदा. किसान_कल्याण, जल_जीवन_मिशन"
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setTagModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
                >
                  टैग सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
