import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, Heart, ExternalLink } from 'lucide-react';

export default function FooterPanorama() {
  const { mla, setViewMode } = useApp();

  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-10 pb-6 border-t-4 border-orange-500 relative overflow-hidden">
      {/* Background Graphic Panorama Overlay (Image 4 Bottom) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Panorama Slogan Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-orange-950/70 via-slate-900 to-green-950/70 p-6 sm:p-8 border border-slate-800 text-center mb-10 shadow-2xl">
          <div className="inline-block text-3xl sm:text-4xl mb-2">🇮🇳</div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            “मेरा इटावा, मेरा परिवार”
          </h3>
          <p className="text-sm font-semibold text-orange-400 mt-1">
            सबका साथ, सबका विकास, सबका विश्वास, सबका प्रयास
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-300">
            <span className="px-3 py-1 bg-white/10 rounded-full">सैफई</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">बकेवर</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">जसवंतनगर</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">भरथना</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">चकरनगर</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">इटावा सदर</span>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-xs">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🪷</span>
              <span className="text-lg font-black text-white">जनसेवा इटावा</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              इटावा विधानसभा (200) का आधिकारिक डिजिटल निर्वाचन क्षेत्र इंटेलिजेंस एवं जनसंवाद पोर्टल।
            </p>
            <div className="pt-2">
              <button
                onClick={() => setViewMode('admin')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-600 text-white font-bold transition flex items-center gap-1.5"
              >
                <span>प्रशासनिक लॉगिन (Admin CMS)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-l-2 border-orange-500 pl-2">
              महत्वपूर्ण लिंक
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#home" className="hover:text-orange-400 transition">मुखपृष्ठ (Home)</a></li>
              <li><a href="#about" className="hover:text-orange-400 transition">विधायक परिचय (About MLA)</a></li>
              <li><a href="#development" className="hover:text-orange-400 transition">विकास कार्य पुरालेख (Works Archive)</a></li>
              <li><a href="#updates" className="hover:text-orange-400 transition">समाचार एवं मीडिया (News & Media)</a></li>
              <li><a href="#constituency" className="hover:text-orange-400 transition">विधानसभा मानचित्र (Constituency Map)</a></li>
            </ul>
          </div>

          {/* Col 3: Government Schemes */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-l-2 border-green-500 pl-2">
              कल्याणकारी योजनाएं
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>प्रधानमंत्री आवास योजना (ग्रामीण)</li>
              <li>जल जीवन मिशन (हर घर नल जल)</li>
              <li>मुख्यमंत्री अभ्युदय योजना</li>
              <li>आयुष्मान भारत - जन आरोग्य</li>
              <li>किसान सम्मान निधि</li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-l-2 border-amber-500 pl-2">
              कार्यालय संपर्क
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{mla?.contact?.office || 'विधायक कार्यालय, कलेक्ट्रेट रोड, इटावा, उ.प्र. - 206001'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{mla?.contact?.helpline || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{mla?.contact?.email || 'mla.etawah200@janseva.org'}</span>
              </div>
              {/* Official Social Media Links */}
              <div className="pt-2 flex items-center space-x-2">
                <a
                  href="https://www.instagram.com/mlaetawah/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-700/50 text-pink-300 hover:bg-pink-900/60 text-[10px] font-bold transition flex items-center gap-1"
                  title="Official Instagram (@mlaetawah)"
                >
                  <span>📷 @mlaetawah</span>
                </a>
                <a
                  href="https://www.facebook.com/mlaetawah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-700/50 text-blue-300 hover:bg-blue-900/60 text-[10px] font-bold transition flex items-center gap-1"
                  title="Official Facebook (mlaetawah)"
                >
                  <span>📘 mlaetawah</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <div>
            © 2026 जनसेवा इटावा (विधानसभा 200). सर्वाधिकार सुरक्षित।
          </div>
          <div className="flex items-center space-x-1">
            <span>विकसित इटावा, विकसित भारत 🇮🇳</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
