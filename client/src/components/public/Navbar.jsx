import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Smartphone, ShieldCheck, UserPlus, Menu, X, ChevronDown, Globe, Check, User } from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const {
    setViewMode,
    setShowMobileSimulator,
    showMobileSimulator,
    setShowQrModal,
    setShowLoginModal,
    currentUser,
    settings,
    navigateToPublicPage,
    publicPage
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('हिंदी');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);


  const languages = ['हिंदी', 'English'];

  const handleSelectLang = (selected) => {
    setLang(selected);
    setLangDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur shadow-sm border-b border-slate-200">
        {/* Top Tricolor Ribbon & Motto Banner (Matching Image 2) */}
        <div className="tricolor-ribbon w-full"></div>
        <div className="bg-gradient-to-r from-orange-50 via-white to-green-50 px-4 py-1.5 border-b border-slate-100 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="font-extrabold text-orange-800 tracking-wide">जनसेवा इटावा (विधानसभा 200)</span>
              <span className="text-slate-300">|</span>
              <span className="italic font-bold text-slate-700">“मजबूत नेतृत्व, विकसित इटावा, समृद्ध भारत”</span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Language Selector Dropdown (Image 2) */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-50 transition cursor-pointer"
                >
                  <Globe className="w-3 h-3 text-orange-600" />
                  <span>{lang}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 text-xs">
                    {languages.map((l) => (
                      <button
                        key={l}
                        onClick={() => handleSelectLang(l)}
                        className={`w-full text-left px-3 py-1.5 font-bold flex items-center justify-between transition ${
                          lang === l ? 'bg-orange-50 text-orange-600' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{l}</span>
                        {lang === l && <Check className="w-3.5 h-3.5 text-orange-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Login / Citizen Profile */}
              <button
                onClick={() => setShowLoginModal(true)}
                className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  currentUser
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200'
                }`}
                title={currentUser ? 'नागरिक प्रोफाइल' : 'यूजर लॉगिन'}
              >
                <User className="w-3.5 h-3.5" />
                <span>{currentUser ? currentUser.name : 'यूजर लॉगिन'}</span>
              </button>

              {/* Dedicated Mobile Web View App Button */}
              <button
                onClick={() => navigateToPublicPage('mobile')}
                className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-orange-600 via-amber-500 to-green-600 text-white hover:opacity-95 transition shadow-sm cursor-pointer"
                title="मोबाइल वेब ऐप खोलें (/mobile)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📱 मोबाइल ऐप (/mobile)</span>
              </button>

              {/* Mobile View Toggle */}
              <button
                onClick={() => setShowMobileSimulator(!showMobileSimulator)}
                className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Toggle Mobile Simulator"
              >
                <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                <span className="hidden sm:inline">{showMobileSimulator ? 'Hide Mobile' : 'Mobile View'}</span>
              </button>

              {/* Admin CMS Switch */}
              <button
                onClick={() => setViewMode('admin')}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-orange-600 transition shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Admin CMS</span>
              </button>
            </div>
          </div>
        </div>


        {/* Main Navigation Bar (Image 2) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Badge: जनसेवा इटावा People • Development • Trust (Image 2) */}
            <div className="flex items-center space-x-3">
              <a href="#home" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-green-600 p-0.5 flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-xl">🪷</span>
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                    जनसेवा <span className="text-orange-600">इटावा</span>
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 -mt-1">
                    People • Development • Trust
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Nav Links (Matching Image 2: Home, Our MLA, Development, Media, Leaders, Constituency, Schemes, Get Involved, Contact) */}
            <nav className="hidden xl:flex items-center space-x-6 text-xs font-bold text-slate-700">
              <button
                onClick={() => navigateToPublicPage('home')}
                className={`transition cursor-pointer ${publicPage === 'home' ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 pb-1' : 'hover:text-orange-600'}`}
              >
                Home
              </button>
              <button
                onClick={() => navigateToPublicPage('timeline')}
                className={`transition cursor-pointer ${publicPage === 'timeline' ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 pb-1' : 'hover:text-orange-600'}`}
              >
                Our MLA
              </button>
              <button
                onClick={() => navigateToPublicPage('works')}
                className={`transition cursor-pointer ${publicPage === 'works' ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 pb-1' : 'hover:text-orange-600'}`}
              >
                Development
              </button>
              <button
                onClick={() => navigateToPublicPage('social')}
                className={`transition cursor-pointer ${publicPage === 'social' ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 pb-1' : 'hover:text-orange-600'}`}
              >
                Media
              </button>
              <button
                onClick={() => navigateToPublicPage('leaders')}
                className={`transition cursor-pointer ${publicPage === 'leaders' ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 pb-1' : 'hover:text-orange-600'}`}
              >
                Leaders
              </button>
              <button
                onClick={() => navigateToPublicPage('constituency')}
                className={`transition cursor-pointer ${publicPage === 'constituency' ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 pb-1' : 'hover:text-orange-600'}`}
              >
                Constituency
              </button>
              <button
                onClick={() => navigateToPublicPage('jan-samvad')}
                className={`transition cursor-pointer px-2.5 py-1 rounded-lg ${publicPage === 'jan-samvad' ? 'bg-orange-600 text-white font-extrabold shadow-sm' : 'bg-orange-50 text-orange-700 font-bold hover:bg-orange-100 border border-orange-200'}`}
              >
                जन संवाद
              </button>
              <button
                onClick={() => navigateToPublicPage('schemes')}
                className={`transition cursor-pointer ${publicPage === 'schemes' ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 pb-1' : 'hover:text-orange-600'}`}
              >
                Schemes
              </button>
              <button
                onClick={() => setShowQrModal(true)}
                className="hover:text-orange-600 transition cursor-pointer"
              >
                Get Involved
              </button>
              <button
                onClick={() => navigateToPublicPage('team')}
                className={`transition cursor-pointer ${publicPage === 'team' ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 pb-1' : 'hover:text-orange-600'}`}
              >
                Contact
              </button>
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-orange-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
                title="Search (खोजें)"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowLoginModal(true)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentUser
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={currentUser ? 'नागरिक प्रोफाइल / मेरी शिकायतें' : 'यूजर लॉगिन'}
              >
                <User className="w-4 h-4 text-orange-600" />
                <span className="max-w-[100px] truncate">{currentUser ? currentUser.name : 'लॉगिन'}</span>
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 transition active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join Now</span>
              </button>
            </div>

            {/* Mobile hamburger & actions */}
            <div className="xl:hidden flex items-center space-x-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-slate-100 rounded-lg"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="p-1.5 rounded-lg bg-orange-100 text-orange-700"
                title="Login"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold"
              >
                Join Now
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="xl:hidden py-4 border-t border-slate-100 space-y-1 text-xs font-bold text-slate-700">
              <button
                onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                className="w-full text-left block px-3 py-2 rounded-md font-bold text-orange-700 bg-orange-50 border border-orange-200"
              >
                👤 {currentUser ? `${currentUser.name} (प्रोफाइल व शिकायतें)` : 'यूजर / नागरिक लॉगिन (Citizen Login)'}
              </button>
              <button
                onClick={() => { navigateToPublicPage('mobile'); setMobileMenuOpen(false); }}
                className="w-full text-left flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-green-600 text-white font-black text-xs shadow"
              >
                <Smartphone className="w-4 h-4" />
                <span>📱 मोबाइल ऐप वर्जन (/mobile)</span>
              </button>
              <button
                onClick={() => { navigateToPublicPage('home'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md ${publicPage === 'home' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'hover:bg-slate-50'}`}
              >
                🏠 Home (मुख्य पृष्ठ)
              </button>
              <button
                onClick={() => { navigateToPublicPage('timeline'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md ${publicPage === 'timeline' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'hover:bg-slate-50'}`}
              >
                🏛️ Our MLA (हमारी विधायक)
              </button>
              <button
                onClick={() => { navigateToPublicPage('works'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md ${publicPage === 'works' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'hover:bg-slate-50'}`}
              >
                🏗️ Development (विकास कार्य)
              </button>
              <button
                onClick={() => { navigateToPublicPage('social'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md ${publicPage === 'social' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'hover:bg-slate-50'}`}
              >
                📱 Media & Social (मीडिया व सोशल)
              </button>
              <button
                onClick={() => { navigateToPublicPage('leaders'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md ${publicPage === 'leaders' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'hover:bg-slate-50'}`}
              >
                👥 Leaders (मार्गदर्शक नेतृत्व)
              </button>
              <button
                onClick={() => { navigateToPublicPage('constituency'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md ${publicPage === 'constituency' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'hover:bg-slate-50'}`}
              >
                🗺️ Constituency (विधानसभा इटावा 200)
              </button>
              <button
                onClick={() => { navigateToPublicPage('jan-samvad'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md font-bold ${publicPage === 'jan-samvad' ? 'bg-orange-600 text-white font-extrabold' : 'bg-orange-50 text-orange-700'}`}
              >
                📝 जनसंवाद (समस्या निवारण व ट्रैकिंग)
              </button>
              <button
                onClick={() => { navigateToPublicPage('schemes'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md ${publicPage === 'schemes' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'hover:bg-slate-50'}`}
              >
                📑 Schemes (सरकारी कल्याणकारी योजनाएं)
              </button>
              <button
                onClick={() => { setShowQrModal(true); setMobileMenuOpen(false); }}
                className="w-full text-left block px-3 py-2 rounded-md hover:bg-slate-50"
              >
                🤝 Get Involved (हमसे जुड़ें / QR)
              </button>
              <button
                onClick={() => { navigateToPublicPage('team'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md ${publicPage === 'team' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'hover:bg-slate-50'}`}
              >
                👥 Contact (कार्यालय एवं टीम)
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Interactive Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
