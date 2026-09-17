import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Image as ImageIcon,
  RefreshCw,
  CheckCircle,
  Calendar,
  Clock,
  Sparkles,
  Sliders,
  Check,
  PlusCircle,
  Trash2,
  ExternalLink,
  Eye,
  AlertCircle,
  Flag,
  RotateCw
} from 'lucide-react';
import ImageUploadInput from '../components/common/ImageUploadInput';

export default function AdminMediaChanger() {
  const { settings, setSettings, loadSettings, showToast, mla } = useApp();

  // Active Images
  const [heroImage, setHeroImage] = useState(settings?.hero?.saritaImage || '/images/assets/sarita_bhadauria_hero.jpg');
  const [photoTitle, setPhotoTitle] = useState('सदन व विधायी कार्य पोर्ट्रेट');
  const [officialBanner, setOfficialBanner] = useState(settings?.hero?.officialBanner || '/images/assets/official_bjp_mla_banner.jpg');
  const [showOfficialBanner, setShowOfficialBanner] = useState(settings?.mlaPhotoSchedule?.showOfficialBanner ?? true);

  // Other Media
  const [bottomTrioImage, setBottomTrioImage] = useState(settings?.hero?.bgPanorama || '/images/assets/bottom_leaders_trio.jpg');
  const [modiImage, setModiImage] = useState(settings?.hero?.modiImage || '/images/assets/modi_portrait.jpg');
  const [yogiImage, setYogiImage] = useState(settings?.hero?.yogiImage || '/images/assets/yogi_portrait.jpg');
  const [qrImage, setQrImage] = useState(settings?.hero?.qrImage || '/images/assets/qr_code_clean.jpg');

  // Schedule State
  const [updateInterval, setUpdateInterval] = useState('weekly');
  const [autoRotate, setAutoRotate] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [nextScheduledUpdate, setNextScheduledUpdate] = useState(new Date(Date.now() + 7 * 86400000).toISOString());

  // Archive History
  const [history, setHistory] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingActiveId, setSettingActiveId] = useState(null);

  // Add Archive Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newArchiveForm, setNewArchiveForm] = useState({
    title: '',
    url: '/images/poli4.png',
    category: 'जनसंवाद',
    setAsActive: false
  });

  const loadPhotoDetails = async () => {
    try {
      setLoadingPhotos(true);
      const res = await api.getMlaPhotos();
      if (res && res.success) {
        if (res.currentPhoto) setHeroImage(res.currentPhoto);
        if (res.officialBanner) setOfficialBanner(res.officialBanner);
        if (res.schedule) {
          if (res.schedule.updateInterval) setUpdateInterval(res.schedule.updateInterval);
          if (res.schedule.autoRotate !== undefined) setAutoRotate(res.schedule.autoRotate);
          if (res.schedule.lastUpdated) setLastUpdated(res.schedule.lastUpdated);
          if (res.schedule.nextScheduledUpdate) setNextScheduledUpdate(res.schedule.nextScheduledUpdate);
          if (res.schedule.showOfficialBanner !== undefined) setShowOfficialBanner(res.schedule.showOfficialBanner);
        }
        if (res.history) setHistory(res.history);
      }
    } catch (e) {
      console.error('Error fetching MLA photos:', e);
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    loadPhotoDetails();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload = {
        photoUrl: heroImage,
        photoTitle: photoTitle,
        officialBanner: officialBanner,
        updateInterval: updateInterval,
        autoRotate: autoRotate,
        showOfficialBanner: showOfficialBanner,
        user: 'Admin (Super Admin)'
      };

      const res = await api.updateMlaPhoto(payload, 'Admin (Super Admin)');
      if (res && res.success) {
        // Also update other hero images
        const updatedHero = {
          ...settings?.hero,
          saritaImage: heroImage,
          officialBanner: officialBanner,
          bgPanorama: bottomTrioImage,
          modiImage: modiImage,
          yogiImage: yogiImage,
          qrImage: qrImage
        };
        await api.updateHero(updatedHero, 'Admin (Super Admin)');
        await loadSettings();
        await loadPhotoDetails();
        showToast('विधायक फोटो, बैनर एवं शेड्यूलिंग सफलतापूर्वक अपडेट की गई!', 'success');
      } else {
        showToast('अपडेट विफल रहा: ' + (res?.message || 'त्रुटि'), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('सर्वर से त्रुटि हुई', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSetActivePhoto = async (photo) => {
    setSettingActiveId(photo.id);
    try {
      const res = await api.setActiveMlaPhoto(photo.id, 'Admin (Super Admin)');
      if (res && res.success) {
        setHeroImage(photo.url);
        await loadSettings();
        await loadPhotoDetails();
        showToast(`"${photo.title}" अब वेबसाइट पर मुख्य फोटो के रूप में सक्रिय है!`, 'success');
      } else {
        showToast(res?.message || 'सक्रिय करने में त्रुटि हुई', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('त्रुटि हुई', 'error');
    } finally {
      setSettingActiveId(null);
    }
  };

  const handleDeleteArchive = async (id, title) => {
    if (!window.confirm(`क्या आप वाकई "${title}" फोटो को हटाना चाहते हैं?`)) return;
    try {
      const res = await api.deleteMlaPhotoArchive(id, 'Admin (Super Admin)');
      if (res && res.success) {
        showToast('फोटो आर्काइव से हटा दी गई!', 'info');
        loadPhotoDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddArchiveSubmit = async (e) => {
    e.preventDefault();
    if (!newArchiveForm.title.trim()) {
      alert('कृपया फोटो का शीर्षक दर्ज करें।');
      return;
    }
    try {
      const res = await api.addMlaPhotoArchive(newArchiveForm, 'Admin (Super Admin)');
      if (res && res.success) {
        showToast('नई फोटो आर्काइव में जोड़ी गई!', 'success');
        setShowAddModal(false);
        setNewArchiveForm({
          title: '',
          url: '/images/poli4.png',
          category: 'जनसंवाद',
          setAsActive: false
        });
        await loadPhotoDetails();
        await loadSettings();
      }
    } catch (err) {
      console.error(err);
      showToast('फोटो जोड़ने में त्रुटि हुई', 'error');
    }
  };

  // Compute days remaining
  const daysRemaining = Math.ceil((new Date(nextScheduledUpdate) - new Date()) / (1000 * 60 * 60 * 24));
  const isDue = daysRemaining <= 0;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              MLA Photo & Media Asset Controller
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-orange-600" />
            <span>विधायक फोटो एवं बैनर प्रबंधक (MLA Photo & Interval Updater)</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            विधायक जी की फोटो को नियमित अंतराल (साप्ताहिक, पाक्षिक, मासिक) पर अपडेट करें एवं शीर्ष आधिकारिक बैनर प्रबंधित करें।
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          <span>{saving ? 'लागू हो रहा है...' : 'परिवर्तन सेव करें (Apply & Save)'}</span>
        </button>
      </div>

      {/* INTERVAL STATUS ALERT BANNER */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
        isDue 
          ? 'bg-amber-50 border-amber-300 text-amber-900' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-inner ${
            isDue ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider">
                {isDue ? '⚠️ फोटो अपडेट अनुस्मारक (Update Due Now)' : '✓ फोटो शेड्यूल स्थिति सामान्य'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                आवृति: {updateInterval === 'weekly' ? 'साप्ताहिक (7 दिन)' : updateInterval === 'biweekly' ? 'पाक्षिक (15 दिन)' : updateInterval === 'monthly' ? 'मासिक (30 दिन)' : 'त्रैमासिक'}
              </span>
            </div>
            <p className="text-xs mt-0.5 font-medium">
              {isDue 
                ? 'नियत समय सीमा पूर्ण हो चुकी है। कृपया विधायक जी की नई फोटो अपलोड करें या नीचे आर्काइव से सक्रिय करें।' 
                : `अगला फोटो अपडेट ${new Date(nextScheduledUpdate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })} (${daysRemaining} दिन शेष) को प्रस्तावित है।`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold self-end sm:self-center">
          <span className="text-slate-500 text-[11px]">अंतिम अपडेट: {new Date(lastUpdated).toLocaleDateString('hi-IN')}</span>
        </div>
      </div>

      {/* SECTION 1: Active MLA Photo & Regular Interval Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Current Active Photo & Uploader */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>विधायक मुख्य सक्रिय फोटो (Hero Portrait)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ● पोर्टल पर लाइव
                </span>
              </h2>
              <p className="text-xs text-slate-500">वेबसाइट के मुख्य होमपेज, बैनर एवं विधायक परिचय पर प्रदर्शित होने वाला चित्र</p>
            </div>
            <span className="text-xs text-orange-600 font-bold hidden sm:inline">इटावा सदर (200)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Live Preview Card */}
            <div className="sm:col-span-5 flex justify-center">
              <div className="relative w-48 h-64 rounded-2xl overflow-hidden border-4 border-orange-100 shadow-xl bg-gradient-to-tr from-orange-500/20 to-amber-500/10">
                <img
                  src={heroImage}
                  alt="विधायक पोर्ट्रेट"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.target.src = '/images/poli4.png'; }}
                />
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-center">
                  <div className="text-xs font-black truncate">{mla?.name || 'श्रीमती सरिता भदौरिया'}</div>
                  <div className="text-[9px] text-orange-200 font-semibold">सदर विधायक, इटावा</div>
                </div>
              </div>
            </div>

            {/* Upload Input & Title */}
            <div className="sm:col-span-7 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">फोटो का शीर्षक / अवसर</label>
                <input
                  type="text"
                  placeholder="उदा. सत्र 2026 पोर्ट्रेट, क्षेत्र भ्रमण फोटो..."
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <ImageUploadInput
                value={heroImage}
                onChange={setHeroImage}
                label="नया पोर्ट्रेट फोटो अपलोड करें"
                hint="कंप्यूटर से फोटो चुनें या मीडिया लाइब्रेरी से लें (अनुशंसित 600x800 px)"
                aspectRatio="portrait"
              />

              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => setHeroImage('/images/assets/sarita_bhadauria_hero.jpg')}
                  className="font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  डिफ़ॉल्ट सफेद साड़ी फोटो रीसेट करें
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Interval Scheduler Settings */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>रेगुलर इंटरवल सेटिंग्स (Schedule Engine)</span>
                </h2>
                <p className="text-xs text-slate-500">विधायक फोटो बदलने का नियमित अंतराल तय करें</p>
              </div>
            </div>

            <div className="space-y-4 mt-3">
              {/* Interval Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">अपडेट आवृति (Interval Frequency) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'weekly', label: 'साप्ताहिक', days: 'हर 7 दिन' },
                    { id: 'biweekly', label: 'पाक्षिक', days: 'हर 15 दिन' },
                    { id: 'monthly', label: 'मासिक', days: 'हर 30 दिन' },
                    { id: 'quarterly', label: 'त्रैमासिक', days: 'हर 90 दिन' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUpdateInterval(item.id)}
                      className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                        updateInterval === item.id
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-black">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.days}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-Rotation Feature */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RotateCw className={`w-4 h-4 text-orange-600 ${autoRotate ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-bold text-slate-900">स्वतः फोटो रोटेशन (Auto-Rotate)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 cursor-pointer rounded"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  यदि यह विकल्प चालू है, तो नियत तिथि पर सिस्टम आर्काइव से अगली फोटो को स्वतः मुख्य प्रोफाइल फोटो बना देगा।
                </p>
              </div>

              {/* Schedule Details Summary */}
              <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200/80 text-xs space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>अंतिम फोटो अपडेट:</span>
                  <span className="font-bold">{new Date(lastUpdated).toLocaleDateString('hi-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>अगला नियत अपडेट:</span>
                  <span className="font-bold text-orange-700">{new Date(nextScheduledUpdate).toLocaleDateString('hi-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>शेष दिन:</span>
                  <span className="font-bold">{daysRemaining > 0 ? `${daysRemaining} दिन` : 'समय हो गया!'}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="w-full mt-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
          >
            {saving ? 'सुरक्षित हो रहा है...' : 'शेड्यूल एवं फोटो लागू करें'}
          </button>
        </div>
      </div>

      {/* SECTION 2: Official Top Header Banner (Uploaded Image media_1789502249037.jpg) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                शीर्ष आधिकारिक बैनर (Top Header Banner)
              </span>
              <span className="text-xs text-slate-400">वरिष्ठ नेतागण एवं विधायक जी की संयुक्त तस्वीर</span>
            </div>
            <h2 className="text-base font-black text-slate-900 mt-1">
              भाजपा का लक्ष्य: सशक्त भारत, समृद्ध उत्तर प्रदेश, विकसित इटावा
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOfficialBanner}
                onChange={(e) => setShowOfficialBanner(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span>वेबसाइट पर प्रदर्शित करें</span>
            </label>
          </div>
        </div>

        {/* Banner Preview */}
        <div className="rounded-2xl overflow-hidden border-2 border-orange-200 shadow-md bg-slate-900 relative">
          <div className="w-full aspect-[24/8] md:aspect-[3.8/1] max-h-56 overflow-hidden">
            <img
              src={officialBanner}
              alt="Official BJP MLA Etawah Banner"
              className="w-full h-full object-cover object-center"
              onError={(e) => { e.target.src = '/images/assets/official_bjp_mla_banner.jpg'; }}
            />
          </div>
        </div>

        {/* Banner Uploader Input */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
          <div className="md:col-span-8">
            <ImageUploadInput
              value={officialBanner}
              onChange={setOfficialBanner}
              label="नया आधिकारिक शीर्ष बैनर अपलोड करें"
              hint="अनुशंसित अनुपात (Wide Landscape - 1200x350 px)"
              aspectRatio="video"
            />
          </div>
          <div className="md:col-span-4 flex flex-col justify-center space-y-2">
            <button
              type="button"
              onClick={() => setOfficialBanner('/images/assets/official_bjp_mla_banner.jpg')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition text-center"
            >
              मूल आधिकारिक बैनर रीसेट करें
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: MLA Photo History & Archive Gallery (User: "विधायक अपनी फोटो रेगुलर इंटरवल पर अपडेट करने की सुविधा रखेगा") */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>विधायक फोटो इतिहास एवं आर्काइव गैलरी (Photo Archive & History)</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {history.length} चित्र सुरक्षित
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              यहाँ से विधायक जी किसी भी पिछली फोटो को 1-क्लिक में पोर्टल पर सक्रिय कर सकते हैं
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ आर्काइव में नई फोटो जोड़ें</span>
          </button>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {history.map((photo) => (
            <div
              key={photo.id}
              className={`p-3 rounded-2xl border transition flex flex-col justify-between space-y-2.5 relative ${
                photo.url === heroImage
                  ? 'border-2 border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-400/20'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow'
              }`}
            >
              {/* Photo Thumbnail */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 shadow-inner">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.target.src = '/images/poli4.png'; }}
                />
                {photo.url === heroImage && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>सक्रिय</span>
                  </span>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold">
                  {photo.category || 'आधिकारिक'}
                </span>
              </div>

              {/* Title and Date */}
              <div>
                <h4 className="text-xs font-black text-slate-900 truncate" title={photo.title}>
                  {photo.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">जोड़ा गया: {photo.date}</p>
              </div>

              {/* 1-Click Action Toolbar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                {photo.url === heroImage ? (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>वर्तमान सक्रिय फोटो</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetActivePhoto(photo)}
                    disabled={settingActiveId === photo.id}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>{settingActiveId === photo.id ? 'प्रक्रिया...' : 'वेबसाइट पर लगाएं'}</span>
                  </button>
                )}

                {photo.url !== heroImage && (
                  <button
                    onClick={() => handleDeleteArchive(photo.id, photo.title)}
                    className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Other Site Media Assets */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
          अन्य प्रमुख मीडिया चित्र (Additional Site Assets)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bottom Leaders Trio */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800">बॉटम बैनर लीडर्स (मोदी, योगी, विधायक)</h3>
            <ImageUploadInput
              value={bottomTrioImage}
              onChange={setBottomTrioImage}
              aspectRatio="video"
              hint="अनुशंसित 700x350 px"
            />
          </div>

          {/* PM Modi */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800">माननीय प्रधानमंत्री नरेंद्र मोदी जी</h3>
            <ImageUploadInput
              value={modiImage}
              onChange={setModiImage}
              aspectRatio="square"
              hint="स्क्वायर पोर्ट्रेट"
            />
          </div>

          {/* CM Yogi */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800">माननीय मुख्यमंत्री योगी आदित्यनाथ जी</h3>
            <ImageUploadInput
              value={yogiImage}
              onChange={setYogiImage}
              aspectRatio="square"
              hint="स्क्वायर पोर्ट्रेट"
            />
          </div>
        </div>
      </div>

      {/* MODAL: Add New Photo to Archive */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative my-auto">
            <h3 className="text-base font-black text-slate-900 mb-1">विधायक फोटो आर्काइव में नया चित्र जोड़ें</h3>
            <p className="text-xs text-slate-500 mb-4">भविष्य के नियमित रोटेशन व अपडेट हेतु फोटो सुरक्षित रखें</p>

            <form onSubmit={handleAddArchiveSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">फोटो का शीर्षक / अवसर *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. बकेवर चौपाल, विधानसभा सदन पोर्ट्रेट"
                  value={newArchiveForm.title}
                  onChange={(e) => setNewArchiveForm({ ...newArchiveForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी</label>
                <select
                  value={newArchiveForm.category}
                  onChange={(e) => setNewArchiveForm({ ...newArchiveForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="आधिकारिक">आधिकारिक पोर्ट्रेट</option>
                  <option value="जनसंवाद">जनसंवाद व चौपाल</option>
                  <option value="क्षेत्रीय दौरा">क्षेत्रीय दौरा व निरीक्षण</option>
                  <option value="त्यौहार">त्यौहार व विशेष दिवस</option>
                </select>
              </div>

              <ImageUploadInput
                value={newArchiveForm.url}
                onChange={(url) => setNewArchiveForm({ ...newArchiveForm, url })}
                label="फोटो चुनें या अपलोड करें"
                aspectRatio="portrait"
              />

              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newArchiveForm.setAsActive}
                  onChange={(e) => setNewArchiveForm({ ...newArchiveForm, setAsActive: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <span>तुरंत वेबसाइट पर सक्रिय करें (Set as Active Now)</span>
              </label>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  आर्काइव में जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
