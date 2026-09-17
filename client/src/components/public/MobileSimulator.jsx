import React, { useState } from 'react';
import { Home, HardHat, Image, Users, MoreHorizontal, X, ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MobileSimulator() {
  const { showMobileSimulator, setShowMobileSimulator, mla, setShowQrModal } = useApp();
  const [mobileTab, setMobileTab] = useState('home');

  if (!showMobileSimulator) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
      {/* Smartphone frame */}
      <div className="relative w-[320px] h-[640px] bg-slate-900 rounded-[45px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-white/20 flex flex-col justify-between">
        
        {/* Top Notch & speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full flex items-center justify-center space-x-2 z-30">
          <div className="w-2 h-2 rounded-full bg-slate-950"></div>
          <div className="w-10 h-1 bg-slate-900 rounded-full"></div>
        </div>

        {/* Close simulator button */}
        <button
          onClick={() => setShowMobileSimulator(false)}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition z-40"
          title="Close Mobile Simulator"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Smartphone Screen Inner */}
        <div className="w-full h-full bg-slate-50 rounded-[35px] overflow-hidden flex flex-col justify-between pt-6 relative select-none">
          
          {/* Mobile Top Header */}
          <div className="px-4 py-2 bg-white/90 backdrop-blur border-b border-slate-100 flex items-center justify-between z-20">
            <div className="flex items-center space-x-1.5">
              <span className="text-base">🪷</span>
              <span className="font-extrabold text-xs text-orange-600">जनसेवा</span>
              <span className="text-[9px] text-slate-400">इटावा</span>
            </div>
            <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              विधानसभा 200
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-16">
            
            {/* Hero Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white p-3.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="space-y-1 max-w-[170px]">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">
                    जनता के साथ
                  </span>
                  <h4 className="text-xs font-black leading-tight">
                    सेवा • संवाद • विकास आपके साथ
                  </h4>
                  <p className="text-[10px] text-orange-100 leading-tight">
                    श्रीमती सरिता भदौरिया (विधायक, इटावा)
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-white text-orange-700 font-bold text-[10px] shadow flex items-center gap-1"
                    >
                      <span>जुड़ें</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-white/40 shadow">
                  <img
                    src="/images/poli4.png"
                    alt="विधायक"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/poli1.png'; }}
                  />
                </div>
              </div>
            </div>

            {/* Mini-Stats Grid */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-xs font-black text-emerald-600">125+</div>
                <div className="text-[8px] font-bold text-slate-500">विकास कार्य</div>
              </div>
              <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-xs font-black text-amber-600">80+</div>
                <div className="text-[8px] font-bold text-slate-500">गाँवों में पहुँच</div>
              </div>
              <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-xs font-black text-blue-600">350+</div>
                <div className="text-[8px] font-bold text-slate-500">जन संवाद</div>
              </div>
              <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-xs font-black text-rose-600">2,000+</div>
                <div className="text-[8px] font-bold text-slate-500">अपडेट</div>
              </div>
            </div>

            {/* Mini Latest Update */}
            <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span>लेटेस्ट अपडेट</span>
                <span className="text-orange-600 font-bold">15 सितंबर</span>
              </div>
              <div className="text-[11px] font-bold text-slate-800 leading-snug">
                ग्राम रामपुर में सड़क निर्माण कार्य का सघन निरीक्षण
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-50">
                <span className="flex items-center gap-0.5 text-orange-600 font-medium">
                  <MapPin className="w-2.5 h-2.5" />
                  रामपुर, इटावा
                </span>
                <span className="text-emerald-700 font-bold">पूर्ण कार्य</span>
              </div>
            </div>

            {/* Quick QR banner */}
            <div
              onClick={() => setShowQrModal(true)}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className="text-base">📱</div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-900">QR सदस्यता फॉर्म</div>
                  <div className="text-[8px] text-emerald-700">सीधे विधायक टीम से जुड़ें</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
            </div>

          </div>

          {/* Bottom Native App Navigation Bar (Image 4 bottom) */}
          <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-slate-200 py-1.5 px-3 flex items-center justify-around z-30">
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center text-[9px] font-bold transition ${
                mobileTab === 'home' ? 'text-orange-600' : 'text-slate-400'
              }`}
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span>होम</span>
            </button>

            <button
              onClick={() => setMobileTab('works')}
              className={`flex flex-col items-center text-[9px] font-bold transition ${
                mobileTab === 'works' ? 'text-orange-600' : 'text-slate-400'
              }`}
            >
              <HardHat className="w-4 h-4 mb-0.5" />
              <span>विकास</span>
            </button>

            <button
              onClick={() => setMobileTab('media')}
              className={`flex flex-col items-center text-[9px] font-bold transition ${
                mobileTab === 'media' ? 'text-orange-600' : 'text-slate-400'
              }`}
            >
              <Image className="w-4 h-4 mb-0.5" />
              <span>मीडिया</span>
            </button>

            <button
              onClick={() => { setMobileTab('join'); setShowQrModal(true); }}
              className={`flex flex-col items-center text-[9px] font-bold transition ${
                mobileTab === 'join' ? 'text-orange-600' : 'text-slate-400'
              }`}
            >
              <Users className="w-4 h-4 mb-0.5" />
              <span>जुड़ें</span>
            </button>

            <button
              onClick={() => setMobileTab('more')}
              className={`flex flex-col items-center text-[9px] font-bold transition ${
                mobileTab === 'more' ? 'text-orange-600' : 'text-slate-400'
              }`}
            >
              <MoreHorizontal className="w-4 h-4 mb-0.5" />
              <span>और</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
