import React from 'react';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DevelopmentTimeline() {
  const timelineData = [
    { year: '2026', title: '125+ कार्य प्रगति पर', desc: 'स्मार्ट स्कूल, ग्रामीण पाइपलाइन व आधुनिक स्वास्थ्य केंद्र', badge: 'वर्तमान वर्ष', active: true },
    { year: '2025', title: '98 कार्य पूर्ण', desc: 'प्रमुख मार्गों का चौड़ीकरण व विद्युत सबस्टेशन स्थापना', badge: 'सफलतापूर्वक पूर्ण' },
    { year: '2024', title: '76 कार्य पूर्ण', desc: 'महिला स्वयं सहायता भवन व सामुदायिक जल संचयन', badge: 'सफलतापूर्वक पूर्ण' },
    { year: '2023', title: '60 कार्य पूर्ण', desc: 'प्राथमिक विद्यालयों का कायाकल्प एवं सौर ऊर्जा संयत्र', badge: 'सफलतापूर्वक पूर्ण' }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Clock className="w-3.5 h-3.5" />
          <span>विकास यात्रा</span>
        </div>
        <h3 className="text-xl font-black text-white tracking-tight mb-4">
          विकास की समयरेखा
        </h3>

        <div className="space-y-4 relative pl-4 border-l-2 border-slate-700">
          {timelineData.map((t, idx) => (
            <div key={t.year} className="relative group">
              {/* Dot */}
              <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                t.active ? 'bg-orange-500 ring-4 ring-orange-500/20' : 'bg-slate-500'
              }`}></div>

              <div className="flex items-baseline space-x-2">
                <span className="text-sm font-extrabold text-orange-400">{t.year}</span>
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition">{t.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-slate-800">
        <a
          href="#development"
          className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-orange-600/30"
        >
          <span>पूरी समयरेखा देखें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
