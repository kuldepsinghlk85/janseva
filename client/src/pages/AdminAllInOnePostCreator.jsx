import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Send,
  Copy,
  ExternalLink,
  Mic,
  MicOff,
  Video,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Share2,
  Trash2,
  Edit3,
  Eye,
  FileText,
  Settings,
  History,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Hash,
  Play,
  Link as LinkIcon,
  Upload,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Phone,
  Youtube,
  Clock,
  Layers,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Volume2
} from 'lucide-react';

export default function AdminAllInOnePostCreator() {
  const { activeLeaderProfile, activeAdminRole } = useApp();

  // Tab Navigation inside All-in-One Studio
  const [activeTab, setActiveTab] = useState('creator'); // 'creator' | 'history' | 'settings'
  const [activePreviewPlatform, setActivePreviewPlatform] = useState('facebook'); // 'facebook' | 'x' | 'instagram' | 'whatsapp'

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('विकास कार्य');
  const [rawContent, setRawContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [targetConstituency, setTargetConstituency] = useState('इटावा सदर (200)');

  // Voice to Text State
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('hi-IN');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const rawContentRef = useRef('');
  const isListeningRef = useRef(false);

  // Sync ref with state
  rawContentRef.current = rawContent;

  // Edit Mode & Inline Expand in Archive
  const [editingPostId, setEditingPostId] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

  // Platform-tailored content (dynamically calculated or manually customized)
  const [platformContents, setPlatformContents] = useState({
    facebook: '',
    x: '',
    instagram: '',
    whatsapp: ''
  });

  // History & Social Config
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [socialConfig, setSocialConfig] = useState({
    facebookPageUrl: 'https://facebook.com/saritabhadauria',
    xHandle: '@mlasarita',
    xProfileUrl: 'https://x.com/mlasarita',
    instagramUrl: 'https://instagram.com/saritabhadauria_mla',
    whatsappNumber: '919415045678',
    whatsappChannelUrl: 'https://chat.whatsapp.com/sample',
    youtubeChannelUrl: 'https://youtube.com/@saritabhadauria'
  });

  const leaderName = activeLeaderProfile?.name || 'श्रीमती सरिता भदौरिया';
  const leaderRole = activeLeaderProfile?.roleTitle || 'विधायक - इटावा सदर (200)';
  const leaderPhoto = activeLeaderProfile?.photo || '/assets/images/leader.png';

  // 1. Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLanguage;

      recognition.onresult = (event) => {
        let sessionFinal = '';
        let currentInterim = '';

        // Web Speech API maintains the full results array for the current session.
        // Loop from 0 to event.results.length to calculate canonical final and interim transcript.
        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          const transcript = item[0]?.transcript || '';
          if (item.isFinal) {
            sessionFinal += transcript + ' ';
          } else {
            currentInterim += transcript;
          }
        }

        const base = baseTextRef.current ? baseTextRef.current.trim() : '';
        const finalTrimmed = sessionFinal.trim();

        let newContent = base;
        if (finalTrimmed) {
          newContent = base ? `${base} ${finalTrimmed}` : finalTrimmed;
        }

        setRawContent(newContent);
        setInterimText(currentInterim.trim());
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          showToast('⚠️ माइक्रोफ़ोन की अनुमति (Permission) ब्लॉक है। कृपया ब्राउज़र में अनुमति दें।');
          setIsListening(false);
          isListeningRef.current = false;
          setInterimText('');
        }
      };

      recognition.onend = () => {
        // In Chrome, recognition stops on brief silence.
        // Auto-restart if user has not explicitly clicked stop!
        if (isListeningRef.current) {
          try {
            baseTextRef.current = rawContentRef.current ? rawContentRef.current.trim() : '';
            recognition.start();
            return;
          } catch (e) {
            console.warn('Auto-restart recognition error:', e);
          }
        }
        setIsListening(false);
        isListeningRef.current = false;
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [speechLanguage]);

  // Toggle Voice Recording
  const toggleListening = () => {
    if (!speechSupported) {
      alert('आपके ब्राउज़र में वॉइस-टू-टेक्स्ट सपोर्ट नहीं है। कृपया Google Chrome या Edge का उपयोग करें।');
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      // Flush any pending interim text cleanly
      if (interimText && interimText.trim()) {
        setRawContent((prev) => {
          const trimmed = prev.trim();
          const toAdd = interimText.trim();
          return trimmed ? `${trimmed} ${toAdd}` : toAdd;
        });
      }
      setInterimText('');
      showToast('⏹️ रिकॉर्डिंग रोक दी गई।');
    } else {
      // Record base text before starting dictation
      baseTextRef.current = rawContent ? rawContent.trim() : '';
      isListeningRef.current = true;
      setIsListening(true);
      setInterimText('');

      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = speechLanguage;
          recognitionRef.current.start();
          showToast('🎙️ रिकॉर्डिंग चालू है... बोलिए, आपकी आवाज टेक्स्ट में बदल रही है!');
        } catch (err) {
          console.error('Failed to start speech recognition:', err);
          setIsListening(false);
          isListeningRef.current = false;
        }
      }
    }
  };

  // 2. Fetch Data from Backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.getAllInOnePosts();
      if (res && res.success) {
        setPosts(res.posts || []);
        if (res.socialConfig) {
          setSocialConfig((prev) => ({ ...prev, ...res.socialConfig }));
        }
      }
    } catch (err) {
      console.error('Error fetching all-in-one posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // 3. Automated Platform Content Generator
  const generatePlatformTexts = (text, postTitle, cat, vUrl) => {
    const cleanText = text.trim();
    if (!cleanText && !postTitle) return;

    const baseTitle = postTitle ? postTitle.trim() : 'क्षेत्रीय विकास एवं जनसेवा अपडेट';
    const cleanCategory = cat || 'विकास कार्य';
    const videoSnippet = vUrl ? `\n\n🎥 वीडियो लिंक: ${vUrl}` : '';

    // Facebook: Full comprehensive story with bullet points and hashtags
    const fbText = `🏛️【 ${baseTitle} 】🏛️\n📌 श्रेणी: #${cleanCategory.replace(/\s+/g, '_')} | #${targetConstituency.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '')}\n\n${cleanText}${videoSnippet}\n\nजनता की सेवा, क्षेत्र का विकास — यही हमारा संकल्प है! 🤝\n\n📍 कार्यालय: ${leaderName}, ${leaderRole}\n📞 जनसुनवाई हेल्पलाइन: +91 ${socialConfig.whatsappNumber || '9415045678'}\n🌐 आधिकारिक पोर्टल: aapkaneta.com\n\n#सरिता_भदौरिया #इटावा_विकास #JanSeva #UPDevelopment #BJP4UP`;

    // X (Twitter): Strict <= 280 characters limit with punchy summary
    let xText = `🏛️ ${baseTitle}\n\n`;
    const xEnding = `${vUrl ? ' 🎥 ' + vUrl : ''}\n#इटावा #सरिता_भदौरिया #JanSeva`;
    const allowedBodyLen = 280 - (xText.length + xEnding.length);
    let xBody = cleanText;
    if (xBody.length > allowedBodyLen) {
      xBody = xBody.substring(0, Math.max(0, allowedBodyLen - 3)) + '...';
    }
    xText = xText + xBody + xEnding;

    // Instagram: Hook headline, clean spacing, Link in Bio, and 20+ viral hashtags
    const igText = `✨ ${baseTitle} ✨\n\n${cleanText}${videoSnippet}\n\n👉 संपूर्ण रिपोर्ट और अधिक जानकारी के लिए प्रोफाइल बायो (Bio) में दिए गए लिंक पर क्लिक करें।\n\n📍 ${targetConstituency} | ${leaderName}\n.\n.\n#इटावा #सरिता_भदौरिया #JanSeva #EtawahNews #UPPolitics #Development #YouthConnect #ViksitBharat #ViksitUP #PublicLeader #SocialWork #JanSamvad #MLA #EtawahDevelopment #LeaderInAction #DigitalIndia #BhartiyaJanataParty #SevaHiSangathan #GoodGovernance #Karyakarta`;

    // WhatsApp: WhatsApp native bold (*text*), bullet points, helpline & group share CTA
    const waText = `*🏛️ ${baseTitle} 🏛️*\n_(${cleanCategory} | ${targetConstituency})_\n\n${cleanText}${videoSnippet}\n\n------------------------------\n🔹 *जनप्रतिनिधि:* ${leaderName}\n🔹 *पद:* ${leaderRole}\n📞 *जनसंवाद हेल्पलाइन:* +91 ${socialConfig.whatsappNumber || '9415045678'}\n🌐 *वेबसाइट:* https://aapkaneta.com\n\n📢 *कृपया इस जनहितकारी जानकारी को अपने सभी मित्रों एवं व्हाट्सएप ग्रुप्स में शेयर करें!* 🙏`;

    setPlatformContents({
      facebook: fbText,
      x: xText,
      instagram: igText,
      whatsapp: waText
    });
  };

  // Auto regenerate when inputs change
  useEffect(() => {
    generatePlatformTexts(rawContent, title, category, videoUrl);
  }, [rawContent, title, category, videoUrl, targetConstituency]);

  // 4. File Upload Handlers
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingMedia(true);
      showToast('⏳ वीडियो अपलोड हो रहा है... कृपया प्रतीक्षा करें');
      const res = await api.uploadVideoFile(file);
      if (res && res.success && res.url) {
        setVideoUrl(res.url);
        showToast('✅ वीडियो सफलतापूर्वक अपलोड हो गया!');
      } else {
        showToast('⚠️ वीडियो अपलोड में त्रुटि: ' + (res.message || 'त्रुटि हुई'));
      }
    } catch (err) {
      showToast('❌ वीडियो अपलोड विफल: ' + err.message);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingMedia(true);
      showToast('⏳ फ़ोटो अपलोड हो रही है...');
      const res = await api.uploadImageFile(file);
      if (res && res.success && res.url) {
        setImageUrl(res.url);
        showToast('✅ फ़ोटो सफलतापूर्वक अपलोड हो गई!');
      } else {
        showToast('⚠️ फ़ोटो अपलोड विफल: ' + (res.message || ''));
      }
    } catch (err) {
      showToast('❌ फ़ोटो अपलोड विफल: ' + err.message);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Quick Emoji Insertion
  const insertEmoji = (emoji) => {
    setRawContent((prev) => prev + emoji);
  };

  // 5. Copy & Redirect Logic for Each Social Platform
  const copyAndRedirect = async (platform) => {
    const textToCopy = platformContents[platform];
    if (!textToCopy) {
      showToast('⚠️ कॉपी करने के लिए कंटेंट खाली है!');
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(platform);
      setTimeout(() => setCopySuccess(''), 3000);

      // Trigger Direct Redirect
      let targetUrl = '';
      if (platform === 'facebook') {
        showToast('✅ फेसबुक टेक्स्ट कॉपी हो गया! फेसबुक पेज खोला जा रहा है...');
        targetUrl = socialConfig.facebookPageUrl || 'https://www.facebook.com';
      } else if (platform === 'x') {
        showToast('✅ X (Twitter) टेक्स्ट कॉपी हो गया! X कंपोज़र खोला जा रहा है...');
        targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToCopy)}`;
      } else if (platform === 'whatsapp') {
        showToast('✅ व्हाट्सएप मैसेज कॉपी हो गया! व्हाट्सएप खोला जा रहा है...');
        targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToCopy)}`;
      } else if (platform === 'instagram') {
        showToast('✅ इंस्टाग्राम कैप्शन कॉपी हो गया! इंस्टाग्राम खोला जा रहा है...');
        targetUrl = socialConfig.instagramUrl || 'https://www.instagram.com';
      }

      if (targetUrl) {
        setTimeout(() => {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }, 600);
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      showToast('⚠️ क्लिपबोर्ड कॉपी विफल। कृपया मैन्युअली टेक्स्ट कॉपी करें।');
    }
  };

  const copyOnly = async (platform) => {
    const textToCopy = platformContents[platform];
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(platform);
      setTimeout(() => setCopySuccess(''), 3000);
      showToast(`✅ ${platform.toUpperCase()} कंटेंट क्लिपबोर्ड में कॉपी हो गया!`);
    } catch (err) {
      showToast('⚠️ कॉपी विफल');
    }
  };

  // Load an existing post into Creator Studio for editing
  const loadPostForEditing = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title || '');
    setCategory(post.category || 'विकास कार्य');
    setRawContent(post.rawContent || post.rawText || '');
    setVideoUrl(post.videoUrl || '');
    setImageUrl(post.imageUrl || '');
    setTargetConstituency(post.targetConstituency || 'इटावा सदर (200)');

    if (post.platformVariants) {
      setPlatformContents({
        facebook: post.platformVariants.facebook || '',
        x: post.platformVariants.x || post.platformVariants.twitter?.text || '',
        instagram: post.platformVariants.instagram || '',
        whatsapp: post.platformVariants.whatsapp || ''
      });
    }

    setActiveTab('creator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`📝 "${post.title}" संपादन हेतु लोड हो गया है। आप यहाँ संशोधन कर सकते हैं।`);
  };

  // 6. Save & Archive Post (Create or Update)
  const handleSavePost = async (asNew = false) => {
    if (!title.trim() && !rawContent.trim()) {
      showToast('⚠️ कृपया पोस्ट का शीर्षक या विवरण अवश्य भरें');
      return;
    }

    const postPayload = {
      title: title || 'सोशल मीडिया जन-संदेश',
      category,
      rawContent,
      videoUrl,
      imageUrl,
      targetConstituency,
      platformVariants: platformContents,
      author: leaderName
    };

    try {
      setLoading(true);
      if (editingPostId && !asNew) {
        // Update existing post
        const res = await api.updateAllInOnePost(editingPostId, postPayload, leaderName);
        if (res && res.success) {
          showToast('✅ पोस्ट सफलतापूर्वक संशोधित व अपडेट कर दी गई!');
          fetchPosts();
        } else {
          showToast('⚠️ अपडेट में समस्या: ' + (res.message || ''));
        }
      } else {
        // Create new post
        const res = await api.createAllInOnePost(postPayload, leaderName);
        if (res && res.success) {
          showToast('🎉 पोस्ट सफलतापूर्वक सहेजी और आर्काइव में जुड़ गई!');
          setEditingPostId(res.post?.id || null);
          fetchPosts();
        } else {
          showToast('⚠️ पोस्ट सहेजने में समस्या: ' + (res.message || ''));
        }
      }
    } catch (err) {
      showToast('❌ त्रुटि: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 7. Delete Post from Archive
  const handleDeletePost = async (id) => {
    if (!window.confirm('क्या आप वाकई इस पोस्ट को आर्काइव से हटाना चाहते हैं?')) return;
    try {
      setLoading(true);
      const res = await api.deleteAllInOnePost(id);
      if (res && res.success) {
        showToast('🗑️ पोस्ट सफलतापूर्वक हटा दी गई');
        fetchPosts();
      }
    } catch (err) {
      showToast('❌ हटाने में त्रुटि: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 8. Save Social Config
  const handleSaveSocialConfig = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.updateAllInOneSocialConfig(socialConfig, leaderName);
      if (res && res.success) {
        showToast('✅ सोशल मीडिया हैंडल्स सफलतापूर्वक अपडेट हो गए!');
      }
    } catch (err) {
      showToast('❌ सेटिंग्स अपडेट विफल: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Share2 className="w-72 h-72 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Omnichannel Social Post Studio
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>ऑल इन वन पोस्ट क्रिएटर</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-600 text-white font-bold">
                1-Click Multi-Sync
              </span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              एक ही स्थान पर पोस्ट लिखें या <strong>बोल के रिकॉर्ड करें (Voice-to-Text)</strong>, वीडियो/फ़ोटो जोड़ें — 
              सिस्टम स्वचालित रूप से <strong>Facebook, X (Twitter), Instagram</strong> और <strong>WhatsApp</strong> के लिए अनुकूलित 
              कंटेंट तैयार कर देगा। 1-क्लिक में कॉपी करें और सोशल मीडिया पर पब्लिश करें!
            </p>
          </div>

          {/* Active Leader Badge & Navigation Tabs */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 flex items-center gap-3">
              <img
                src={leaderPhoto}
                alt={leaderName}
                className="w-11 h-11 rounded-full object-cover border-2 border-orange-500 shadow"
                onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Sarita+Bhadauria&background=f97316&color=fff'; }}
              />
              <div>
                <p className="text-xs font-bold text-white">{leaderName}</p>
                <p className="text-[11px] text-orange-400 font-medium">{leaderRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('creator')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'creator'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                क्रिएटर
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                आर्काइव ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                हैंडल्स
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: CREATOR STUDIO */}
      {activeTab === 'creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Post Composer & Input Engine (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">पोस्ट विवरण व ऑडियो कंपोज़र</h2>
                    <p className="text-xs text-slate-500">टाइप करें या माइक से बोलकर लिखें</p>
                  </div>
                </div>

                {/* Voice to text button */}
                <div className="flex items-center gap-2">
                  <select
                    value={speechLanguage}
                    onChange={(e) => setSpeechLanguage(e.target.value)}
                    className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700 outline-none"
                  >
                    <option value="hi-IN">हिंदी (Hindi)</option>
                    <option value="en-IN">English (India)</option>
                  </select>

                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        रिकॉर्डिंग रोकें
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-indigo-600" />
                        बोल के लिखें
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Active Edit Mode Alert Banner */}
              {editingPostId && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-amber-950 text-xs shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                      <Edit3 className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-900 uppercase text-[10px] tracking-wider bg-amber-200/80 px-2 py-0.5 rounded-md">
                          संपादन मोड (Editing Mode)
                        </span>
                        <span className="text-[11px] text-amber-700 font-semibold truncate">
                          आईडी: {editingPostId}
                        </span>
                      </div>
                      <p className="font-bold text-amber-950 truncate mt-0.5">
                        "{title || 'अनाम पोस्ट'}" में संशोधन किया जा रहा है
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingPostId(null);
                      setTitle('');
                      setRawContent('');
                      setVideoUrl('');
                      setImageUrl('');
                      showToast('🔄 संपादन रद्द, नई खाली पोस्ट शुरू की गई');
                    }}
                    className="px-3.5 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm shrink-0"
                    title="संपादन रद्द कर नया पोस्ट बनाएं"
                  >
                    + नई पोस्ट बनाएं (रद्द करें)
                  </button>
                </div>
              )}

              {/* Voice status banner with live interim transcription */}
              {isListening && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-xs animate-pulse">
                  <div className="flex items-center justify-between text-red-700 font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                      <span>🎙️ माइक चालू है... आप बोलिए, आपकी बात लाइव टाइप हो रही है।</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-extrabold uppercase">
                      {speechLanguage === 'hi-IN' ? 'हिंदी' : 'English'}
                    </span>
                  </div>
                  {interimText && (
                    <div className="bg-white/90 border border-red-200 rounded-xl px-3 py-1.5 text-slate-800 font-medium italic flex items-center gap-2">
                      <span className="text-[10px] text-red-600 font-bold uppercase not-italic shrink-0">पहचाना जा रहा है:</span>
                      <span className="truncate">"{interimText}"</span>
                    </div>
                  )}
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    पोस्ट शीर्षक / विषय <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="उदा. ग्राम चौपाल व नवीन सड़क शिलान्यास"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition font-medium text-slate-700"
                  >
                    <option value="विकास कार्य">🛣️ विकास कार्य व लोकार्पण</option>
                    <option value="जनसंवाद">🤝 जनसंवाद व समस्या निवारण</option>
                    <option value="बधाई व शुभकामनाएं">🎉 बधाई व शुभकामनाएं</option>
                    <option value="सरकारी योजना">💡 जनहितकारी सरकारी योजनाएं</option>
                    <option value="क्षेत्रीय दौरा">🏛️ क्षेत्रीय दौरा व जनसंपर्क</option>
                    <option value="आपातकालीन सूचना">📢 आपातकालीन व जन-सूचना</option>
                  </select>
                </div>
              </div>

              {/* Content Textarea with Emoji bar & Clear Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    विस्तृत पोस्ट विवरण (HTML / टेक्स्ट समर्थित)
                  </label>
                  <div className="flex items-center gap-2.5">
                    {rawContent && (
                      <button
                        type="button"
                        onClick={() => {
                          setRawContent('');
                          setInterimText('');
                        }}
                        className="text-[11px] text-red-500 hover:text-red-700 font-bold cursor-pointer hover:underline"
                        title="पूरा टेक्स्ट साफ़ करें"
                      >
                        ✕ टेक्स्ट साफ़ करें
                      </button>
                    )}
                    <span className="text-[11px] text-slate-400 font-semibold">
                      अक्षर: {rawContent.length}
                    </span>
                  </div>
                </div>

                {/* Quick Emojis */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-1.5 text-base">
                  <span className="text-[11px] text-slate-400 font-semibold shrink-0">त्वरित इमोजी:</span>
                  {['🚩', '🇮🇳', '🏛️', '📢', '🛣️', '🚜', '🤝', '🙏', '✨', '⚡', '💡', '🎯', '📍'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => insertEmoji(em)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-orange-100 hover:scale-110 transition cursor-pointer text-sm shrink-0"
                    >
                      {em}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={6}
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="यहाँ पोस्ट की पूरी जानकारी लिखें या ऊपर दिए गए 'बोल के लिखें' बटन पर क्लिक करके हिंदी में डिक्टेट करें..."
                  className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition font-normal leading-relaxed"
                />
              </div>

              {/* Media Attachments: Video & Image */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Video className="w-4 h-4 text-orange-600" />
                  <span>वीडियो एवं मीडिया अटैचमेंट</span>
                </div>

                {/* Video URL or File */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      वीडियो लिंक (YouTube / Reel / MP4 URL)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://youtu.be/... या वीडियो URL"
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      या डायरेक्ट वीडियो फ़ाइल अपलोड करें
                    </label>
                    <label className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isUploadingMedia ? 'अपलोड हो रहा है...' : 'वीडियो फ़ाइल चुनें (.mp4)'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={isUploadingMedia}
                      />
                    </label>
                  </div>
                </div>

                {/* Image / Banner URL or File */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      फ़ोटो / बैनर लिंक
                    </label>
                    <div className="relative">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://... फ़ोटो URL"
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      या बैनर फ़ोटो अपलोड करें
                    </label>
                    <label className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isUploadingMedia ? 'अपलोड हो रहा है...' : 'फ़ोटो फ़ाइल चुनें (.jpg/.png)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingMedia}
                      />
                    </label>
                  </div>
                </div>

                {/* Media Preview Box */}
                {(videoUrl || imageUrl) && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>मीडिया प्रीव्यू अटैचमेंट:</span>
                      <button
                        type="button"
                        onClick={() => { setVideoUrl(''); setImageUrl(''); }}
                        className="text-red-500 hover:text-red-700 text-[11px]"
                      >
                        हटाएं
                      </button>
                    </div>

                    {videoUrl && (
                      <div className="text-xs text-blue-600 font-medium truncate flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5" />
                        <span>वीडियो: {videoUrl}</span>
                      </div>
                    )}
                    {imageUrl && (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons: Save & Archive */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPostId(null);
                    setTitle('');
                    setRawContent('');
                    setVideoUrl('');
                    setImageUrl('');
                    showToast('नया पोस्ट मोड रीसेट हुआ');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  {editingPostId ? '✕ संपादन रद्द करें' : 'रीसेट करें'}
                </button>

                <div className="flex items-center gap-2">
                  {editingPostId && (
                    <button
                      type="button"
                      onClick={() => handleSavePost(true)}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer border border-slate-300"
                      title="मूल पोस्ट बदले बिना इसे नई पोस्ट के रूप में सहेजें"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>नई कॉपी बनाएं</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSavePost(false)}
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer ${
                      editingPostId
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${editingPostId ? 'text-white' : 'text-orange-400'}`} />
                    <span>{editingPostId ? '💾 संशोधन अपडेट करें (Update Post)' : 'आर्काइव में सुरक्षित करें'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Multi-Platform Generator & Interactive Simulator (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
              
              {/* Platform Selector Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">सोशल मीडिया लाइव प्रीव्यू व शेयर</h2>
                    <p className="text-xs text-slate-500">प्लेटफ़ॉर्म चुनें, कॉपी करें व सीधे रीडायरेक्ट हों</p>
                  </div>
                </div>
              </div>

              {/* Platform Switcher Pills */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setActivePreviewPlatform('facebook')}
                  className={`py-2 px-1 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                    activePreviewPlatform === 'facebook'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </button>

                <button
                  onClick={() => setActivePreviewPlatform('x')}
                  className={`py-2 px-1 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                    activePreviewPlatform === 'x'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Twitter className="w-4 h-4" />
                  <div className="flex items-center gap-1">
                    <span>X (Twitter)</span>
                  </div>
                </button>

                <button
                  onClick={() => setActivePreviewPlatform('instagram')}
                  className={`py-2 px-1 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                    activePreviewPlatform === 'instagram'
                      ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border-pink-500 text-pink-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </button>

                <button
                  onClick={() => setActivePreviewPlatform('whatsapp')}
                  className={`py-2 px-1 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                    activePreviewPlatform === 'whatsapp'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* 1-CLICK ACTION BAR FOR CURRENT PLATFORM */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-orange-950 block">
                    {activePreviewPlatform === 'facebook' && '📘 फेसबुक के लिए पूर्ण कंटेंट तैयार है'}
                    {activePreviewPlatform === 'x' && '𝕏 ट्विटर/X के लिए 280-कैरेक्टर पोस्ट तैयार है'}
                    {activePreviewPlatform === 'instagram' && '📷 इंस्टाग्राम के लिए कैप्शन व हैशटैग तैयार है'}
                    {activePreviewPlatform === 'whatsapp' && '💬 व्हाट्सएप के लिए बोल्ड व बुलेट मैसेज तैयार है'}
                  </span>
                  <span className="text-orange-700 text-[11px]">
                    क्लिक करते ही टेक्स्ट क्लिपबोर्ड पर कॉपी हो जाएगा और सीधे सोशल मीडिया खुल जाएगा।
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => copyOnly(activePreviewPlatform)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                    title="केवल क्लिपबोर्ड में कॉपी करें"
                  >
                    {copySuccess === activePreviewPlatform ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                    <span>केवल कॉपी</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyAndRedirect(activePreviewPlatform)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>कॉपी करें व जाएँ</span>
                  </button>
                </div>
              </div>

              {/* X TWITTER SPECIFIC: 280 CHARACTERS PROGRESS BAR */}
              {activePreviewPlatform === 'x' && (
                <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>X कैरेक्टर सीमा (Character Limit):</span>
                    <span className={platformContents.x.length > 280 ? 'text-red-400' : 'text-emerald-400'}>
                      {platformContents.x.length} / 280
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        platformContents.x.length > 280 ? 'bg-red-500' : 'bg-blue-400'
                      }`}
                      style={{ width: `${Math.min(100, (platformContents.x.length / 280) * 100)}%` }}
                    ></div>
                  </div>
                  {platformContents.x.length > 280 && (
                    <p className="text-[11px] text-red-300">
                      ⚠️ टेक्स्ट 280 अक्षरों से अधिक है। कृपया नीचे बॉक्स में इसे थोड़ा संक्षिप्त करें।
                    </p>
                  )}
                </div>
              )}

              {/* EDITABLE ADAPTED TEXTAREA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  अनुकूलित टेक्स्ट (आप चाहें तो यहाँ व्यक्तिगत बदलाव भी कर सकते हैं):
                </label>
                <textarea
                  rows={5}
                  value={platformContents[activePreviewPlatform]}
                  onChange={(e) =>
                    setPlatformContents((prev) => ({
                      ...prev,
                      [activePreviewPlatform]: e.target.value
                    }))
                  }
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 font-mono text-slate-800 leading-relaxed outline-none"
                />
              </div>

              {/* INTERACTIVE HIGH-FIDELITY SIMULATOR CARDS */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span>लाइव सोशल मीडिया स्क्रीन प्रीव्यू:</span>
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">
                    {activePreviewPlatform} SIMULATOR
                  </span>
                </div>

                {/* 1. FACEBOOK SIMULATOR CARD */}
                {activePreviewPlatform === 'facebook' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 space-y-3 font-sans">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={leaderPhoto}
                          alt={leaderName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Sarita+Bhadauria'; }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{leaderName}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-600 text-white" />
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <span>Just now</span>
                            <span>•</span>
                            <Globe className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </div>

                    <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                      {platformContents.facebook || 'फेसबुक पोस्ट विवरण यहाँ दिखाई देगा...'}
                    </div>

                    {imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-100 max-h-56 bg-slate-900">
                        <img src={imageUrl} alt="Post banner" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {videoUrl && !imageUrl && (
                      <div className="rounded-xl p-3 bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs text-blue-600">
                        <Play className="w-4 h-4" />
                        <span className="truncate">अटैच वीडियो लिंक: {videoUrl}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs px-2">
                      <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer">
                        <ThumbsUp className="w-4 h-4" /> Like
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer">
                        <MessageSquare className="w-4 h-4" /> Comment
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer">
                        <Share2 className="w-4 h-4" /> Share
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. X (TWITTER) SIMULATOR CARD */}
                {activePreviewPlatform === 'x' && (
                  <div className="bg-black text-white rounded-2xl p-4 space-y-3 font-sans border border-slate-800 shadow-md">
                    <div className="flex items-start gap-3">
                      <img
                        src={leaderPhoto}
                        alt={leaderName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Sarita+Bhadauria'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">{leaderName}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400 text-black shrink-0" />
                          <span className="text-[11px] text-slate-400 truncate">{socialConfig.xHandle || '@mlasarita'}</span>
                          <span className="text-[11px] text-slate-500">• 1m</span>
                        </div>

                        <div className="text-xs text-slate-100 whitespace-pre-line leading-relaxed mt-1.5">
                          {platformContents.x || 'X (Twitter) पोस्ट यहाँ दिखाई देगी...'}
                        </div>

                        {imageUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 max-h-48">
                            <img src={imageUrl} alt="Tweet Media" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-slate-400 text-xs mt-3 pt-2 border-t border-slate-800">
                          <span className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                            <MessageCircle className="w-3.5 h-3.5" /> 12
                          </span>
                          <span className="flex items-center gap-1.5 hover:text-green-400 cursor-pointer">
                            <Repeat2 className="w-3.5 h-3.5" /> 48
                          </span>
                          <span className="flex items-center gap-1.5 hover:text-rose-400 cursor-pointer">
                            <Heart className="w-3.5 h-3.5" /> 254
                          </span>
                          <span className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                            <Share2 className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. INSTAGRAM SIMULATOR CARD */}
                {activePreviewPlatform === 'instagram' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden font-sans">
                    <div className="p-3 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                          <img
                            src={leaderPhoto}
                            alt={leaderName}
                            className="w-full h-full rounded-full object-cover border border-white"
                            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Sarita+Bhadauria'; }}
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">
                            saritabhadauria_mla
                          </span>
                          <span className="text-[10px] text-slate-500">इटावा सदर 200</span>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="w-full h-48 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Instagram preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4 text-slate-400 space-y-1">
                          <ImageIcon className="w-8 h-8 mx-auto text-slate-500" />
                          <p className="text-xs font-bold text-white">{title || 'Instagram Visual Post'}</p>
                          <p className="text-[10px] text-slate-400">फ़ोटो या वीडियो थंबनेल</p>
                        </div>
                      )}
                    </div>

                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-slate-800">
                          <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer" />
                          <MessageCircle className="w-5 h-5 cursor-pointer" />
                          <Send className="w-5 h-5 cursor-pointer" />
                        </div>
                        <Bookmark className="w-5 h-5 text-slate-800 cursor-pointer" />
                      </div>

                      <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto pr-1">
                        <span className="font-bold mr-1.5">saritabhadauria_mla</span>
                        {platformContents.instagram || 'इंस्टाग्राम कैप्शन यहाँ दिखाई देगा...'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. WHATSAPP SIMULATOR CARD */}
                {activePreviewPlatform === 'whatsapp' && (
                  <div className="rounded-2xl border border-emerald-200 shadow-md p-4 bg-[#EFEAE2] font-sans relative overflow-hidden">
                    <div className="bg-emerald-800 text-white px-3 py-2 -mx-4 -mt-4 mb-3 flex items-center gap-2.5 shadow-sm">
                      <img
                        src={leaderPhoto}
                        alt={leaderName}
                        className="w-7 h-7 rounded-full object-cover border border-emerald-400"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Sarita+Bhadauria'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{leaderName} (जनसंपर्क ग्रुप)</p>
                        <p className="text-[10px] text-emerald-200">online</p>
                      </div>
                    </div>

                    <div className="max-w-[90%] ml-auto bg-[#DCF8C6] rounded-2xl rounded-tr-xs p-3 shadow text-xs text-slate-900 whitespace-pre-line leading-relaxed relative border border-emerald-200/50">
                      {platformContents.whatsapp || 'व्हाट्सएप संदेश यहाँ दिखाई देगा...'}
                      
                      <div className="text-[10px] text-slate-500 text-right mt-1.5 flex items-center justify-end gap-1">
                        <span>10:45 AM</span>
                        <span className="text-blue-500 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: POST HISTORY & ARCHIVE */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800">आर्काइव व पूर्व में बनाई गई पोस्ट्स ({posts.length})</h2>
              <p className="text-xs text-slate-500">किसी भी पूर्व पोस्ट के टेक्स्ट को 1-क्लिक में दोबारा कॉपी करें</p>
            </div>

            <button
              onClick={fetchPosts}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> रिफ्रेश करें
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <History className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold">अभी कोई पोस्ट आर्काइव में नहीं है</p>
              <p className="text-xs">नया पोस्ट बनाने के लिए 'क्रिएटर' टैब का उपयोग करें।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                const isCurrentEditing = editingPostId === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => loadPostForEditing(post)}
                    className={`bg-slate-50 border rounded-2xl p-4 transition space-y-3 cursor-pointer group ${
                      isCurrentEditing
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/40'
                        : 'border-slate-200 hover:border-orange-400 hover:bg-orange-50/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold uppercase tracking-wider">
                            {post.category || 'विकास कार्य'}
                          </span>
                          {isCurrentEditing && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-black uppercase tracking-wider animate-pulse">
                              सक्रिय संपादन
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            (क्लिक करके मॉडिफाई करें)
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-[11px] text-slate-500">
                          तारीख: {new Date(post.createdAt || Date.now()).toLocaleDateString('hi-IN')} • लेखक: {post.author || leaderName}
                        </p>
                      </div>

                      {/* Header Actions: Edit & Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            loadPostForEditing(post);
                          }}
                          className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                          title="पोस्ट को मॉडिफाई व एडिट करें"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(post.id);
                          }}
                          className="w-8 h-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                          title="आर्काइव से हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content Display (Collapsible / Expandable) */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2">
                      <p className={`text-xs text-slate-700 leading-relaxed ${isExpanded ? 'whitespace-pre-line' : 'line-clamp-3'}`}>
                        {post.rawContent || post.rawText}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedPostId(isExpanded ? null : post.id);
                          }}
                          className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'संक्षिप्त करें' : 'पूरा आर्टिकल पढ़ें'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            loadPostForEditing(post);
                          }}
                          className="font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>एडिटर में लोड करें व बदलें →</span>
                        </button>
                      </div>
                    </div>

                    {/* 1-Click Copy Buttons per Platform & Edit Action */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadPostForEditing(post);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>संपादित व मॉडिफाई करें</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 mr-1">त्वरित कॉपी:</span>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const text = post.platformVariants?.facebook || post.rawContent;
                            await navigator.clipboard.writeText(text);
                            showToast('✅ फेसबुक कंटेंट कॉपी हुआ!');
                          }}
                          className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-blue-600 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Facebook className="w-3 h-3" /> FB
                        </button>

                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const text = post.platformVariants?.x || post.rawContent;
                            await navigator.clipboard.writeText(text);
                            showToast('✅ X (Twitter) कंटेंट कॉपी हुआ!');
                          }}
                          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-black rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Twitter className="w-3 h-3" /> X
                        </button>

                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const text = post.platformVariants?.instagram || post.rawContent;
                            await navigator.clipboard.writeText(text);
                            showToast('✅ इंस्टाग्राम कैप्शन कॉपी हुआ!');
                          }}
                          className="px-2 py-1 bg-white hover:bg-pink-50 border border-slate-200 text-pink-600 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Instagram className="w-3 h-3" /> IG
                        </button>

                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const text = post.platformVariants?.whatsapp || post.rawContent;
                            await navigator.clipboard.writeText(text);
                            showToast('✅ व्हाट्सएप मैसेज कॉपी हुआ!');
                          }}
                          className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 text-emerald-600 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" /> WA
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SOCIAL MEDIA PROFILE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-600" />
              <span>सोशल मीडिया प्रोफाइल्स व हैंडल्स कॉन्फ़िगरेशन</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              यहाँ अपने आधिकारिक सोशल मीडिया लिंक्स दर्ज करें। जब भी आप किसी पोस्ट को 'कॉपी करें व जाएँ' पर क्लिक करेंगे, 
              तो सिस्टम सीधे इन्हीं प्रोफाइल्स पर रीडायरेक्ट करेगा।
            </p>
          </div>

          <form onSubmit={handleSaveSocialConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook पेज URL</span>
              </label>
              <input
                type="url"
                value={socialConfig.facebookPageUrl}
                onChange={(e) => setSocialConfig({ ...socialConfig, facebookPageUrl: e.target.value })}
                placeholder="https://facebook.com/yourpagename"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Twitter className="w-4 h-4 text-slate-900" />
                  <span>X (Twitter) हैंडल</span>
                </label>
                <input
                  type="text"
                  value={socialConfig.xHandle}
                  onChange={(e) => setSocialConfig({ ...socialConfig, xHandle: e.target.value })}
                  placeholder="@mlasarita"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram प्रोफाइल URL</span>
                </label>
                <input
                  type="url"
                  value={socialConfig.instagramUrl}
                  onChange={(e) => setSocialConfig({ ...socialConfig, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp हेल्पलाइन नंबर (कंट्री कोड सहित)</span>
                </label>
                <input
                  type="text"
                  value={socialConfig.whatsappNumber}
                  onChange={(e) => setSocialConfig({ ...socialConfig, whatsappNumber: e.target.value })}
                  placeholder="919415045678"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube चैनल लिंक</span>
                </label>
                <input
                  type="url"
                  value={socialConfig.youtubeChannelUrl}
                  onChange={(e) => setSocialConfig({ ...socialConfig, youtubeChannelUrl: e.target.value })}
                  placeholder="https://youtube.com/@channel"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                सेटिंग्स सुरक्षित करें (Save Handles)
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
