import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import WhatsAppRegistrationLinkBox from './WhatsAppRegistrationLinkBox';

export default function ConstituencyAndQR() {
  const { setShowQrModal, settings } = useApp();

  return (
    <section id="constituency-info" className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Card: हमारी विधानसभा – इटावा (Image 2 - 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span>हमारी विधानसभा – इटावा (200)</span>
                </h3>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  विधानसभा क्षेत्र
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Map Graphic (Image 2) */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="w-48 h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-center shadow-inner">
                    <img
                      src="/images/assets/etawah_map_badge.jpg"
                      alt="इटावा विधानसभा मानचित्र"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.src = '/images/poli3.png'; }}
                    />
                  </div>
                </div>

                {/* 4 Statistics (Image 2) */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">नगर निकाय</span>
                    <span className="text-sm font-black text-slate-900">4 नगर निकाय</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">ग्राम पंचायतें</span>
                    <span className="text-sm font-black text-slate-900">229 ग्राम पंचायत</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">कुल गाँव / मजरे</span>
                    <span className="text-sm font-black text-slate-900">~ 350 गांव</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">कुल जनसंख्या</span>
                    <span className="text-sm font-black text-blue-700">5.4 लाख+ जनसंख्या</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 mt-4">
              <a
                href="#constituency"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-md shadow-blue-600/20"
              >
                <span>विस्तृत मानचित्र देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Card: जनसेवा से जुड़ें (Image 2 - 5 cols) */}
          <div id="citizen-connect" className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between text-center items-center scroll-mt-24">
            <div className="w-full">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  जनसेवा से जुड़ें
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  विधायक कार्यालय से सीधा डिजिटल संपर्क
                </p>
              </div>

              {/* Clean QR code frame (Image 2) */}
              <div className="my-2 p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl inline-block shadow-inner">
                <div className="w-28 h-28 mx-auto rounded-xl overflow-hidden bg-white shadow-sm p-1">
                  <img
                    src={settings?.hero?.qrImage || "/images/assets/qr_code_clean.jpg"}
                    alt="WhatsApp QR"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = '/images/poli1.png';
                    }}
                  />
                </div>
              </div>

              <p className="text-xs font-extrabold text-slate-800 mt-2">
                QR को स्कैन करें और हमारे परिवार का हिस्सा बनें
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                सीधा सुझाव, शिकायत निवारण व सरकारी योजनाओं की नियमित जानकारी
              </p>

              {/* WhatsApp Registration Link Generator */}
              <div className="mt-3 text-left w-full">
                <WhatsAppRegistrationLinkBox variant="light" source="Constituency QR Card" />
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 mt-3">
              <button
                onClick={() => setShowQrModal(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-md shadow-green-600/20 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>अभी जुड़ें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
