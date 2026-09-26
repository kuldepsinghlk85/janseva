import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import Navbar from '../components/public/Navbar';
import FestivalBanner from '../components/public/FestivalBanner';
import FooterPanorama from '../components/public/FooterPanorama';
import VoiceInputButton from '../components/common/VoiceInputButton';
import {
  ArrowLeft,
  Search,
  Share2,
  Heart,
  MessageCircle,
  Repeat2,
  ExternalLink,
  Home,
  Instagram,
  Facebook,
  Youtube,
  Send,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function PublicSocialPage() {
  const { navigateToPublicPage } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultPosts = [
    {
      id: 'p1',
      platform: 'instagram',
      author: 'सरिता भदौरिया (@mlaetawah)',
      handle: '@mlaetawah',
      date: '2 घंटे पहले',
      media: '/images/assets/work_rampur_road.jpg',
      content: 'आज ग्राम रामपुर में नवनिर्मित संपर्क मार्ग का विधिवत लोकार्पण कर क्षेत्रवासियों को समर्पित किया। विकास की अविरल धारा से हर गांव को जोड़ना ही हमारा ध्येय है। #Etawah200 #SaritaBhadauria #VikasKiGanga',
      likes: '4.8K',
      comments: '342',
      shares: '210',
      url: 'https://www.instagram.com/mlaetawah/?hl=en'
    },
    {
      id: 'p2',
      platform: 'facebook',
      author: 'Sarita Bhadauria (विधायक इटावा सदर)',
      handle: 'mlaetawah',
      date: '5 घंटे पहले',
      media: '/images/assets/work_school_children.jpg',
      content: 'राजकीय बालिका इंटर कॉलेज में ऑपरेशन कायाकल्प के अंतर्गत आधुनिक स्मार्ट कक्षाओं का निरीक्षण कर नौनिहालों से संवाद किया। बेटियां पढ़ेंगी तभी देश आगे बढ़ेगा। #BetiBachaoBetiPadhao',
      likes: '6.2K',
      comments: '512',
      shares: '380',
      url: 'https://www.facebook.com/mlaetawah'
    },
    {
      id: 'p3',
      platform: 'youtube',
      author: 'MLA Etawah Official',
      handle: 'MLA Etawah',
      date: '1 दिन पहले',
      media: '/images/assets/social_rally.jpg',
      content: 'इटावा नगर विधानसभा 200: विकास के 7 वर्ष, जनता का विश्वास। जनसंवाद चौपाल एवं विकास समीक्षा बैठक का मुख्य अंश। पूरा वीडियो चैनल पर देखें।',
      likes: '8.9K',
      comments: '420',
      shares: '640',
      url: 'https://www.youtube.com'
    },
    {
      id: 'p4',
      platform: 'twitter',
      author: 'Sarita Bhadauria MLA',
      handle: '@mlaetawah',
      date: '1 दिन पहले',
      media: '/images/assets/work_health_camp.jpg',
      content: 'पिलखर प्राथमिक स्वास्थ्य केंद्र में 24x7 इमरजेंसी सेवाओं एवं अत्याधुनिक पैथोलॉजी का शुभारंभ। जन-जन का उत्तम स्वास्थ्य ही हमारी सर्वोच्च प्राथमिकता है। #AyushmanBharat',
      likes: '3.4K',
      comments: '185',
      shares: '290',
      url: 'https://twitter.com'
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getSocialPosts();
        if (res && res.success && res.posts && res.posts.length > 0) {
          setPosts(res.posts);
        } else {
          setPosts(defaultPosts);
        }
      } catch (e) {
        setPosts(defaultPosts);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const platforms = [
    { key: 'All', label: 'सभी मंच' },
    { key: 'telegram', label: 'Telegram (t.me/sarrita8)' },
    { key: 'instagram', label: 'Instagram (@mlaetawah)' },
    { key: 'facebook', label: 'Facebook (mlaetawah)' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'twitter', label: 'X (Twitter)' }
  ];

  const filteredPosts = posts.filter((p) => {
    const matchesPlatform = selectedPlatform === 'All' || p.platform?.toLowerCase() === selectedPlatform.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const handleShareWhatsApp = (item) => {
    const text = `*${item.author}*\n\n"${item.content}"\n\nमूल पोस्ट देखें: ${item.url || 'https://www.instagram.com/mlaetawah/?hl=en'}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <FestivalBanner />
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigateToPublicPage('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all backdrop-blur-sm border border-white/30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← मुख्य पृष्ठ पर वापस जाएं</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-rose-100">
              <button onClick={() => navigateToPublicPage('home')} className="hover:underline flex items-center gap-1 cursor-pointer">
                <Home className="w-3.5 h-3.5" /> मुख्य पृष्ठ
              </button>
              <span>/</span>
              <span className="text-white font-semibold">सोशल मीडिया केंद्र</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-rose-100 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> डिजिटल जनसंवाद
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
              आधिकारिक सोशल मीडिया केंद्र – हर मंच पर, जनता के साथ
            </h1>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
              विधायक श्रीमती सरिता भदौरिया के आधिकारिक Telegram (t.me/sarrita8), Instagram (@mlaetawah), Facebook, YouTube एवं X हैंडल्स से प्रतिदिन प्रकाशित पोस्ट्स, वीडियो एवं जन-सरोकार।
            </p>
          </div>
        </div>
      </div>

      {/* Profiles Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-5 mb-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            <a
              href="https://t.me/sarrita8"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-sky-600" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">Telegram</h4>
                  <p className="text-[10px] text-sky-700 font-bold">t.me/sarrita8</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
            </a>

            <a
              href="https://www.instagram.com/mlaetawah/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">Instagram</h4>
                  <p className="text-[10px] text-pink-700 font-bold">@mlaetawah</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-pink-600" />
            </a>

            <a
              href="https://www.facebook.com/mlaetawah"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">Facebook</h4>
                  <p className="text-[10px] text-blue-700 font-bold">/mlaetawah</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            </a>

            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">YouTube</h4>
                  <p className="text-[10px] text-red-700 font-bold">MLA Etawah</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-red-600" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">𝕏</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900">X (Twitter)</h4>
                  <p className="text-[10px] text-slate-700 font-bold">@mlaetawah</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            </a>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-3 border-t border-slate-100">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="पोस्ट या विषय खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputButton
                  onTranscript={(text) => setSearchQuery((prev) => (prev ? `${prev} ${text}` : text))}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                />
              </div>
            </div>

            {/* Platform Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
              {platforms.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPlatform(p.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedPlatform === p.key
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src="/images/assets/sarita_bhadauria_hero.jpg"
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-rose-300 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.author}</h4>
                      <p className="text-[10px] text-slate-400">{item.date || 'हालिया'}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    item.platform === 'telegram'
                      ? 'bg-sky-100 text-sky-700 border border-sky-200'
                      : item.platform === 'instagram'
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : item.platform === 'facebook'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.platform}
                  </span>
                </div>

                {/* Media Image */}
                {item.media && (
                  <div className="aspect-video sm:aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={item.media}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => { e.target.src = '/images/assets/work_rampur_road.jpg'; }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-4">
                    {item.content}
                  </p>
                </div>
              </div>

              {/* Footer Metrics & Actions */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1 text-rose-600 font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    {item.likes || '4.2K'}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 font-semibold">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {item.comments || '310'}
                  </span>
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <Repeat2 className="w-3.5 h-3.5" />
                    {item.shares || '180'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={item.url || 'https://www.instagram.com/mlaetawah/?hl=en'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>मूल पोस्ट</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleShareWhatsApp(item)}
                    className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateToPublicPage('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← मुख्य पृष्ठ पर वापस जाएं</span>
          </button>
        </div>
      </div>

      <FooterPanorama />
    </div>
  );
}
