import React, { useState } from 'react';
import { Search, X, ArrowRight, ExternalLink, HardHat, FileText, Landmark, Sparkles } from 'lucide-react';
import VoiceInputButton from '../common/VoiceInputButton';

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const searchableItems = [
    { title: 'रामपुर से वैदपुरा 8.5 किमी संपर्क मार्ग निर्माण', type: 'विकास कार्य', category: 'सड़क', link: '#development', icon: HardHat },
    { title: 'राजकीय बालिका इंटर कॉलेज में स्मार्ट क्लास व प्रयोगशाला', type: 'विकास कार्य', category: 'शिक्षा', link: '#development', icon: HardHat },
    { title: 'महिला स्वयं सहायता समूह को ऋण व आत्मनिर्भरता', type: 'विकास कार्य', category: 'महिला', link: '#development', icon: HardHat },
    { title: 'सामुदायिक स्वास्थ्य केंद्र में डिजिटल एक्स-रे व लैब', type: 'विकास कार्य', category: 'स्वास्थ्य', link: '#development', icon: HardHat },
    { title: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)', type: 'योजना', category: 'कृषि', link: '#schemes', icon: Landmark },
    { title: 'प्रधानमंत्री आवास योजना (ग्रामीण व शहरी)', type: 'योजना', category: 'आवास', link: '#schemes', icon: Landmark },
    { title: 'आयुष्मान भारत - जन आरोग्य योजना (₹5 लाख बीमा)', type: 'योजना', category: 'स्वास्थ्य', link: '#schemes', icon: Landmark },
    { title: 'प्रधानमंत्री उज्ज्वला योजना 2.0 (निःशुल्क गैस)', type: 'योजना', category: 'ऊर्जा', link: '#schemes', icon: Landmark },
    { title: 'जल जीवन मिशन - हर घर नल से शुद्ध जल', type: 'योजना', category: 'पेयजल', link: '#schemes', icon: Landmark },
    { title: 'मुख्यमंत्री कन्या सुमंगला योजना (₹25,000)', type: 'योजना', category: 'बालिका', link: '#schemes', icon: Landmark },
    { title: 'श्रीमती सरिता भदौरिया (विधायक, इटावा 200) परिचय', type: 'विधायक', category: 'नेतृत्व', link: '#about', icon: Sparkles },
    { title: 'विधानसभा क्षेत्र इटावा 200 सांख्यिकी व मानचित्र', type: 'विधानसभा', category: 'भूगोल', link: '#constituency', icon: ExternalLink },
    { title: 'हमारे बड़े नेता - नरेंद्र मोदी व योगी आदित्यनाथ सोशल फीड', type: 'सोशल मीडिया', category: 'नेता', link: '#leaders', icon: FileText }
  ];

  const results = !searchTerm.trim()
    ? searchableItems.slice(0, 5)
    : searchableItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2 text-orange-600 font-bold text-sm">
            <Search className="w-5 h-5" />
            <span>पोर्टल खोज (Search JanSeva Portal)</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input with Voice Typing */}
        <div className="relative mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="विकास कार्य, योजनाएं, गांव (बोलकर या लिखकर खोजें)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-slate-800"
            />
          </div>
          <VoiceInputButton
            onTranscript={(txt) => setSearchTerm(txt)}
            currentValue={searchTerm}
            mode="replace"
            size="md"
            title="बोलकर खोजें (Voice Search)"
          />
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {results.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              कोई परिणाम नहीं मिला। कृपया अन्य कीवर्ड लिखकर खोजें।
            </div>
          ) : (
            results.map((r, idx) => {
              const Icon = r.icon;
              return (
                <a
                  key={idx}
                  href={r.link}
                  onClick={onClose}
                  className="p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 flex items-center justify-between transition group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition">
                        {r.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-semibold text-orange-600">{r.type}</span>
                        <span>•</span>
                        <span>{r.category}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition flex-shrink-0" />
                </a>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>इटावा (200) डिजिटल इंटेलिजेंस खोज</span>
          <span className="font-semibold text-orange-600">{results.length} परिणाम उपलब्ध</span>
        </div>
      </div>
    </div>
  );
}
