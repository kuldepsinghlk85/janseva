import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Quote, CheckCircle2, UserPlus } from 'lucide-react';
import HeroPosterSlider from './HeroPosterSlider';

export default function HeroSection() {
  const { settings, mla, setShowQrModal, navigateToPublicPage } = useApp();
  const hero = settings?.hero || {};

  // If hero is disabled in settings or Section Manager
  if (hero.show === false) return null;

  const saritaImg = hero.saritaImage || '/images/assets/sarita_bhadauria_hero.jpg';
  const modiImg = hero.modiImage || '/images/assets/modi_portrait.jpg';
  const yogiImg = hero.yogiImage || '/images/assets/yogi_portrait.jpg';

  const handleScrollToJourney = (e) => {
    e?.preventDefault();
    if (navigateToPublicPage) {
      navigateToPublicPage('timeline');
    }
  };

  const handleJoinUs = (e) => {
    e?.preventDefault();
    setShowQrModal(true);
    const target = document.getElementById('citizen-connect');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-b from-orange-50/60 via-amber-50/20 to-white pt-6 pb-10 border-b border-slate-200 overflow-hidden">
      {/* Background Decorative River Ghat / Bridge Panorama Illustration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.12),transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Col 1: Smt. Sarita Bhadauria Portrait (Image 2 Left - 4 cols) */}
          <div id="about" className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500 via-amber-400 to-green-600 rounded-3xl blur-md opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative w-64 sm:w-72 md:w-80 h-[360px] sm:h-[400px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-t from-orange-600/20 to-transparent flex items-end">
                <img
                  src={saritaImg}
                  alt={mla?.name || 'श्रीमती सरिता भदौरिया'}
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-700"
                  onError={(e) => { e.target.src = '/images/poli4.png'; }}
                />
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-center">
                  <div className="text-sm font-extrabold">{hero.signature || mla?.name || 'श्रीमती सरिता भदौरिया'}</div>
                  <div className="text-[10px] text-orange-200 font-semibold">{hero.designation || mla?.title || 'विधायक, इटावा विधानसभा (200)'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Center Headline, Slogans & CTA (4 cols) */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-4">
            
            {/* Main Headline (Dynamic with Admin Settings) */}
            <div className="space-y-2">
              {hero.title ? (
                hero.title.split('\n').map((line, idx) => (
                  <div key={idx} className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {line.startsWith('“') ? line : `“${line}”`}
                  </div>
                ))
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    “विकास ही मेरी प्राथमिकता है,
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    और जनता ही मेरी शक्ति।”
                  </div>
                </>
              )}
              {hero.subtitle && (
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                  {hero.subtitle}
                </p>
              )}
            </div>

            {/* Slogan Banner */}
            <div className="pt-1">
              <h3 className="text-lg font-black text-orange-700">
                — {hero.signature || mla?.name || 'श्रीमती सरिता भदौरिया'}
              </h3>
              <p className="text-xs font-bold text-slate-600">
                {hero.designation || mla?.title || 'विधायक, इटावा विधानसभा (200)'}
              </p>
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={handleJoinUs}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none"
              >
                <span>{hero.ctaPrimaryText || 'जनसेवा से जुड़ें →'}</span>
              </button>

              <button
                type="button"
                onClick={handleScrollToJourney}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/90 hover:bg-orange-50 text-slate-800 hover:text-orange-700 font-bold text-sm border border-slate-300 hover:border-orange-300 shadow-sm transition cursor-pointer select-none active:scale-95 backdrop-blur-xs"
              >
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">▶</span>
                <span>{hero.ctaSecondaryText || 'हमारी कहानी देखें'}</span>
              </button>
            </div>
          </div>

          {/* Col 3: Right Hero Poster Slider & Leadership Strip (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            {/* Auto-sliding Vertical Posters (4 to 6 admin-managed posters) */}
            <HeroPosterSlider />

            {/* Sleek Leadership Banner underneath Poster Slider */}
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 border border-orange-200/80 shadow-xs flex items-center justify-between gap-2 text-left">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <img
                  src={modiImg}
                  alt="नरेन्द्र मोदी"
                  className="w-8 h-8 rounded-full border border-orange-400 object-cover object-top flex-shrink-0"
                  onError={(e) => { e.target.src = '/images/media_1789495695592.jpg'; }}
                />
                <div className="truncate">
                  <div className="text-[10px] font-black text-slate-800 truncate">नरेन्द्र मोदी</div>
                  <div className="text-[9px] text-orange-600 font-semibold truncate">“{hero.modiQuote || 'विकसित भारत'}”</div>
                </div>
              </div>

              <div className="w-[1px] h-6 bg-slate-200"></div>

              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <img
                  src={yogiImg}
                  alt="योगी आदित्यनाथ"
                  className="w-8 h-8 rounded-full border border-orange-500 object-cover object-top flex-shrink-0"
                  onError={(e) => { e.target.src = '/images/media_1789495695592.jpg'; }}
                />
                <div className="truncate">
                  <div className="text-[10px] font-black text-slate-800 truncate">योगी आदित्यनाथ</div>
                  <div className="text-[9px] text-orange-600 font-semibold truncate">“{hero.yogiQuote || 'समृद्ध उ.प्र.'}”</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
