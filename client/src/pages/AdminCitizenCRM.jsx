import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Users, Search, PlusCircle, FileSpreadsheet, Camera, QrCode, Trash2, CheckCircle2, AlertTriangle, X, MessageCircle, Send, CheckSquare, Square, Smartphone } from 'lucide-react';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminCitizenCRM() {
  const { showToast } = useApp();
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState('');
  const [filterVillage, setFilterVillage] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [ocrSimulating, setOcrSimulating] = useState(false);

  // Multi-Selection State for Direct WhatsApp
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDirectWhatsAppModal, setShowDirectWhatsAppModal] = useState(false);
  const [customWaMessage, setCustomWaMessage] = useState('');
  const [activeQueueIndex, setActiveQueueIndex] = useState(0);

  useEffect(() => {
    loadCitizens();
  }, [search, filterVillage, filterType]);

  const loadCitizens = async () => {
    const res = await api.getCitizens({ search, village: filterVillage, type: filterType });
    if (res.success) setCitizens(res.citizens);
  };

  const handleDelete = async (id) => {
    if (!confirm('क्या आप वाकई इस नागरिक रिकॉर्ड को हटाना चाहते हैं?')) return;
    const res = await api.deleteCitizen(id);
    if (res.success) {
      showToast('रिकॉर्ड हटा दिया गया।', 'info');
      loadCitizens();
    }
  };

  const handleBulkImport = async () => {
    // Parse CSV / comma separated lines
    const lines = importText.trim().split('\n');
    const records = [];
    lines.forEach(l => {
      const parts = l.split(',').map(p => p.trim());
      if (parts[0] && parts[1]) {
        records.push({
          name: parts[0],
          mobile: parts[1],
          village: parts[2] || 'इटावा',
          booth: parts[3] || 'वार्ड 1',
          type: parts[4] || 'Citizen'
        });
      }
    });

    if (records.length === 0) {
      alert('कृपया कम से कम एक पंक्ति दर्ज करें (नाम, मोबाइल, गांव)');
      return;
    }

    const res = await api.bulkImportCitizens(records, 'Excel CSV Import', 'Admin (Super Admin)');
    if (res.success) {
      showToast(`इम्पोर्ट संपन्न: ${res.added} नए नागरिक जोड़े गए (${res.duplicates} डुप्लिकेट छोड़े गए)`, 'success');
      setShowImportModal(false);
      setImportText('');
      loadCitizens();
    }
  };

  const handleSimulateOCR = () => {
    setOcrSimulating(true);
    setTimeout(() => {
      setImportText(`राजेन्द्र प्रसाद, 9823456789, सैफई, बूथ 12, Supporter\nअनिता शर्मा, 9712345678, बकेवर, बूथ 05, Citizen\nमनीष सिंह, 9911223344, रामपुर, बूथ 08, Volunteer`);
      setOcrSimulating(false);
      showToast('OCR ने मतदाता पर्ची से 3 रिकॉर्ड सफलतापूर्वक निकाल लिए!', 'success');
    }, 1200);
  };

  const villages = ['All', 'Saifai', 'Bechpura', 'Udi', 'Banthar', 'Rampur', 'Bakewar', 'Takroi'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Citizen Relationship Management (CRM) Database</h2>
          <p className="text-xs text-slate-500">विधानसभा क्षेत्र के 50,000+ नागरिकों, समर्थकों व कार्यकर्ताओं का एकीकृत डिजिटल डेटाबेस</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bulk Import (Excel / OCR)</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-600 mb-1">Search Citizen / Mobile</label>
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="नाम या मोबाइल नंबर खोजें..."
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
          <label className="block font-bold text-slate-600 mb-1">Type (प्रकार)</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
          >
            <option value="All">All Types</option>
            <option value="Citizen">Citizen (नागरिक)</option>
            <option value="Supporter">Supporter (समर्थक)</option>
            <option value="Volunteer">Volunteer (कार्यकर्ता)</option>
            <option value="Booth Leader">Booth Leader (बूथ प्रमुख)</option>
          </select>
        </div>
      </div>

      {/* Citizens Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Selection Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>{selectedIds.length} नागरिक चयनित</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-600 hover:text-slate-900 font-bold px-2 py-1 cursor-pointer"
              >
                चयन हटाएं
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomWaMessage('');
                  setActiveQueueIndex(0);
                  setShowDirectWhatsAppModal(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>चयनित को व्हाट्सएप करें ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={citizens.length > 0 && selectedIds.length === citizens.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(citizens.map(c => c.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Mobile</th>
                <th className="p-3.5">Village</th>
                <th className="p-3.5">Booth</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Registered Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {citizens.map((c) => {
                const isChecked = selectedIds.includes(c.id);
                return (
                  <tr key={c.id} className={`hover:bg-slate-50 transition ${isChecked ? 'bg-emerald-50/40' : ''}`}>
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, c.id]);
                          } else {
                            setSelectedIds(prev => prev.filter(id => id !== c.id));
                          }
                        }}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                    <td className="p-3.5 text-slate-600 font-mono">{c.mobile}</td>
                    <td className="p-3.5 font-semibold text-orange-700">{c.village}</td>
                    <td className="p-3.5 text-slate-500">{c.booth}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.type === 'Supporter' ? 'bg-amber-100 text-amber-800' :
                        c.type === 'Volunteer' ? 'bg-indigo-100 text-indigo-800' :
                        c.type === 'Booth Leader' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px]">{c.date}</td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIds([c.id]);
                          setCustomWaMessage('');
                          setActiveQueueIndex(0);
                          setShowDirectWhatsAppModal(true);
                        }}
                        className="p-1 rounded text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition inline-flex items-center cursor-pointer"
                        title="विधायक सीधा व्हाट्सएप संदेश लिखें"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct WhatsApp Multi-Send Assistant Modal */}
      {showDirectWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDirectWhatsAppModal(false)}
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
                  विधायक सीधा व्हाट्सएप संदेश (Direct WhatsApp)
                </h3>
                <p className="text-xs text-slate-500">
                  चयनित {selectedIds.length} नागरिकों को विधायक स्तर से व्यक्तिगत संदेश भेजें
                </p>
              </div>
            </div>

            {/* Selected Recipients Preview Pills */}
            <div className="my-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                प्राप्तकर्ता ({selectedIds.length} नागरिक):
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {citizens.filter(c => selectedIds.includes(c.id)).map((sc) => (
                  <span key={sc.id} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-xs font-semibold border border-slate-200 text-slate-800">
                    <span>{sc.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({sc.mobile})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Template Buttons */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                त्वरित संदेश टेम्पलेट (Quick Templates):
              </label>
              <div className="flex flex-wrap gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setCustomWaMessage("सादर प्रणाम! विधायक कार्यालय इटावा (200) से जनसेवा संवाद हेतु संपर्क किया जा रहा है। यदि आपके गाँव या क्षेत्र में कोई समस्या हो, तो कृपया हमें अवगत कराएं।")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition border border-slate-200"
                >
                  🌾 कुशलक्षेम व जनसेवा
                </button>
                <button
                  type="button"
                  onClick={() => setCustomWaMessage("सादर प्रणाम! आपके क्षेत्र में विकास कार्यों की समीक्षा व जनसुनवाई हेतु विधायक शिविर का आयोजन किया जा रहा है। आपकी उपस्थिति सादर प्रार्थनीय है।")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition border border-slate-200"
                >
                  🏛️ शिविर आमंत्रण
                </button>
                <button
                  type="button"
                  onClick={() => setCustomWaMessage("सादर प्रणाम! आपके द्वारा जनसंवाद में प्रस्तुत किए गए पत्र पर आवश्यक कार्रवाई शुरू कर दी गई है। निरंतर संपर्क में रहें।")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition border border-slate-200"
                >
                  📋 समस्या निवारण सूचना
                </button>
              </div>
            </div>

            {/* Message Box */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">संदेश सामग्री (Message Body) *</label>
                <VoiceInputButton
                  onTranscript={(txt) => setCustomWaMessage(prev => prev ? prev + ' ' + txt : txt)}
                  mode="append"
                  size="sm"
                />
              </div>
              <textarea
                rows="4"
                value={customWaMessage}
                onChange={(e) => setCustomWaMessage(e.target.value)}
                placeholder="यहाँ संदेश लिखें या बोलकर टाइप करें..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>संदेश में नागरिक का नाम अभिवादन के रूप में स्वतः जोड़ा जाएगा।</span>
                <span>{customWaMessage.length} वर्ण</span>
              </div>
            </div>

            {/* Dispatch Action Area */}
            {selectedIds.length === 1 ? (
              // Single citizen direct trigger
              <button
                type="button"
                onClick={async () => {
                  const target = citizens.find(c => c.id === selectedIds[0]);
                  if (!target) return;
                  const finalMsg = `सादर प्रणाम ${target.name} जी,\n\n${customWaMessage || 'विधायक कार्यालय इटावा (200) से जनसेवा संवाद हेतु संपर्क।'}\n\n— श्रीमती सरिता भदौरिया (विधायक, इटावा)`;
                  window.open(`https://api.whatsapp.com/send?phone=91${target.mobile}&text=${encodeURIComponent(finalMsg)}`, '_blank');
                  await api.logDirectMessage({ recipients: target, message: finalMsg });
                  showToast('व्हाट्सएप चैट विंडो खोल दी गई!', 'success');
                  setShowDirectWhatsAppModal(false);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>सीधा व्हाट्सएप खोलें (Open Direct WhatsApp)</span>
              </button>
            ) : (
              // Multi-citizen sequential sender queue
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    क्रमिक व्हाट्सएप प्रेषण ({activeQueueIndex + 1} / {selectedIds.length})
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    {citizens.filter(c => selectedIds.includes(c.id))[activeQueueIndex]?.name} ({citizens.filter(c => selectedIds.includes(c.id))[activeQueueIndex]?.mobile})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const selectedCitizens = citizens.filter(c => selectedIds.includes(c.id));
                      const target = selectedCitizens[activeQueueIndex];
                      if (!target) return;
                      const finalMsg = `सादर प्रणाम ${target.name} जी,\n\n${customWaMessage || 'विधायक कार्यालय इटावा (200) से जनसेवा संवाद हेतु संपर्क।'}\n\n— श्रीमती सरिता भदौरिया (विधायक, इटावा)`;
                      window.open(`https://api.whatsapp.com/send?phone=91${target.mobile}&text=${encodeURIComponent(finalMsg)}`, '_blank');
                      
                      if (activeQueueIndex + 1 < selectedCitizens.length) {
                        setActiveQueueIndex(prev => prev + 1);
                      } else {
                        await api.logDirectMessage({ recipients: selectedCitizens, message: finalMsg });
                        showToast('सभी चयनित नागरिकों को संदेश प्रेषित कर दिया गया!', 'success');
                        setShowDirectWhatsAppModal(false);
                      }
                    }}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>व्हाट्सएप भेजें और अगला</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const selectedCitizens = citizens.filter(c => selectedIds.includes(c.id));
                      if (activeQueueIndex + 1 < selectedCitizens.length) {
                        setActiveQueueIndex(prev => prev + 1);
                      } else {
                        setShowDirectWhatsAppModal(false);
                      }
                    }}
                    className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    इन्हें छोड़ें (Skip)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setShowImportModal(false)} className="absolute top-4 right-4 text-slate-400 p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-2">Excel / OCR डेटा इम्पोर्ट</h3>
            <p className="text-xs text-slate-500 mb-3">
              प्रत्येक पंक्ति में अल्पविराम (comma) से अलग करके दर्ज करें: <b>नाम, मोबाइल, गाँव, बूथ, प्रकार</b>
            </p>

            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={handleSimulateOCR}
                disabled={ocrSimulating}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200 flex items-center gap-1 hover:bg-purple-100 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{ocrSimulating ? 'OCR स्कैनिंग...' : 'Simulate OCR (मतदाता पर्ची फोटो)'}</span>
              </button>
              <VoiceInputButton
                onTranscript={(text) => setImportText(prev => prev ? `${prev}\n${text}` : text)}
                mode="append"
                buttonTitle="बोलकर डेटा दर्ज करें"
                size="sm"
              />
            </div>

            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="रमेश कुमार, 9876543210, सैफई, बूथ 14, Citizen&#10;पूजा यादव, 8765432109, बेचपुरा, बूथ 28, Supporter"
              className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs mb-3"
            />

            <button
              onClick={handleBulkImport}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
            >
              इम्पोर्ट निष्पादित करें (डुप्लिकेट स्वतः फ़िल्टर होंगे)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
