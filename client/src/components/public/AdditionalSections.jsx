import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Calendar, MapPin, Clock, Award, CheckCircle2, Heart, MessageCircle, Share2, Quote, ArrowRight } from 'lucide-react';

// About MLA Section
export function AboutMLA() {
  const { mla } = useApp();
  return (
    <section id="about" className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] max-w-sm w-full bg-slate-100">
              <img
                src="/images/poli4.png"
                alt={mla?.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => { e.target.src = '/images/poli1.png'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-bold text-orange-400">जनप्रतिनिधि परिचय</span>
                <h3 className="text-2xl font-black">{mla?.name || 'श्रीमती सरिता भदौरिया'}</h3>
                <p className="text-xs text-slate-300">{mla?.title || 'विधायक, इटावा विधानसभा (200)'}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>राजनीतिक एवं सामाजिक यात्रा</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              समर्पित जनसेवा, पारदर्शिता और निरंतर विकास का संकल्प
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              {mla?.about || 'श्रीमती सरिता भदौरिया उत्तर प्रदेश की 17वीं एवं 18वीं विधानसभा में इटावा विधानसभा (200) का प्रतिनिधित्व कर रही हैं। वे क्षेत्र के सर्वांगीण विकास, महिला सशक्तिकरण, युवाओं के उत्थान एवं किसान कल्याण के लिए सदैव समर्पित हैं।'}
            </p>

            {/* Election Milestones */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                ऐतिहासिक जनसमर्थन (विधानसभा चुनाव)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(mla?.electionHistory || []).map((e, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/70 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{e.election} ({e.year})</div>
                      <div className="text-[11px] text-orange-700 font-semibold mt-0.5">प्राप्त मत: {e.votes} ({e.margin} अंतर)</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-green-600 text-white shadow-sm">
                      {e.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slogans pills */}
            <div className="pt-2 flex flex-wrap gap-2">
              {(mla?.slogans || []).map((s, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  “{s}”
                </span>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// Upcoming Events Section
export function EventsWidget() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.getEvents().then(res => {
      if (res.success) setEvents(res.events);
    });
  }, []);

  return (
    <section className="py-12 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6">
          <div>
            <div className="flex items-center space-x-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>विधानसभा दौरा व कार्यक्रम</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              आगामी कार्यक्रम एवं जनसंवाद
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            कार्यालय द्वारा अधिकृत कार्यक्रम
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-14 rounded-xl bg-orange-600 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-base font-black leading-none">{ev.dateDay}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">{ev.dateMonth}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{ev.title}</h4>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{ev.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {ev.time}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                  {ev.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Social Media Feed Widget
export function SocialFeedWidget() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.getSocialPosts().then(res => {
      if (res.success) setPosts(res.posts);
    });
  }, []);

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
          <div>
            <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <span>लाइव सोशल मीडिया स्ट्रीम</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              सोशल मीडिया अपडेट्स
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100">Facebook</span>
            <span className="px-2.5 py-1 bg-pink-50 text-pink-700 font-bold rounded-lg border border-pink-100">Instagram</span>
            <span className="px-2.5 py-1 bg-red-50 text-red-700 font-bold rounded-lg border border-red-100">YouTube</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200">X (Twitter)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.slice(0, 4).map((p) => (
            <div key={p.id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 capitalize">{p.platform}</span>
                  <span className="text-slate-400 text-[11px]">{p.date}</span>
                </div>
                <div className="aspect-video bg-slate-200 overflow-hidden">
                  <img
                    src={p.media || '/images/poli3.png'}
                    alt="Post media"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/poli1.png'; }}
                  />
                </div>
                <div className="p-3.5">
                  <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                    {p.content}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-600" />
                  {p.likes}
                </span>
                <span className="flex items-center gap-1 text-blue-600 font-semibold">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {p.comments}
                </span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <Share2 className="w-3.5 h-3.5" />
                  {p.shares}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Photo & Video Gallery Widget
export function GalleryWidget() {
  const images = [
    { src: '/images/poli1.png', title: 'विकास समीक्षा बैठक' },
    { src: '/images/poli2.png', title: 'महिला स्वयं सहायता समूह संवाद' },
    { src: '/images/poli3.png', title: 'ग्रामीण सड़क निरीक्षण' },
    { src: '/images/poli4.png', title: 'जनता चौपाल कार्यक्रम' }
  ];

  return (
    <section className="py-12 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">चित्रमय झलकियां</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            फोटो एवं वीडियो गैलरी
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            इटावा विधानसभा क्षेत्र में जनसेवा, विकास निरीक्षण और लोक संवाद के प्रमुख क्षण।
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200 shadow-md">
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                <span className="text-xs font-bold text-white">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Leader Network Section
export function LeaderNetworkWidget() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    api.getLeaders().then(res => {
      if (res.success) setLeaders(res.leaders);
    });
  }, []);

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">मार्गदर्शक नेतृत्व</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            राष्ट्रीय एवं प्रांतीय नेतृत्व
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((l) => (
            <div key={l.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-center space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-orange-500 shadow-md">
                <img
                  src={l.photo || '/images/media_1789490967561.jpg'}
                  alt={l.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">{l.name}</h4>
                <p className="text-xs text-orange-700 font-semibold">{l.position}</p>
              </div>
              <p className="text-xs text-slate-600 italic">
                “{l.quote}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonial Section
export function TestimonialWidget() {
  const testimonials = [
    { name: 'रामसेवक यादव', village: 'ग्राम रामपुर', text: 'हमारे गांव की सड़क 15 वर्षों से जर्जर थी। विधायक जी के प्रयासों से मात्र 3 महीने में शानदार पक्की सड़क बनकर तैयार हो गई।' },
    { name: 'सुनीता देवी', village: 'बकेवर', text: 'प्राथमिक विद्यालय में स्मार्ट क्लास और आरओ पानी की व्यवस्था से हमारे बच्चों को अब शहर जैसा माहौल मिल रहा है।' },
    { name: 'महेश तिवारी', village: 'तकरोई', text: 'जल जीवन मिशन से अब हर घर में शुद्ध पेयजल आ रहा है। माताओं-बहनों को पानी के लिए दूर नहीं जाना पड़ता।' }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-orange-50/50 to-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">जनता की आवाज़</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            क्षेत्रवासियों के अनुभव एवं विचार
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <Quote className="w-6 h-6 text-orange-400" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                “{t.text}”
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <span className="text-[11px] text-orange-600 font-medium">{t.village}</span>
                </div>
                <span className="text-xs">⭐ 5.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
