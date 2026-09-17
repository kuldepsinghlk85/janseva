import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Plus,
  Trash2,
  Edit,
  Eye,
  Share2,
  Search,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Video,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Star,
  X,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import MultiImageUploadInput from '../components/common/MultiImageUploadInput';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminActivityManager() {
  const [activities, setActivities] = useState([]);
  const [sliderActivities, setSliderActivities] = useState([]);
  const [selectedAddActivityId, setSelectedAddActivityId] = useState('');
  const [sliderLoading, setSliderLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form State
  const defaultForm = {
    title: '',
    category: 'Inauguration',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    location: {
      village: '',
      block: 'इटावा सदर',
      district: 'इटावा',
      pincode: '206001'
    },
    shortDescription: '',
    fullDescription: '',
    images: [],
    videoUrl: '',
    externalLinks: [
      { title: '', url: '' },
      { title: '', url: '' }
    ],
    tags: 'विकास कार्य, इटावा',
    status: 'published',
    featured: false
  };

  const [formData, setFormData] = useState(defaultForm);
  const [villagesList, setVillagesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([
    { id: 'Inauguration', nameHi: 'लोकार्पण / उद्घाटन', name: 'Inauguration' },
    { id: 'Foundation Stone', nameHi: 'शिलान्यास', name: 'Foundation Stone' },
    { id: 'Inspection', nameHi: 'स्थलीय निरीक्षण', name: 'Inspection' },
    { id: 'Public Meeting', nameHi: 'जनसंवाद चौपाल', name: 'Public Meeting' },
    { id: 'Village Visit', nameHi: 'ग्राम भ्रमण', name: 'Village Visit' },
    { id: 'Development Work', nameHi: 'विकास कार्य', name: 'Development Work' },
    { id: 'Government Scheme', nameHi: 'सरकारी योजना वितरण', name: 'Government Scheme' },
    { id: 'Grievance Redressal', nameHi: 'जनसुनवाई', name: 'Grievance Redressal' },
    { id: 'Other', nameHi: 'अन्य कार्यक्रम', name: 'Other' }
  ]);
  const [tagsList, setTagsList] = useState([]);

  const loadMasterData = async () => {
    try {
      const [vRes, cRes, tRes] = await Promise.all([
        api.getVillages(),
        api.getMasterCategories('activity'),
        api.getTags()
      ]);
      if (vRes && vRes.success && vRes.data) setVillagesList(vRes.data);
      if (cRes && cRes.success && cRes.data && cRes.data.length > 0) setCategoriesList(cRes.data);
      if (tRes && tRes.success && tRes.data) setTagsList(tRes.data);
    } catch (e) {
      console.error('Error fetching master data:', e);
    }
  };

  const handleQuickAddVillage = async () => {
    const vName = window.prompt('नया गाँव / वार्ड का नाम दर्ज करें (उदा. पछायगांव):');
    if (!vName || !vName.trim()) return;
    try {
      const res = await api.addVillage({ nameHi: vName.trim(), block: 'इटावा सदर', district: 'इटावा' });
      if (res && res.success) {
        setVillagesList((prev) => [...prev, res.data]);
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, village: vName.trim() }
        }));
        alert(`गाँव "${vName.trim()}" जोड़ा गया और चयनित किया गया!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickAddCategory = async () => {
    const cName = window.prompt('नई गतिविधि श्रेणी का नाम दर्ज करें (उदा. किसान मेला):');
    if (!cName || !cName.trim()) return;
    try {
      const res = await api.addMasterCategory({ nameHi: cName.trim(), name: cName.trim(), type: 'activity' });
      if (res && res.success) {
        setCategoriesList((prev) => [...prev, res.data]);
        setFormData((prev) => ({ ...prev, category: res.data.id || res.data.nameHi }));
        alert(`श्रेणी "${cName.trim()}" जोड़ी गई और चयनित की गई!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await api.getActivities();
      if (res && res.success) {
        setActivities(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSliderActivities = async () => {
    try {
      setSliderLoading(true);
      const res = await api.getFeaturedSliderActivities();
      if (res && res.success) {
        setSliderActivities(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching slider activities:', err);
    } finally {
      setSliderLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    loadSliderActivities();
    loadMasterData();
  }, []);

  // Handle moving slider activity up or down (reorder)
  const handleMoveSlider = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sliderActivities.length) return;

    const reordered = [...sliderActivities];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const newIds = reordered.map((a) => a.id);
    setSliderActivities(reordered);

    try {
      setSliderLoading(true);
      const res = await api.updateFeaturedSliderOrder(newIds);
      if (res && res.success) {
        setSliderActivities(res.data || reordered);
        setFeedback({
          type: 'success',
          msg: `स्लाइडर क्रम अपडेट हुआ: "${moved.title.slice(0, 30)}..." अब स्थान #${targetIndex + 1} पर है!`
        });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
      loadSliderActivities();
      setFeedback({ type: 'error', msg: 'स्लाइडर क्रम सुरक्षित करने में समस्या आई' });
    } finally {
      setSliderLoading(false);
    }
  };

  // Handle removing an activity from slider (min 2 activities check)
  const handleRemoveFromSlider = async (actId) => {
    if (sliderActivities.length <= 2) {
      alert('स्लाइडर में कम से कम 2 गतिविधियां रहना अनिवार्य है।');
      return;
    }

    const remainingIds = sliderActivities.filter((a) => a.id !== actId).map((a) => a.id);

    try {
      setSliderLoading(true);
      const res = await api.updateFeaturedSliderOrder(remainingIds);
      if (res && res.success) {
        setSliderActivities(res.data || []);
        setFeedback({ type: 'success', msg: 'गतिविधि को शीर्ष स्लाइडर से हटा दिया गया है।' });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', msg: err?.message || 'हटाने में त्रुटि' });
    } finally {
      setSliderLoading(false);
    }
  };

  // Handle adding an activity to slider (max 4 activities check)
  const handleAddToSlider = async (actId) => {
    if (sliderActivities.length >= 4) {
      alert('स्लाइडर में अधिकतम 4 गतिविधियां ही रखी जा सकती हैं। पहले किसी एक को हटाएं।');
      return;
    }

    if (sliderActivities.some((a) => a.id === actId)) {
      alert('यह गतिविधि पहले से स्लाइडर में मौजूद है।');
      return;
    }

    const newIds = [...sliderActivities.map((a) => a.id), actId];

    try {
      setSliderLoading(true);
      const res = await api.updateFeaturedSliderOrder(newIds);
      if (res && res.success) {
        setSliderActivities(res.data || []);
        setFeedback({ type: 'success', msg: 'गतिविधि सफलतापूर्वक शीर्ष स्लाइडर में जुड़ गई!' });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', msg: err?.message || 'जोड़ने में त्रुटि' });
    } finally {
      setSliderLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingActivity(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title || '',
      category: activity.category || 'Inauguration',
      date: activity.date || new Date().toISOString().split('T')[0],
      time: activity.time || '11:00 AM',
      location: {
        village: activity.location?.village || '',
        block: activity.location?.block || 'इटावा सदर',
        district: activity.location?.district || 'इटावा',
        pincode: activity.location?.pincode || '206001'
      },
      shortDescription: activity.shortDescription || '',
      fullDescription: activity.fullDescription || '',
      images: activity.images || [],
      videoUrl: activity.videoUrl || '',
      externalLinks: activity.externalLinks && activity.externalLinks.length
        ? activity.externalLinks
        : [{ title: '', url: '' }, { title: '', url: '' }],
      tags: Array.isArray(activity.tags) ? activity.tags.join(', ') : (activity.tags || ''),
      status: activity.status || 'published',
      featured: !!activity.featured
    });
    setIsModalOpen(true);
  };

  const handleLinkChange = (index, field, value) => {
    const updated = [...formData.externalLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, externalLinks: updated });
  };

  const addLinkField = () => {
    if (formData.externalLinks.length < 4) {
      setFormData({
        ...formData,
        externalLinks: [...formData.externalLinks, { title: '', url: '' }]
      });
    }
  };

  const removeLinkField = (index) => {
    const updated = formData.externalLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, externalLinks: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('कृपया शीर्षक (Title) दर्ज करें!');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : formData.tags,
        externalLinks: formData.externalLinks.filter((l) => l.title.trim() && l.url.trim())
      };

      let res;
      if (editingActivity) {
        res = await api.updateActivity(editingActivity.id, payload);
      } else {
        res = await api.createActivity(payload);
      }

      if (res && res.success) {
        setFeedback({
          type: 'success',
          msg: editingActivity ? 'गतिविधि सफलतापूर्वक अपडेट की गई!' : 'नई जन-गतिविधि पोर्टल पर प्रकाशित हो गई!'
        });
        setIsModalOpen(false);
        loadActivities();
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({ type: 'error', msg: res?.message || 'सुरक्षित करने में त्रुटि हुई।' });
      }
    } catch (err) {
      console.error('Save activity error:', err);
      setFeedback({ type: 'error', msg: 'सर्वर त्रुटि: गतिविधि सुरक्षित नहीं हो सकी।' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`क्या आप वाकई "${title}" गतिविधि को हटाना चाहते हैं?`)) return;

    try {
      const res = await api.deleteActivity(id);
      if (res && res.success) {
        setFeedback({ type: 'success', msg: 'गतिविधि हटा दी गई है।' });
        loadActivities();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleStatus = async (activity) => {
    const newStatus = activity.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateActivity(activity.id, { status: newStatus });
      loadActivities();
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const filteredActivities = activities.filter((act) => {
    const matchSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.location?.village && act.location.village.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.tags && act.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchCategory = filterCategory === 'All' || act.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>MLA Daily Activity Publisher & Development Timeline Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">दैनिक जन-गतिविधि प्रकाशक</h1>
          <p className="text-orange-100 text-xs sm:text-sm max-w-2xl">
            एक बार दर्ज करें — मुख्य पृष्ठ टॉप फीचर कार्ड, विकास यात्रा टाइमलाइन, स्वतः निर्मित डिटेल पेज और व्हाट्सएप शेयरिंग में स्वतः प्रकाशित होगा।
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-5 py-3 rounded-2xl shadow-lg flex items-center space-x-2 transition transform active:scale-95 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-5 h-5 text-orange-600" />
          <span>नई गतिविधि प्रकाशित करें</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-md transition ${
            feedback.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">कुल जन-गतिविधियां</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{activities.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">प्रकाशित (Live)</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {activities.filter((a) => a.status === 'published').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">ड्राफ्ट (Draft)</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {activities.filter((a) => a.status === 'draft').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">फीचर्ड स्लाइडर (Top Slider)</span>
          <p className="text-2xl font-black text-orange-600 mt-1">
            {sliderActivities.length} / 4
          </p>
        </div>
      </div>

      {/* TOP FEATURED SLIDER MANAGER (2 to 4 activities database order control) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 sm:p-6 rounded-3xl border-2 border-orange-300 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>मुख्य पृष्ठ शीर्ष स्लाइडर नियंत्रक</span>
              </span>
              <span className="text-xs font-bold text-orange-950 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300">
                {sliderActivities.length} एक्टिविटी सक्रिय (न्यूनतम 2, अधिकतम 4)
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1.5">
              होमपेज टॉप फीचर कार्ड: 2 से 4 एक्टिविटी स्लाइडर व उनका क्रम (Order)
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl">
              यह सीधे डेटाबेस से नियंत्रित होता है। आप तय कर सकते हैं कि कौन-सी खबरें शीर्ष पर स्लाइडर में चलेंगी और उनका कौन सा क्रम (1st, 2nd, 3rd, 4th) होगा।
            </p>
          </div>

          {/* Add Activity to Slider Selector (if < 4) */}
          {sliderActivities.length < 4 && (
            <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-orange-200 shadow-xs">
              <select
                value={selectedAddActivityId}
                onChange={(e) => setSelectedAddActivityId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 max-w-xs"
              >
                <option value="">+ अन्य प्रकाशित गतिविधि चुनें...</option>
                {activities
                  .filter((a) => a.status === 'published' && !sliderActivities.some((s) => s.id === a.id))
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title.slice(0, 45)}...
                    </option>
                  ))}
              </select>
              <button
                onClick={() => {
                  if (!selectedAddActivityId) return;
                  handleAddToSlider(Number(selectedAddActivityId));
                  setSelectedAddActivityId('');
                }}
                disabled={!selectedAddActivityId || sliderLoading}
                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>स्लाइडर में जोड़ें</span>
              </button>
            </div>
          )}
        </div>

        {/* Slider Activities Cards Grid (Showing 2 to 4 items in exact order) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sliderActivities.map((act, index) => {
            const thumb = Array.isArray(act.images) && act.images.length ? act.images[0] : '/images/assets/work_rampur_road.jpg';
            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-sm flex flex-col justify-between space-y-3 relative group hover:border-orange-400 transition"
              >
                {/* Header with Order Badge & Remove */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-600 text-white text-[11px] font-black shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>स्लाइडर क्रम #{index + 1}</span>
                  </span>
                  <button
                    onClick={() => handleRemoveFromSlider(act.id)}
                    disabled={sliderActivities.length <= 2 || sliderLoading}
                    title={sliderActivities.length <= 2 ? 'कम से कम 2 एक्टिविटी अनिवार्य हैं' : 'स्लाइडर से हटाएं'}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Thumbnail & Title */}
                <div className="flex items-center space-x-3">
                  <img
                    src={thumb}
                    alt=""
                    className="w-16 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-tight">
                      {act.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                      <span className="truncate">{act.location?.village || 'इटावा'}</span>
                    </p>
                  </div>
                </div>

                {/* Reorder Buttons (Move Up / Down) */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleMoveSlider(index, -1)}
                      disabled={index === 0 || sliderLoading}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 disabled:opacity-30 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title="पहले दिखाएं (Move Up/Left)"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>पहले</span>
                    </button>
                    <button
                      onClick={() => handleMoveSlider(index, 1)}
                      disabled={index === sliderActivities.length - 1 || sliderLoading}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 disabled:opacity-30 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title="बाद में दिखाएं (Move Down/Right)"
                    >
                      <span>बाद में</span>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    {index === 0 ? 'प्रथम' : index === sliderActivities.length - 1 ? 'अंतिम' : `#${index + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="शीर्षक, गांव या टैग खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">सभी श्रेणियां (All Categories)</option>
              {categoriesList.map((c) => (
                <option key={c.id || c.name} value={c.id || c.name}>{c.nameHi || c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={loadActivities}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-bold">गतिविधियां लोड हो रही हैं...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-600">कोई गतिविधि नहीं मिली</p>
            <p className="text-xs text-slate-400">नई गतिविधि जोड़ने के लिए "नई गतिविधि प्रकाशित करें" बटन दबाएं।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">फोटो / शीर्षक</th>
                  <th className="py-3 px-4">श्रेणी व स्थान</th>
                  <th className="py-3 px-4">दिनांक व समय</th>
                  <th className="py-3 px-4 text-center">रीच (Reach)</th>
                  <th className="py-3 px-4 text-center">स्थिति (Status)</th>
                  <th className="py-3 px-4 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActivities.map((act) => {
                  const thumb = Array.isArray(act.images) && act.images.length ? act.images[0] : '/images/assets/work_rampur_road.jpg';
                  const sliderIndex = sliderActivities.findIndex((s) => s.id === act.id);
                  const isInSlider = sliderIndex !== -1;

                  return (
                    <tr key={act.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3 min-w-[280px]">
                          <img
                            src={thumb}
                            alt=""
                            className="w-14 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                            onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                          />
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {isInSlider && (
                                <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[10px] font-black uppercase flex items-center gap-0.5 shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                                  <span>स्लाइडर #{sliderIndex + 1}</span>
                                </span>
                              )}
                              {act.featured && !isInSlider && (
                                <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-black uppercase">
                                  Top Card
                                </span>
                              )}
                              <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{act.title}</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{act.shortDescription}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {act.categoryHi || act.category}
                          </span>
                          <div className="flex items-center text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-red-500 mr-1" />
                            <span>{act.location?.village || 'इटावा'}, {act.location?.block || 'सदर'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5 text-slate-600">
                          <div className="flex items-center space-x-1 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{act.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{act.time}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center space-x-3 text-[11px] text-slate-500">
                          <span className="flex items-center space-x-0.5" title="देखा गया">
                            <Eye className="w-3 h-3 text-blue-500" />
                            <span>{act.views || 0}</span>
                          </span>
                          <span className="flex items-center space-x-0.5" title="शेयर किया गया">
                            <Share2 className="w-3 h-3 text-green-500" />
                            <span>{act.shares || 0}</span>
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(act)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                            act.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {act.status === 'published' ? 'लाइव (Live)' : 'ड्राफ्ट (Draft)'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Quick Toggle Top Slider Button */}
                          {isInSlider ? (
                            <button
                              onClick={() => handleRemoveFromSlider(act.id)}
                              disabled={sliderActivities.length <= 2 || sliderLoading}
                              className="p-1.5 rounded-lg border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 disabled:opacity-30 transition cursor-pointer"
                              title={`शीर्ष स्लाइडर से हटाएं (वर्तमान क्रम #${sliderIndex + 1})`}
                            >
                              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToSlider(act.id)}
                              disabled={sliderActivities.length >= 4 || sliderLoading}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-30 transition cursor-pointer"
                              title={sliderActivities.length >= 4 ? 'स्लाइडर में अधिकतम 4 हो सकती हैं' : 'शीर्ष स्लाइडर में जोड़ें'}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => openEditModal(act)}
                            className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="संपादित करें"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(act.id, act.title)}
                            className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New / Edit Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 my-8 overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  {editingActivity ? 'जन-गतिविधि संपादित करें (Edit Activity)' : 'नई दैनिक जन-गतिविधि प्रकाशित करें'}
                </h3>
                <p className="text-orange-100 text-xs">
                  एक बार प्रकाशित करें — वेबसाइट के सभी अनुभागों में स्वतः सिंक्रनाइज़ हो जाएगा।
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Row 1: Title with Voice Typing */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">गतिविधि का मुख्य शीर्षक (Title) *</label>
                  <VoiceInputButton
                    onTranscript={(txt) => setFormData((prev) => ({ ...prev, title: txt }))}
                    currentValue={formData.title}
                    mode="replace"
                    size="sm"
                    title="शीर्षक बोलकर दर्ज करें (Voice Typing)"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="उदा. ग्राम रामपुर में 4.5 किमी पक्की सड़क का लोकार्पण (बोलकर या लिखकर दर्ज करें)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Row 2: Category, Date, Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">श्रेणी (Category) *</label>
                    <button
                      type="button"
                      onClick={handleQuickAddCategory}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      + नई श्रेणी
                    </button>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id || c.name} value={c.id || c.name}>{c.nameHi || c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">दिनांक (Date) *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">समय (Time)</label>
                  <input
                    type="text"
                    placeholder="उदा. 11:30 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Location (Village, Block, District) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">ग्राम / वार्ड (Village) *</label>
                    <button
                      type="button"
                      onClick={handleQuickAddVillage}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      + नया गाँव
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    list="villages-list-activity"
                    placeholder="उदा. ग्राम रामपुर"
                    value={formData.location.village}
                    onChange={(e) => {
                      const val = e.target.value;
                      const match = villagesList.find((v) => v.nameHi === val || v.name === val);
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          village: val,
                          block: match?.block || formData.location.block,
                          district: match?.district || formData.location.district
                        }
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <datalist id="villages-list-activity">
                    {villagesList.map((v) => (
                      <option key={v.id} value={v.nameHi}>{v.nameHi} ({v.block})</option>
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">विकास खंड / मंडल (Block)</label>
                  <input
                    type="text"
                    placeholder="उदा. इटावा सदर"
                    value={formData.location.block}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, block: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">जिला (District)</label>
                  <input
                    type="text"
                    value={formData.location.district}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, district: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Short Summary & Rich Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">संक्षिप्त विवरण (Short Summary - 2-3 पंक्तियां)</label>
                  <VoiceInputButton
                    onTranscript={(txt) => setFormData((prev) => ({ ...prev, shortDescription: txt }))}
                    currentValue={formData.shortDescription}
                    mode="append"
                    size="sm"
                    title="संक्षिप्त विवरण बोलें (Voice Typing)"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="कार्ड और टाइमलाइन में दिखाई देने वाला संक्षिप्त विवरण (बोलकर भी दर्ज कर सकते हैं)..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">विस्तृत विवरण (Full Rich Description) *</label>
                  <VoiceInputButton
                    onTranscript={(txt) => setFormData((prev) => ({ ...prev, fullDescription: txt }))}
                    currentValue={formData.fullDescription}
                    mode="append"
                    size="sm"
                    title="विस्तृत विवरण बोलें (Voice Typing)"
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="कार्यक्रम का विस्तृत विवरण, भाषण के मुख्य बिंदु, उपस्थित लोग, लागत आदि (माइक चालू करके हिंदी में बोलें)..."
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Row 5: Multi-Image Uploader */}
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-2">
                <MultiImageUploadInput
                  images={formData.images}
                  onChange={(newImgs) => setFormData({ ...formData, images: newImgs })}
                  label="गतिविधि के चित्र (Multiple Event Photos) - फाइल चुनें या ड्रॉप करें"
                />
              </div>

              {/* Row 6: Video URL & Dynamic Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center space-x-1">
                    <Video className="w-3.5 h-3.5 text-red-500" />
                    <span>यूट्यूब वीडियो लिंक (YouTube Link)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5 text-orange-500" />
                      <span>टैग्स (Tags)</span>
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        const t = window.prompt('नया टैग नाम दर्ज करें (बिना # के):');
                        if (!t || !t.trim()) return;
                        const res = await api.addTag({ name: t.trim() });
                        if (res && res.success) {
                          setTagsList((prev) => [...prev, res.data]);
                          const current = formData.tags ? formData.tags.split(',').map((s) => s.trim()).filter(Boolean) : [];
                          if (!current.includes(t.trim())) {
                            setFormData({ ...formData, tags: [...current, t.trim()].join(', ') });
                          }
                          alert(`टैग #${t.trim()} जोड़ा गया!`);
                        }
                      }}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      + नया टैग
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="सड़क, ग्राम विकास, पीडब्ल्यूडी, इटावा"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {tagsList.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tagsList.slice(0, 8).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            const current = formData.tags ? formData.tags.split(',').map((s) => s.trim()).filter(Boolean) : [];
                            if (!current.includes(t.name)) {
                              setFormData({ ...formData, tags: [...current, t.name].join(', ') });
                            }
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-800 text-[10px] font-bold cursor-pointer transition"
                        >
                          +{t.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 7: 2 to 4 External Links */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 flex items-center space-x-1">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    <span>महत्वपूर्ण बाहरी लिंक (2-4 External Reference Links)</span>
                  </label>
                  {formData.externalLinks.length < 4 && (
                    <button
                      type="button"
                      onClick={addLinkField}
                      className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      + और लिंक जोड़ें
                    </button>
                  )}
                </div>

                {formData.externalLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`लिंक शीर्षक ${idx + 1} (उदा. समाचार रिपोर्ट)`}
                      value={link.title}
                      onChange={(e) => handleLinkChange(idx, 'title', e.target.value)}
                      className="w-1/3 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    {formData.externalLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLinkField(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Row 8: Featured & Status Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-100/70 rounded-xl border border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <span className="font-bold text-slate-800">
                    मुख्य पृष्ठ टॉप फीचर कार्ड बनाएं (Feature on Homepage Top)
                  </span>
                </label>

                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-700">स्थिति:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-800 outline-none"
                  >
                    <option value="published">लाइव प्रकाशित (Published)</option>
                    <option value="draft">ड्राफ्ट (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'सुरक्षित हो रहा है...' : editingActivity ? 'अपडेट सुरक्षित करें' : 'प्रकाशित करें (Publish Live)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
