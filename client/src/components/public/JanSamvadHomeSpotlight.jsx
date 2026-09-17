import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  MessageSquare,
  UserPlus,
  QrCode,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Maximize2,
  X,
  FileText,
  HeartHandshake,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import WhatsAppRegistrationLinkBox from './WhatsAppRegistrationLinkBox';

export default function JanSamvadHomeSpotlight() {
  const { navigateToPublicPage, setShowQrModal, setShowLoginModal, currentUser } = useApp();
  const [trackQuery, setTrackQuery] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedItem, setTrackedItem] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [showFullQrModal, setShowFullQrModal] = useState(false);

  // Quick Inline Grievance Tracking
  const handleQuickTrack = async (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackingLoading(true);
    setTrackError('');
    setTrackedItem(null);

    try {
      const res = await api.trackJanSamvadGrievance(trackQuery.trim());
      if (res && res.success && res.data) {
        setTrackedItem(res.data);
      } else {
        setTrackError(res?.message || 'इस टोकन / मोबाइल नंबर से कोई शिकायत प्राप्त नहीं हुई।');
      }
    } catch (err) {
      setTrackError('शिकायत स्थिति खोजने में असमर्थ। कृपया पुनः प्रयास करें।');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return { label: 'निस्तारित (Resolved)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'in_progress':
        return { label: 'प्रक्रियाधीन (In Progress)', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'forwarded_dept':
        return { label: 'विभाग को प्रेषित (Forwarded)', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: 'लंबित / समीक्षाधीन (Pending)', bg: 'bg-orange-100 text-orange-800 border-orange-300' };
    }
  };

  return (
    <section className="relative py-8 bg-gradient-to-b from-orange-50/50 via-white to-slate-50 border-y border-orange-200/60 shadow-sm overflow-hidden">
      {/* Decorative Tricolor Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-green-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Ribbon Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सबसे महत्वपूर्ण सेवा (Central Public Service)</span>
            </span>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              इटावा विधानसभा (200) | सीधा जनसंवाद एवं जनसेवा
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold">
            {currentUser ? (
              <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>लॉगिन: {currentUser.name}</span>
              </span>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-orange-700 hover:text-orange-800 bg-orange-100/70 hover:bg-orange-100 px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1"
              >
                <span>👤 यूजर लॉगिन / स्टेटस देखें</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Left Feature Box + Right QR & Mobile Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT 7 COLS: Action Hub for Jan Samvad & Connect With Us */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-300/80 shadow-xl shadow-orange-500/5 relative overflow-hidden flex flex-col justify-between">
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-100/60 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center space-x-2 text-orange-600 font-extrabold text-xs uppercase tracking-wide bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>सीधी जनसुनवाई एवं पारदर्शी निवारण प्रणाली</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  जन संवाद एवं हमसे जुड़ें
                  <span className="block text-orange-600 text-lg sm:text-xl font-bold mt-1 font-serif">
                    “अपनी समस्या सीधे विधायक जी तक पहुंचाएं, त्वरित समाधान पाएं”
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  इटावा विधानसभा क्षेत्र का कोई भी नागरिक बिना किसी कार्यालय के चक्कर काटे, सीधे इस पोर्टल के माध्यम से अपनी समस्या, सुझाव अथवा विकास कार्य का प्रस्ताव फोटो व आवश्यक दस्तावेजों सहित दर्ज करा सकता है। प्रत्येक शिकायत पर संबंधित विभाग से समन्वय कर त्वरित कार्रवाई की जाती है।
                </p>
              </div>

              {/* Quick 3 Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">घर बैठे ऑनलाइन दर्ज</h4>
                    <p className="text-[11px] text-slate-500">मोबाइल या कंप्यूटर से फोटो व विवरण सहित सबमिट करें।</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">यूनिक टोकन व रसीद</h4>
                    <p className="text-[11px] text-slate-500">तुरंत पावती रसीद प्राप्त करें जिसे प्रिंट भी कर सकते हैं।</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">पारदर्शी लाइव ट्रैकिंग</h4>
                    <p className="text-[11px] text-slate-500">अधिकारी स्तर पर हो रही कार्रवाई को रियल-टाइम ट्रैक करें।</p>
                  </div>
                </div>
              </div>

              {/* Direct One-Click Actions */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigateToPublicPage('jan-samvad')}
                  className="flex-1 min-w-[200px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-600/30 transition active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>समस्या / शिकायत दर्ज करें (जनसंवाद)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowQrModal(true)}
                  className="py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-700/20 transition active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>हमसे जुड़ें / सदस्यता लें</span>
                </button>
              </div>

              {/* Inline Quick Track Form */}
              <div className="pt-4 border-t border-slate-100">
                <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      placeholder="टोकन संख्या (उदा: JS-2026-ETW-1001) या 10-अंकीय मोबाइल नंबर..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {trackingLoading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>स्थिति ट्रैक करें</span>
                  </button>
                </form>

                {/* Track Error */}
                {trackError && (
                  <p className="mt-2 text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                    {trackError}
                  </p>
                )}

                {/* Tracked Result Box */}
                {trackedItem && (
                  <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-emerald-50 border border-orange-200 animate-fadeIn space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200 shadow-xs">
                          {trackedItem.tokenNumber}
                        </span>
                        <span className="font-bold text-xs text-slate-900">
                          {trackedItem.citizenName} ({trackedItem.village})
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(trackedItem.status).bg}`}>
                        {getStatusBadge(trackedItem.status).label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold line-clamp-1">
                      विषय: {trackedItem.subject}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>दर्ज तिथि: {trackedItem.dateDisplay || trackedItem.createdAt?.split('T')[0]}</span>
                      <button
                        onClick={() => navigateToPublicPage('jan-samvad')}
                        className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-0.5"
                      >
                        <span>विस्तृत विवरण देखें</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: Mobile QR Scanner Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between items-center text-center relative border border-slate-700">
            {/* Header Badge */}
            <div className="w-full flex items-center justify-between text-xs font-bold mb-3">
              <span className="flex items-center space-x-1 text-emerald-400">
                <Smartphone className="w-4 h-4" />
                <span>मोबाइल में खोलें</span>
              </span>
              <button
                onClick={() => setShowFullQrModal(true)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="बड़ा QR देखें"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black tracking-tight text-white">
                फोन के कैमरे से स्कैन करें
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs mx-auto">
                सीधे अपने मोबाइल से जन संवाद फॉर्म भरें, फोटो अपलोड करें और तुरंत रसीद पाएं।
              </p>
            </div>

            {/* The QR Code Container */}
            <div
              onClick={() => setShowFullQrModal(true)}
              className="my-4 p-3.5 bg-white rounded-2xl shadow-2xl inline-block cursor-pointer group hover:scale-105 transition transform relative"
              title="क्लिक करके बड़ा QR देखें"
            >
              <div className="w-36 h-36 bg-white flex items-center justify-center relative">
                {/* Clean Scalable SVG QR Code */}
                <svg className="w-full h-full text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm-2-4h2v2h-2v-2zm4-4h4v2h-4v-2zm-4 0h2v2h-2v-2zm2 6h2v2h-2v-2zm2-2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                </svg>
                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                    🪷
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 rounded-2xl transition flex items-center justify-center">
                <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                  🔍 ज़ूम करें
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Registration Link Box (As Requested by User) */}
            <div className="w-full my-3">
              <WhatsAppRegistrationLinkBox variant="dark" source="Spotlight QR" />
            </div>

            <div className="w-full space-y-2">
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-amber-300 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>कैमरा खोलें • कोड स्कैन करें • फॉर्म भरें</span>
              </div>

              <div className="pt-2 border-t border-slate-800 w-full flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow active:scale-95 cursor-pointer"
                >
                  वेब फॉर्म खोलें
                </button>
                <button
                  onClick={() => navigateToPublicPage('jan-samvad')}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 active:scale-95 cursor-pointer"
                >
                  जनसंवाद पेज
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* High-Resolution QR Zoom Modal */}
      {showFullQrModal && (
        <div
          onClick={() => setShowFullQrModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative"
          >
            <button
              onClick={() => setShowFullQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl">
              🪷
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">जनसंवाद एवं सदस्यता QR कोड</h3>
              <p className="text-xs text-slate-500">इटावा विधानसभा (200) | सीधा जनसंपर्क</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 inline-block">
              <div className="w-52 h-52 bg-white p-2 rounded-xl shadow flex items-center justify-center relative">
                <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm-2-4h2v2h-2v-2zm4-4h4v2h-4v-2zm-4 0h2v2h-2v-2zm2 6h2v2h-2v-2zm2-2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-sm bg-orange-600 text-white rounded-full p-1 shadow">🪷</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-700">
              स्मार्टफोन कैमरे को इस कोड के सामने लाएं
            </p>

            {/* Direct WhatsApp Registration Link Box in Modal */}
            <div className="text-left w-full">
              <WhatsAppRegistrationLinkBox variant="light" source="Zoom QR Modal" />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setShowFullQrModal(false);
                  setShowQrModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition"
              >
                कंप्यूटर पर फॉर्म भरें
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
