import React from 'react';
import { Car, GraduationCap, HeartPulse, Droplets, HeartHandshake, Sprout, Zap, Landmark } from 'lucide-react';

export default function PopularCategories() {
  const categories = [
    { id: 1, name: 'सड़क एवं परिवहन', icon: Car, color: 'text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-300' },
    { id: 2, name: 'शिक्षा', icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-100 hover:border-purple-300' },
    { id: 3, name: 'स्वास्थ्य', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-100 hover:border-rose-300' },
    { id: 4, name: 'पेयजल', icon: Droplets, color: 'text-cyan-600 bg-cyan-50 border-cyan-100 hover:border-cyan-300' },
    { id: 5, name: 'महिला सशक्तिकरण', icon: HeartHandshake, color: 'text-pink-600 bg-pink-50 border-pink-100 hover:border-pink-300' },
    { id: 6, name: 'कृषि एवं ग्रामीण विकास', icon: Sprout, color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300' },
    { id: 7, name: 'बिजली', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300' },
    { id: 8, name: 'सरकारी योजनाएँ', icon: Landmark, color: 'text-orange-600 bg-orange-50 border-orange-100 hover:border-orange-300' }
  ];

  return (
    <div id="categories" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
          <span>विभागीय क्षेत्र</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4">
          लोकप्रिय श्रेणियाँ
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.id}
                href="#development"
                className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${c.color}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm bg-white">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {c.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>सभी श्रेणियों में तीव्र गति से कार्य प्रगति पर है।</span>
      </div>
    </div>
  );
}
