import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { CheckCircle, AlertCircle, X, UserPlus, Phone, MapPin, ShieldCheck, HeartHandshake, MessageCircle } from 'lucide-react';
import VoiceInputButton from '../common/VoiceInputButton';

export default function CitizenRegistrationModal() {
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
  const [fromWhatsApp, setFromWhatsApp] = useState(false);

  React.useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const m = searchParams.get('mobile');
      const isWa = searchParams.get('source') === 'whatsapp_link' || searchParams.has('mobile');
      if (m) {
        const clean = m.replace(/\D/g, '');
        if (clean.length === 10) {
          setFormData(prev => ({ ...prev, mobile: clean }));
        }
      }
      if (isWa) {
        setFromWhatsApp(true);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [showQrModal]);

  if (!showQrModal) return null;

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
      setResult({ success: true, message: res.message || 'पंजीकरण सफलतापूर्वक दर्ज हो गया है!' });
      showToast('पंजीकरण सफल! जनसेवा परिवार में आपका स्वागत है।', 'success');
      setTimeout(() => {
        setShowQrModal(false);
        setResult(null);
      }, 2000);
    } else {
      setResult({ success: false, message: res.message || 'पंजीकरण में त्रुटि हुई', isDuplicate: res.isDuplicate });
    }
  };

  const villages = ['रामपुर', 'सैफई', 'बकेवर', 'तकरोई', 'पिलखर', 'जसवंतनगर', 'भरथना', 'उदी', 'इटावा सदर'];

  return (
    <div
      onClick={() => { setShowQrModal(false); setResult(null); }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={() => { setShowQrModal(false); setResult(null); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer z-10"
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

        {fromWhatsApp && !result && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              WhatsApp एक्टिवेशन लिंक से स्वागत है! आपका मोबाइल नंबर दर्ज कर लिया गया है, कृपया अपना नाम व गाँव भरकर पंजीकरण पूर्ण करें।
            </span>
          </div>
        )}

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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">पूरा नाम (Full Name) *</label>
              <VoiceInputButton
                onTranscript={(text) => setFormData(prev => ({ ...prev, name: text }))}
                mode="replace"
                buttonTitle="बोलकर नाम दर्ज करें"
                size="sm"
              />
            </div>
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">समस्या / सुझाव (यदि कोई हो)</label>
              <VoiceInputButton
                onTranscript={(text) => setFormData(prev => ({ ...prev, message: prev.message ? `${prev.message} ${text}` : text }))}
                mode="append"
                buttonTitle="बोलकर समस्या बताएं"
                size="sm"
              />
            </div>
            <textarea
              rows={2}
              placeholder="अपनी समस्या या सुझाव बोलकर या लिखकर दर्ज करें..."
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'प्रक्रिया जारी है...' : 'पंजीकरण पूर्ण करें'}</span>
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-[11px] text-slate-400">
          सुरक्षित डिजिटल डेटाबेस | गोपनीयता सुरक्षित
        </div>
      </div>
    </div>
  );
}
