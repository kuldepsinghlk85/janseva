import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ArrowRight } from 'lucide-react';

export default function LeaderSocialSection() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'सभी' },
    { id: 'modi', label: 'प्रधानमंत्री मोदी' },
    { id: 'yogi', label: 'मुख्यमंत्री योगी' },
    { id: 'bjp', label: 'भाजपा राष्ट्रीय' },
    { id: 'bjp-up', label: 'भाजपा उत्तर प्रदेश' },
    { id: 'others', label: 'अन्य प्रमुख नेता' }
  ];

  const cards = [
    {
      id: 1,
      category: 'modi',
      author: 'नरेन्द्र मोदी',
      handle: '@narendramodi',
      avatar: '/images/assets/modi_portrait.jpg',
      image: '/images/assets/social_modi.jpg',
      text: 'नया भारत, विकसित भारत के लिए मिलकर काम करें। हर नागरिक का प्रयास देश को नई दिशा देगा।',
      likes: '2.4M',
      comments: '12K',
      shares: '5.1K'
    },
    {
      id: 2,
      category: 'yogi',
      author: 'योगी आदित्यनाथ',
      handle: '@myogiadityanath',
      avatar: '/images/assets/yogi_portrait.jpg',
      image: '/images/assets/social_yogi.jpg',
      text: 'यूपी का हर जिला बनेगा विकास का मॉडल। विकास की अविरल धारा से हर गांव और कस्बे का उत्थान।',
      likes: '1.1M',
      comments: '8.5K',
      shares: '2.3K'
    },
    {
      id: 3,
      category: 'bjp',
      author: 'भाजपा राष्ट्रीय',
      handle: '@BJP4India',
      avatar: '/images/assets/social_bjp.jpg',
      image: '/images/assets/social_bjp.jpg',
      text: 'सेवा, सुशासन, गरीब कल्याण। अंत्योदय के पावन संकल्प के साथ प्रत्येक नागरिक की सेवा में समर्पित।',
      likes: '850K',
      comments: '6.2K',
      shares: '1.9K'
    },
    {
      id: 4,
      category: 'bjp-up',
      author: 'योगी आदित्यनाथ कार्यालय',
      handle: '@myogiadityanath',
      avatar: '/images/assets/yogi_portrait.jpg',
      image: '/images/assets/social_rally.jpg',
      text: 'जनता का विश्वास ही हमारी शक्ति है। जनसंवाद और स्थलीय निरीक्षण से समस्याओं का मौके पर समाधान।',
      likes: '820K',
      comments: '6.7K',
      shares: '1.9K'
    }
  ];

  const filteredCards = activeTab === 'all'
    ? cards
    : cards.filter(c => c.category === activeTab);

  return (
    <section id="leaders" className="py-10 bg-white border-b border-slate-200 relative">
      <div id="leaders-feed" className="absolute -top-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs (Image 2) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              हमारे बड़े नेता – सोशल मीडिया अपडेट
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              देश और प्रदेश के नेतृत्व की महत्वपूर्ण बातें, हमारे लिए प्रेरणा
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <a
              href="#leaders-feed"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 whitespace-nowrap px-2"
            >
              <span>सभी देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4 Cards Grid (Image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6">
          {filteredCards.map((c) => (
            <div
              key={c.id}
              className="bg-slate-50 hover:bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Author Info */}
                <div className="p-3 bg-white border-b border-slate-100 flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-400 bg-slate-100 flex-shrink-0">
                    <img src={c.avatar} alt={c.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-extrabold text-slate-900 truncate">{c.author}</div>
                    <div className="text-[10px] text-orange-700 font-semibold truncate">{c.handle}</div>
                  </div>
                </div>

                {/* Media Image */}
                <div className="aspect-video bg-slate-200 overflow-hidden">
                  <img
                    src={c.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/poli3.png'; }}
                  />
                </div>

                {/* Text */}
                <div className="p-3.5">
                  <p className="text-xs text-slate-800 font-medium leading-relaxed line-clamp-3">
                    {c.text}
                  </p>
                </div>
              </div>

              {/* Engagement Metrics (Image 2) */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1 text-rose-600">
                  <Heart className="w-3.5 h-3.5 fill-rose-600" />
                  {c.likes}
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {c.comments}
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <Share2 className="w-3.5 h-3.5" />
                  {c.shares}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
