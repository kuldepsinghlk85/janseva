import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function BottomBanner() {
  const { settings } = useApp();
  const trioImg = settings?.hero?.bgPanorama || '/images/assets/bottom_leaders_trio.jpg';

  return (
    <section className="bg-gradient-to-r from-orange-600 via-amber-600 to-green-700 py-6 text-white relative overflow-hidden shadow-inner">
      {/* Decorative subtle patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Trio Portrait cropped from image 2 */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/60 bg-white/20 p-1">
              <img
                src={trioImg}
                alt="माननीय प्रधानमंत्री नरेंद्र मोदी, मुख्यमंत्री योगी आदित्यनाथ एवं विधायक सरिता भदौरिया"
                className="h-28 sm:h-32 w-auto object-cover rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-black/30 backdrop-blur px-2.5 py-1 rounded-full text-amber-200 inline-block mb-1">
                संकल्प से सिद्धि
              </span>
              <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                डबल इंजन सरकार
              </h4>
              <p className="text-xs text-orange-100 font-medium">
                अग्रणी इटावा, स्वर्णिम उत्तर प्रदेश
              </p>
            </div>
          </div>

          {/* Center Slogan */}
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
              “सबका साथ, सबका विकास, सबका विश्वास, सबका प्रयास”
            </h3>
            <p className="text-sm sm:text-base font-semibold text-amber-100 mt-1 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>विकसित इटावा, विकसित उत्तर प्रदेश, विकसित भारत 🇮🇳</span>
            </p>
          </div>

          {/* Right Action */}
          <div className="flex-shrink-0">
            <a
              href="#citizen-connect"
              className="inline-flex items-center space-x-2 bg-white text-orange-700 hover:bg-orange-50 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <span>जनसंवाद से जुड़ें</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
