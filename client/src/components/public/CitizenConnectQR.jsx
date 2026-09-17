import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { QrCode, UserPlus, CheckCircle, AlertCircle, X, ShieldCheck } from 'lucide-react';
import WhatsAppRegistrationLinkBox from './WhatsAppRegistrationLinkBox';

export default function CitizenConnectQR() {
  const { showQrModal, setShowQrModal, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: 'रामपुर',
    booth: 'बूथ संख्या 12',
    type: 'Citizen',
    area: 'इटावा विधानसभा (200)'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert('कृपया नाम और मोबाइल नंबर दर्ज करें।');
      return;
    }
    setLoading(true);
    setResult(null);

    const res = await api.registerCitizen(formData);
    setLoading(false);

    if (res.success) {
      setResult({ success: true, message: res.message });
      showToast('पंजीकरण सफल! जनसेवा परिवार में आपका स्वागत है।', 'success');
      setFormData({ name: '', mobile: '', village: 'रामपुर', booth: 'बूथ संख्या 12', type: 'Citizen', area: 'इटावा विधानसभा (200)' });
    } else {
      setResult({ success: false, message: res.message, isDuplicate: res.isDuplicate });
    }
  };

  const villages = ['रामपुर', 'सैफई', 'बकेवर', 'तकरोई', 'पिलखर', 'जसवंतनगर', 'भरथना', 'उदी', 'इटावा सदर'];

  return (
    <>
      {/* Widget Card (Mockup 4 Right) */}
      <div id="citizen-connect" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 h-full flex flex-col justify-between text-center items-center">
        <div className="w-full">
          <div className="inline-flex items-center space-x-1.5 text-green-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>सीधा जनसंपर्क</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
            जनसेवा से जुड़ें
          </h3>

          {/* QR Code Container */}
          <div className="my-3 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl inline-block shadow-inner">
            {/* SVG Representation of clean QR code */}
            <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl shadow flex items-center justify-center relative">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm-2-4h2v2h-2v-2zm4-4h4v2h-4v-2zm-4 0h2v2h-2v-2zm2 6h2v2h-2v-2zm2-2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs bg-orange-600 text-white rounded-full p-0.5">🪷</span>
              </div>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-800">
            QR स्कैन करें और हमारे परिवार का हिस्सा बनें
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            सीधा सुझाव, शिकायत निवारण व सरकारी योजनाओं की नियमित जानकारी हेतु।
          </p>

          {/* WhatsApp Registration Link Generator */}
          <div className="mt-3 text-left w-full">
            <WhatsAppRegistrationLinkBox variant="light" source="Citizen Connect QR Widget" />
          </div>
        </div>

        <div className="w-full pt-4 mt-3 border-t border-slate-100">
          <button
            onClick={() => setShowQrModal(true)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-green-600/20 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>अभी जुड़ें (सदस्यता फॉर्म)</span>
          </button>
        </div>
      </div>

      {/* Citizen Registration Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => { setShowQrModal(false); setResult(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2 text-2xl shadow-inner">
                🪷
              </div>
              <h3 className="text-xl font-black text-slate-900">जनसेवा सदस्यता पंजीकरण</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                इटावा विधानसभा (200) | श्रीमती सरिता भदौरिया
              </p>
            </div>

            {result && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-start space-x-2 ${
                result.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div>{result.message}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">पूरा नाम (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रमेश कुमार"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर (Mobile No) *</label>
                <input
                  type="tel"
                  required
                  placeholder="उदा. 9876543210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">गाँव / क्षेत्र (Village)</label>
                  <select
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    {villages.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">सदस्य प्रकार (Type)</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="Citizen">नागरिक (Citizen)</option>
                    <option value="Supporter">समर्थक (Supporter)</option>
                    <option value="Volunteer">कार्यकर्ता (Volunteer)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'प्रक्रिया जारी है...' : 'पंजीकरण पूर्ण करें'}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-[11px] text-slate-400">
              सुरक्षित डिजिटल डेटाबेस | गोपनीयता सुरक्षित
            </div>
          </div>
        </div>
      )}
    </>
  );
}
