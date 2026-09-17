import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  MessageCircle,
  Send,
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function WhatsAppRegistrationLinkBox({
  variant = 'dark', // 'dark' | 'light' | 'compact'
  source = 'Home Spotlight QR'
}) {
  const { showToast, mla } = useApp() || {};
  const [mobileNumber, setMobileNumber] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Official MLA Helpline / WhatsApp Number
  const officialWhatsapp = mla?.contact?.whatsapp || mla?.contact?.helpline || '+91 98765 43210';
  const cleanOfficialWhatsapp = officialWhatsapp.replace(/\D/g, '');

  const handleSendWhatsAppLink = async (e) => {
    if (e) e.preventDefault();
    const cleanMobile = mobileNumber.replace(/\D/g, '');

    if (cleanMobile.length !== 10) {
      showToast?.('कृपया मान्य 10-अंकीय WhatsApp मोबाइल नंबर दर्ज करें!', 'error');
      return;
    }

    setGenerating(true);
    try {
      // Build dynamic personalized registration URL
      const origin = window.location.origin;
      const regUrl = `${origin}/?action=register&mobile=${cleanMobile}&source=whatsapp_link`;
      setGeneratedUrl(regUrl);

      // Construct respectful, official WhatsApp message in Hindi
      const mlaName = mla?.name || 'श्रीमती सरिता भदौरिया';
      const mlaRole = mla?.designation || 'विधायक, इटावा विधानसभा (200)';

      const message = `सादर प्रणाम! 🙏\n\nइटावा विधानसभा (200) - जनसेवा एवं जनसंवाद डिजिटल पोर्टल में आपका हार्दिक स्वागत है।\n\n${mlaName} (${mlaRole}) के जनसेवा परिवार से जुड़ने, अपनी समस्या सीधे दर्ज करने अथवा सुझाव देने हेतु नीचे दिए गए अधिकृत लिंक पर क्लिक करके तुरंत अपना पंजीकरण पूर्ण करें:\n\n👉 सीधा पंजीकरण लिंक:\n${regUrl}\n\n(इस लिंक पर क्लिक करते ही आपका फॉर्म आपके मोबाइल नंबर सहित स्वतः खुल जाएगा)\n\n──────────────────\nकार्यालय: ${mlaName}\nहेल्पलाइन / WhatsApp: ${officialWhatsapp}\n“जनता का विश्वास, हमारी ज़िम्मेदारी”`;

      // Open WhatsApp chat directly to the user's mobile number with the prefilled message
      const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanMobile}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Track link generation in analytics/audit log
      try {
        await api.trackShare?.('whatsapp', 'registration_activation', cleanMobile, `${mlaName} Registration Link to ${cleanMobile}`);
      } catch (logErr) {
        console.warn('Share track error:', logErr);
      }

      setSentSuccess(true);
      showToast?.('WhatsApp लिंक सफलतापूर्वक जनरेट हो गया! WhatsApp विंडो खुल गई है।', 'success');
    } catch (err) {
      showToast?.('त्रुटि: ' + err.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    showToast?.('पंजीकरण लिंक क्लिपबोर्ड पर कॉपी हो गया!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const isDark = variant === 'dark';

  return (
    <div
      className={`w-full rounded-2xl p-4 transition-all duration-200 border ${
        isDark
          ? 'bg-gradient-to-b from-slate-900/90 to-slate-950 text-white border-emerald-500/40 shadow-lg shadow-emerald-950/20'
          : 'bg-emerald-50/70 text-slate-800 border-emerald-300 shadow-sm'
      }`}
    >
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center space-x-1.5">
          <span className="p-1 rounded-lg bg-emerald-500 text-white shadow-xs">
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
          </span>
          <span className={`text-xs font-black tracking-tight ${isDark ? 'text-emerald-400' : 'text-emerald-900'}`}>
            WhatsApp पर रजिस्ट्रेशन लिंक मंगाएं
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          QR का आसान विकल्प
        </span>
      </div>

      <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        यदि फोन से QR कोड स्कैन नहीं हो पा रहा है, तो नीचे अपना <strong>WhatsApp नंबर</strong> दर्ज करें — पंजीकरण लिंक सीधे आपके WhatsApp पर भेज दिया जाएगा:
      </p>

      {/* Input & Action Form */}
      <form onSubmit={handleSendWhatsAppLink} className="space-y-2">
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center gap-1 text-xs font-mono font-bold text-slate-400 pointer-events-none">
            <span>🇮🇳</span>
            <span>+91</span>
          </div>
          <input
            type="tel"
            maxLength={10}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="10-अंकीय WhatsApp नंबर..."
            className={`w-full pl-14 pr-3 py-2 text-xs font-mono font-bold rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isDark
                ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-400 focus:bg-slate-800'
                : 'bg-white border-emerald-300 text-slate-900 placeholder-slate-400 focus:bg-white'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={generating || mobileNumber.length !== 10}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Send className="w-3.5 h-3.5" />
          <span>
            {generating ? 'लिंक तैयार हो रहा है...' : 'WhatsApp पर एक्टिवेशन लिंक भेजें'}
          </span>
        </button>
      </form>

      {/* Generated Link Alert & Quick Copy */}
      {sentSuccess && generatedUrl && (
        <div className="mt-3 p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>पंजीकरण लिंक तैयार:</span>
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-[10px] bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-0.5 rounded cursor-pointer flex items-center gap-1 font-bold transition"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
            </button>
          </div>
          <p className="text-[10px] font-mono text-slate-300 truncate bg-slate-900/80 p-1.5 rounded border border-slate-800">
            {generatedUrl}
          </p>
        </div>
      )}

      {/* Official MLA Helpline / WhatsApp Number (As specifically requested by user) */}
      <div className={`mt-3 pt-2.5 border-t text-center space-y-1 ${
        isDark ? 'border-slate-800 text-slate-300' : 'border-emerald-200 text-slate-700'
      }`}>
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold">
          <Phone className="w-3 h-3 text-emerald-500" />
          <span>विधायक अधिकृत WhatsApp नंबर:</span>
          <a
            href={`https://api.whatsapp.com/send?phone=${cleanOfficialWhatsapp}&text=${encodeURIComponent('सादर प्रणाम विधायक जी! मुझे जनसेवा पोर्टल से जुड़ना है।')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-emerald-400 hover:underline font-extrabold flex items-center gap-0.5"
            title="सीधा WhatsApp चैट शुरू करें"
          >
            <span>{officialWhatsapp}</span>
            <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        </div>
        <p className="text-[10px] text-slate-400">
          (कार्यालय समय में इस नंबर पर सीधा संदेश भेजकर भी सहायता प्राप्त कर सकते हैं)
        </p>
      </div>
    </div>
  );
}
