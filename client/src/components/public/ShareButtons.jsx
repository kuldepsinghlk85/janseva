import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';

export default function ShareButtons({
  title,
  shortDescription,
  url = typeof window !== 'undefined' ? window.location.href : '',
  location = 'इटावा',
  date = '',
  onShareSuccess
}) {
  const [copied, setCopied] = useState(false);

  // Generate customized share text
  const shareMessage = `*${title}*\n📍 ${location} | 📅 ${date}\n\n${shortDescription}\n\nकार्यालय श्रीमती सरिता भदौरिया (विधायक, इटावा 200)\nपूरी जानकारी देखें: ${url}`;

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank');
    if (onShareSuccess) onShareSuccess('whatsapp');
  };

  const handleFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(fbUrl, '_blank');
    if (onShareSuccess) onShareSuccess('facebook');
  };

  const handleTwitter = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=Etawah,JanSeva,SaritaBhadauria`;
    window.open(twUrl, '_blank');
    if (onShareSuccess) onShareSuccess('twitter');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title} - ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (onShareSuccess) onShareSuccess('copy');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* WhatsApp Connect / Share */}
      <button
        type="button"
        onClick={handleWhatsApp}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
        title="व्हाट्सएप पर शेयर करें"
      >
        <span className="text-sm">🟢</span>
        <span>WhatsApp</span>
      </button>

      {/* Facebook Share */}
      <button
        type="button"
        onClick={handleFacebook}
        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
        title="फेसबुक पर शेयर करें"
      >
        <span>f</span>
        <span>Facebook</span>
      </button>

      {/* X / Twitter */}
      <button
        type="button"
        onClick={handleTwitter}
        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
        title="X पर शेयर करें"
      >
        <span>𝕏</span>
        <span>Twitter</span>
      </button>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 cursor-pointer ${
          copied
            ? 'bg-green-50 border-green-400 text-green-700'
            : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
        }`}
        title="लिंक कॉपी करें"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'कॉपी हो गया!' : 'लिंक कॉपी'}</span>
      </button>
    </div>
  );
}
