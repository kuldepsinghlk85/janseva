import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import Navbar from '../components/public/Navbar';
import FestivalBanner from '../components/public/FestivalBanner';
import FooterPanorama from '../components/public/FooterPanorama';
import VoiceInputButton from '../components/common/VoiceInputButton';
import KnowYourConstituency from '../components/public/KnowYourConstituency';
import {
  ArrowLeft,
  Search,
  MapPin,
  Home,
  Building2,
  Users,
  CheckCircle2,
  Share2,
  Layers,
  Compass,
  FileText
} from 'lucide-react';

export default function PublicConstituencyPage() {
  const { navigateToPublicPage } = useApp();
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultVillages = [
    { id: 1, nameHi: 'इटावा नगर (वार्ड 1-40)', block: 'इटावा सदर', voters: '1,85,000+', panchayat: 'नगर पालिका परिषद', works: 34 },
    { id: 2, nameHi: 'रामपुर', block: 'इटावा सदर', voters: '4,200', panchayat: 'ग्राम पंचायत रामपुर', works: 8 },
    { id: 3, nameHi: 'सैफई', block: 'सैफई', voters: '6,500', panchayat: 'ग्राम पंचायत सैफई', works: 12 },
    { id: 4, nameHi: 'बकेवर', block: 'भरथना', voters: '8,900', panchayat: 'नगर पंचायत बकेवर', works: 14 },
    { id: 5, nameHi: 'तकरोई', block: 'इटावा सदर', voters: '3,800', panchayat: 'ग्राम पंचायत तकरोई', works: 6 },
    { id: 6, nameHi: 'पिलखर', block: 'इटावा सदर', voters: '5,100', panchayat: 'ग्राम पंचायत पिलखर', works: 7 },
    { id: 7, nameHi: 'जसवंतनगर', block: 'जसवंतनगर', voters: '28,000+', panchayat: 'नगर पालिका जसवंतनगर', works: 18 },
    { id: 8, nameHi: 'भरथना', block: 'भरथना', voters: '32,000+', panchayat: 'नगर पालिका भरथना', works: 21 },
    { id: 9, nameHi: 'वैदपुरा', block: 'सैफई', voters: '4,600', panchayat: 'ग्राम पंचायत वैदपुरा', works: 5 },
    { id: 10, nameHi: 'पिपरोली', block: 'इटावा सदर', voters: '2,900', panchayat: 'ग्राम पंचायत पिपरोली', works: 4 },
    { id: 11, nameHi: 'उदी मोड़', block: 'बढ़पुरा', voters: '5,400', panchayat: 'ग्राम पंचायत उदी', works: 9 },
    { id: 12, nameHi: 'चंबल किनारा मजरा', block: 'बढ़पुरा', voters: '1,800', panchayat: 'ग्राम पंचायत बढ़पुरा', works: 3 }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getVillages();
        if (res && res.success && res.data && res.data.length > 0) {
          setVillages(res.data);
        } else {
          setVillages(defaultVillages);
        }
      } catch (e) {
        setVillages(defaultVillages);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const blocks = ['All', 'इटावा सदर', 'सैफई', 'भरथना', 'जसवंतनगर', 'बढ़पुरा'];

  const filtered = villages.filter((v) => {
    const vName = v.nameHi || v.name || '';
    const vBlock = v.block || '';
    const matchesBlock = selectedBlock === 'All' || vBlock.includes(selectedBlock);
    const matchesSearch =
      !searchQuery ||
      vName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vBlock.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBlock && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <FestivalBanner />
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigateToPublicPage('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all backdrop-blur-sm border border-white/30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← मुख्य पृष्ठ पर वापस जाएं</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-teal-200">
              <button onClick={() => navigateToPublicPage('home')} className="hover:underline flex items-center gap-1 cursor-pointer">
                <Home className="w-3.5 h-3.5" /> मुख्य पृष्ठ
              </button>
              <span>/</span>
              <span className="text-white font-semibold">विधानसभा क्षेत्र इटावा (200)</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-teal-100 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-sm">
              <Compass className="w-3.5 h-3.5" /> निर्वाचन क्षेत्र प्रोफाइल
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
              हमारा विधानसभा क्षेत्र – इटावा (200) एवं समस्त गांव डायरेक्टरी
            </h1>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              यमुना-चंबल के पावन संगम की ऐतिहासिक भूमि। 229 ग्राम पंचायतें, 4 नगर निकाय एवं 250+ गांवों का विस्तृत जनसांख्यिकी एवं विकास ब्यौरा।
            </p>
          </div>
        </div>
      </div>

      {/* Key Stats Row */}
      <div className="max-w-7xl mx-auto px-4 -mt-5 mb-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-500 uppercase">नगर निकाय</span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">4 निकाय</p>
            <p className="text-[11px] text-teal-600 mt-0.5">इटावा, बकेवर, जसवंतनगर, भरथना</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-500 uppercase">ग्राम पंचायतें</span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">229 पंचायतें</p>
            <p className="text-[11px] text-teal-600 mt-0.5">100% विद्युतीकृत एवं सड़क नेटवर्क</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-500 uppercase">गांव / मजरे</span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">~350 गांव</p>
            <p className="text-[11px] text-teal-600 mt-0.5">सक्रिय ग्राम प्रधान एवं सचिव</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-500 uppercase">कुल जनसंख्या</span>
            <p className="text-xl sm:text-2xl font-black text-teal-700 mt-1">5.4 लाख+</p>
            <p className="text-[11px] text-teal-600 mt-0.5">3.85 लाख+ पंजीकृत मतदाता</p>
          </div>
        </div>
      </div>

      {/* Know Your Constituency & Interactive Village GIS Explorer */}
      <div className="mb-6">
        <KnowYourConstituency />
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="गांव, मजरा या ब्लॉक का नाम खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputButton
                  onTranscript={(text) => setSearchQuery((prev) => (prev ? `${prev} ${text}` : text))}
                  className="p-1 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                />
              </div>
            </div>

            {/* Block Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {blocks.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBlock(b)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedBlock === b
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {b === 'All' ? 'सभी ब्लॉक' : b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Villages Directory Grid & Map Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Villages Directory (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900 text-lg">
                गांव एवं वार्ड सूची ({filtered.length})
              </h3>
              <span className="text-xs text-slate-500">
                इटावा सदर 200 क्षेत्र
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span>{v.nameHi || v.name}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ब्लॉक: <span className="font-semibold text-slate-700">{v.block || 'इटावा'}</span>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold">
                      {v.panchayat || 'ग्राम पंचायत'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>मतदाता: <strong className="text-slate-900">{v.voters || '3,500+'}</strong></span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {v.works || 5}+ विकास कार्य
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Map & Geography Visual (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-600" />
                <span>विधानसभा क्षेत्र मानचित्र</span>
              </h3>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-teal-50/40 p-2">
                <img
                  src="/images/assets/etawah_map_badge.jpg"
                  alt="इटावा मानचित्र"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = '/images/poli3.png'; }}
                />
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>भौगोलिक स्थिति:</strong> उत्तर प्रदेश का पश्चिमी-मध्य भाग, यमुना एवं चंबल नदियों के दोआब में स्थित।
                </p>
                <p>
                  <strong>प्रमुख संपर्क मार्ग:</strong> आगरा-लखनऊ एक्सप्रेसवे, राष्ट्रीय राजमार्ग 19, बुंदेलखंड एक्सप्रेसवे जंक्शन।
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Back to Home CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateToPublicPage('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
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
