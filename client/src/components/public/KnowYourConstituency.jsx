import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import {
  MapPin,
  Vote,
  HardHat,
  Users,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Compass,
  Building,
  Home,
  Phone,
  ArrowRight
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function KnowYourConstituency() {
  const [tehsils, setTehsils] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);
  const [booths, setBooths] = useState([]);
  const [developments, setDevelopments] = useState([]);

  // Cascading Selection State
  const [selectedTehsil, setSelectedTehsil] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState('');
  const [activeVillage, setActiveVillage] = useState(null);

  // Quick Search Query
  const [quickSearch, setQuickSearch] = useState('');

  // Mini Map
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      const [tRes, bRes, vRes, btRes, dRes] = await Promise.all([
        api.getLocationTehsils(),
        api.getLocationBlocks(),
        api.getLocationVillages(),
        api.getLocationBooths(),
        api.getLocationDevelopments()
      ]);

      if (tRes?.success) setTehsils(tRes.data);
      if (bRes?.success) setBlocks(bRes.data);
      if (vRes?.success) {
        setVillages(vRes.data);
        if (vRes.data.length > 0) {
          // Select first village by default (e.g. Rampur)
          selectVillage(vRes.data[0]);
          setSelectedTehsil(vRes.data[0].tehsil || 'Etawah');
          setSelectedBlock(vRes.data[0].block || 'Barhpura');
          setSelectedVillageId(vRes.data[0].id);
        }
      }
      if (btRes?.success) setBooths(btRes.data);
      if (dRes?.success) setDevelopments(dRes.data);
    } catch (err) {
      console.error('Error loading constituency data:', err);
    }
  };

  const filteredBlocks = selectedTehsil
    ? blocks.filter(b => (b.tehsil || '').toLowerCase() === selectedTehsil.toLowerCase() || b.tehsilId === tehsils.find(t => t.name === selectedTehsil)?.id)
    : blocks;

  const filteredVillages = selectedBlock
    ? villages.filter(v => (v.block || '').toLowerCase() === selectedBlock.toLowerCase())
    : villages;

  const selectVillage = (v) => {
    setActiveVillage(v);
    setSelectedVillageId(v.id);
  };

  const handleVillageChange = (villageId) => {
    const v = villages.find(item => item.id === Number(villageId));
    if (v) {
      setSelectedVillageId(v.id);
      setActiveVillage(v);
    }
  };

  const handleQuickSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuickSearch(q);
    if (!q) return;

    const matched = villages.find(v =>
      v.villageName.toLowerCase().includes(q) ||
      (v.villageCode && v.villageCode.toLowerCase().includes(q))
    );
    if (matched) {
      setActiveVillage(matched);
      setSelectedVillageId(matched.id);
      setSelectedTehsil(matched.tehsil || '');
      setSelectedBlock(matched.block || '');
    }
  };

  // Associated Data for selected village
  const villageBooths = booths.filter(b => b.villageId === activeVillage?.id);
  const villageDevelopments = developments.filter(d => d.villageId === activeVillage?.id);

  // Mini Map Render
  useEffect(() => {
    if (!activeVillage || !mapContainerRef.current) return;

    let L = window.L;
    const initMiniMap = async () => {
      if (!L) {
        try {
          const leafletModule = await import('leaflet');
          L = leafletModule.default || leafletModule;
          window.L = L;
        } catch (err) {
          return;
        }
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const lat = parseFloat(activeVillage.latitude) || 26.7850;
      const lng = parseFloat(activeVillage.longitude) || 79.0210;

      const map = L.map(mapContainerRef.current).setView([lat, lng], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; JanSeva Etawah',
        maxZoom: 18
      }).addTo(map);

      // Village Center Marker
      const villageMarker = L.circleMarker([lat, lng], {
        radius: 10,
        fillColor: '#10b981',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);

      villageMarker.bindPopup(`<b>${activeVillage.villageName}</b><br>राजस्व गाँव केंद्र`).openPopup();

      // Booth markers if any
      villageBooths.forEach(b => {
        const bLat = parseFloat(b.latitude);
        const bLng = parseFloat(b.longitude);
        if (!isNaN(bLat) && !isNaN(bLng)) {
          L.circleMarker([bLat, bLng], {
            radius: 8,
            fillColor: '#8b5cf6',
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.9
          }).addTo(map).bindPopup(`<b>बूथ सं. ${b.boothNumber}</b><br>${b.pollingStationName}`);
        }
      });
    };

    initMiniMap();
  }, [activeVillage, villageBooths]);

  return (
    <section className="py-12 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4 text-orange-600" />
            <span>जनसेवा लोकेशन इंटेलिजेंस</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            अपनी विधानसभा व गाँव जानें
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            इटावा विधानसभा (200) के अपने गाँव का चयन करें और देखें अपना पोलिंग स्टेशन, बी.एल.ओ., तथा गाँव में हुए विकास कार्य।
          </p>
        </div>

        {/* Search & Cascading Filter Box */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Search */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1">त्वरित गाँव खोज</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={handleQuickSearch}
                  placeholder="गाँव का नाम लिखें..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Tehsil Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">1. तहसील चुनें</label>
              <select
                value={selectedTehsil}
                onChange={(e) => {
                  setSelectedTehsil(e.target.value);
                  setSelectedBlock('');
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">-- सभी तहसीलें ({tehsils.length}) --</option>
                {tehsils.map(t => (
                  <option key={t.id} value={t.name}>{t.nameHi || t.name} तहसील</option>
                ))}
              </select>
            </div>

            {/* Block Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">2. विकासखंड (ब्लॉक) चुनें</label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">-- सभी विकासखंड ({filteredBlocks.length}) --</option>
                {filteredBlocks.map(b => (
                  <option key={b.id} value={b.blockName || b.name}>
                    {b.blockNameHi || b.blockName || b.name} ब्लॉक
                  </option>
                ))}
              </select>
            </div>

            {/* Village Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">3. राजस्व गाँव चुनें</label>
              <select
                value={selectedVillageId}
                onChange={(e) => handleVillageChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-orange-300 bg-orange-50/40 text-orange-950 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">-- गाँव चुनें ({filteredVillages.length}) --</option>
                {filteredVillages.map(v => (
                  <option key={v.id} value={v.id}>{v.villageName} ({v.villageCode})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Village Intelligence Display */}
        {activeVillage ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Village Snapshot & Map */}
            <div className="space-y-6">
              {/* Village Core Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    कोड: {activeVillage.villageCode}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{activeVillage.tehsil} तहसील</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
                  <Home className="w-6 h-6 text-orange-600" />
                  <span>ग्राम {activeVillage.villageName}</span>
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-4">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-500 block text-[11px]">विकासखंड</span>
                    <span className="font-bold text-slate-800">{activeVillage.block}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-500 block text-[11px]">ग्राम पंचायत</span>
                    <span className="font-bold text-slate-800 truncate block">{activeVillage.gramPanchayat || '-'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-500 block text-[11px]">अनुमानित जनसंख्या</span>
                    <span className="font-bold text-slate-800">{activeVillage.population || '1500+'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-500 block text-[11px]">विधानसभा</span>
                    <span className="font-bold text-orange-600">200 - इटावा</span>
                  </div>
                </div>

                {/* Direct Google Maps Direction Link */}
                <div className="mt-5">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeVillage.latitude},${activeVillage.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
                  >
                    <Compass className="w-4 h-4 text-orange-400" />
                    <span>Google Maps में दिशा देखें</span>
                  </a>
                </div>
              </div>

              {/* Mini GIS Map */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 bg-slate-900 text-white text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>गाँव व पोलिंग बूथ मानचित्र</span>
                  </span>
                  <span className="text-[10px] text-slate-400">OpenStreetMap GIS</span>
                </div>
                <div ref={mapContainerRef} className="w-full h-56 bg-slate-100"></div>
              </div>
            </div>

            {/* Right Column: Polling Booths & Development Works */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Polling Station / Booth Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Vote className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">मतदान केंद्र व पोलिंग बूथ</h4>
                      <p className="text-xs text-slate-500">इस गाँव के अंतर्गत आने वाले पोलिंग बूथ व अधिकारी</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                    {villageBooths.length} बूथ
                  </span>
                </div>

                {villageBooths.length > 0 ? (
                  <div className="space-y-3">
                    {villageBooths.map(b => (
                      <div key={b.id} className="p-4 bg-purple-50/40 rounded-xl border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-purple-700 text-white rounded text-[11px] font-extrabold">
                              बूथ #{b.boothNumber}
                            </span>
                            <h5 className="font-bold text-slate-900 text-sm">{b.pollingStationName}</h5>
                          </div>
                          <p className="text-xs text-slate-600">{b.address}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                            <span>कुल मतदाता: <strong className="text-slate-800">{b.totalVoters}</strong></span>
                            <span>({b.maleVoters} पुरुष / {b.femaleVoters} महिला)</span>
                          </div>
                        </div>

                        <div className="sm:text-right text-xs space-y-1 bg-white p-3 rounded-lg border border-purple-100 flex-shrink-0">
                          <p className="font-bold text-purple-900">बी.एल.ओ. (BLO):</p>
                          <p className="text-slate-700 font-medium">{b.bloName || 'नामित बी.एल.ओ.'}</p>
                          <p className="text-slate-500 text-[11px]">{b.sectorOfficer || 'सेक्टर मजिस्ट्रेट'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500">इस गाँव के लिए प्राथमिक पोलिंग स्टेशन निकटतम केंद्र पर संबद्ध है।</p>
                  </div>
                )}
              </div>

              {/* 2. Development Works in this Village */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">गाँव में स्वीकृत एवं पूर्ण विकास कार्य</h4>
                      <p className="text-xs text-slate-500">विधायक निधि एवं शासकीय योजनाओं द्वारा स्वीकृत निर्माण</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                    {villageDevelopments.length} योजनाएं
                  </span>
                </div>

                {villageDevelopments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {villageDevelopments.map(d => (
                      <div key={d.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                              {d.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              d.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {d.status}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-sm">{d.title}</h5>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{d.description}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                          <span className="text-slate-500">लागत:</span>
                          <span className="font-black text-slate-900">{d.budget}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500">इस गाँव के विकास प्रस्ताव सर्वेक्षण में सम्मिलित किए जा रहे हैं।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">कृपया ऊपर दिए गए ड्रॉपडाउन से अपना गाँव चुनें</p>
          </div>
        )}
      </div>
    </section>
  );
}
