import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Layers,
  Search,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Home,
  Vote,
  Compass,
  HardHat,
  Filter,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  X,
  Save
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function AdminLocationIntelligence() {
  const { showToast } = useApp() || {};
  const [activeTab, setActiveTab] = useState('villages'); // default to 'villages' or 'dashboard'
  const [kpi, setKpi] = useState(null);
  const [hierarchy, setHierarchy] = useState([]);
  const [villages, setVillages] = useState([]);
  const [booths, setBooths] = useState([]);
  const [gpsPoints, setGpsPoints] = useState([]);
  const [developments, setDevelopments] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [gramPanchayats, setGramPanchayats] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // Map state
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedMapItem, setSelectedMapItem] = useState(null);
  const [mapFilter, setMapFilter] = useState('all'); // 'all', 'village', 'booth', 'development', 'mla_visit'

  // Modal State for Manual Data Entry (CRUD)
  const [modalType, setModalType] = useState(null); // 'village', 'booth', 'development', 'gps', 'panchayat', 'block', 'tehsil'
  const [modalData, setModalData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Excel Import state
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [kpiRes, hierRes, vRes, bRes, gRes, dRes, tRes, blkRes, gpRes, asmRes] = await Promise.all([
        api.getLocationKPIs(),
        api.getLocationHierarchy(),
        api.getLocationVillages(),
        api.getLocationBooths(),
        api.getLocationGpsPoints(),
        api.getLocationDevelopments(),
        api.getLocationTehsils(),
        api.getLocationBlocks(),
        api.getLocationGPs(),
        api.getLocationAssemblies()
      ]);

      if (kpiRes?.success) setKpi(kpiRes.data);
      if (hierRes?.success) setHierarchy(hierRes.data);
      if (vRes?.success) setVillages(vRes.data);
      if (bRes?.success) setBooths(bRes.data);
      if (gRes?.success) setGpsPoints(gRes.data);
      if (dRes?.success) setDevelopments(dRes.data);
      if (tRes?.success) setTehsils(tRes.data);
      if (blkRes?.success) setBlocks(blkRes.data);
      if (gpRes?.success) setGramPanchayats(gpRes.data);
      if (asmRes?.success) setAssemblies(asmRes.data);
    } catch (err) {
      console.error('Error loading location intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const res = await api.searchLocation(searchQuery);
    if (res.success) {
      setSearchResults(res.data);
    }
  };

  // Leaflet Map Initialization & Markers
  useEffect(() => {
    if (activeTab !== 'dashboard') return;
    let timer = setTimeout(() => {
      initMap();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab, gpsPoints, mapFilter]);

  const initMap = async () => {
    if (!mapContainerRef.current) return;

    let L = window.L;
    if (!L) {
      try {
        const leafletModule = await import('leaflet');
        L = leafletModule.default || leafletModule;
        window.L = L;
      } catch (err) {
        console.error('Error importing Leaflet:', err);
        return;
      }
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center on Etawah
    const map = L.map(mapContainerRef.current).setView([26.785, 79.025], 11);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | JanSeva GIS',
      maxZoom: 18
    }).addTo(map);

    // Prepare pins
    const itemsToPin = gpsPoints.filter(pt => {
      if (mapFilter === 'all') return true;
      return pt.locationType === mapFilter;
    });

    itemsToPin.forEach(pt => {
      const lat = parseFloat(pt.latitude);
      const lng = parseFloat(pt.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      let color = '#2563eb';
      let fillColor = '#3b82f6';
      if (pt.locationType === 'village') { color = '#059669'; fillColor = '#10b981'; }
      else if (pt.locationType === 'booth') { color = '#7c3aed'; fillColor = '#8b5cf6'; }
      else if (pt.locationType === 'development') { color = '#d97706'; fillColor = '#f59e0b'; }
      else if (pt.locationType === 'mla_visit') { color = '#dc2626'; fillColor = '#ef4444'; }
      else if (pt.locationType === 'mla_office') { color = '#0284c7'; fillColor = '#38bdf8'; }

      const marker = L.circleMarker([lat, lng], {
        radius: pt.locationType === 'mla_office' ? 10 : 8,
        fillColor: fillColor,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: ${color};">${pt.locationType.toUpperCase()}</span>
          <h4 style="margin: 4px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${pt.title}</h4>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">${pt.address || ''}</p>
          ${pt.status ? `<div style="margin-top: 6px; font-size: 11px; font-weight: 600; color: #16a34a;">स्थिति: ${pt.status}</div>` : ''}
          ${pt.budget ? `<div style="font-size: 11px; font-weight: 700; color: #ea580c;">लागत: ${pt.budget}</div>` : ''}
          <div style="margin-top: 6px; font-size: 10px; color: #94a3b8;">GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedMapItem(pt);
      });
    });
  };

  // Focus map on coordinate
  const focusOnMap = (lat, lng, item) => {
    setActiveTab('dashboard');
    setSelectedMapItem(item);
    setTimeout(() => {
      if (mapInstanceRef.current && lat && lng) {
        mapInstanceRef.current.setView([parseFloat(lat), parseFloat(lng)], 14);
      }
    }, 300);
  };

  // ======================== MODAL & CRUD HANDLERS ========================
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setEditingId(item.id);
      setModalData({ ...item });
    } else {
      setEditingId(null);
      // Default template data for each type
      if (type === 'village') {
        setModalData({
          villageName: '',
          villageCode: `UP${Math.floor(100000 + Math.random() * 900000)}`,
          tehsil: tehsils[0]?.name || 'Etawah',
          block: blocks[0]?.blockName || blocks[0]?.name || 'Barhpura',
          gramPanchayat: gramPanchayats[0]?.name || 'Rampur Gram Panchayat',
          population: '1500',
          latitude: '26.7850',
          longitude: '79.0210',
          tags: 'Village, Development'
        });
      } else if (type === 'booth') {
        setModalData({
          boothNumber: String((booths.length > 0 ? Math.max(...booths.map(b => Number(b.boothNumber) || 100)) : 100) + 1),
          pollingStationName: '',
          villageId: villages[0]?.id || 1,
          villageName: villages[0]?.villageName || 'Rampur',
          address: 'Village Rampur, Barhpura Block, Etawah',
          latitude: '26.7850',
          longitude: '79.0210',
          totalVoters: 850,
          maleVoters: 450,
          femaleVoters: 400,
          bloName: '',
          sectorOfficer: ''
        });
      } else if (type === 'development') {
        setModalData({
          title: '',
          category: 'Road & Drainage',
          villageId: villages[0]?.id || 1,
          villageName: villages[0]?.villageName || 'Rampur',
          block: blocks[0]?.blockName || blocks[0]?.name || 'Barhpura',
          tehsil: tehsils[0]?.name || 'Etawah',
          budget: '₹ 10.00 Lakhs',
          sanctionDate: new Date().toISOString().split('T')[0],
          completionDate: '',
          status: 'Sanctioned',
          contractor: '',
          description: '',
          latitude: '26.7850',
          longitude: '79.0210'
        });
      } else if (type === 'gps') {
        setModalData({
          title: '',
          locationType: 'village',
          category: 'General',
          address: '',
          latitude: '26.7850',
          longitude: '79.0210',
          budget: '',
          status: '',
          description: ''
        });
      } else if (type === 'panchayat') {
        setModalData({
          name: '',
          nameHi: '',
          block: blocks[0]?.blockName || blocks[0]?.name || 'Barhpura',
          tehsil: tehsils[0]?.name || 'Etawah',
          code: `GP00${gramPanchayats.length + 1}`,
          pradhanName: '',
          pradhanPhone: '',
          sachivName: '',
          sachivPhone: ''
        });
      } else if (type === 'block') {
        setModalData({
          name: '',
          blockNameHi: '',
          tehsil: tehsils[0]?.name || 'Etawah',
          code: `BL00${blocks.length + 1}`
        });
      } else if (type === 'tehsil') {
        setModalData({
          name: '',
          nameHi: '',
          code: `ETW00${tehsils.length + 1}`
        });
      }
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setModalData({});
    setEditingId(null);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res;
      if (modalType === 'village') {
        const payload = {
          ...modalData,
          tags: typeof modalData.tags === 'string' ? modalData.tags.split(',').map(t => t.trim()) : modalData.tags
        };
        if (editingId) {
          res = await api.updateLocationVillage(editingId, payload);
        } else {
          res = await api.createLocationVillage(payload);
        }
      } else if (modalType === 'booth') {
        if (editingId) {
          res = await api.updateLocationBooth(editingId, modalData);
        } else {
          res = await api.createLocationBooth(modalData);
        }
      } else if (modalType === 'development') {
        if (editingId) {
          res = await api.updateLocationDevelopment(editingId, modalData);
        } else {
          res = await api.createLocationDevelopment(modalData);
        }
      } else if (modalType === 'gps') {
        if (editingId) {
          res = await api.updateLocationGpsPoint(editingId, modalData);
        } else {
          res = await api.createLocationGpsPoint(modalData);
        }
      } else if (modalType === 'panchayat') {
        if (editingId) {
          res = await api.updateLocationGP(editingId, modalData);
        } else {
          res = await api.createLocationGP(modalData);
        }
      } else if (modalType === 'block') {
        if (editingId) {
          res = await api.updateLocationBlock(editingId, modalData);
        } else {
          res = await api.createLocationBlock(modalData);
        }
      } else if (modalType === 'tehsil') {
        if (editingId) {
          res = await api.updateLocationTehsil(editingId, modalData);
        } else {
          res = await api.createLocationTehsil(modalData);
        }
      }

      if (res?.success) {
        showToast?.(editingId ? 'सफलतापूर्वक अपडेट किया गया!' : 'नया विवरण सफलतापूर्वक दर्ज किया गया!');
        handleCloseModal();
        loadAllData();
      } else {
        showToast?.(res?.message || 'सहेजने में समस्या आई', 'error');
      }
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (type, id, name) => {
    if (!window.confirm(`क्या आप निश्चित रूप से "${name || 'इस प्रविष्टि'}" को हटाना चाहते हैं?`)) {
      return;
    }
    try {
      let res;
      if (type === 'village') res = await api.deleteLocationVillage(id);
      else if (type === 'booth') res = await api.deleteLocationBooth(id);
      else if (type === 'development') res = await api.deleteLocationDevelopment(id);
      else if (type === 'gps') res = await api.deleteLocationGpsPoint(id);
      else if (type === 'panchayat') res = await api.deleteLocationGP(id);
      else if (type === 'block') res = await api.deleteLocationBlock(id);
      else if (type === 'tehsil') res = await api.deleteLocationTehsil(id);

      if (res?.success) {
        showToast?.('प्रविष्टि सफलतापूर्वक हटा दी गई!');
        loadAllData();
      } else {
        showToast?.(res?.message || 'हटाने में समस्या आई', 'error');
      }
    } catch (err) {
      showToast?.(err.message, 'error');
    }
  };

  // Excel Import Handler
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    try {
      const res = await api.importLocationExcel(importFile);
      setImportResult(res);
      if (res.success) {
        showToast?.(`सफलतापूर्वक ${res.importedCount} रिकॉर्ड्स आयात किए गए!`);
        loadAllData();
      } else {
        showToast?.(res.message || 'इम्पोर्ट विफल रहा', 'error');
      }
    } catch (err) {
      setImportResult({ success: false, message: err.message });
    } finally {
      setImporting(false);
    }
  };

  // Quick Sub-navigation tabs
  const tabs = [
    { id: 'dashboard', label: 'GIS Dashboard & Map', labelHi: 'भौगोलिक नक्शा व स्थिति', icon: Layers },
    { id: 'assembly', label: 'Assembly', labelHi: 'इटावा (200)', icon: Building },
    { id: 'tehsils', label: `Tehsils (${tehsils.length})`, labelHi: 'तहसीलें (7)', icon: Building },
    { id: 'blocks', label: `Blocks (${blocks.length})`, labelHi: 'विकासखंड (8)', icon: Building },
    { id: 'panchayats', label: `Gram Panchayats (${gramPanchayats.length})`, labelHi: 'ग्राम पंचायतें', icon: Home },
    { id: 'villages', label: `Villages (${villages.length})`, labelHi: 'राजस्व गाँव', icon: Home },
    { id: 'booths', label: `Polling Booths (${booths.length})`, labelHi: 'मतदान केंद्र / बूथ', icon: Vote },
    { id: 'gps', label: `GPS Master (${gpsPoints.length})`, labelHi: 'GPS निर्देशांक', icon: Compass },
    { id: 'developments', label: `Development Mapping (${developments.length})`, labelHi: 'विकास कार्य मैपिंग', icon: HardHat },
    { id: 'import', label: 'Excel Import', labelHi: '12-कॉलम एक्सेल अपलोड', icon: Upload },
    { id: 'export', label: 'Export Data', labelHi: 'डेटा डाउनलोड', icon: Download }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl mb-6 border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>GEOGRAPHICAL INTELLIGENCE & CONSTITUENCY MAPPING SYSTEM</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>इटावा विधानसभा (200) - लोकेशन इंटेलिजेंस सिस्टम</span>
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              विधानसभा, तहसील, ब्लॉक, ग्राम पंचायत, राजस्व गाँव, पोलिंग बूथ, GPS निर्देशांक एवं विकास कार्य मैपिंग का संपूर्ण प्रबंधन।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenModal('village')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow flex items-center space-x-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया राजस्व गाँव जोड़ें</span>
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow flex items-center space-x-2 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>एक्सेल डेटा इम्पोर्ट</span>
            </button>
            <a
              href={api.getLocationExportUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg shadow flex items-center space-x-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>मास्टर .xlsx डाउनलोड</span>
            </a>
            <button
              onClick={loadAllData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
              title="रिफ्रेश डेटा"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live KPI Strip */}
        {kpi && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-5 border-t border-slate-800/80">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">तहसीलें</span>
              <span className="text-xl font-black text-amber-400">{kpi.totalTehsils}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">विकासखंड (Blocks)</span>
              <span className="text-xl font-black text-blue-400">{kpi.totalBlocks}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">ग्राम पंचायतें</span>
              <span className="text-xl font-black text-purple-400">{kpi.totalGramPanchayats}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">कुल गाँव (Villages)</span>
              <span className="text-xl font-black text-emerald-400">{kpi.totalVillages}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">मतदान केंद्र (Booths)</span>
              <span className="text-xl font-black text-pink-400">{kpi.totalBooths}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">GPS निर्देशांक</span>
              <span className="text-xl font-black text-cyan-400">{kpi.totalGpsPoints}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">विकास कार्य प्रोजेक्ट</span>
              <span className="text-xl font-black text-orange-400">{kpi.totalDevelopments}</span>
            </div>
          </div>
        )}
      </div>

      {/* Global Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="किसी भी गाँव का नाम, कोड, ब्लॉक, बूथ नंबर, या विकास कार्य खोजें (उदा: Rampur, 101, Barhpura, Solar)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-lg shadow flex items-center space-x-2 transition cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>सर्च करें</span>
          </button>
        </form>

        {/* Instant Search Results Dropdown/Box */}
        {searchResults && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
              <span>खोज परिणाम ({searchResults.totalMatches} मिले)</span>
              <button
                onClick={() => setSearchResults(null)}
                className="text-red-600 hover:underline cursor-pointer"
              >
                बंद करें
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {searchResults.villages?.length > 0 && (
                <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    <span>गाँव ({searchResults.villages.length})</span>
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {searchResults.villages.map(v => (
                      <div
                        key={v.id}
                        onClick={() => focusOnMap(v.latitude, v.longitude, { title: v.villageName, locationType: 'village', ...v })}
                        className="p-2 bg-white rounded border border-emerald-100 text-xs hover:border-emerald-400 cursor-pointer transition flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{v.villageName}</p>
                          <p className="text-[11px] text-slate-500">{v.block} ब्लॉक | कोड: {v.villageCode}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">नक्शा देखें</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.booths?.length > 0 && (
                <div className="bg-purple-50/70 p-3 rounded-lg border border-purple-200">
                  <h4 className="text-xs font-bold text-purple-900 mb-2 flex items-center gap-1">
                    <Vote className="w-3.5 h-3.5 text-purple-600" />
                    <span>पोलिंग बूथ ({searchResults.booths.length})</span>
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {searchResults.booths.map(b => (
                      <div
                        key={b.id}
                        onClick={() => focusOnMap(b.latitude, b.longitude, { title: b.pollingStationName, locationType: 'booth', ...b })}
                        className="p-2 bg-white rounded border border-purple-100 text-xs hover:border-purple-400 cursor-pointer transition flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-800">बूथ सं. {b.boothNumber}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[180px]">{b.pollingStationName}</p>
                        </div>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">नक्शा देखें</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.developments?.length > 0 && (
                <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1">
                    <HardHat className="w-3.5 h-3.5 text-amber-600" />
                    <span>विकास कार्य ({searchResults.developments.length})</span>
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {searchResults.developments.map(d => (
                      <div
                        key={d.id}
                        onClick={() => focusOnMap(d.latitude, d.longitude, { title: d.title, locationType: 'development', ...d })}
                        className="p-2 bg-white rounded border border-amber-100 text-xs hover:border-amber-400 cursor-pointer transition flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-800 truncate max-w-[180px]">{d.title}</p>
                          <p className="text-[11px] text-amber-700 font-medium">{d.villageName} | {d.budget}</p>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">नक्शा देखें</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2 border-b border-slate-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>{tab.labelHi}</span>
            </button>
          );
        })}
      </div>

      {/* ======================= TAB 1: GIS DASHBOARD & MAP ======================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Leaflet Map Container */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {/* Map Filter Controls */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <Filter className="w-4 h-4 text-orange-600" />
                  <span>नक्शे पर पिन फिल्टर:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setMapFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      mapFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    सभी ({gpsPoints.length})
                  </button>
                  <button
                    onClick={() => setMapFilter('village')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                      mapFilter === 'village' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>गाँव ({gpsPoints.filter(p => p.locationType === 'village').length})</span>
                  </button>
                  <button
                    onClick={() => setMapFilter('booth')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                      mapFilter === 'booth' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>बूथ ({gpsPoints.filter(p => p.locationType === 'booth').length})</span>
                  </button>
                  <button
                    onClick={() => setMapFilter('development')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                      mapFilter === 'development' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>विकास कार्य ({gpsPoints.filter(p => p.locationType === 'development').length})</span>
                  </button>
                  <button
                    onClick={() => setMapFilter('mla_visit')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                      mapFilter === 'mla_visit' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>दौरे / कैंप ({gpsPoints.filter(p => p.locationType === 'mla_visit' || p.locationType === 'mla_office').length})</span>
                  </button>
                </div>
              </div>

              {/* Map Canvas */}
              <div ref={mapContainerRef} className="w-full h-[520px] bg-slate-100 z-0"></div>

              {/* Legend Bottom Bar */}
              <div className="p-3 bg-slate-900 text-slate-300 text-xs flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <span className="font-semibold text-white">मानचित्र संकेतक (GIS Legend):</span>
                <div className="flex flex-wrap items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-white"></span> राजस्व गाँव</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block border border-white"></span> पोलिंग बूथ</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-white"></span> विकास कार्य</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block border border-white"></span> विधायक जन-चौपाल</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-500 inline-block border border-white"></span> केंद्रीय कार्यालय</span>
                </div>
              </div>
            </div>

            {/* Selected Location / Quick Details Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>चयनित स्थान विवरण (Selected Pin)</span>
                </h3>

                {selectedMapItem ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-white">
                        {selectedMapItem.locationType}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {selectedMapItem.latitude}, {selectedMapItem.longitude}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 leading-tight">
                      {selectedMapItem.title}
                    </h4>

                    {selectedMapItem.category && (
                      <p className="text-xs text-slate-600 font-semibold">
                        श्रेणी: <span className="text-slate-800">{selectedMapItem.category}</span>
                      </p>
                    )}

                    {selectedMapItem.address && (
                      <p className="text-xs text-slate-600">
                        पता: {selectedMapItem.address}
                      </p>
                    )}

                    {selectedMapItem.budget && (
                      <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold">
                        स्वीकृत बजट: {selectedMapItem.budget}
                      </div>
                    )}

                    {selectedMapItem.status && (
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>प्रोजेक्ट स्थिति: {selectedMapItem.status}</span>
                      </div>
                    )}

                    {selectedMapItem.description && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200">
                        {selectedMapItem.description}
                      </p>
                    )}

                    <div className="pt-2 flex gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedMapItem.latitude},${selectedMapItem.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Google Maps में खोलें</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">नक्शे पर किसी भी बिंदु (पिन) पर क्लिक करें</p>
                    <p className="text-[11px] text-slate-400 mt-1">यहाँ गाँव, बूथ, अथवा विकास कार्य की संपूर्ण जानकारी दिखेगी।</p>
                  </div>
                )}
              </div>

              {/* Quick Hierarchy Breakdown Tree */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>विधानसभा संरचना (Hierarchy)</span>
                </h3>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {hierarchy[0]?.tehsils?.map(t => (
                    <div key={t.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>तहसील: {t.nameHi || t.name}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{t.blocks?.length || 0} ब्लॉक</span>
                      </div>
                      <div className="mt-2 space-y-1 pl-2 border-l-2 border-slate-200">
                        {t.blocks?.map(b => (
                          <div key={b.id} className="text-[11px] text-slate-600 flex justify-between py-0.5">
                            <span>• {b.nameHi || b.name} ब्लॉक</span>
                            <span className="text-slate-400">{b.villagesCount || 0} गाँव</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: ASSEMBLY ======================= */}
      {activeTab === 'assembly' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">विधानसभा क्षेत्र विवरण (Assembly Master)</h2>
              <p className="text-xs text-slate-500">उत्तर प्रदेश विधानसभा निर्वाचन क्षेत्र संख्या 200 - इटावा</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-slate-500 font-medium">राज्य</span>
                <span className="text-xs font-bold text-slate-800">उत्तर प्रदेश (Uttar Pradesh)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-slate-500 font-medium">जनपद (District)</span>
                <span className="text-xs font-bold text-slate-800">इटावा (Etawah)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-slate-500 font-medium">विधानसभा नाम व संख्या</span>
                <span className="text-xs font-bold text-orange-600">200 - इटावा विधानसभा (Etawah)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-slate-500 font-medium">वर्तमान विधायिका</span>
                <span className="text-xs font-bold text-slate-800">श्रीमती सरिता भदौरिया</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-slate-500 font-medium">संबद्ध तहसीलें</span>
                <span className="text-xs font-bold text-blue-600">7 तहसीलें</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-medium">संबद्ध विकासखंड</span>
                <span className="text-xs font-bold text-blue-600">8 विकासखंड (Blocks)</span>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-orange-950 mb-2">भौगोलिक एवं निर्वाचन अवलोकन</h4>
                <p className="text-xs text-orange-800 leading-relaxed">
                  इटावा विधानसभा क्षेत्र ऐतिहासिक एवं विकासोन्मुख प्राथमिकताओं के साथ यमुना एवं चंबल के बीहड़ों से लेकर समतल कृषि क्षेत्रों तक विस्तृत है। इस पोर्टल द्वारा हर राजस्व गाँव, मजरा, पोलिंग बूथ तथा विकास योजनाओं को पारदर्शी डिजिटल रूप से ट्रैक किया जाता है।
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-orange-200/80 flex items-center justify-between text-xs font-bold text-orange-900">
                <span>कुल पंजीकृत मतदाता: 3.8+ लाख</span>
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full">सक्रिय क्षेत्र</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 3: TEHSILS (7) ======================= */}
      {activeTab === 'tehsils' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">तहसील मास्टर (Tehsil Master)</h2>
              <p className="text-xs text-slate-500">इटावा जनपद के अंतर्गत कुल 7 प्रशासनिक तहसीलें</p>
            </div>
            <button
              onClick={() => handleOpenModal('tehsil')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नई तहसील जोड़ें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tehsils.map((t, idx) => (
              <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {t.code || `ETW00${t.id}`}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-2">{t.nameHi || t.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{t.name} Tehsil, Etawah</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs text-slate-600 font-medium">
                    <span>संबद्ध ब्लॉक:</span>
                    <span className="font-bold text-blue-600">
                      {blocks.filter(b => b.tehsilId === t.id || (b.tehsil && b.tehsil.toLowerCase() === t.name.toLowerCase())).map(b => b.blockNameHi || b.name || b.blockName).join(', ') || 'प्रत्यक्ष क्षेत्र'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal('tehsil', t)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                    title="संपादित करें"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('tehsil', t.id, t.nameHi || t.name)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= TAB 4: BLOCKS (8) ======================= */}
      {activeTab === 'blocks' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">विकासखंड मास्टर (Block Master)</h2>
              <p className="text-xs text-slate-500">इटावा के 8 विकासखंड: बढ़पुरा, बसरेहर, सैफई, जसवंतनगर, चकरनगर, भरथना, महेवा, ताखा</p>
            </div>
            <button
              onClick={() => handleOpenModal('block')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया विकासखंड जोड़ें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {blocks.map((b, idx) => {
              const bName = b.blockName || b.name;
              const bNameHi = b.blockNameHi || bName;
              const villageCount = villages.filter(v => (v.block || '').toLowerCase() === bName.toLowerCase()).length;
              return (
                <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {b.code || `BL00${b.id}`}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mt-2">{bNameHi}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{bName} Development Block</p>
                    <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs text-slate-600 font-medium">
                      <span>मैप किए गए गाँव:</span>
                      <span className="font-bold text-emerald-600">{villageCount} गाँव</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal('block', b)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                      title="संपादित करें"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('block', b.id, bNameHi)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================= TAB 5: GRAM PANCHAYATS ======================= */}
      {activeTab === 'panchayats' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">ग्राम पंचायत मास्टर (Gram Panchayat Master)</h2>
              <p className="text-xs text-slate-500">विधानसभा के अंतर्गत सभी ग्राम पंचायतें व पदाधिकारी</p>
            </div>
            <button
              onClick={() => handleOpenModal('panchayat')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नई ग्राम पंचायत जोड़ें</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">क्र.</th>
                  <th className="p-3">ग्राम पंचायत नाम</th>
                  <th className="p-3">विकासखंड</th>
                  <th className="p-3">तहसील</th>
                  <th className="p-3">कोड</th>
                  <th className="p-3">ग्राम प्रधान / सचिव</th>
                  <th className="p-3">गाँव की संख्या</th>
                  <th className="p-3 text-right">एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {gramPanchayats.map((gp, idx) => (
                  <tr key={gp.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-800">{gp.nameHi || gp.name}</td>
                    <td className="p-3 text-slate-700">{gp.block || 'Barhpura'}</td>
                    <td className="p-3 text-slate-700">{gp.tehsil || 'Etawah'}</td>
                    <td className="p-3 font-mono text-slate-500">{gp.code || `GP00${gp.id}`}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{gp.pradhanName || 'प्रधान विवरण नहीं'}</div>
                      <div className="text-[11px] text-slate-500">{gp.pradhanPhone}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {gp.villages?.length || 2} गाँव
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenModal('panchayat', gp)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                          title="संपादित करें"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('panchayat', gp.id, gp.nameHi || gp.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= TAB 6: VILLAGES ======================= */}
      {activeTab === 'villages' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">राजस्व गाँव मास्टर (Revenue Village Master)</h2>
              <p className="text-xs text-slate-500">कुल {villages.length} गाँव डेटाबेस में दर्ज हैं (अक्षांश/देशांतर एवं जनसंख्या सहित)</p>
            </div>
            <button
              onClick={() => handleOpenModal('village')}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया राजस्व गाँव जोड़ें (मैन्युअल प्रविष्टि)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">क्र.</th>
                  <th className="p-3">गाँव का नाम</th>
                  <th className="p-3">गाँव कोड</th>
                  <th className="p-3">विकासखंड</th>
                  <th className="p-3">तहसील</th>
                  <th className="p-3">ग्राम पंचायत</th>
                  <th className="p-3">जनसंख्या</th>
                  <th className="p-3">GPS निर्देशांक</th>
                  <th className="p-3 text-center">एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {villages.map((v, idx) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900 text-sm">{v.villageName}</td>
                    <td className="p-3 font-mono text-slate-500 font-semibold">{v.villageCode}</td>
                    <td className="p-3 text-slate-700 font-medium">{v.block}</td>
                    <td className="p-3 text-slate-700">{v.tehsil}</td>
                    <td className="p-3 text-slate-600">{v.gramPanchayat || '-'}</td>
                    <td className="p-3 font-semibold text-slate-800">{v.population || '-'}</td>
                    <td className="p-3 font-mono text-xs text-slate-500">{v.latitude}, {v.longitude}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => focusOnMap(v.latitude, v.longitude, { title: v.villageName, locationType: 'village', ...v })}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                          title="नक्शे पर देखें"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>नक्शा</span>
                        </button>
                        <button
                          onClick={() => handleOpenModal('village', v)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition cursor-pointer"
                          title="संपादित करें"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('village', v.id, v.villageName)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200 transition cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= TAB 7: BOOTHS ======================= */}
      {activeTab === 'booths' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">मतदान केंद्र व पोलिंग बूथ (Polling Booths)</h2>
              <p className="text-xs text-slate-500">इटावा विधानसभा के सभी पोलिंग स्टेशन, बी.एल.ओ. एवं मतदाता संख्या</p>
            </div>
            <button
              onClick={() => handleOpenModal('booth')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया पोलिंग बूथ जोड़ें</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">बूथ सं.</th>
                  <th className="p-3">मतदान केंद्र का नाम (Polling Station)</th>
                  <th className="p-3">संबद्ध गाँव</th>
                  <th className="p-3">कुल मतदाता</th>
                  <th className="p-3">पुरुष / महिला</th>
                  <th className="p-3">बी.एल.ओ. (BLO)</th>
                  <th className="p-3">सेक्टर अधिकारी</th>
                  <th className="p-3 text-center">एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {booths.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 font-extrabold flex items-center justify-center text-xs">
                        {b.boothNumber}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{b.pollingStationName}</td>
                    <td className="p-3 font-semibold text-slate-700">{b.villageName}</td>
                    <td className="p-3 font-bold text-slate-900">{b.totalVoters}</td>
                    <td className="p-3 text-slate-500">{b.maleVoters} पु. / {b.femaleVoters} म.</td>
                    <td className="p-3 text-slate-700">{b.bloName || '-'}</td>
                    <td className="p-3 text-slate-700">{b.sectorOfficer || '-'}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => focusOnMap(b.latitude, b.longitude, { title: b.pollingStationName, locationType: 'booth', ...b })}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                          title="नक्शे पर देखें"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>नक्शा</span>
                        </button>
                        <button
                          onClick={() => handleOpenModal('booth', b)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition cursor-pointer"
                          title="संपादित करें"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('booth', b.id, `बूथ सं. ${b.boothNumber}`)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200 transition cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= TAB 8: GPS MASTER ======================= */}
      {activeTab === 'gps' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">GPS निर्देशांक मास्टर (GPS Location Points)</h2>
              <p className="text-xs text-slate-500">नक्शे पर प्रदर्शित होने वाले सभी जियो-लोकेशन बिंदु</p>
            </div>
            <button
              onClick={() => handleOpenModal('gps')}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया GPS पॉइंट जोड़ें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gpsPoints.map((pt) => (
              <div key={pt.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {pt.locationType}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{pt.latitude}, {pt.longitude}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                  <p className="text-xs text-slate-600">{pt.address}</p>
                  {pt.budget && (
                    <p className="text-xs font-bold text-orange-600">बजट: {pt.budget}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5">
                  <button
                    onClick={() => focusOnMap(pt.latitude, pt.longitude, pt)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>नक्शा</span>
                  </button>
                  <button
                    onClick={() => handleOpenModal('gps', pt)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition cursor-pointer"
                    title="संपादित करें"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('gps', pt.id, pt.title)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200 transition cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= TAB 9: DEVELOPMENT MAPPING ======================= */}
      {activeTab === 'developments' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">विकास कार्य मैपिंग (Development Work Mapping)</h2>
              <p className="text-xs text-slate-500">गाँवों में स्वीकृत एवं प्रगतिरत विकास कार्य, बजट एवं ठेकेदार विवरण</p>
            </div>
            <button
              onClick={() => handleOpenModal('development')}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया विकास कार्य जोड़ें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {developments.map((d) => (
              <div key={d.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                        {d.category}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1">{d.title}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-3">
                    <div><strong>गाँव:</strong> {d.villageName}</div>
                    <div><strong>विकासखंड:</strong> {d.block}</div>
                    <div><strong>स्वीकृत बजट:</strong> <span className="font-bold text-slate-900">{d.budget}</span></div>
                    <div><strong>स्वीकृति तिथि:</strong> {d.sanctionDate}</div>
                  </div>

                  {d.description && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200 mt-2">
                      {d.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => focusOnMap(d.latitude, d.longitude, { title: d.title, locationType: 'development', ...d })}
                    className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>नक्शा देखें</span>
                  </button>
                  <button
                    onClick={() => handleOpenModal('development', d)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition cursor-pointer"
                    title="संपादित करें"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('development', d.id, d.title)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200 transition cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= TAB 10: EXCEL IMPORT (12-COLUMN) ======================= */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">12-कॉलम एक्सेल फाइल इम्पोर्ट सिस्टम</h2>
            <p className="text-xs text-slate-500 mt-1">
              विधानसभा, तहसील, ब्लॉक, ग्राम पंचायत, गाँव, पोलिंग बूथ एवं GPS निर्देशांकों को एक ही एक्सेल शीट से स्वतः सिंक करें।
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              अपेक्षित 12 एक्सेल कॉलम (हेडर प्रारूप):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs font-mono">
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">1. State</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">2. District</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">3. Assembly</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">4. Tehsil</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">5. Block</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">6. Gram Panchayat</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">7. Village Name</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">8. Village Code</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">9. Booth Number</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">10. Polling Station</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">11. Latitude</span>
              <span className="bg-white p-2 rounded border border-slate-200 text-slate-700">12. Longitude</span>
            </div>
          </div>

          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition cursor-pointer">
              <input
                type="file"
                id="excelUploadInput"
                accept=".xlsx, .xls, .csv"
                onChange={(e) => setImportFile(e.target.files[0])}
                className="hidden"
              />
              <label htmlFor="excelUploadInput" className="cursor-pointer block">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <span className="text-sm font-bold text-slate-800 block">
                  {importFile ? importFile.name : 'एक्सेल फाइल (.xlsx या .xls) चुनें या यहाँ ड्रैग करें'}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">अधिकतम फाइल साइज़: 15 MB</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={api.getLocationExportUrl()}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>सैंपल टेम्पलेट (.xlsx) डाउनलोड करें</span>
              </a>

              <button
                type="submit"
                disabled={!importFile || importing}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-2 cursor-pointer"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>इम्पोर्ट जारी है...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>डेटा इम्पोर्ट व प्रोसेस करें</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {importResult && (
            <div className={`mt-6 p-4 rounded-xl border ${
              importResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <h4 className="text-sm font-bold flex items-center gap-2">
                {importResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                <span>{importResult.success ? 'डेटा सफलतापूर्वक इम्पोर्ट हो गया!' : 'इम्पोर्ट में समस्या आई'}</span>
              </h4>
              {importResult.success && (
                <p className="text-xs mt-1">
                  कुल {importResult.importedCount} रिकॉर्ड्स सफलतापूर्वक जोड़े या अपडेट किए गए। {importResult.skippedCount > 0 && `(${importResult.skippedCount} रिक्त पंक्तियाँ छोड़ी गईं)`}
                </p>
              )}
              {importResult.errors?.length > 0 && (
                <ul className="text-xs mt-2 list-disc pl-5 space-y-1 text-red-700">
                  {importResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB 11: EXPORT DATA ======================= */}
      {activeTab === 'export' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">मास्टर डेटा एक्सेल एक्सपोर्ट</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            इटावा विधानसभा 200 के समस्त राजस्व गाँव, पोलिंग बूथ, अक्षांश, देशांतर तथा जनसंख्या का अद्यतन बैकअप एक्सेल स्प्रेडशीट (.xlsx) में तुरंत डाउनलोड करें।
          </p>

          <div className="mt-6">
            <a
              href={api.getLocationExportUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Etawah_Constituency_Master.xlsx डाउनलोड करें</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================== UNIFIED MANUAL ENTRY MODAL ===================== */}
      {/* ========================================================================= */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 my-8 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingId ? 'विवरण संपादित करें (Edit Record)' : 'नया विवरण मैन्युअल भरें (Add New Manual Entry)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {modalType === 'village' && 'राजस्व गाँव का संपूर्ण ब्यौरा भरें'}
                    {modalType === 'booth' && 'मतदान केंद्र एवं पोलिंग बूथ विवरण भरें'}
                    {modalType === 'development' && 'विकास योजना व परियोजना विवरण भरें'}
                    {modalType === 'gps' && 'GIS लोकेशन व निर्देशांक बिंदु जोड़ें'}
                    {modalType === 'panchayat' && 'ग्राम पंचायत व अधिकारी विवरण भरें'}
                    {modalType === 'block' && 'विकासखंड (Block) विवरण भरें'}
                    {modalType === 'tehsil' && 'तहसील विवरण भरें'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* ================== FORM FIELDS: VILLAGE ================== */}
              {modalType === 'village' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">गाँव का नाम *</label>
                      <input
                        type="text"
                        required
                        value={modalData.villageName || ''}
                        onChange={(e) => setModalData({ ...modalData, villageName: e.target.value })}
                        placeholder="उदा: रामपुर, अरज़ी जाधौनपुर..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">गाँव कोड (Village Code)</label>
                      <input
                        type="text"
                        value={modalData.villageCode || ''}
                        onChange={(e) => setModalData({ ...modalData, villageCode: e.target.value })}
                        placeholder="उदा: UP123456"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">तहसील</label>
                      <select
                        value={modalData.tehsil || ''}
                        onChange={(e) => setModalData({ ...modalData, tehsil: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                      >
                        {tehsils.map(t => (
                          <option key={t.id} value={t.name}>{t.nameHi || t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">विकासखंड (ब्लॉक)</label>
                      <select
                        value={modalData.block || ''}
                        onChange={(e) => setModalData({ ...modalData, block: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                      >
                        {blocks.map(b => (
                          <option key={b.id} value={b.blockName || b.name}>{b.blockNameHi || b.blockName || b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ग्राम पंचायत</label>
                      <input
                        type="text"
                        value={modalData.gramPanchayat || ''}
                        onChange={(e) => setModalData({ ...modalData, gramPanchayat: e.target.value })}
                        placeholder="ग्राम पंचायत का नाम..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">अनुमानित जनसंख्या</label>
                      <input
                        type="text"
                        value={modalData.population || ''}
                        onChange={(e) => setModalData({ ...modalData, population: e.target.value })}
                        placeholder="उदा: 2450"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">अक्षांश (Latitude)</label>
                      <input
                        type="text"
                        value={modalData.latitude || ''}
                        onChange={(e) => setModalData({ ...modalData, latitude: e.target.value })}
                        placeholder="26.7850"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">देशांतर (Longitude)</label>
                      <input
                        type="text"
                        value={modalData.longitude || ''}
                        onChange={(e) => setModalData({ ...modalData, longitude: e.target.value })}
                        placeholder="79.0210"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">टैग्स (Tags - कॉमा से अलग करें)</label>
                    <input
                      type="text"
                      value={Array.isArray(modalData.tags) ? modalData.tags.join(', ') : (modalData.tags || '')}
                      onChange={(e) => setModalData({ ...modalData, tags: e.target.value })}
                      placeholder="Village, Development, Solar, School, Road..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* ================== FORM FIELDS: BOOTH ================== */}
              {modalType === 'booth' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">बूथ संख्या (Booth No.) *</label>
                      <input
                        type="text"
                        required
                        value={modalData.boothNumber || ''}
                        onChange={(e) => setModalData({ ...modalData, boothNumber: e.target.value })}
                        placeholder="उदा: 101"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">संबद्ध राजस्व गाँव</label>
                      <select
                        value={modalData.villageId || ''}
                        onChange={(e) => {
                          const v = villages.find(x => x.id === Number(e.target.value));
                          setModalData({
                            ...modalData,
                            villageId: Number(e.target.value),
                            villageName: v ? v.villageName : modalData.villageName
                          });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                      >
                        {villages.map(v => (
                          <option key={v.id} value={v.id}>{v.villageName} ({v.block})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">मतदान केंद्र का नाम (Polling Station) *</label>
                    <input
                      type="text"
                      required
                      value={modalData.pollingStationName || ''}
                      onChange={(e) => setModalData({ ...modalData, pollingStationName: e.target.value })}
                      placeholder="उदा: प्राथमिक विद्यालय रामपुर कक्ष संख्या 1..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">मतदान केंद्र का पूरा पता (Address)</label>
                    <input
                      type="text"
                      value={modalData.address || ''}
                      onChange={(e) => setModalData({ ...modalData, address: e.target.value })}
                      placeholder="उदा: ग्राम रामपुर, बढ़पुरा ब्लॉक, इटावा"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">कुल मतदाता संख्या</label>
                      <input
                        type="number"
                        value={modalData.totalVoters || ''}
                        onChange={(e) => setModalData({ ...modalData, totalVoters: Number(e.target.value) })}
                        placeholder="850"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">पुरुष मतदाता</label>
                      <input
                        type="number"
                        value={modalData.maleVoters || ''}
                        onChange={(e) => setModalData({ ...modalData, maleVoters: Number(e.target.value) })}
                        placeholder="450"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">महिला मतदाता</label>
                      <input
                        type="number"
                        value={modalData.femaleVoters || ''}
                        onChange={(e) => setModalData({ ...modalData, femaleVoters: Number(e.target.value) })}
                        placeholder="400"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">बी.एल.ओ. (BLO Name & Phone)</label>
                      <input
                        type="text"
                        value={modalData.bloName || ''}
                        onChange={(e) => setModalData({ ...modalData, bloName: e.target.value })}
                        placeholder="श्रीमती सुनीता देवी (9838000001)"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">सेक्टर मजिस्ट्रेट / अधिकारी</label>
                      <input
                        type="text"
                        value={modalData.sectorOfficer || ''}
                        onChange={(e) => setModalData({ ...modalData, sectorOfficer: e.target.value })}
                        placeholder="श्री आर. के. शर्मा (9415000001)"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">अक्षांश (Latitude)</label>
                      <input
                        type="text"
                        value={modalData.latitude || ''}
                        onChange={(e) => setModalData({ ...modalData, latitude: e.target.value })}
                        placeholder="26.7852"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">देशांतर (Longitude)</label>
                      <input
                        type="text"
                        value={modalData.longitude || ''}
                        onChange={(e) => setModalData({ ...modalData, longitude: e.target.value })}
                        placeholder="79.0215"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ================== FORM FIELDS: DEVELOPMENT ================== */}
              {modalType === 'development' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">विकास कार्य का शीर्षक / नाम *</label>
                    <input
                      type="text"
                      required
                      value={modalData.title || ''}
                      onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                      placeholder="उदा: मुख्य बस्ती में सीसी रोड व नाली निर्माण..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी (Category)</label>
                      <select
                        value={modalData.category || ''}
                        onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      >
                        <option value="Road & Drainage">सड़क व नाली निर्माण (Road & Drainage)</option>
                        <option value="Solar & Energy">सौर ऊर्जा व स्ट्रीट लाइट (Solar & Energy)</option>
                        <option value="Drinking Water">पेयजल व हैंडपंप (Drinking Water)</option>
                        <option value="Education">शिक्षा व स्कूल कायाकल्प (Education)</option>
                        <option value="Healthcare">चिकित्सा व स्वास्थ्य केंद्र (Healthcare)</option>
                        <option value="Community Welfare">सामुदायिक भवन / बारात घर</option>
                        <option value="Digital Governance">डिजिटल ग्राम सचिवालय</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">संबद्ध गाँव</label>
                      <select
                        value={modalData.villageId || ''}
                        onChange={(e) => {
                          const v = villages.find(x => x.id === Number(e.target.value));
                          setModalData({
                            ...modalData,
                            villageId: Number(e.target.value),
                            villageName: v ? v.villageName : modalData.villageName,
                            block: v ? v.block : modalData.block,
                            tehsil: v ? v.tehsil : modalData.tehsil
                          });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      >
                        {villages.map(v => (
                          <option key={v.id} value={v.id}>{v.villageName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">कार्य स्थिति (Status)</label>
                      <select
                        value={modalData.status || ''}
                        onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-bold"
                      >
                        <option value="Proposed">प्रस्तावित (Proposed)</option>
                        <option value="Sanctioned">स्वीकृत (Sanctioned)</option>
                        <option value="In Progress">प्रगति पर (In Progress)</option>
                        <option value="Completed">पूर्ण (Completed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">स्वीकृत बजट (Budget)</label>
                      <input
                        type="text"
                        value={modalData.budget || ''}
                        onChange={(e) => setModalData({ ...modalData, budget: e.target.value })}
                        placeholder="उदा: ₹ 14.50 Lakhs"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">स्वीकृति तिथि</label>
                      <input
                        type="date"
                        value={modalData.sanctionDate || ''}
                        onChange={(e) => setModalData({ ...modalData, sanctionDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">कार्यदायी संस्था / ठेकेदार</label>
                      <input
                        type="text"
                        value={modalData.contractor || ''}
                        onChange={(e) => setModalData({ ...modalData, contractor: e.target.value })}
                        placeholder="उदा: PWD / ग्रामीण अभियंत्रण"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">कार्य का विवरण (Description)</label>
                    <textarea
                      rows="3"
                      value={modalData.description || ''}
                      onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                      placeholder="परियोजना की मुख्य विशेषताएं, लंबाई अथवा लाभान्वित आबादी..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    ></textarea>
                  </div>
                </>
              )}

              {/* ================== FORM FIELDS: GPS MASTER ================== */}
              {modalType === 'gps' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">स्थान / प्रोजेक्ट शीर्षक *</label>
                      <input
                        type="text"
                        required
                        value={modalData.title || ''}
                        onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                        placeholder="उदा: प्राथमिक स्वास्थ्य केंद्र, रामलीला मैदान..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">स्थान प्रकार (Location Type)</label>
                      <select
                        value={modalData.locationType || ''}
                        onChange={(e) => setModalData({ ...modalData, locationType: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white font-bold"
                      >
                        <option value="village">राजस्व गाँव (Village)</option>
                        <option value="booth">पोलिंग बूथ (Polling Booth)</option>
                        <option value="development">विकास कार्य (Development Project)</option>
                        <option value="mla_visit">विधायक दौरा / जन-चौपाल (MLA Visit)</option>
                        <option value="mla_office">विधायक केंद्रीय कैंप कार्यालय (MLA Office)</option>
                        <option value="custom">अन्य महत्वपूर्ण स्थल (Custom POI)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">पता / स्थान विवरण</label>
                    <input
                      type="text"
                      value={modalData.address || ''}
                      onChange={(e) => setModalData({ ...modalData, address: e.target.value })}
                      placeholder="उदा: मुख्य चौराहा, बढ़पुरा ब्लॉक, इटावा"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">अक्षांश (Latitude) *</label>
                      <input
                        type="text"
                        required
                        value={modalData.latitude || ''}
                        onChange={(e) => setModalData({ ...modalData, latitude: e.target.value })}
                        placeholder="26.7850"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">देशांतर (Longitude) *</label>
                      <input
                        type="text"
                        required
                        value={modalData.longitude || ''}
                        onChange={(e) => setModalData({ ...modalData, longitude: e.target.value })}
                        placeholder="79.0210"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ================== FORM FIELDS: GRAM PANCHAYAT ================== */}
              {modalType === 'panchayat' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ग्राम पंचायत का नाम *</label>
                      <input
                        type="text"
                        required
                        value={modalData.name || ''}
                        onChange={(e) => setModalData({ ...modalData, name: e.target.value, nameHi: e.target.value })}
                        placeholder="उदा: रामपुर ग्राम पंचायत"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">पंचायत कोड (Code)</label>
                      <input
                        type="text"
                        value={modalData.code || ''}
                        onChange={(e) => setModalData({ ...modalData, code: e.target.value })}
                        placeholder="GP001"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">विकासखंड (ब्लॉक)</label>
                      <select
                        value={modalData.block || ''}
                        onChange={(e) => setModalData({ ...modalData, block: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        {blocks.map(b => (
                          <option key={b.id} value={b.blockName || b.name}>{b.blockNameHi || b.blockName || b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">तहसील</label>
                      <select
                        value={modalData.tehsil || ''}
                        onChange={(e) => setModalData({ ...modalData, tehsil: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        {tehsils.map(t => (
                          <option key={t.id} value={t.name}>{t.nameHi || t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ग्राम प्रधान का नाम</label>
                      <input
                        type="text"
                        value={modalData.pradhanName || ''}
                        onChange={(e) => setModalData({ ...modalData, pradhanName: e.target.value })}
                        placeholder="प्रधान का नाम..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">प्रधान संपर्क नंबर (Phone)</label>
                      <input
                        type="text"
                        value={modalData.pradhanPhone || ''}
                        onChange={(e) => setModalData({ ...modalData, pradhanPhone: e.target.value })}
                        placeholder="मोबाइल नंबर..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ================== FORM FIELDS: BLOCK ================== */}
              {modalType === 'block' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">विकासखंड का नाम *</label>
                      <input
                        type="text"
                        required
                        value={modalData.name || modalData.blockName || ''}
                        onChange={(e) => setModalData({ ...modalData, name: e.target.value, blockName: e.target.value, blockNameHi: e.target.value })}
                        placeholder="उदा: बढ़पुरा, ताखा..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ब्लॉक कोड (Code)</label>
                      <input
                        type="text"
                        value={modalData.code || ''}
                        onChange={(e) => setModalData({ ...modalData, code: e.target.value })}
                        placeholder="BL001"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">संबद्ध तहसील</label>
                    <select
                      value={modalData.tehsil || ''}
                      onChange={(e) => setModalData({ ...modalData, tehsil: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      {tehsils.map(t => (
                        <option key={t.id} value={t.name}>{t.nameHi || t.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* ================== FORM FIELDS: TEHSIL ================== */}
              {modalType === 'tehsil' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">तहसील का नाम *</label>
                    <input
                      type="text"
                      required
                      value={modalData.name || ''}
                      onChange={(e) => setModalData({ ...modalData, name: e.target.value, nameHi: e.target.value })}
                      placeholder="उदा: सैफई, जसवंतनगर..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">तहसील कोड (Code)</label>
                    <input
                      type="text"
                      value={modalData.code || ''}
                      onChange={(e) => setModalData({ ...modalData, code: e.target.value })}
                      placeholder="ETW001"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer disabled:bg-slate-400"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>सहेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingId ? 'अपडेट करें (Save Changes)' : 'डेटा सहेजें (Save Record)'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
