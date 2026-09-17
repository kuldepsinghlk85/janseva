import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Leaf,
  Shield,
  BookOpen,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function HomeTimelineAndTeamRow() {
  const { navigateToPublicPage } = useApp();

  const milestones = [
    { year: '2026', title: 'निरंतर क्षेत्र विकास कार्य' },
    { year: '2025', title: 'जनसंवाद अभियान' },
    { year: '2024', title: 'विकास योजनाओं का क्रियान्वयन' },
    { year: '2022', title: 'द्वितीय बार विधायक निर्वाचित' },
    { year: '2017', title: 'प्रथम बार विधायक निर्वाचित' }
  ];

  const teamRoles = [
    { id: 1, name: 'बूथ प्रभारी', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 2, name: 'मंडल संयोजक', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 3, name: 'विकास सेल', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 4, name: 'सोशल मीडिया टीम', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { id: 5, name: 'किसान संपर्क टीम', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 6, name: 'युवा मोर्चा कोऑर्डिनेटर', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 7, name: 'महिला सशक्तिकरण सेल', color: 'bg-pink-50 text-pink-700 border-pink-200' },
    { id: 8, name: 'आईटी सेल', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
  ];

  const pillars = [
    { id: 1, name: 'स्वच्छ इटावा', icon: Leaf, color: 'bg-emerald-100 text-emerald-700' },
    { id: 2, name: 'सुरक्षित इटावा', icon: Shield, color: 'bg-blue-100 text-blue-700' },
    { id: 3, name: 'शिक्षित इटावा', icon: BookOpen, color: 'bg-purple-100 text-purple-700' },
    { id: 4, name: 'समृद्ध इटावा', icon: TrendingUp, color: 'bg-orange-100 text-orange-700' }
  ];

  return (
    <section className="py-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. समयरेखा (Timeline) (3 cols on desktop) */}
          <div className="lg:col-span-3 bg-slate-900 text-white rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-800">
                <Clock className="w-4 h-4 text-orange-400" />
                <h3 className="text-base font-black tracking-tight">समयरेखा (Timeline)</h3>
              </div>

              {/* Vertical Milestones */}
              <div className="space-y-3.5 py-1">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <span className="font-bold text-orange-400 w-10 flex-shrink-0 pt-0.5">
                      {m.year}
                    </span>
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                      <span className="text-slate-300 truncate">{m.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => navigateToPublicPage('timeline')}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <span>पूर्ण विकास यात्रा देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. हमारी टीम (3 cols on desktop) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-100">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  हमारी टीम – आपके लिए तत्पर
                </h3>
              </div>

              {/* Team Pills Grid */}
              <div className="grid grid-cols-2 gap-2 py-1">
                {teamRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-center truncate ${role.color}`}
                  >
                    {role.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => navigateToPublicPage('team')}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
              >
                <span>हमारी टीम से मिलें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. विकास संकल्प Banner (4 cols on desktop) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-orange-50 via-amber-50 to-white rounded-3xl p-5 border border-orange-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200 border border-orange-200">
                <img
                  src="/images/assets/social_rally.jpg"
                  alt="इटावा जनसभा"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/poli4.png'; }}
                />
              </div>

              <div className="text-center pt-1">
                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                  “इटावा का विकास हम सबकी सहभागिता से संभव है”
                </h4>
                <p className="text-xs font-bold text-orange-700 mt-1">
                  — श्रीमती सरिता भदौरिया
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-orange-200/60 mt-2 text-center">
              <span className="text-[11px] font-bold text-slate-500">
                मेरा इटावा • मेरा परिवार • मेरा संकल्प
              </span>
            </div>
          </div>

          {/* 4. इटावा के 4 स्तम्भ (Pillars) (2 cols on desktop) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-center pb-2 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">संकल्प स्तम्भ</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 py-1">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 hover:bg-orange-50 transition border border-slate-100 text-center space-y-1 group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">
                      {p.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold">इटावा 200</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
