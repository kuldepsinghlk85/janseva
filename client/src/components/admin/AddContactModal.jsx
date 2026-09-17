import React, { useState, useRef } from 'react';
import {
  User,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
  Camera,
  Trash2,
  Save,
  Building,
  FileText,
  Sparkles,
  Users
} from 'lucide-react';
import VoiceInputButton from '../common/VoiceInputButton';
import { api } from '../../services/api';

export default function AddContactModal({ isOpen, onClose, onSuccess, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    fatherSpouseName: '',
    type: 'Citizen',
    customDesignation: '',
    village: 'इटावा सदर',
    customVillage: '',
    booth: '',
    notes: '',
    photo: ''
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const photoInputRef = useRef(null);

  if (!isOpen) return null;

  const villages = [
    'इटावा सदर',
    'सैफई',
    'बकेवर',
    'रामपुर',
    'तकरोई',
    'पिलखर',
    'जसवंतनगर',
    'भरथना',
    'उदी',
    'वैदपुरा',
    'बसरेहर',
    'अन्य गाँव'
  ];

  const roleOptions = [
    { value: 'Citizen', label: 'सामान्य नागरिक (Citizen)', badge: 'bg-emerald-100 text-emerald-800' },
    { value: 'Supporter', label: 'समर्थक (Supporter)', badge: 'bg-blue-100 text-blue-800' },
    { value: 'Karyakarta', label: 'सक्रिय कार्यकर्ता (Party Worker)', badge: 'bg-orange-100 text-orange-800' },
    { value: 'Booth Leader', label: 'बूथ अध्यक्ष / प्रभारी (Booth President)', badge: 'bg-purple-100 text-purple-800' },
    { value: 'Gram Pradhan', label: 'ग्राम प्रधान / पूर्व प्रधान (Gram Pradhan)', badge: 'bg-amber-100 text-amber-800' },
    { value: 'Ward Member', label: 'वार्ड सदस्य / पार्षद (Ward Member)', badge: 'bg-indigo-100 text-indigo-800' },
    { value: 'Youth Wing', label: 'युवा मोर्चा साथी (Youth Wing)', badge: 'bg-cyan-100 text-cyan-800' },
    { value: 'Mahila Morcha', label: 'महिला मोर्चा (Mahila Morcha)', badge: 'bg-rose-100 text-rose-800' },
    { value: 'Social Leader', label: 'व्यापारी / सामाजिक प्रतिनिधि (Social Leader)', badge: 'bg-yellow-100 text-yellow-800' },
    { value: 'Other', label: 'अन्य विशेष पद (Custom Role)', badge: 'bg-slate-100 text-slate-800' }
  ];

  const presetAvatars = [
    { name: 'पुरुष 1', url: '/images/poli1.png' },
    { name: 'महिला 1', url: '/images/poli2.png' },
    { name: 'पुरुष 2', url: '/images/admimadmin.png' }
  ];

  // Handle Photo File Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('फोटो का आकार 10 MB से कम होना चाहिए।');
      return;
    }

    setUploadingPhoto(true);
    setErrorMsg('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });
      const data = await res.json();

      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, photo: data.url }));
        showToast?.('फोटो सफलतापूर्वक अपलोड हो गई!', 'success');
      } else {
        setErrorMsg(data.message || 'फोटो अपलोड विफल');
      }
    } catch (err) {
      setErrorMsg('फोटो अपलोड में त्रुटि: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.mobile.trim()) {
      setErrorMsg('कृपया नाम और मोबाइल नंबर अवश्य भरें।');
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMsg('कृपया 10-अंकीय वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    setSaving(true);

    const finalVillage = formData.village === 'अन्य गाँव' && formData.customVillage.trim()
      ? formData.customVillage.trim()
      : formData.village;

    const finalType = formData.type === 'Other' && formData.customDesignation.trim()
      ? formData.customDesignation.trim()
      : formData.type;

    const payload = {
      name: formData.name.trim(),
      mobile: cleanMobile,
      fatherSpouseName: formData.fatherSpouseName.trim(),
      type: finalType,
      category: finalType,
      village: finalVillage,
      booth: formData.booth.trim() || 'वार्ड सूची',
      notes: formData.notes.trim(),
      photo: formData.photo,
      area: 'इटावा विधानसभा (200)',
      source: 'Admin Directory Form'
    };

    try {
      const res = await api.registerCitizen(payload);
      if (res?.success) {
        showToast?.(`नागरिक ${payload.name} सफलतापूर्वक जोड़ा गया!`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMsg(res?.message || 'नागरिक जोड़ने में त्रुटि हुई।');
      }
    } catch (err) {
      setErrorMsg('सर्वर से संपर्क नहीं हो सका: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] overflow-y-auto space-y-5"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                नया नागरिक / संपर्क जोड़ें (विस्तृत विवरण)
              </h3>
              <p className="text-xs text-slate-500">
                व्यक्ति की जानकारी, पद/भूमिका और फोटो सहित डायरेक्टरी में दर्ज करें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* PHOTO SELECTION & UPLOAD SECTION (User Request: "उसकी फोटो चुनने का भी एक ऑप्शन होगा") */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/70 to-amber-50/50 border border-orange-200/80 space-y-3">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-orange-600" />
              <span>नागरिक की फोटो चुनें / अपलोड करें (Photo Upload)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview Frame */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-300 bg-white shadow flex-shrink-0 flex items-center justify-center">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/poli1.png'; }}
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-300" />
                )}

                {formData.photo && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition"
                    title="फोटो हटाएं"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingPhoto ? 'अपलोड हो रहा है...' : 'डिवाइस से फोटो चुनें'}</span>
                  </button>

                  <span className="text-[11px] text-slate-500">या प्रीसेट अवतार चुनें:</span>
                </div>

                {/* Preset Quick Avatars */}
                <div className="flex items-center gap-2 pt-1">
                  {presetAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photo: av.url }))}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                        formData.photo === av.url ? 'border-orange-600 scale-105 shadow' : 'border-slate-200 hover:border-slate-400'
                      }`}
                      title={av.name}
                    >
                      <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BASIC INFORMATION: NAME & MOBILE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">पूरा नाम (Full Name) *</label>
                <VoiceInputButton
                  onTranscript={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  mode="replace"
                  size="sm"
                />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="उदा: रामसेवक शर्मा"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                10-अंकीय मोबाइल नंबर *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  placeholder="9876543210"
                  className="w-full pl-11 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>
          </div>

          {/* ROLE / CATEGORY: "वो कौन है" (User Request: "कि वो कौन है") */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>नागरिक की श्रेणी / वो कौन है? (Role & Designation) *</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {formData.type === 'Other' && (
              <input
                type="text"
                value={formData.customDesignation}
                onChange={(e) => setFormData({ ...formData, customDesignation: e.target.value })}
                placeholder="विशेष पद या भूमिका लिखें (उदा: मंडल उपाध्यक्ष, पूर्व ब्लॉक प्रमुख...)"
                className="w-full mt-1.5 px-3 py-2 rounded-xl border border-orange-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            )}
          </div>

          {/* LOCATION: VILLAGE & BOOTH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                गाँव / क्षेत्र (Village / Area)
              </label>
              <select
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white"
              >
                {villages.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>

              {formData.village === 'अन्य गाँव' && (
                <input
                  type="text"
                  value={formData.customVillage}
                  onChange={(e) => setFormData({ ...formData, customVillage: e.target.value })}
                  placeholder="गाँव या मोहल्ले का नाम लिखें"
                  className="w-full mt-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                बूथ संख्या / वार्ड (Booth No.)
              </label>
              <input
                type="text"
                value={formData.booth}
                onChange={(e) => setFormData({ ...formData, booth: e.target.value })}
                placeholder="उदा: बूथ संख्या 12 (प्राथमिक विद्यालय)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white"
              />
            </div>
          </div>

          {/* FATHER/SPOUSE NAME & NOTES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                पिता / पति का नाम (वैकल्पिक)
              </label>
              <input
                type="text"
                value={formData.fatherSpouseName}
                onChange={(e) => setFormData({ ...formData, fatherSpouseName: e.target.value })}
                placeholder="उदा: स्व. रामदयाल शर्मा"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                अतिरिक्त टिप्पणी / संपर्क विवरण
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="उदा: प्रमुख सामाजिक कार्यकर्ता, नियमित संपर्क"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white"
              />
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              रद्द करें
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 active:scale-95 transition disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'सुरक्षित हो रहा है...' : 'संपर्क डायरेक्टरी में सुरक्षित करें'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
