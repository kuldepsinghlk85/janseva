import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  Share2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Heart,
  MessageCircle,
  CheckCircle2,
  HardHat,
  Calendar,
  Copy,
  ExternalLink,
  PlusCircle,
  Trash2,
  Edit3,
  Search,
  Filter,
  Check,
  Globe,
  X,
  AlertCircle,
  Layers,
  MapPin,
  Send
} from 'lucide-react';
import ImageUploadInput from '../components/common/ImageUploadInput';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminSocialMedia() {
  const { showToast } = useApp();
  const [socialData, setSocialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingProfileId, setSyncingProfileId] = useState(null);
  const [convertingActivityId, setConvertingActivityId] = useState(null);
  const [convertingWorkId, setConvertingWorkId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'instagram' | 'facebook' | 'activity' | 'work'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  // Form data for adding manual post
  const [newPostForm, setNewPostForm] = useState({
    platform: 'instagram',
    postUrl: '',
    content: '',
    media: '/images/assets/work_school_children.jpg',
    likes: 120,
    comments: 18
  });

  const loadSocial = async () => {
    try {
      setLoading(true);
      const res = await api.getSocialPosts();
      if (res && res.success) {
        setSocialData(res);
      }
    } catch (e) {
      console.error('Error fetching social posts:', e);
      showToast('सोशल डेटा लोड करने में त्रुटि हुई', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocial();
  }, []);

  // Sync All or Specific Profile
  const handleSync = async (profileId = null) => {
    if (profileId) {
      setSyncingProfileId(profileId);
    } else {
      setSyncingAll(true);
    }

    try {
      const res = await api.syncSocial(profileId, 'Admin (Super Admin)');
      if (res && res.success) {
        showToast(res.message || 'सोशल प्रोफाइल सफलतापूर्वक सिंक की गईं!', 'success');
        loadSocial();
      } else {
        showToast(res?.message || 'सिंक करने में त्रुटि हुई', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('सर्वर से सिंक करने में त्रुटि हुई', 'error');
    } finally {
      setSyncingAll(false);
      setSyncingProfileId(null);
    }
  };

  // Convert to Daily Activity
  const handleConvertToActivity = async (post) => {
    setConvertingActivityId(post.id);
    try {
      const res = await api.convertSocialToActivity(post.id, 'Admin (Super Admin)');
      if (res && res.success) {
        showToast(res.message || 'दैनिक जन-गतिविधि में सफलतापूर्वक जोड़ दिया गया!', 'success');
        loadSocial();
      } else {
        showToast(res?.message || 'गतिविधि में जोड़ने में त्रुटि हुई', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('त्रुटि हुई', 'error');
    } finally {
      setConvertingActivityId(null);
    }
  };

  // Convert to Development Work
  const handleConvertToWork = async (post) => {
    setConvertingWorkId(post.id);
    try {
      const res = await api.convertSocialToWork(post.id, 'Admin (Super Admin)');
      if (res && res.success) {
        showToast('सोशल पोस्ट को विकास कार्य में परिवर्तित कर दिया गया!', 'success');
        loadSocial();
      } else {
        showToast(res?.message || 'विकास कार्य में जोड़ने में त्रुटि हुई', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('त्रुटि हुई', 'error');
    } finally {
      setConvertingWorkId(null);
    }
  };

  // Copy Post Content
  const handleCopy = (post) => {
    const text = `${post.content}\n\n— ${post.author}\nस्रोत: ${post.postUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    showToast('पोस्ट टेक्स्ट क्लिपबोर्ड पर कॉपी हो गया!', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // WhatsApp Share
  const handleWhatsAppShare = (post) => {
    const text = `*${post.author}*\n\n${post.content}\n\n🔗 मूल पोस्ट: ${post.postUrl}\n🌐 JanSeva Portal: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('क्या आप वाकई इस पोस्ट को सिंक सूची से हटाना चाहते हैं?')) return;
    try {
      const res = await api.deleteSocialPost(postId, 'Admin (Super Admin)');
      if (res && res.success) {
        showToast('पोस्ट हटा दी गई!', 'success');
        loadSocial();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Manual Post
  const handleAddManualPost = async (e) => {
    e.preventDefault();
    if (!newPostForm.content.trim()) {
      alert('कृपया पोस्ट की सामग्री दर्ज करें।');
      return;
    }
    try {
      const payload = {
        ...newPostForm,
        author: newPostForm.platform === 'telegram' 
          ? 'Sarita Bhadauria MLA Etawah (Telegram)' 
          : newPostForm.platform === 'facebook' 
          ? 'Sarita Bhadauria MLA Etawah' 
          : 'श्रीमती सरिता भदौरिया (@mlaetawah)',
        authorAvatar: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
        profileUrl: newPostForm.platform === 'telegram'
          ? 'https://t.me/sarrita8'
          : newPostForm.platform === 'facebook' 
          ? 'https://www.facebook.com/mlaetawah'
          : 'https://www.instagram.com/mlaetawah/?hl=en',
        postUrl: newPostForm.postUrl || (newPostForm.platform === 'telegram' ? 'https://t.me/sarrita8' : newPostForm.platform === 'facebook' ? 'https://www.facebook.com/mlaetawah' : 'https://www.instagram.com/mlaetawah/?hl=en')
      };
      const res = await api.createSocialPost(payload, 'Admin (Super Admin)');
      if (res && res.success) {
        showToast('सोशल पोस्ट सफलतापूर्वक दर्ज हो गई!', 'success');
        setShowAddModal(false);
        setNewPostForm({
          platform: 'instagram',
          postUrl: '',
          content: '',
          media: '/images/assets/work_school_children.jpg',
          likes: 120,
          comments: 18
        });
        loadSocial();
      }
    } catch (err) {
      console.error(err);
      showToast('पोस्ट जोड़ने में त्रुटि हुई', 'error');
    }
  };

  // Submit Profile Edit
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editingProfile) return;
    try {
      const res = await api.updateSocialProfile(editingProfile.id, editingProfile, 'Admin (Super Admin)');
      if (res && res.success) {
        showToast('प्रोफाइल विवरण सफलतापूर्वक अद्यतित किया गया!', 'success');
        setShowEditProfileModal(false);
        setEditingProfile(null);
        loadSocial();
      }
    } catch (err) {
      console.error(err);
      showToast('प्रोफाइल अपडेट करने में त्रुटि हुई', 'error');
    }
  };

  const profiles = socialData?.profiles || [];
  const posts = socialData?.posts || [];
  const stats = socialData?.stats || {};

  const tgProfile = profiles.find((p) => p.platform === 'telegram') || {
    id: 'profile-telegram-sarrita8',
    platform: 'telegram',
    handle: 'sarrita8',
    username: '@sarrita8',
    displayName: 'Sarita Bhadauria MLA Etawah (आधिकारिक टेलीग्राम चैनल)',
    profileUrl: 'https://t.me/sarrita8',
    avatar: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
    bio: 'आधिकारिक टेलीग्राम चैनल - श्रीमती सरिता भदौरिया, विधायक, इटावा सदर विधानसभा निर्वाचन क्षेत्र (200)। त्वरित सूचना, विकास बुलेटिन एवं सीधा संवाद।',
    followers: '12.5K',
    subscribers: '12.5K',
    totalPosts: 310,
    status: 'connected',
    lastSyncedAt: new Date().toISOString()
  };

  const igProfile = profiles.find((p) => p.platform === 'instagram') || {
    id: 'profile-instagram-mlaetawah',
    platform: 'instagram',
    handle: 'mlaetawah',
    username: '@mlaetawah',
    displayName: 'श्रीमती सरिता भदौरिया (MLA Etawah)',
    profileUrl: 'https://www.instagram.com/mlaetawah/?hl=en',
    avatar: '/images/poli4.png',
    bio: 'विधायक - इटावा सदर विधानसभा (200), उत्तर प्रदेश विधानसभा | भारतीय जनता पार्टी',
    followers: '18.4K',
    following: '245',
    totalPosts: 432,
    status: 'connected',
    lastSyncedAt: new Date().toISOString()
  };

  const fbProfile = profiles.find((p) => p.platform === 'facebook') || {
    id: 'profile-facebook-mlaetawah',
    platform: 'facebook',
    handle: 'mlaetawah',
    username: 'mlaetawah',
    profileUrl: 'https://www.facebook.com/mlaetawah',
    avatar: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
    bio: 'आधिकारिक फेसबुक पृष्ठ - श्रीमती सरिता भदौरिया, विधायक, इटावा सदर विधानसभा निर्वाचन क्षेत्र (200)। जनसेवा, क्षेत्र का विकास एवं लोक-कल्याण ही सर्वोच्च प्राथमिकता।',
    followers: '34.8K',
    likes: '31.2K',
    totalPosts: 876,
    status: 'connected',
    lastSyncedAt: new Date().toISOString()
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (activeTab === 'telegram' && p.platform !== 'telegram') return false;
    if (activeTab === 'instagram' && p.platform !== 'instagram') return false;
    if (activeTab === 'facebook' && p.platform !== 'facebook') return false;
    if (activeTab === 'activity' && !p.isConvertedToActivity) return false;
    if (activeTab === 'work' && !p.isConvertedToWork) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (p.content || '').toLowerCase().includes(q) ||
        (p.author || '').toLowerCase().includes(q) ||
        (p.aiTags?.village || '').toLowerCase().includes(q) ||
        (p.aiTags?.category || '').toLowerCase().includes(q);
      if (!matchText) return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white flex items-center justify-center text-xl shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900">
                सोशल मीडिया सिंक एवं इंटेलिजेंस हब (Social Media Sync & Picker Engine)
              </h1>
              <p className="text-xs text-slate-500">
                श्रीमती सरिता भदौरिया (विधायक, इटावा 200) के आधिकारिक Instagram एवं Facebook से लाइव डेटा सिंक व इनफार्मेशन पिकर
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-orange-600" />
            <span>+ नया पोस्ट जोड़ें</span>
          </button>

          <button
            onClick={() => handleSync(null)}
            disabled={syncingAll}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${syncingAll ? 'animate-spin' : ''}`} />
            <span>{syncingAll ? 'सभी सिंक हो रहे हैं...' : 'सभी प्रोफाइल सिंक करें (Sync All)'}</span>
          </button>
        </div>
      </div>

      {/* MODULE 1: Synced Profiles Viewer Module (User Request Core) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-slate-900">
              आधिकारिक सिंक की गई प्रोफाइल्स (Official Synced Profiles)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              3 प्रोफाइल्स लाइव सिंक
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">एडमिन यहाँ से सभी सोशल प्रोफाइल का विवरण देख व 1-क्लिक में सिंक कर सकते हैं</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Instagram Profile Card */}
          <div className="bg-gradient-to-br from-rose-50/60 via-white to-pink-50/40 rounded-3xl p-5 border-2 border-rose-200/80 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-rose-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md">
                      <img
                        src={igProfile.avatar || '/images/poli4.png'}
                        alt={igProfile.displayName}
                        className="w-full h-full object-cover rounded-full border-2 border-white"
                        onError={(e) => { e.target.src = '/images/poli1.png'; }}
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow">
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        INSTAGRAM
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ● सिंक एवं कनेक्टेड
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mt-1">
                      {igProfile.displayName}
                    </h3>
                    <a
                      href={igProfile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 hover:underline flex items-center gap-1"
                    >
                      <span>{igProfile.username}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingProfile(igProfile);
                    setShowEditProfileModal(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition"
                  title="प्रोफाइल सेटिंग्स / URL संपादित करें"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 font-medium mt-3 bg-white/70 p-2.5 rounded-xl border border-rose-100 line-clamp-2">
                {igProfile.bio}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-rose-100">
                <div className="bg-white/80 p-2 rounded-xl border border-rose-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">{igProfile.followers || '18.4K'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">फॉलोअर्स</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-rose-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">{igProfile.following || '245'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">फॉलोइंग</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-rose-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">{igProfile.totalPosts || '432'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">कुल पोस्ट्स</div>
                </div>
              </div>
            </div>

            {/* Profile Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                अंतिम सिंक: {igProfile.lastSyncedAt ? new Date(igProfile.lastSyncedAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : 'अभी'}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={igProfile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-pink-700 hover:bg-pink-50 text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <span>प्रोफाइल देखें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleSync(igProfile.id)}
                  disabled={syncingProfileId === igProfile.id}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingProfileId === igProfile.id ? 'animate-spin' : ''}`} />
                  <span>{syncingProfileId === igProfile.id ? 'सिंक हो रहा है...' : 'Instagram सिंक करें'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Facebook Profile Card */}
          <div className="bg-gradient-to-br from-blue-50/60 via-white to-sky-50/40 rounded-3xl p-5 border-2 border-blue-200/80 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-blue-600 shadow-md">
                      <img
                        src={fbProfile.avatar || '/images/poli1.png'}
                        alt={fbProfile.displayName}
                        className="w-full h-full object-cover rounded-full border-2 border-white"
                        onError={(e) => { e.target.src = '/images/poli4.png'; }}
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow">
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
                        FACEBOOK
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ● सिंक एवं कनेक्टेड
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mt-1">
                      {fbProfile.displayName}
                    </h3>
                    <a
                      href={fbProfile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <span>facebook.com/{fbProfile.handle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingProfile(fbProfile);
                    setShowEditProfileModal(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition"
                  title="प्रोफाइल सेटिंग्स / URL संपादित करें"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 font-medium mt-3 bg-white/70 p-2.5 rounded-xl border border-blue-100 line-clamp-2">
                {fbProfile.bio}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-blue-100">
                <div className="bg-white/80 p-2 rounded-xl border border-blue-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">{fbProfile.followers || '34.8K'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">फॉलोअर्स</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-blue-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">{fbProfile.likes || '31.2K'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">पेज लाइक्स</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-blue-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">{fbProfile.totalPosts || '876'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">कुल पोस्ट्स</div>
                </div>
              </div>
            </div>

            {/* Profile Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                अंतिम सिंक: {fbProfile.lastSyncedAt ? new Date(fbProfile.lastSyncedAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : 'अभी'}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={fbProfile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <span>पेज देखें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleSync(fbProfile.id)}
                  disabled={syncingProfileId === fbProfile.id}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingProfileId === fbProfile.id ? 'animate-spin' : ''}`} />
                  <span>{syncingProfileId === fbProfile.id ? 'सिंक हो रहा है...' : 'Facebook सिंक करें'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Telegram Profile Card */}
          <div className="bg-gradient-to-br from-sky-50/70 via-white to-cyan-50/40 rounded-3xl p-5 border-2 border-sky-200/80 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-sky-500 shadow-md">
                      <img
                        src={tgProfile.avatar || '/uploads/images/sarita_bhadauriya-1789523047198-607565.png'}
                        alt={tgProfile.displayName}
                        className="w-full h-full object-cover rounded-full border-2 border-white"
                        onError={(e) => { e.target.src = '/images/poli1.png'; }}
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-sky-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow">
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500 text-white flex items-center gap-1">
                        <Send className="w-2.5 h-2.5" />
                        <span>TELEGRAM</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ● सिंक एवं कनेक्टेड
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mt-1">
                      {tgProfile.displayName}
                    </h3>
                    <a
                      href={tgProfile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1"
                    >
                      <span>{tgProfile.username || '@sarrita8'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingProfile(tgProfile);
                    setShowEditProfileModal(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition"
                  title="प्रोफाइल सेटिंग्स / URL संपादित करें"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 font-medium mt-3 bg-white/70 p-2.5 rounded-xl border border-sky-100 line-clamp-2">
                {tgProfile.bio}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-sky-100">
                <div className="bg-white/80 p-2 rounded-xl border border-sky-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">{tgProfile.subscribers || tgProfile.followers || '12.5K'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">सब्सक्राइबर्स</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-sky-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">24x7</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ब्रॉडकास्ट</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-sky-100/60 shadow-xs">
                  <div className="text-base font-black text-slate-900">{tgProfile.totalPosts || '310'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">कुल अपडेट्स</div>
                </div>
              </div>
            </div>

            {/* Profile Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                अंतिम सिंक: {tgProfile.lastSyncedAt ? new Date(tgProfile.lastSyncedAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : 'अभी'}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={tgProfile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <span>चैनल देखें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleSync(tgProfile.id)}
                  disabled={syncingProfileId === tgProfile.id}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingProfileId === tgProfile.id ? 'animate-spin' : ''}`} />
                  <span>{syncingProfileId === tgProfile.id ? 'सिंक हो रहा है...' : 'Telegram सिंक करें'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODULE 2: Synced Posts & Information Picker (User Request: "एडमिन कोई भी इनफार्मेशन यहां से पिक कर सकता है") */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>सिंक की गई पोस्ट्स एवं इनफार्मेशन पिकर</span>
              <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                {filteredPosts.length} उपलब्ध
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              एडमिन यहाँ से किसी भी पोस्ट को चुनकर 1-क्लिक में <b>दैनिक जन-गतिविधि</b> या <b>विकास कार्य</b> में जोड़ सकता है
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="सड़क, सैफई, अस्पताल खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            सभी पोस्ट्स ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'telegram'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram @sarrita8</span>
            <span>({posts.filter((p) => p.platform === 'telegram').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'instagram'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
            }`}
          >
            <span>Instagram @mlaetawah</span>
            <span>({posts.filter((p) => p.platform === 'instagram').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'facebook'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span>Facebook mlaetawah</span>
            <span>({posts.filter((p) => p.platform === 'facebook').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'activity'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>दैनिक गतिविधि में शामिल</span>
          </button>
          <button
            onClick={() => setActiveTab('work')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'work'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>विकास कार्य में शामिल</span>
          </button>
        </div>

        {/* Stream of Posts Cards */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-orange-500" />
            <p className="text-xs font-bold">सोशल मीडिया डेटा लोड हो रहा है...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-600">कोई पोस्ट नहीं मिली।</p>
            <p className="text-xs text-slate-400 mt-1">आप 'सभी प्रोफाइल सिंक करें' बटन दबाकर ताज़ा पोस्ट्स प्राप्त कर सकते हैं।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-3xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Post Author Bar */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                        <img
                          src={post.authorAvatar || (post.platform === 'facebook' ? '/images/poli1.png' : '/images/poli4.png')}
                          alt={post.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                          <span>{post.author}</span>
                          <span className="text-[10px] text-blue-600">✓</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">{post.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-black uppercase text-[9px] px-2 py-0.5 rounded-full ${
                          post.platform === 'telegram'
                            ? 'bg-sky-500 text-white'
                            : post.platform === 'instagram'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {post.platform}
                      </span>
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
                        title="मूल पोस्ट खोलें"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Post Media Preview */}
                  {post.media && (
                    <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden mb-3 shadow-inner relative group">
                      <img
                        src={post.media}
                        alt="Post media"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/poli3.png'; }}
                      />
                    </div>
                  )}

                  {/* Post Caption / Text */}
                  <p className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* AI Intelligence Classification Tags */}
                  {post.aiTags && (
                    <div className="mt-3 p-3 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-orange-900 font-bold text-[11px]">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                          <span>AI Intelligence वर्गीकरण</span>
                        </span>
                        {post.aiTags.confidence && (
                          <span className="text-[10px] text-orange-700 bg-white px-1.5 py-0.2 rounded font-semibold border border-orange-200">
                            सटीकता: {Math.round(post.aiTags.confidence * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-lg bg-white text-slate-800 font-bold border border-orange-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-600" />
                          <span>गाँव: <b>{post.aiTags.village}</b></span>
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-white text-slate-800 font-bold border border-orange-200">
                          श्रेणी: <b>{post.aiTags.category}</b>
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-white text-slate-800 font-bold border border-orange-200">
                          विभाग: <b>{post.aiTags.department}</b>
                        </span>
                      </div>
                      {post.aiTags.suggestedTitle && (
                        <div className="text-[11px] text-slate-700 font-semibold pt-0.5 truncate">
                          💡 सुझाई गई हेडलाइन: <i>{post.aiTags.suggestedTitle}</i>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Conversion Badges & Action Toolbar (User Request: "एडमिन कोई भी इनफार्मेशन यहां से पिक कर सकता है") */}
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  {/* Status Badges */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center gap-1 font-bold text-rose-600 text-xs">
                        <Heart className="w-3.5 h-3.5 fill-rose-600" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-blue-600 text-xs">
                        <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px]">
                      {post.isConvertedToActivity && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>दैनिक गतिविधि</span>
                        </span>
                      )}
                      {post.isConvertedToWork && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold flex items-center gap-1">
                          <HardHat className="w-3 h-3 text-orange-600" />
                          <span>विकास कार्य</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 1-Click Action Buttons for Admin */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                    {/* Pick 1: Add to Daily Activity */}
                    <button
                      onClick={() => handleConvertToActivity(post)}
                      disabled={convertingActivityId === post.id}
                      className={`px-2 py-1.5 rounded-xl font-bold text-[11px] transition shadow-xs flex items-center justify-center gap-1 cursor-pointer ${
                        post.isConvertedToActivity
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                      title="दैनिक जन-गतिविधि (Daily Activity Timeline) में जोड़ें"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{convertingActivityId === post.id ? 'प्रक्रिया...' : post.isConvertedToActivity ? 'गतिविधि ✓' : '+ दैनिक गतिविधि'}</span>
                    </button>

                    {/* Pick 2: Convert to Development Work */}
                    <button
                      onClick={() => handleConvertToWork(post)}
                      disabled={convertingWorkId === post.id}
                      className={`px-2 py-1.5 rounded-xl font-bold text-[11px] transition shadow-xs flex items-center justify-center gap-1 cursor-pointer ${
                        post.isConvertedToWork
                          ? 'bg-orange-50 text-orange-700 border border-orange-300 hover:bg-orange-100'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                      title="विकास कार्य (Development Projects) में जोड़ें"
                    >
                      <HardHat className="w-3.5 h-3.5" />
                      <span>{convertingWorkId === post.id ? 'प्रक्रिया...' : post.isConvertedToWork ? 'विकास कार्य ✓' : '+ विकास कार्य'}</span>
                    </button>

                    {/* Pick 3: Copy Content */}
                    <button
                      onClick={() => handleCopy(post)}
                      className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition flex items-center justify-center gap-1 cursor-pointer"
                      title="टेक्स्ट कॉपी करें"
                    >
                      {copiedId === post.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === post.id ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
                    </button>

                    {/* Pick 4: WhatsApp Share */}
                    <button
                      onClick={() => handleWhatsAppShare(post)}
                      className="px-2 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] transition flex items-center justify-center gap-1 cursor-pointer"
                      title="व्हाट्सएप पर शेयर करें"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>व्हाट्सएप</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Add Manual Post or Paste URL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">नया सोशल पोस्ट मैनुअल जोड़ें / लिंक दर्ज करें</h3>
                <p className="text-xs text-slate-500">Instagram या Facebook पोस्ट की सामग्री सीधे पोर्टल में सिंक करें</p>
              </div>
            </div>

            <form onSubmit={handleAddManualPost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">प्लेटफ़ॉर्म चुनें *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPostForm({ ...newPostForm, platform: 'telegram' })}
                    className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      newPostForm.platform === 'telegram'
                        ? 'bg-sky-500 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Telegram (@sarrita8)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostForm({ ...newPostForm, platform: 'instagram' })}
                    className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      newPostForm.platform === 'instagram'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Instagram (@mlaetawah)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostForm({ ...newPostForm, platform: 'facebook' })}
                    className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      newPostForm.platform === 'facebook'
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Facebook (mlaetawah)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">मूल पोस्ट URL (वैकल्पिक)</label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/p/... या https://facebook.com/..."
                  value={newPostForm.postUrl}
                  onChange={(e) => setNewPostForm({ ...newPostForm, postUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">पोस्ट की सामग्री / कैप्शन *</label>
                  <VoiceInputButton
                    onTranscript={(text) => setNewPostForm((prev) => ({ ...prev, content: prev.content ? `${prev.content} ${text}` : text }))}
                    mode="append"
                    buttonTitle="बोलकर कैप्शन लिखें"
                    size="sm"
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="विधायक जी का भाषण, दौरा, विकास कार्य या जनसंवाद का विवरण यहाँ लिखें या बोलें..."
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <ImageUploadInput
                  label="पोस्ट मीडिया / फोटो"
                  value={newPostForm.media}
                  onChange={(url) => setNewPostForm({ ...newPostForm, media: url })}
                  helperText="डिवाइस से फोटो अपलोड करें या मीडिया लाइब्रेरी से चुनें"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
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
                  सुरक्षित एवं सिंक करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Profile Settings */}
      {showEditProfileModal && editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative my-auto">
            <button
              onClick={() => {
                setShowEditProfileModal(false);
                setEditingProfile(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">सोशल प्रोफाइल URL व विवरण संपादित करें</h3>
                <p className="text-xs text-slate-500">{editingProfile.platform.toUpperCase()} प्रोफाइल सेटिंग्स</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">आधिकारिक प्रोफाइल URL *</label>
                <input
                  type="url"
                  required
                  value={editingProfile.profileUrl || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, profileUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">हैंडल / यूजरनेम *</label>
                <input
                  type="text"
                  required
                  value={editingProfile.handle || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, handle: e.target.value, username: e.target.value.startsWith('@') ? e.target.value : `@${e.target.value}` })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">प्रदर्शित नाम (Display Name)</label>
                <input
                  type="text"
                  value={editingProfile.displayName || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, displayName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">फॉलोअर्स संख्या</label>
                <input
                  type="text"
                  value={editingProfile.followers || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, followers: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">बायो / परिचय</label>
                <textarea
                  rows={2}
                  value={editingProfile.bio || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProfileModal(false);
                    setEditingProfile(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  अपडेट सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
