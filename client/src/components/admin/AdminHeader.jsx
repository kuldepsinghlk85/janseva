import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Globe, Bell, ExternalLink, Key, Smartphone, Sparkles, Check, ChevronRight } from 'lucide-react';

export default function AdminHeader() {
  const {
    setViewMode,
    navigateToPublicPage,
    adminTab,
    activeAdminRole,
    setActiveAdminRole,
    SYSTEM_ROLES,
    loginUser
  } = useApp();

  const [showCredModal, setShowCredModal] = useState(false);

  const currentRole = SYSTEM_ROLES?.find(r => r.id === activeAdminRole) || SYSTEM_ROLES?.[0] || {
    id: 'admin',
    name: 'मुख्य प्रशासक',
    roleTitle: 'एडमिन (Super Admin)',
    username: 'admin',
    defaultPassword: 'admin123',
    icon: '👑'
  };

  return (
    <>
      {/* Top 5-Role Persistent Switcher Strip */}
      <div className="bg-slate-900 text-white px-6 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-inner z-30">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 text-[11px] font-extrabold text-orange-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>5 सेग्रीगेटेड रोल चयन (One-Click Role Switch):</span>
          </span>
        </div>

        {/* 5 Role Toggle Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {SYSTEM_ROLES?.map((role) => {
            const isActive = activeAdminRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveAdminRole(role.id)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${role.gradient} text-white shadow-lg ring-2 ring-white/60 scale-105`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title={`इस रोल का पूर्वावलोकन करें: ${role.roleTitle}`}
              >
                <span>{role.icon}</span>
                <span>{role.roleTitle.split(' ')[0]}</span>
                {isActive && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Credentials and Mobile Links */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCredModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-[11px] font-bold transition cursor-pointer"
            title="5 रोल्स के यूजरनेम व पासवर्ड देखें"
          >
            <Key className="w-3 h-3 text-orange-400" />
            <span>🔐 क्रेडेंशियल्स व लॉगिन व्यवस्था</span>
          </button>

          <button
            onClick={() => navigateToPublicPage('mobile')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition cursor-pointer"
            title="मोबाइल ऐप वर्जन खोलें (/mobile)"
          >
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>📱 मोबाइल वेब ऐप (/mobile)</span>
          </button>
        </div>
      </div>

      {/* Main Admin Header */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search in ${currentRole.roleTitle} scope...`}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center space-x-4">
          
          {/* View Website Button */}
          <button
            onClick={() => setViewMode('public')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span>वेबसाइट देखें</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {/* Active Role Privilege Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-extrabold">
            <span>{currentRole.icon}</span>
            <span>{currentRole.roleTitle}</span>
            <span className="text-[10px] text-orange-700 font-semibold">• {currentRole.badge}</span>
          </div>

          {/* Notification Bell with Badge 12 */}
          <div className="relative cursor-pointer p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow">
              12
            </span>
          </div>

          {/* Active Role Profile */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 bg-slate-200 flex items-center justify-center text-sm shadow-sm">
              <span>{currentRole.icon}</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[130px]">
                {currentRole.name}
              </div>
              <div className="text-[10px] text-orange-600 font-bold mt-0.5">
                {currentRole.roleTitle}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* MODAL: 5 Roles Credentials & Standalone Login Guide */}
      {showCredModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    5 सेग्रीगेटेड रोल्स एवं क्रेडेंशियल्स व्यवस्था
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    एडमिन, विधायक, डेटा मैनेजर, कार्यकर्ता, विधायक का असिस्टेंट
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCredModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>निर्देश:</strong> वर्तमान में आप ऊपर दी गई 5 लिंक्स/बटनों से किसी भी रोल को 1-क्लिक में स्विच करके देख सकते हैं। भविष्य में जब भी अलग-अलग उपयोगकर्ताओं को स्वतंत्र लॉगिन देना हो, तो निम्नलिखित यूजरनेम और पासवर्ड से सीधा लॉगिन किया जा सकता है:
            </div>

            <div className="space-y-3">
              {SYSTEM_ROLES?.map((role) => {
                const isCurActive = activeAdminRole === role.id;
                return (
                  <div
                    key={role.id}
                    className={`p-4 rounded-2xl border transition ${
                      isCurActive
                        ? 'bg-orange-50/80 border-orange-400 ring-2 ring-orange-500/30'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl">{role.icon}</span>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{role.roleTitle}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">{role.department}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveAdminRole(role.id);
                          setShowCredModal(false);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                          isCurActive
                            ? 'bg-orange-600 text-white shadow'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isCurActive ? 'वर्तमान सक्रिय ✓' : 'यह रोल एक्टिव करें'}
                      </button>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs font-mono grid grid-cols-2 gap-2 text-slate-800 mb-2">
                      <div>यूजरनेम: <strong className="text-slate-900 font-black">{role.username}</strong></div>
                      <div>पासवर्ड: <strong className="text-orange-700 font-black">{role.defaultPassword}</strong></div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div className="font-bold text-slate-700">अनुमतियां एवं अधिकार:</div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                        {role.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowCredModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer shadow"
              >
                विंडो बंद करें
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

