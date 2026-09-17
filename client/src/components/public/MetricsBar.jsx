import React from 'react';
import { HardHat, MapPin, Users, Share2, Calendar, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MetricsBar() {
  const { settings, mla } = useApp();
  const stats = settings?.stats || mla?.stats || {
    developmentWorks: '125+',
    villagesCovered: '80+',
    population: '5.4 लाख+',
    socialPosts: '2,000+',
    janSamvad: '350+',
    activeMembers: '1,200+'
  };

  const metrics = [
    {
      id: 1,
      icon: HardHat,
      value: stats.developmentWorks || '125+',
      label: 'विकास कार्य',
      color: 'text-emerald-700 bg-emerald-100 border-emerald-300'
    },
    {
      id: 2,
      icon: MapPin,
      value: stats.villagesCovered || '80+',
      label: 'गांवों में पहुंच',
      color: 'text-amber-700 bg-amber-100 border-amber-300'
    },
    {
      id: 3,
      icon: Users,
      value: stats.population || '5.4 लाख+',
      label: 'जनसंख्या (क्षेत्र)',
      color: 'text-blue-700 bg-blue-100 border-blue-300'
    },
    {
      id: 4,
      icon: Share2,
      value: stats.socialPosts || '2,000+',
      label: 'सोशल मीडिया अपडेट',
      color: 'text-rose-700 bg-rose-100 border-rose-300'
    },
    {
      id: 5,
      icon: Calendar,
      value: stats.janSamvad || '350+',
      label: 'जन संवाद कार्यक्रम',
      color: 'text-purple-700 bg-purple-100 border-purple-300'
    },
    {
      id: 6,
      icon: Heart,
      value: stats.activeMembers || '1,200+',
      label: 'सक्रिय सदस्य',
      color: 'text-pink-700 bg-pink-100 border-pink-300'
    }
  ];

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 mb-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-white hover:shadow-md transition duration-300"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${m.color} shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900 leading-tight">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 leading-tight mt-0.5">
                    {m.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
