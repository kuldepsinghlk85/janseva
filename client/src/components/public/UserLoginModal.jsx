import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  User,
  Phone,
  Lock,
  CheckCircle,
  AlertCircle,
  X,
  ShieldCheck,
  Smartphone,
  LogOut,
  FileText,
  Clock,
  ChevronRight,
  Sparkles,
  MapPin,
  Key
} from 'lucide-react';
import VoiceInputButton from '../common/VoiceInputButton';

export default function UserLoginModal() {
  const {
    showLoginModal,
    setShowLoginModal,
    currentUser,
    loginUser,
    logoutUser,
    showToast,
    setViewMode,
    navigateToPublicPage
  } = useApp();

  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen', 'register', 'staff'
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register Tab State
  const [registerData, setRegisterData] = useState({
    name: '',
    mobile: '',
    village: 'इटावा सदर',
    booth: 'बूथ संख्या 12',
    type: 'Citizen',
    area: 'इटावा विधानसभा (200)'
  });

  // Staff Tab State
  const [staffUsername, setStaffUsername] = useState('admin');
  const [staffPassword, setStaffPassword] = useState('admin123');

  // Grievances for logged in citizen
  const [myGrievances, setMyGrievances] = useState([]);
  const [loadingGrievances, setLoadingGrievances] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.mobile) {
      loadMyGrievances(currentUser.mobile);
    }
  }, [currentUser]);

  const loadMyGrievances = async (mob) => {
    setLoadingGrievances(true);
    try {
      const res = await api.getCitizenGrievances(mob);
      if (res && res.success) {
        setMyGrievances(res.grievances || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGrievances(false);
    }
  };

  if (!showLoginModal) return null;

  // Handle Citizen Login
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobile || mobile.trim().length < 10) {
      setErrorMsg('कृपया 10-अंकीय वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setOtp('1234'); // Simulated prefilled OTP for fast testing
    showToast('OTP भेजा गया: 1234 (डेमो सुरक्षा कोड)', 'info');
  };

  const handleVerifyCitizenLogin = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim() !== '1234') {
      setErrorMsg('गलत OTP। कृपया 1234 दर्ज करें।');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.citizenLogin({ mobile: mobile.trim(), name: name.trim() });
      if (res && res.success && res.user) {
        loginUser(res.user);
        showToast(`स्वागत है ${res.user.name}! आप सफलतापूर्वक लॉगिन हो गए हैं।`, 'success');
        setOtpSent(false);
        setOtp('');
      } else {
        setErrorMsg(res?.message || 'लॉगिन असफल रहा।');
      }
    } catch (err) {
      setErrorMsg('सर्वर से संपर्क नहीं हो सका।');
    } finally {
      setLoading(false);
    }
  };

  // Handle Citizen Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.name || !registerData.mobile) {
      setErrorMsg('कृपया नाम और मोबाइल नंबर भरें।');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.citizenRegisterAuth(registerData);
      if (res && res.success && res.user) {
        loginUser(res.user);
        showToast(res.message || 'पंजीकरण सफल! आपका स्वागत है।', 'success');
      } else {
        setErrorMsg(res?.message || 'पंजीकरण में त्रुटि हुई।');
      }
    } catch (err) {
      setErrorMsg('सर्वर से संपर्क नहीं हो सका।');
    } finally {
      setLoading(false);
    }
  };

  // Handle Staff / Admin Login
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.userLogin({ username: staffUsername, password: staffPassword });
      if (res && res.success) {
        const staffUser = {
          id: res.id,
          name: res.name,
          username: res.username,
          role: res.role,
          permissions: res.permissions
        };
        loginUser(staffUser);
        showToast(`प्रशासनिक लॉगिन सफल: ${res.name} (${res.role})`, 'success');
        // If super admin, option to switch to admin panel
        if (res.role === 'Super Admin' || res.permissions?.includes('all')) {
          setViewMode('admin');
          setShowLoginModal(false);
        }
      } else {
        setErrorMsg(res?.message || 'अमान्य यूजरनेम या पासवर्ड।');
      }
    } catch (err) {
      setErrorMsg('सर्वर से संपर्क नहीं हो सका।');
    } finally {
      setLoading(false);
    }
  };

  const villages = ['रामपुर', 'सैफई', 'बकेवर', 'तकरोई', 'पिलखर', 'जसवंतनगर', 'भरथना', 'उदी', 'इटावा सदर'];

  return (
    <div
      onClick={() => setShowLoginModal(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2 text-2xl shadow-inner">
            🪷
          </div>
          <h3 className="text-xl font-black text-slate-900">जनसेवा नागरिक एवं यूजर पोर्टल</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            इटावा विधानसभा (200) | श्रीमती सरिता भदौरिया
          </p>
        </div>

        {/* If Already Logged In */}
        {currentUser ? (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>सक्रिय लॉगिन सत्र (Active Session)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-900 uppercase">
                  {currentUser.role || 'Citizen'}
                </span>
              </div>
              <div className="text-base font-black text-slate-900">
                {currentUser.name}
              </div>
              {currentUser.mobile && (
                <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser.mobile}</span>
                  {currentUser.village && <span>• {currentUser.village}</span>}
                </div>
              )}
            </div>

            {/* My Jan Samvad Complaints Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-orange-600" />
                  <span>मेरी दर्ज शिकायतें ({myGrievances.length})</span>
                </h4>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigateToPublicPage('jan-samvad');
                  }}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
                >
                  <span>नई शिकायत दर्ज करें</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {loadingGrievances ? (
                <div className="p-3 text-center text-xs text-slate-400">लोड हो रहा है...</div>
              ) : myGrievances.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  इस मोबाइल नंबर से अभी कोई शिकायत दर्ज नहीं है।
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {myGrievances.map((g) => (
                    <div key={g.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-orange-700">{g.tokenNumber}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                          {g.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 line-clamp-1">{g.subject}</div>
                      <div className="text-[10px] text-slate-500">{g.dateDisplay || g.createdAt}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Switch if Admin user */}
            {(currentUser.role === 'Super Admin' || currentUser.role === 'MLA User' || currentUser.permissions?.includes('all')) && (
              <button
                onClick={() => {
                  setViewMode('admin');
                  setShowLoginModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>एडमिन सीएमएस पैनल में जाएं</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={() => {
                logoutUser();
                showToast('आप पोर्टल से लॉगआउट हो गए हैं।', 'info');
              }}
              className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition flex items-center justify-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>लॉगआउट करें (Logout)</span>
            </button>
          </div>
        ) : (
          /* When Logged Out: Tabs for Citizen / Register / Staff */
          <div className="space-y-4">
            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
              <button
                onClick={() => { setActiveTab('citizen'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg transition ${activeTab === 'citizen' ? 'bg-white text-orange-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                नागरिक लॉगिन
              </button>
              <button
                onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg transition ${activeTab === 'register' ? 'bg-white text-orange-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                नया पंजीकरण
              </button>
              <button
                onClick={() => { setActiveTab('staff'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg transition ${activeTab === 'staff' ? 'bg-white text-orange-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                स्टाफ / एडमिन
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: Citizen Mobile / OTP Login */}
            {activeTab === 'citizen' && (
              <div className="space-y-3 text-left">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        10-अंकीय मोबाइल नंबर *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          required
                          className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        आपका नाम (वैकल्पिक)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="उदा: रामसेवक शर्मा"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>OTP भेजें (Send OTP)</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCitizenLogin} className="space-y-3">
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                      📱 मोबाइल <b>+91 {mobile}</b> पर डेमो OTP भेजा गया है: <span className="font-mono font-black text-orange-600 text-sm">1234</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        4-अंकीय OTP दर्ज करें *
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="1234"
                        required
                        autoFocus
                        className="w-full px-3 py-2.5 text-center tracking-widest text-lg font-black rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>सत्यापित करें व लॉगिन करें</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        बदलें
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: Citizen Register */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3 text-left">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">पूरा नाम (Full Name) *</label>
                    <VoiceInputButton
                      onTranscript={(text) => setRegisterData(prev => ({ ...prev, name: text }))}
                      mode="replace"
                      size="sm"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="उदा: रामसेवक शर्मा"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={registerData.mobile}
                    onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">गाँव / मोहल्ला</label>
                    <select
                      value={registerData.village}
                      onChange={(e) => setRegisterData({ ...registerData, village: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white"
                    >
                      {villages.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">नागरिक प्रकार</label>
                    <select
                      value={registerData.type}
                      onChange={(e) => setRegisterData({ ...registerData, type: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white"
                    >
                      <option value="Citizen">सामान्य नागरिक (Citizen)</option>
                      <option value="Volunteer">सक्रिय स्वयंसेवक (Volunteer)</option>
                      <option value="Party Worker">कार्यकर्ता (Karyakarta)</option>
                      <option value="Youth Supporter">युवा साथी (Youth)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  पंजीकरण पूर्ण करें व लॉगिन हों
                </button>
              </form>
            )}

            {/* TAB 3: Staff & Admin Login */}
            {activeTab === 'staff' && (
              <form onSubmit={handleStaffLogin} className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    यूजरनेम (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                    placeholder="admin या mla_sarita"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    पासवर्ड (Password) *
                  </label>
                  <input
                    type="password"
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="font-bold text-slate-700">डेमो प्रशासनिक क्रेडेंशियल्स:</div>
                  <div>• एडमिन: <code className="font-mono font-bold text-orange-600">admin / admin123</code></div>
                  <div>• विधायक: <code className="font-mono font-bold text-orange-600">mla_sarita / mla2026</code></div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs transition shadow active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>प्रशासनिक लॉगिन करें</span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
