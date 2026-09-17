import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Share2,
  Clock,
  Calendar,
  RefreshCw,
  X,
  ExternalLink,
  Layers,
  Save,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminHeroPosterManager() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState(null);
  const [saving, setSaving] = useState(false);
  const [previewPoster, setPreviewPoster] = useState(null);

  // Slider Global Settings
  const [settings, setSettings] = useState({
    autoSlide: true,
    intervalSeconds: 4.5,
    maxVisible: 6,
    showOnHero: true
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Predefined Poster Gallery
  const stockPosters = [
    { name: 'पर्यटन दिवस पोस्टर (Image 1)', url: '/images/posters/poster_tourism_day.png' },
    { name: 'कैबिनेट निर्णय स्मार्ट स्कूल (Image 2)', url: '/images/posters/poster_cabinet_smart_school.jpg' },
    { name: 'किसान सम्मान निधि', url: '/images/posters/poster_kisan_samman.jpg' },
    { name: 'गणेश चतुर्थी व उत्सव', url: '/images/posters/poster_ganesh_utsav.png' },
    { name: 'इटावा लॉयन सफारी विकास', url: '/images/posters/poster_safari_etawah.png' },
    { name: 'विकास पत्रिका 2026', url: '/images/posters/poster_vikas_patrika.jpg' }
  ];

  // Default Form state
  const defaultForm = {
    title: '',
    subtitle: 'सरिता भदौरिया, सदर विधायक इटावा (200)',
    category: 'त्यौहार व विशेष दिवस',
    date: new Date().toISOString().split('T')[0],
    image: '/images/posters/poster_tourism_day.png',
    caption: '',
    isActive: true
  };

  const [formData, setFormData] = useState(defaultForm);

  const categories = [
    'त्यौहार व विशेष दिवस',
    'शासनादेश व कैबिनेट निर्णय',
    'सरकारी योजना',
    'विकास कार्य',
    'जनसंवाद व चौपाल',
    'अन्य'
  ];

  // Load all posters & settings from server
  const loadPosters = async () => {
    setLoading(true);
    try {
      const res = await api.getAllHeroPosters();
      if (res.success) {
        setPosters(res.posters || []);
        if (res.settings) {
          setSettings(res.settings);
        }
      }
    } catch (err) {
      console.error('Failed to load hero posters:', err);
      showFeedback('पोस्टर लोड करने में समस्या आई', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosters();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handle Settings Update
  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      const res = await api.updateHeroPostersSettings(settings);
      if (res.success) {
        showFeedback('स्लाइडर सेटिंग्स सफलतापूर्वक सहेजी गईं!');
      } else {
        showFeedback(res.message || 'सेटिंग्स अपडेट नहीं हो सकीं', 'error');
      }
    } catch (err) {
      showFeedback('सर्वर त्रुटि', 'error');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPoster(null);
    setFormData({
      ...defaultForm,
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (poster) => {
    setEditingPoster(poster);
    setFormData({
      title: poster.title || '',
      subtitle: poster.subtitle || '',
      category: poster.category || 'त्यौहार व विशेष दिवस',
      date: poster.date || new Date().toISOString().split('T')[0],
      image: poster.image || '',
      caption: poster.caption || '',
      isActive: poster.isActive !== false
    });
    setIsModalOpen(true);
  };

  // Submit Poster Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showFeedback('कृपया पोस्टर का मुख्य शीर्षक दर्ज करें', 'error');
      return;
    }
    if (!formData.image.trim()) {
      showFeedback('कृपया पोस्टर की इमेज का चयन करें या अपलोड करें', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingPoster) {
        const res = await api.updateHeroPoster(editingPoster.id, formData);
        if (res.success) {
          showFeedback('पोस्टर सफलतापूर्वक अपडेट किया गया!');
          setIsModalOpen(false);
          loadPosters();
        } else {
          showFeedback(res.message || 'त्रुटि', 'error');
        }
      } else {
        const res = await api.createHeroPoster(formData);
        if (res.success) {
          showFeedback('नया पोस्टर सफलतापूर्वक जोड़ा गया!');
          setIsModalOpen(false);
          loadPosters();
        } else {
          showFeedback(res.message || 'त्रुटि', 'error');
        }
      }
    } catch (err) {
      showFeedback('सर्वर त्रुटि', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active Status
  const handleToggle = async (id, currentVal) => {
    try {
      const res = await api.toggleHeroPoster(id);
      if (res.success) {
        setPosters(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentVal } : p));
        showFeedback(`पोस्टर ${!currentVal ? 'सक्रिय' : 'निष्क्रिय'} किया गया`);
      }
    } catch (err) {
      showFeedback('स्थिति बदलने में विफल', 'error');
    }
  };

  // Delete Poster
  const handleDelete = async (id) => {
    if (!window.confirm('क्या आप वाकई इस पोस्टर को हटाना चाहते हैं?')) return;
    try {
      const res = await api.deleteHeroPoster(id);
      if (res.success) {
        setPosters(prev => prev.filter(p => p.id !== id));
        showFeedback('पोस्टर सफलतापूर्वक हटा दिया गया');
      }
    } catch (err) {
      showFeedback('हटाने में विफल', 'error');
    }
  };

  // Reorder Posters
  const handleMove = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= posters.length) return;

    const newPosters = [...posters];
    const [moved] = newPosters.splice(index, 1);
    newPosters.splice(targetIndex, 0, moved);

    setPosters(newPosters);

    // Save order on backend
    try {
      const orderedIds = newPosters.map(p => p.id);
      await api.updateHeroPostersOrder(orderedIds);
      showFeedback('पोस्टर का क्रम अपडेट किया गया');
    } catch (err) {
      showFeedback('क्रम सहेजने में विफल', 'error');
      loadPosters();
    }
  };

  // Handle local image file upload mock
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const activeCount = posters.filter(p => p.isActive).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-sm font-bold text-white transition-all animate-bounce ${
            feedback.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        >
          {feedback.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>होमपेज हीरो पोस्टर स्लाइडर प्रबंधन</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            दैनिक पोस्टर व सरकारी बुलेटिन स्लाइडर
          </h1>
          <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            होमपेज के दाहिने हिस्से (Right Section) में 4 से 6 या आवश्यकतानुसार पोस्टर स्वतः स्लाइड होकर चलेंगे। विधायिका यहाँ से नए पोस्टर अपलोड कर सकती हैं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadPosters}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-black text-sm shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>नया पोस्टर अपलोड करें</span>
          </button>
        </div>
      </div>

      {/* Control & Settings Panel */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-800 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-orange-600" />
              <span>स्लाइडर रोटेशन व डिस्प्ले सेटिंग्स</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              स्लाइडर की गति, अधिकतम दृश्य पोस्टरों की संख्या (4-6) और ऑटो-रोटेशन नियंत्रित करें
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-600">
              कुल: <strong className="text-slate-900">{posters.length}</strong> | सक्रिय: <strong className="text-emerald-600">{activeCount}</strong> | अधिकतम दिखेगा: <strong className="text-orange-600">{settings.maxVisible}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          
          {/* Setting 1: Auto Slide Toggle */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">ऑटो-स्लाइड (Auto Rotate)</div>
              <div className="text-[11px] text-slate-500">पोस्टर अपने आप बदलें</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSlide}
                onChange={(e) => setSettings({ ...settings, autoSlide: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* Setting 2: Interval Seconds */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>बदलने का समय (Interval)</span>
              </span>
              <span className="text-orange-600 font-extrabold">{settings.intervalSeconds}s</span>
            </div>
            <select
              value={settings.intervalSeconds}
              onChange={(e) => setSettings({ ...settings, intervalSeconds: parseFloat(e.target.value) })}
              className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
            >
              <option value="3">3 सेकंड (तेज़)</option>
              <option value="4.5">4.5 सेकंड (संतुलित - डिफ़ॉल्ट)</option>
              <option value="6">6 सेकंड (सामान्य)</option>
              <option value="8">8 सेकंड (विस्तृत पठन)</option>
            </select>
          </div>

          {/* Setting 3: Max Visible Posters (4 to 6) */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-orange-600" />
                <span>अधिकतम पोस्टर संख्या (Hero)</span>
              </span>
              <span className="text-orange-600 font-extrabold">{settings.maxVisible} पोस्टर</span>
            </div>
            <select
              value={settings.maxVisible}
              onChange={(e) => setSettings({ ...settings, maxVisible: parseInt(e.target.value) })}
              className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
            >
              <option value="4">4 पोस्टर (अनुशंसित)</option>
              <option value="5">5 पोस्टर</option>
              <option value="6">6 पोस्टर (अनुशंसित)</option>
              <option value="8">8 पोस्टर</option>
              <option value="10">10 पोस्टर</option>
            </select>
          </div>

          {/* Setting 4: Save Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={settingsSaving}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {settingsSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{settingsSaving ? 'सहेजा जा रहा है...' : 'सेटिंग्स सुरक्षित करें'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Posters List Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              वर्तमान में सक्रिय व उपलब्ध पोस्टर
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              पोस्टर का क्रम बदलने के लिए (↑ या ↓) का उपयोग करें। शीर्ष {settings.maxVisible} पोस्टर होमपेज पर प्रदर्शित होंगे।
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black">
            लाइव क्रम: शीर्ष {settings.maxVisible}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-2 text-orange-500" />
            <p className="text-xs font-bold">पोस्टर सूची लोड हो रही है...</p>
          </div>
        ) : posters.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">अभी कोई पोस्टर उपलब्ध नहीं है</p>
            <p className="text-xs text-slate-500 mt-1">ऊपर दिए गए बटन से नया पोस्टर अपलोड करें</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posters.map((poster, index) => {
              const isIncludedInHero = index < settings.maxVisible && poster.isActive;
              return (
                <div
                  key={poster.id}
                  className={`relative rounded-2xl border-2 transition-all overflow-hidden flex flex-col bg-white ${
                    isIncludedInHero
                      ? 'border-orange-400 shadow-md ring-2 ring-orange-400/20'
                      : poster.isActive
                      ? 'border-slate-200 opacity-90'
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-[11px] flex items-center justify-center">
                        #{index + 1}
                      </span>
                      {isIncludedInHero ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>होमपेज पर लाइव</span>
                        </span>
                      ) : poster.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                          कतार में (Queue)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          निष्क्रिय (Off)
                        </span>
                      )}
                    </div>

                    {/* Order buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded bg-white hover:bg-orange-100 text-slate-700 disabled:opacity-30 border border-slate-200 cursor-pointer"
                        title="ऊपर ले जाएं"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === posters.length - 1}
                        className="p-1 rounded bg-white hover:bg-orange-100 text-slate-700 disabled:opacity-30 border border-slate-200 cursor-pointer"
                        title="नीचे ले जाएं"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail & Info */}
                  <div className="p-3 flex space-x-3 flex-1">
                    {/* Poster Thumbnail */}
                    <div
                      onClick={() => setPreviewPoster(poster)}
                      className="w-20 aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0 cursor-pointer group relative shadow-xs"
                    >
                      <img
                        src={poster.image}
                        alt={poster.title}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-500"
                        onError={(e) => { e.target.src = '/images/poli3.png'; }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-black mb-1">
                          {poster.category || 'विशेष बुलेटिन'}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-tight">
                          {poster.title}
                        </h4>
                        {poster.subtitle && (
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            {poster.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-2">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        <span>{poster.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    {/* Active Toggle */}
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={poster.isActive}
                        onChange={() => handleToggle(poster.id, poster.isActive)}
                        className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-[11px] font-bold text-slate-700">
                        {poster.isActive ? 'सक्रिय' : 'बंद'}
                      </span>
                    </label>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(poster)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                        title="संपादित करें"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(poster.id)}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 transition cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black">
                  {editingPoster ? 'पोस्टर संपादित करें' : 'नया पोस्टर अपलोड व प्रकाशित करें'}
                </h3>
                <p className="text-xs text-orange-100">
                  होमपेज स्लाइडर में 3:4/4:5 वर्टिकल आकार में प्रदर्शित होगा
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Image Picker / Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800">
                  पोस्टर इमेज (Vertical 3:4 or 4:5 Poster) *
                </label>
                
                {/* Image Preview & URL input */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-28 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-dashed border-orange-400 bg-slate-100 flex-shrink-0 flex items-center justify-center shadow-inner relative">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => { e.target.src = '/images/poli3.png'; }}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="छवि URL दर्ज करें (उदा. /images/posters/poster_tourism_day.png)"
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>

                    {/* Local File Upload Button */}
                    <div className="flex items-center space-x-2">
                      <label className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-bold border border-slate-300 transition cursor-pointer flex items-center space-x-1.5">
                        <Upload className="w-3.5 h-3.5 text-orange-600" />
                        <span>डिवाइस से फोटो चुनें</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">या नीचे स्टॉक पोस्टर में से चुनें</span>
                    </div>

                    {/* Stock Gallery Quick Selector */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stockPosters.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: s.url })}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                            formData.image === s.url
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title with Speech-to-Text */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800">
                    पोस्टर मुख्य शीर्षक (Title) *
                  </label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, title: prev.title ? `${prev.title} ${text}` : text }))}
                    tooltip="बोलकर शीर्षक लिखें"
                  />
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="उदा. राष्ट्रीय पर्यटन दिवस की हार्दिक बधाई एवं शुभकामनाएं"
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              {/* Subtitle / Legislator Signature */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800">
                    उप-शीर्षक / विधायक हस्ताक्षर पंक्ति (Subtitle)
                  </label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, subtitle: text }))}
                    tooltip="बोलकर लिखें"
                  />
                </div>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="उदा. सरिता भदौरिया, सदर विधायक इटावा (200)"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">श्रेणी (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">प्रकाशन दिनांक (Date)</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 bg-white"
                  />
                </div>
              </div>

              {/* Caption / WhatsApp Message */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800">
                    विस्तृत विवरण / व्हाट्सएप शेयर संदेश (Caption)
                  </label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, caption: prev.caption ? `${prev.caption} ${text}` : text }))}
                    tooltip="बोलकर विवरण लिखें"
                  />
                </div>
                <textarea
                  rows="2"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="व्हाट्सएप पर शेयर करते समय यह संदेश साथ जाएगा..."
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Active Toggle in Form */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="formIsActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                  तुरंत स्लाइडर में प्रदर्शित करें (Active on Hero Slider)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{saving ? 'सहेजा जा रहा है...' : editingPoster ? 'परिवर्तन सहेजें' : 'पोस्टर प्रकाशित करें'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewPoster && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 p-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-orange-400">{previewPoster.title}</span>
              <button
                type="button"
                onClick={() => setPreviewPoster(null)}
                className="p-1 rounded-full bg-slate-800 hover:bg-rose-600 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="my-3 flex items-center justify-center">
              <img
                src={previewPoster.image}
                alt={previewPoster.title}
                className="max-h-[60vh] w-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
