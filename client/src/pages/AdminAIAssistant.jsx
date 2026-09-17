import React, { useState } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Bot, Send, Sparkles, FileText, CheckCircle2, MessageSquare, Copy, Check, MessageCircle, Share2 } from 'lucide-react';
import VoiceInputButton from '../components/common/VoiceInputButton';

export default function AdminAIAssistant() {
  const { showToast } = useApp();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'नमस्ते! मैं **जनसेवा AI डेवलपमेंट असिस्टेंट** हूँ। आप मुझसे इटावा (200) के किसी भी गांव, विकास कार्य, बजट, सड़क परियोजनाओं अथवा प्रेस विज्ञप्ति ड्राफ्टिंग के संबंध में पूछ सकते हैं।'
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Article Generator Form
  const [genTopic, setGenTopic] = useState('');
  const [genVillage, setGenVillage] = useState('रामपुर');
  const [genArticle, setGenArticle] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleSend = async (customText) => {
    const textToSend = customText || query;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    const res = await api.aiQuery(textToSend, 'Admin (Super Admin)');
    setLoading(false);

    if (res.success) {
      setMessages(prev => [...prev, { sender: 'ai', text: res.answer, data: res.data }]);
    }
  };

  const handleGenerateArticle = async (e) => {
    e.preventDefault();
    if (!genTopic) return;
    setGenerating(true);
    const res = await api.aiGenerateArticle({ topic: genTopic, village: genVillage }, 'Admin (Super Admin)');
    setGenerating(false);
    if (res.success) {
      setGenArticle(res.article);
      showToast('AI द्वारा प्रेस नोट एवं लेख तैयार कर दिया गया!', 'success');
    }
  };

  const quickPrompts = [
    'How many road projects completed?',
    'रामपुर गांव में कौन-से विकास कार्य हुए हैं?',
    'Draft a press release in Hindi for MLA works',
    'कितने नागरिक पंजीकृत हैं?'
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Intelligence Engine</span>
        </div>
        <h2 className="text-xl font-black text-slate-900">AI Development & Speech Assistant</h2>
        <p className="text-xs text-slate-500">
          प्राकृतिक भाषा में विकास कार्यों का विश्लेषण, आंकड़ों की जानकारी एवं प्रेस विज्ञप्तियों का त्वरित लेखन
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Interactive Chatbot */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[560px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/70 rounded-t-2xl">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">जनसेवा AI संवाद</h4>
              <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                ● डेटाबेस से सीधा जुड़ा हुआ
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>AI डेटाबेस का विश्लेषण कर रहा है...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick prompt buttons */}
          <div className="p-2 border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-100 flex items-center space-x-2">
            <input
              type="text"
              placeholder="विकास कार्य, गांव या भाषण के बारे में पूछें (या बोलकर टाइप करें)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <VoiceInputButton
              onTranscript={(txt) => setQuery(txt)}
              currentValue={query}
              mode="replace"
              title="बोलकर प्रश्न पूछें (Voice Typing)"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition shadow cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 5 cols: AI Article / Press Release Generator */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>प्रेस विज्ञप्ति जनरेटर</span>
            </div>
            <h3 className="text-base font-black text-slate-900">AI आर्टिकल एवं प्रेस नोट लेखन</h3>
            <p className="text-xs text-slate-500">
              योजना अथवा निरीक्षण का विवरण देकर स्वतः प्रेस विज्ञप्ति तैयार करें
            </p>

            <form onSubmit={handleGenerateArticle} className="space-y-3 pt-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">विषय (Topic)</label>
                  <VoiceInputButton
                    onTranscript={(txt) => setGenTopic(txt)}
                    currentValue={genTopic}
                    mode="replace"
                    size="sm"
                    title="विषय बोलकर दर्ज करें"
                  />
                </div>
                <input
                  type="text"
                  placeholder="उदा. नई पेयजल पाइपलाइन का शिलान्यास"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">गाँव / क्षेत्र (Village)</label>
                  <VoiceInputButton
                    onTranscript={(txt) => setGenVillage(txt)}
                    currentValue={genVillage}
                    mode="replace"
                    size="sm"
                    title="गाँव का नाम बोलें"
                  />
                </div>
                <input
                  type="text"
                  value={genVillage}
                  onChange={(e) => setGenVillage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow disabled:opacity-50 cursor-pointer"
              >
                {generating ? 'AI लिख रहा है...' : 'प्रेस नोट उत्पन्न करें'}
              </button>
            </form>

            {genArticle && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{genArticle.title}</h4>
                </div>
                <div className="text-slate-700 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto pr-1">
                  {genArticle.content}
                </div>

                {/* WhatsApp Share & Copy Buttons */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const shareText = `*${genArticle.title}*\n\n${genArticle.content}\n\n📍 इटावा विधानसभा (200) | कार्यालय: श्रीमती सरिता भदौरिया, विधायक\n🌐 http://localhost:5000`;
                      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                      window.open(waUrl, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>वॉट्सऐप पर साझा करें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const copyContent = `${genArticle.title}\n\n${genArticle.content}`;
                      navigator.clipboard.writeText(copyContent);
                      showToast('प्रेस नोट कॉपी हो गया!', 'success');
                    }}
                    className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition cursor-pointer"
                    title="प्रेस नोट कॉपी करें"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            AI द्वारा तैयार प्रेस नोट को सीधे मीडिया एवं सोशल मीडिया पर साझा किया जा सकता है।
          </div>
        </div>

      </div>
    </div>
  );
}
