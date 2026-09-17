import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Share2,
  ArrowRight,
  MapPin,
  QrCode,
  ExternalLink,
  Youtube,
  Instagram,
  Facebook
} from 'lucide-react';

export default function HomeSocialAndConstituencyRow() {
  const { navigateToPublicPage, setShowQrModal, settings } = useApp();

  const socialChannels = [
    {
      id: 'fb',
      name: 'Facebook',
      handle: '/mlaetawah',
      url: 'https://www.facebook.com/mlaetawah?mibextid=ZbWKwL',
      btnText: 'Follow',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: Facebook,
      iconBg: 'bg-blue-600 text-white'
    },
    {
      id: 'ig',
      name: 'Instagram',
      handle: '@mlaetawah',
      url: 'https://www.instagram.com/mlaetawah/?hl=en',
      btnText: 'Follow',
      btnColor: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white',
      icon: Instagram,
      iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white'
    },
    {
      id: 'yt',
      name: 'YouTube',
      handle: 'MLA Etawah',
      url: 'https://www.youtube.com',
      btnText: 'Subscribe',
      btnColor: 'bg-red-600 hover:bg-red-700 text-white',
      icon: Youtube,
      iconBg: 'bg-red-600 text-white'
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      handle: '@mlaetawah',
      url: 'https://twitter.com',
      btnText: 'Follow',
      btnColor: 'bg-black hover:bg-slate-800 text-white',
      iconText: '𝕏',
      iconBg: 'bg-black text-white'
    }
  ];

  return (
    <section className="py-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. सोशल मीडिया अपडेट (Left 6 cols on desktop) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    सोशल मीडिया अपडेट
                  </h3>
                  <p className="text-[11px] text-slate-500">हर मंच पर, जनता के साथ</p>
                </div>
                <button
                  onClick={() => navigateToPublicPage('social')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>सभी देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Social Cards in 2x2 or 4x1 grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {socialChannels.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <div
                      key={ch.id}
                      className="bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col items-center text-center justify-between space-y-2.5 transition group hover:shadow-md hover:border-orange-300"
                    >
                      <div className={`w-10 h-10 rounded-xl ${ch.iconBg} flex items-center justify-center shadow-xs flex-shrink-0`}>
                        {Icon ? <Icon className="w-5 h-5" /> : <span className="text-lg font-bold">{ch.iconText}</span>}
                      </div>

                      <div className="min-w-0 w-full">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{ch.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{ch.handle}</p>
                      </div>

                      <a
                        href={ch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition shadow-xs flex items-center justify-center gap-1 ${ch.btnColor}`}
                      >
                        <span>{ch.btnText}</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>आधिकारिक हैंडल: @mlaetawah</span>
              <button
                onClick={() => navigateToPublicPage('social')}
                className="text-orange-600 font-bold hover:underline cursor-pointer"
              >
                सोशल मीडिया केंद्र खोलें →
              </button>
            </div>
          </div>

          {/* 2. हमारा विधानसभा क्षेत्र (Center 3 cols on desktop) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>हमारा विधानसभा क्षेत्र</span>
                </h3>
              </div>

              {/* Map Illustration / Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-orange-50/40 p-2 aspect-[4/3] flex items-center justify-center group cursor-pointer"
                   onClick={() => navigateToPublicPage('constituency')}>
                <img
                  src="/images/assets/etawah_map_badge.jpg"
                  alt="इटावा विधानसभा क्षेत्र मानचित्र"
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                  onError={(e) => { e.target.src = '/images/poli3.png'; }}
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  इटावा सदर (200)
                </div>
              </div>

              <p className="text-[11px] text-slate-600 mt-2.5 text-center leading-relaxed">
                इटावा, सैफई, बकेवर, तकरोई, जसवंतनगर सहित 250+ गांव व नगर निकाय।
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-3">
              <button
                onClick={() => navigateToPublicPage('constituency')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
              >
                <span>इंटरएक्टिव मानचित्र देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. जनसेवा से जुड़ें QR Code (Right 3 cols on desktop) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between text-center items-center">
            <div className="w-full">
              <div className="flex items-center justify-center pb-3 mb-2 border-b border-slate-100">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>जनसेवा से जुड़ें</span>
                </h3>
              </div>

              {/* Clean QR code frame */}
              <div className="my-1 p-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl inline-block shadow-inner">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-xl overflow-hidden bg-white shadow-sm p-1">
                  <img
                    src={settings?.hero?.qrImage || "/images/assets/qr_code_clean.jpg"}
                    alt="WhatsApp QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = '/images/poli1.png'; }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-600 mt-1">
                QR कोड स्कैन करें और अपने क्षेत्र का हिस्सा बनें
              </p>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 mt-2">
              <button
                onClick={() => setShowQrModal(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
              >
                <span>सदस्य बनें →</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
