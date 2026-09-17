import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Eye,
  AlertCircle,
  Clock,
  MessageCircle,
  Video,
  PlusCircle,
  Trash2,
  Edit,
  ExternalLink,
  Play,
  FileText,
  X,
  Share2
} from 'lucide-react';
import ImageUploadInput from '../components/common/ImageUploadInput';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminFestivalManager() {
  const { settings, setSettings, loadSettings, showToast } = useApp();

  const [active, setActive] = useState(Boolean(settings?.festival?.active));
  const [selectedPreset, setSelectedPreset] = useState(settings?.festival?.selectedFestival || 'ganesh_chaturthi');
  const [title, setTitle] = useState(settings?.festival?.title || 'गणेश चतुर्थी की हार्दिक शुभकामनाएं');
  const [message, setMessage] = useState(settings?.festival?.message || 'समस्त इटावा वासियों को गणेश चतुर्थी के पावन पर्व पर हार्दिक बधाई एवं अनंत मंगलकामनाएं।');
  const [fullMessage, setFullMessage] = useState(settings?.festival?.fullMessage || '');
  const [startDate, setStartDate] = useState(settings?.festival?.startDate || '2026-09-15');
  const [endDate, setEndDate] = useState(settings?.festival?.endDate || '2026-09-24');
  const [bannerImage, setBannerImage] = useState(settings?.festival?.bannerImage || '/images/poli3.png');
  const [videoUrl, setVideoUrl] = useState(settings?.festival?.videoUrl || '');
  const [autoRestore, setAutoRestore] = useState(settings?.festival?.autoRestore ?? true);
  const [saving, setSaving] = useState(false);

  // Database Collection of Festivals
  const [festivalsList, setFestivalsList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    message: '',
    fullMessage: '',
    bannerImage: '/images/poli2.png',
    videoUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    category: 'धार्मिक उत्सव',
    active: false
  });

  const loadFestivals = async () => {
    try {
      setLoadingList(true);
      const res = await api.getFestivals();
      if (res && res.success) {
        setFestivalsList(res.festivals || []);
        if (res.activeFestival) {
          setActive(Boolean(res.activeFestival.active));
          if (res.activeFestival.title) setTitle(res.activeFestival.title);
          if (res.activeFestival.message) setMessage(res.activeFestival.message);
          if (res.activeFestival.fullMessage) setFullMessage(res.activeFestival.fullMessage);
          if (res.activeFestival.bannerImage) setBannerImage(res.activeFestival.bannerImage);
          if (res.activeFestival.videoUrl) setVideoUrl(res.activeFestival.videoUrl);
          if (res.activeFestival.startDate) setStartDate(res.activeFestival.startDate);
          if (res.activeFestival.endDate) setEndDate(res.activeFestival.endDate);
        }
      }
    } catch (e) {
      console.error('Error fetching festivals list:', e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadFestivals();
  }, []);

  const getEmbedYoutube = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const handleSaveActive = async () => {
    setSaving(true);
    const updatedFestival = {
      active,
      selectedFestival: selectedPreset,
      title,
      message,
      fullMessage,
      bannerImage,
      videoUrl,
      startDate,
      endDate,
      autoRestore
    };

    try {
      const res = await api.updateFestival(updatedFestival, 'Admin (Super Admin)');
      if (res.success) {
        if (settings) {
          setSettings({ ...settings, festival: { ...settings.festival, ...updatedFestival } });
        }
        await loadSettings();
        await loadFestivals();
        showToast('त्यौहार अभियान एवं शेड्यूलिंग सफलता पूर्वक सुरक्षित की गई!', 'success');
      } else {
        showToast('अपडेट विफल रहा: ' + (res.message || 'त्रुटि'), 'error');
      }
    } catch (err) {
      showToast('नेटवर्क त्रुटि, पुनः प्रयास करें', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (newActive) => {
    setActive(newActive);
    const updatedFestival = {
      active: newActive,
      selectedFestival: selectedPreset,
      title,
      message,
      fullMessage,
      bannerImage,
      videoUrl,
      startDate,
      endDate,
      autoRestore
    };
    try {
      const res = await api.updateFestival(updatedFestival, 'Admin (Super Admin)');
      if (res.success) {
        if (settings) {
          setSettings({ ...settings, festival: { ...settings.festival, ...updatedFestival } });
        }
        await loadSettings();
        await loadFestivals();
        showToast(newActive ? 'त्यौहार थीम होमपेज पर सक्रिय हो गई है!' : 'त्यौहार थीम निष्क्रिय की गई', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivateRecord = async (id, titleName) => {
    try {
      const res = await api.activateFestival(id);
      if (res.success) {
        showToast(`"${titleName}" अब वेबसाइट पर सक्रिय है!`, 'success');
        await loadFestivals();
        await loadSettings();
      }
    } catch (e) {
      showToast('सक्रिय करने में त्रुटि हुई', 'error');
    }
  };

  const handleDeleteRecord = async (id, titleName) => {
    if (!confirm(`क्या आप वाकई "${titleName}" अभियान रिकॉर्ड को डेटाबेस से हटाना चाहते हैं?`)) return;
    try {
      const res = await api.deleteFestivalItem(id);
      if (res.success) {
        showToast(`अभियान रिकॉर्ड हटा दिया गया।`, 'info');
        await loadFestivals();
        await loadSettings();
      }
    } catch (e) {
      showToast('हटाने में त्रुटि हुई', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      title: '',
      message: '',
      fullMessage: '',
      bannerImage: '/images/poli2.png',
      videoUrl: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      category: 'धार्मिक उत्सव',
      active: false
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setEditId(item.id);
    setFormData({
      name: item.name || '',
      title: item.title || '',
      message: item.message || '',
      fullMessage: item.fullMessage || '',
      bannerImage: item.bannerImage || '/images/poli2.png',
      videoUrl: item.videoUrl || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      category: item.category || 'विशेष पर्व',
      active: Boolean(item.active)
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('कृपया अभियान का शीर्षक दर्ज करें!', 'error');
      return;
    }

    try {
      if (modalMode === 'add') {
        const res = await api.createFestival(formData);
        if (res.success) {
          showToast('नया त्यौहार अभियान डेटाबेस में सहेजा गया!', 'success');
          setShowModal(false);
          await loadFestivals();
          await loadSettings();
        }
      } else {
        const res = await api.updateFestivalItem(editId, formData);
        if (res.success) {
          showToast('त्यौहार अभियान सफलतापूर्वक अपडेट हुआ!', 'success');
          setShowModal(false);
          await loadFestivals();
          await loadSettings();
        }
      }
    } catch (err) {
      showToast('सहेजने में त्रुटि हुई', 'error');
    }
  };

  const handleShareWhatsApp = (fest) => {
    const shareText = `*${fest.title}*\n\n${fest.message}\n\n${fest.fullMessage ? fest.fullMessage + '\n\n' : ''}${fest.videoUrl ? '🎬 वीडियो संदेश देखें: ' + fest.videoUrl + '\n\n' : ''}— श्रीमती सरिता भदौरिया (विधायक, इटावा विधानसभा 200)\n🔗 जनसेवा पोर्टल: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const activeVideoEmbed = getEmbedYoutube(videoUrl);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Festival & Special Campaigns Suite</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>त्यौहार व विशेष दिवस पेज प्रबंधक (Festival Manager)</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            त्यौहारों व राष्ट्रीय पर्वों पर पोस्टर, वीडियो संदेश, बधाई पत्र साझा करें तथा समस्त रिकॉर्ड डेटाबेस में सुरक्षित रखें।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleShareWhatsApp({ title, message, fullMessage, videoUrl })}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition cursor-pointer active:scale-95"
            title="शुभकामना संदेश व्हाट्सएप पर शेयर करें"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp शेयर</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ नया अभियान रिकॉर्ड</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Editor & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Current Active Campaign Editor */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>होमपेज मुख्य बैनर सेटिंग्स (Live Campaign Control)</span>
              </h3>
              <p className="text-[11px] text-slate-500">चालू करने पर होमपेज के शीर्ष पर बधाई बैनर, पोस्टर व वीडियो प्रदर्शित होंगे</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => handleToggleActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            {/* Title with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">अभियान शीर्षक (Festival Title) *</label>
                <VoiceInputButton
                  onTranscript={(text) => setTitle(text)}
                  mode="replace"
                  title="बोलकर शीर्षक लिखें"
                  size="sm"
                />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. गणेश चतुर्थी की हार्दिक शुभकामनाएं"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Short Wishes Message with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">संक्षिप्त शुभकामना संदेश (Short Wishes Message) *</label>
                <VoiceInputButton
                  onTranscript={(text) => setMessage(prev => prev ? `${prev} ${text}` : text)}
                  mode="append"
                  title="बोलकर संक्षिप्त संदेश लिखें"
                  size="sm"
                />
              </div>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="समस्त क्षेत्रवासियों को पावन पर्व की हार्दिक बधाई..."
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Detailed Wishes / Speech with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">विस्तृत संदेश / विधायक उद्बोधन (Detailed Message / Speech Text)</label>
                <VoiceInputButton
                  onTranscript={(text) => setFullMessage(prev => prev ? `${prev} ${text}` : text)}
                  mode="append"
                  title="बोलकर विस्तृत संदेश लिखें"
                  size="sm"
                />
              </div>
              <textarea
                rows={4}
                value={fullMessage}
                onChange={(e) => setFullMessage(e.target.value)}
                placeholder="विस्तृत शुभकामना संदेश, संदेश का महत्व, वोकल फॉर लोकल अपील अथवा विधायक जी का पूरा उद्बोधन यहाँ दर्ज करें..."
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
              />
            </div>

            {/* Poster Upload */}
            <div>
              <ImageUploadInput
                value={bannerImage}
                onChange={(url) => setBannerImage(url)}
                label="त्यौहार पोस्टर / बैनर फोटो (Festival Poster / Image)"
              />
            </div>

            {/* Video Link / Upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-red-600" />
                  <span>वीडियो संदेश लिंक (YouTube Video / Reels / MP4 URL)</span>
                </label>
              </div>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... अथवा MP4 वीडियो लिंक"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                YouTube वीडियो अथवा फेसबुक/इंस्टाग्राम रील्स का लिंक साझा करें, यह होमपेज पर सीधे प्लेयर के रूप में चलेगा।
              </p>
            </div>

            {/* Scheduling Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">प्रारंभ तिथि (Start Date)</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">समाप्ति तिथि (End Date)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Auto Restore Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div>
                <h4 className="font-bold text-slate-800">ऑटो रिस्टोर (Auto-restore Default Theme)</h4>
                <p className="text-[11px] text-slate-500">समाप्ति तिथि के पश्चात पोर्टल स्वतः सामान्य डिफ़ॉल्ट थीम पर वापस लौट आएगा।</p>
              </div>
              <input
                type="checkbox"
                checked={autoRestore}
                onChange={(e) => setAutoRestore(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {/* Save Active Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveActive}
                disabled={saving}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{saving ? 'सुरक्षित हो रहा है...' : 'होमपेज थीम व बैनर परिवर्तन लागू करें'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Column: Poster & Video Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-600" />
                <span>लाइव बैनर व पोस्टर प्रीव्यू</span>
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {active ? '🟢 एक्टिव' : '⚪ निष्क्रय'}
              </span>
            </div>

            {/* Banner Mockup Box */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-amber-200 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-5 space-y-3 relative">
              <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-amber-200">
                <Sparkles className="w-4 h-4" />
                <span>विशेष उत्सव शुभकामना</span>
              </div>

              <h3 className="text-lg font-black tracking-tight leading-snug">
                {title}
              </h3>

              <p className="text-xs text-amber-100 leading-relaxed">
                {message}
              </p>

              {/* Poster Preview */}
              {bannerImage && (
                <div className="rounded-xl overflow-hidden border-2 border-white/40 shadow bg-black/30 aspect-video relative">
                  <img
                    src={bannerImage}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/poli3.png'; }}
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-white">
                    त्यौहार पोस्टर
                  </span>
                </div>
              )}

              {/* Video Player Preview */}
              {activeVideoEmbed && (
                <div className="rounded-xl overflow-hidden border-2 border-white/40 shadow aspect-video bg-black">
                  <iframe
                    src={activeVideoEmbed}
                    title="Festival Video Message"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-white/20 text-[10px] text-amber-200">
                <span>— श्रीमती सरिता भदौरिया (विधायक, इटावा 200)</span>
                <span>📅 {startDate} से {endDate}</span>
              </div>
            </div>

            {/* Information Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>
                समाप्ति तिथि के पश्चात यह त्यौहार बैनर स्वचालित रूप से हट जाएगा तथा यह सारा रिकॉर्ड नीचे डेटाबेस अभिलेख में सुरक्षित रहेगा।
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Database Records & History Archive Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              <span>त्यौहार अभियान डेटाबेस एवं अभिलेख (Festival Database Records)</span>
            </h3>
            <p className="text-xs text-slate-500">
              पूर्व एवं आगामी समस्त त्यौहारों, पोस्टरों, वीडियो संदेशों का स्थायी डिजिटल रिकॉर्ड
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ नया त्यौहार जोड़ें</span>
          </button>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">पोस्टर / बैनर</th>
                <th className="p-3">त्यौहार एवं शीर्षक</th>
                <th className="p-3">वीडियो संदेश</th>
                <th className="p-3">शुभकामना संदेश</th>
                <th className="p-3">अवधि</th>
                <th className="p-3">स्थिति</th>
                <th className="p-3 text-right">कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {festivalsList.map((fest) => (
                <tr key={fest.id} className="hover:bg-slate-50 transition">
                  {/* Poster Thumbnail */}
                  <td className="p-3 w-20">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex-shrink-0">
                      <img
                        src={fest.bannerImage || '/images/poli2.png'}
                        alt={fest.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/poli3.png'; }}
                      />
                    </div>
                  </td>

                  {/* Festival Name & Title */}
                  <td className="p-3 max-w-xs">
                    <div className="font-black text-slate-900">{fest.name || fest.title}</div>
                    <div className="text-[11px] text-amber-700 font-bold mt-0.5">{fest.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">श्रेणी: {fest.category || 'विशेष पर्व'}</div>
                  </td>

                  {/* Video Status */}
                  <td className="p-3 whitespace-nowrap">
                    {fest.videoUrl ? (
                      <a
                        href={fest.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 font-bold text-[11px] hover:bg-red-100 transition"
                      >
                        <Play className="w-3 h-3 fill-red-600 text-red-600" />
                        <span>वीडियो लिंक</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">कोई वीडियो नहीं</span>
                    )}
                  </td>

                  {/* Message Excerpt */}
                  <td className="p-3 max-w-sm">
                    <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                      {fest.message}
                    </p>
                  </td>

                  {/* Dates */}
                  <td className="p-3 whitespace-nowrap text-slate-500 font-semibold text-[11px]">
                    <div>{fest.startDate}</div>
                    <div className="text-[10px] text-slate-400">से {fest.endDate}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      fest.active
                        ? 'bg-green-100 text-green-800 ring-1 ring-green-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {fest.active ? '🟢 सक्रिय (Live)' : '⚪ अप्रचलित'}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    {!fest.active && (
                      <button
                        onClick={() => handleActivateRecord(fest.id, fest.title)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shadow-sm cursor-pointer"
                        title="वेबसाइट पर लाइव करें"
                      >
                        सक्रिय करें
                      </button>
                    )}

                    <button
                      onClick={() => handleShareWhatsApp(fest)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                      title="व्हाट्सएप पर शेयर करें"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(fest)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                      title="संपादित करें"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteRecord(fest.id, fest.title)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Festival Record Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] overflow-y-auto space-y-4"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {modalMode === 'add' ? 'नया त्यौहार अभियान दर्ज करें' : 'त्यौहार अभियान संपादित करें'}
                </h3>
                <p className="text-xs text-slate-500">डेटाबेस में स्थायी रिकॉर्ड के रूप में सुरक्षित होगा</p>
              </div>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">त्यौहार का नाम (Festival Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. दीपावली (Diwali)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="धार्मिक उत्सव">धार्मिक उत्सव</option>
                    <option value="महापर्व">महापर्व</option>
                    <option value="राष्ट्रीय पर्व">राष्ट्रीय पर्व</option>
                    <option value="सांस्कृतिक पर्व">सांस्कृतिक पर्व</option>
                    <option value="विशेष जयंती">विशेष जयंती</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">अभियान शीर्षक (Festival Title) *</label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, title: text }))}
                    mode="replace"
                    title="बोलकर शीर्षक लिखें"
                    size="sm"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="उदा. दीपावली एवं धनतेरस की हार्दिक शुभकामनाएं"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">संक्षिप्त शुभकामना संदेश (Short Message) *</label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, message: prev.message ? `${prev.message} ${text}` : text }))}
                    mode="append"
                    title="बोलकर संदेश लिखें"
                    size="sm"
                  />
                </div>
                <textarea
                  rows={2}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="समस्त क्षेत्रवासियों को पावन पर्व की हार्दिक बधाई..."
                  className="w-full p-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">विस्तृत संदेश / उद्बोधन (Full Speech & Message)</label>
                  <VoiceInputButton
                    onTranscript={(text) => setFormData(prev => ({ ...prev, fullMessage: prev.fullMessage ? `${prev.fullMessage} ${text}` : text }))}
                    mode="append"
                    title="बोलकर पूरा उद्बोधन लिखें"
                    size="sm"
                  />
                </div>
                <textarea
                  rows={4}
                  value={formData.fullMessage}
                  onChange={(e) => setFormData({ ...formData, fullMessage: e.target.value })}
                  placeholder="विस्तृत शुभकामना संदेश व उद्बोधन..."
                  className="w-full p-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <ImageUploadInput
                  value={formData.bannerImage}
                  onChange={(url) => setFormData({ ...formData, bannerImage: url })}
                  label="त्यौहार पोस्टर / शुभकामना फोटो"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-red-600" />
                  <span>वीडियो संदेश लिंक (YouTube Video URL)</span>
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">प्रारंभ तिथि</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">समाप्ति तिथि</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="form-active-check"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                />
                <label htmlFor="form-active-check" className="font-bold text-slate-700 cursor-pointer">
                  सहेजते ही होमपेज पर सक्रिय (Live) करें
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow transition cursor-pointer"
                >
                  {modalMode === 'add' ? 'डेटाबेस में सुरक्षित करें' : 'अपडेट सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
