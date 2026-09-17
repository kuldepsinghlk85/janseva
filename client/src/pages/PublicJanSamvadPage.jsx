import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import Navbar from '../components/public/Navbar';
import FestivalBanner from '../components/public/FestivalBanner';
import FooterPanorama from '../components/public/FooterPanorama';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  Printer,
  Share2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Building,
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';

export default function PublicJanSamvadPage() {
  const { navigateToPublicPage, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('register'); // 'register', 'track'

  // Grievance Form State
  const [formData, setFormData] = useState({
    citizenName: '',
    fatherSpouseName: '',
    mobile: '',
    tehsil: 'इटावा',
    block: 'बढ़पुरा',
    village: '',
    category: 'सड़क व नाली निर्माण',
    priority: 'आवश्यक',
    subject: '',
    description: '',
    attachedDocuments: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  // Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedGrievance, setTrackedGrievance] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Tehsils & Blocks master data
  const [tehsils, setTehsils] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadLocationMasters();
  }, []);

  const loadLocationMasters = async () => {
    try {
      const [tRes, bRes, vRes] = await Promise.all([
        api.getLocationTehsils(),
        api.getLocationBlocks(),
        api.getLocationVillages()
      ]);
      if (tRes?.success) setTehsils(tRes.data);
      if (bRes?.success) setBlocks(bRes.data);
      if (vRes?.success) setVillages(vRes.data);
    } catch (e) {
      console.error('Failed loading location masters', e);
    }
  };

  // Handle Photo / File Attachment
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast?.('फाइल का आकार 5 MB से कम होना चाहिए!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newDoc = {
        name: file.name,
        url: event.target.result,
        type: file.type.includes('pdf') ? 'pdf' : 'image'
      };
      setFormData(prev => ({
        ...prev,
        attachedDocuments: [...prev.attachedDocuments, newDoc]
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachedDocuments: prev.attachedDocuments.filter((_, i) => i !== index)
    }));
  };

  // Submit Grievance
  const handleSubmitGrievance = async (e) => {
    e.preventDefault();
    if (!formData.citizenName.trim() || !formData.mobile.trim() || !formData.subject.trim()) {
      showToast?.('कृपया नाम, मोबाइल नंबर और विषय अवश्य भरें!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.registerJanSamvadGrievance(formData);
      if (res?.success) {
        setSubmissionReceipt(res.data);
        showToast?.('समस्या सफलतापूर्वक दर्ज हो गई! टोकन संख्या सुरक्षित रखें।');
      } else {
        showToast?.(res?.message || 'समस्या दर्ज करने में त्रुटि आई', 'error');
      }
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Track Grievance
  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!trackQuery.trim()) return;

    setTrackingLoading(true);
    setTrackError('');
    setTrackedGrievance(null);

    try {
      const res = await api.trackJanSamvadGrievance(trackQuery.trim());
      if (res?.success && res.data) {
        setTrackedGrievance(res.data);
      } else {
        setTrackError(res?.message || 'इस टोकन अथवा मोबाइल नंबर से कोई शिकायत नहीं मिली।');
      }
    } catch (err) {
      setTrackError('शिकायत खोजने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setTrackingLoading(false);
    }
  };

  // Print Function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-500 selection:text-white">
      <FestivalBanner />
      <Navbar />

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigateToPublicPage('home')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition backdrop-blur-sm border border-white/20 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← मुख्य पृष्ठ पर वापस जाएं</span>
            </button>

            <span className="text-xs text-orange-400 font-bold tracking-wider uppercase bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
              विधायक जनसुनवाई एवं शिकायत निवारण पटल
            </span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-200 text-xs font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
              <span>सीधा नागरिक संवाद एवं पारदर्शी समाधान</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
              जन संवाद (Jan Samvad) – नागरिक समस्या निवारण पोर्टल
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              इटावा विधानसभा (200) के नागरिक अपनी किसी भी सार्वजनिक या व्यक्तिगत समस्या को ऑनलाइन दर्ज कराएं, आवेदन पत्र संलग्न करें तथा अपनी शिकायत की स्थिति को लाइव ट्रैक कर रसीद डाउनलोड करें।
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => { setActiveTab('register'); setSubmissionReceipt(null); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. समस्या / प्रार्थना पत्र दर्ज करें</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>2. शिकायत स्थिति देखें व रसीद डाउनलोड करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ===================== TAB 1: REGISTRATION ===================== */}
        {activeTab === 'register' && (
          <div>
            {!submissionReceipt ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto">
                <div className="mb-6 pb-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">प्रार्थना पत्र / जनसंवाद फॉर्म भरें</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      कृपया अपनी सही जानकारी भरें ताकि समस्या का शीघ्र समाधान एवं संपर्क किया जा सके।
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase">
                    ई-जनसुनवाई सेवा
                  </span>
                </div>

                <form onSubmit={handleSubmitGrievance} className="space-y-5">
                  {/* Citizen Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">नागरिक का पूरा नाम *</label>
                      <input
                        type="text"
                        required
                        value={formData.citizenName}
                        onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                        placeholder="उदा: रामबाबू शर्मा"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">पिता / पति का नाम</label>
                      <input
                        type="text"
                        value={formData.fatherSpouseName}
                        onChange={(e) => setFormData({ ...formData, fatherSpouseName: e.target.value })}
                        placeholder="उदा: स्व. रामदयाल शर्मा"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर (WhatsApp संबद्ध) *</label>
                      <input
                        type="tel"
                        required
                        maxLength="10"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="10 अंकों का मोबाइल नंबर"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">समस्या की श्रेणी (Department / Category) *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value="सड़क व नाली निर्माण">सड़क व नाली निर्माण (PWD / Gram Vikas)</option>
                        <option value="विद्युत आपूर्ति व ट्रांसफार्मर">विद्युत आपूर्ति, मीटर व ट्रांसफार्मर (Electricity)</option>
                        <option value="पेयजल व हैंडपंप मरम्मत">पेयजल, नल-जल व हैंडपंप (Jal Nigam)</option>
                        <option value="कल्याणकारी योजनाएं (पेंशन/आवास/राशन)">कल्याणकारी योजनाएं (पेंशन / आवास / राशन)</option>
                        <option value="राजस्व, भूमि व चकरोड विवाद">राजस्व, भूमि पैमाइश व चकरोड (Tehsil)</option>
                        <option value="स्वास्थ्य, अस्पताल व दवाई">स्वास्थ्य, अस्पताल व चिकित्सा सुविधा (Healthcare)</option>
                        <option value="शिक्षा व विद्यालय कायाकल्प">शिक्षा व विद्यालय समस्या (Basic Shiksha)</option>
                        <option value="पुलिस व शांति व्यवस्था">पुलिस प्रशासन व सुरक्षा (Police/Security)</option>
                        <option value="अन्य सामान्य समस्या">अन्य सामान्य जनहित समस्या</option>
                      </select>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">तहसील चुनें</label>
                      <select
                        value={formData.tehsil}
                        onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      >
                        {tehsils.map(t => (
                          <option key={t.id} value={t.name}>{t.nameHi || t.name} तहसील</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">विकासखंड (Block)</label>
                      <select
                        value={formData.block}
                        onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      >
                        {blocks.map(b => (
                          <option key={b.id} value={b.blockName || b.name}>{b.blockNameHi || b.blockName || b.name} ब्लॉक</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">गाँव / मजरा / वार्ड का नाम</label>
                      <input
                        type="text"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        placeholder="उदा: ग्राम रामपुर, वार्ड नं. 4..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  {/* Subject & Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">समस्या का मुख्य विषय (Subject) *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="उदा: मुख्य बस्ती में जल निकासी हेतु 200 मीटर पक्की नाली निर्माण..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">समस्या का विस्तृत विवरण (Full Details) *</label>
                    <textarea
                      rows="4"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="समस्या कब से है, इससे कितने लोग प्रभावित हैं, तथा क्या आवश्यक कार्रवाई अपेक्षित है, विस्तार से लिखें..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    ></textarea>
                  </div>

                  {/* Attach Necessary Documents / Photos */}
                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-orange-600" />
                      <span>जरूरी कागज / आवेदन पत्र की फोटो संलग्न करें (Optional Attachments)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mb-3">
                      यदि आपके पास प्रार्थना पत्र, आधार कार्ड या समस्या स्थल की फोटो है तो यहाँ अपलोड करें। (JPG, PNG, PDF)
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="px-4 py-2 bg-white border border-dashed border-orange-400 hover:border-orange-600 rounded-xl text-xs font-bold text-orange-700 cursor-pointer flex items-center space-x-2 transition shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ फोटो / दस्तावेज चुनें</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {formData.attachedDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-sm">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span className="truncate max-w-[150px] font-medium text-slate-700">{doc.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>प्रार्थना पत्र दर्ज किया जा रहा है...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>समस्या जनसंवाद पोर्टल पर सबमिट करें →</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Receipt Generated Screen */
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 max-w-2xl mx-auto text-center printable-receipt">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  प्रार्थना पत्र सफलतापूर्वक पंजीकृत हुआ
                </span>

                <h2 className="text-2xl font-black text-slate-900 mt-3">
                  आपकी शिकायत जनसंवाद पटल पर दर्ज कर ली गई है
                </h2>

                <div className="my-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                  <span className="text-xs text-slate-500 font-bold block">आपकी ट्रैकिंग टोकन संख्या (Tracking Token)</span>
                  <span className="text-3xl font-black text-orange-600 font-mono tracking-wider block mt-1">
                    {submissionReceipt.tokenNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    कृपया इस टोकन नंबर को सुरक्षित रखें। इसी से अपनी शिकायत की स्थिति देख सकेंगे।
                  </span>
                </div>

                <div className="text-left bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-500">नागरिक का नाम:</span>
                    <span className="font-bold text-slate-900">{submissionReceipt.citizenName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">मोबाइल नंबर:</span>
                    <span className="font-bold text-slate-900">{submissionReceipt.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">क्षेत्र / गाँव:</span>
                    <span className="font-bold text-slate-900">{submissionReceipt.village}, {submissionReceipt.block}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">विषय:</span>
                    <span className="font-bold text-slate-900">{submissionReceipt.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">पंजीकरण तिथि:</span>
                    <span className="font-bold text-slate-900">{submissionReceipt.dateDisplay}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={handlePrint}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>रसीद प्रिंट / डाउनलोड करें</span>
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`मेरी शिकायत जनसंवाद इटावा पर दर्ज हुई। टोकन संख्या: ${submissionReceipt.tokenNumber}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp पर सहेजें</span>
                  </a>

                  <button
                    onClick={() => {
                      setTrackQuery(submissionReceipt.tokenNumber);
                      setActiveTab('track');
                      setTrackedGrievance(submissionReceipt);
                    }}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>स्थिति ट्रैक करें →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: TRACKING & DOWNLOAD ===================== */}
        {activeTab === 'track' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Tracking Search Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-900 mb-1">अपनी शिकायत की स्थिति देखें व रिपोर्ट प्राप्त करें</h2>
              <p className="text-xs text-slate-500 mb-5">
                प्रार्थना पत्र जमा करते समय प्राप्त टोकन संख्या (उदा: JS-2026-ETW-1001) या पंजीकृत मोबाइल नंबर दर्ज करें।
              </p>

              <form onSubmit={handleTrack} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="टोकन संख्या (JS-2026-ETW-XXXX) या 10-अंकीय मोबाइल नंबर..."
                    className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm rounded-xl shadow flex items-center space-x-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>{trackingLoading ? 'खोज रहे हैं...' : 'खोजें (Track)'}</span>
                </button>
              </form>

              {trackError && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {/* Tracked Grievance Details & Timeline Display */}
            {trackedGrievance && (
              <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 sm:p-8 space-y-6 printable-case">
                {/* Official Letterhead Header for Print */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider">
                      कार्यालय विधायिका, 200 - इटावा विधानसभा
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                      जन संवाद एवं शिकायत निस्तारण आख्या
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      टोकन क्रमांक: <strong className="font-mono text-slate-800">{trackedGrievance.tokenNumber}</strong> | पंजीकरण तिथि: {trackedGrievance.dateDisplay}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      trackedGrievance.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : trackedGrievance.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : trackedGrievance.status === 'forwarded_dept'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {trackedGrievance.status === 'resolved' && '✓ पूर्णतः निस्तारित'}
                      {trackedGrievance.status === 'in_progress' && '⏳ कार्रवाई प्रगति पर'}
                      {trackedGrievance.status === 'forwarded_dept' && '↗ संबंधित विभाग को प्रेषित'}
                      {trackedGrievance.status === 'reviewed' && '👁️ समीक्षित'}
                      {trackedGrievance.status === 'pending' && '⏱️ लंबित (प्रक्रियाधीन)'}
                      {trackedGrievance.status === 'rejected' && '✕ अस्वीकृत'}
                    </span>

                    <button
                      onClick={handlePrint}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer print:hidden"
                      title="दस्तावेज व रिपोर्ट प्रिंट करें"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Citizen Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">नागरिक का नाम</span>
                    <span className="font-bold text-slate-900">{trackedGrievance.citizenName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">पिता / पति का नाम</span>
                    <span className="font-bold text-slate-800">{trackedGrievance.fatherSpouseName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">संबद्ध क्षेत्र / गाँव</span>
                    <span className="font-bold text-slate-800">{trackedGrievance.village}, {trackedGrievance.block}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">संबंधित विभाग</span>
                    <span className="font-bold text-blue-700">{trackedGrievance.department || trackedGrievance.category}</span>
                  </div>
                </div>

                {/* Subject & Description */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">समस्या का विवरण (Grievance Description):</h4>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-800">
                    <p className="font-bold text-slate-900 mb-1">{trackedGrievance.subject}</p>
                    <p className="text-slate-600">{trackedGrievance.description}</p>
                  </div>
                </div>

                {/* Attached Document Preview if any */}
                {trackedGrievance.attachedDocuments?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700">संलग्न दस्तावेज / आवेदन पत्र की फोटो:</h4>
                    <div className="flex flex-wrap gap-3">
                      {trackedGrievance.attachedDocuments.map((doc, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                          <img
                            src={doc.url}
                            alt="Attachment"
                            className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-slate-800 block">{doc.name}</span>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-600 hover:underline inline-block mt-1 font-semibold"
                            >
                              पूरा देखें (Open Full)
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Action Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>कार्रवाई प्रगति टाइमलाइन (Action Taken Timeline)</span>
                  </h4>

                  <div className="space-y-3 pl-2 border-l-2 border-orange-500/40">
                    {trackedGrievance.timeline?.map((item, idx) => (
                      <div key={idx} className="relative pl-5 text-xs">
                        <div className="w-3 h-3 rounded-full bg-orange-600 absolute -left-[7px] top-1 border-2 border-white"></div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500">{item.date} • {item.by}</div>
                        {item.remarks && (
                          <div className="mt-1 p-2 bg-orange-50/60 rounded-lg border border-orange-100 text-orange-950 font-medium">
                            {item.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Action Note / Disposal Remark */}
                {trackedGrievance.actionTakenNote && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                    <span className="font-bold text-emerald-900 block mb-1">
                      कार्यालय आख्या / निस्तारण विवरण (Final Action Taken Note):
                    </span>
                    <p className="text-emerald-800 leading-relaxed font-medium">
                      {trackedGrievance.actionTakenNote}
                    </p>
                  </div>
                )}

                {/* Print & Download Action Bar */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
                  <span className="text-xs text-slate-500 font-medium">
                    आप इस रिपोर्ट को सुरक्षित रखने हेतु प्रिंट कर सकते हैं।
                  </span>

                  <button
                    onClick={handlePrint}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>आख्या व रसीद प्रिंट / डाउनलोड करें</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <FooterPanorama />
    </div>
  );
}
