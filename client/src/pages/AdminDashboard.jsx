import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  HardHat,
  Users,
  Share2,
  Calendar,
  UserCheck,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  Bell,
  UploadCloud,
  FileSpreadsheet,
  Bot,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { mla, setAdminTab, showToast } = useApp();
  const [socialData, setSocialData] = useState(null);
  const [worksStats, setWorksStats] = useState({ total: 125, completed: 45, inProgress: 48, approved: 20, notStarted: 12 });
  const [citizens, setCitizens] = useState([]);
  const [team, setTeam] = useState([]);
  const [events, setEvents] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [socRes, devRes, citRes, tmRes, evRes, leadRes] = await Promise.all([
        api.getSocialPosts(),
        api.getDevelopmentWorks(),
        api.getCitizens(),
        api.getTeam(),
        api.getEvents(),
        api.getLeaders()
      ]);

      if (socRes.success) setSocialData(socRes);
      if (devRes.success && devRes.stats) setWorksStats(devRes.stats);
      if (citRes.success) setCitizens(citRes.citizens.slice(0, 5));
      if (tmRes.success) setTeam(tmRes.members.slice(0, 4));
      if (evRes.success) setEvents(evRes.events.slice(0, 4));
      if (leadRes.success) setLeaders(leadRes.leaders);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const handleSyncSocial = async () => {
    setSyncing(true);
    const res = await api.syncSocial('Admin (Super Admin)');
    setSyncing(false);
    if (res.success) {
      showToast('सोशल मीडिया फीड्स सफलतापूर्वक सिंक की गईं!', 'success');
      loadDashboardData();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Welcome & Leaders Banner (Mockups 2 & 3) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-orange-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/60 px-2.5 py-1 rounded-md border border-orange-800/60">
              Constituency Control Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              Welcome Back, Team!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Manage, Monitor and Empower Development • इटावा विधानसभा (200)
            </p>
          </div>

          {/* Leaders Trio Card (Mockup 2 & 3 Header) */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center space-x-4">
            <div className="flex -space-x-3 items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow bg-slate-200">
                <img src="/images/media_1789490967561.jpg" alt="PM Modi" className="w-full h-full object-cover" />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-400 shadow bg-slate-200">
                <img src="/images/media_1789490967561.jpg" alt="CM Yogi" className="w-full h-full object-cover" />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400 shadow bg-slate-200">
                <img src="/images/poli4.png" alt="MLA Sarita Bhadauria" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="text-left border-l border-white/20 pl-3">
              <div className="text-[10px] uppercase font-bold text-orange-300">Tuesday, 15 September 2026</div>
              <div className="text-xs font-black text-white">“सेवा, संवाद, विकास हमारा संकल्प”</div>
              <div className="text-[10px] text-slate-300">नरेन्द्र मोदी • योगी आदित्यनाथ • सरिता भदौरिया</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 KPI Stat Cards (Mockup 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Works */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HardHat className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">125+</div>
            <div className="text-xs font-bold text-slate-500">Development Works</div>
          </div>
        </div>

        {/* Card 2: Citizens */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18%
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">50,000+</div>
            <div className="text-xs font-bold text-slate-500">Citizens Registered</div>
          </div>
        </div>

        {/* Card 3: Social Media Posts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +26%
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">2,000+</div>
            <div className="text-xs font-bold text-slate-500">Social Media Posts</div>
          </div>
        </div>

        {/* Card 4: Events */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14%
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">350+</div>
            <div className="text-xs font-bold text-slate-500">Meetings & Events</div>
          </div>
        </div>

        {/* Card 5: Active Members */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +20%
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">1,200+</div>
            <div className="text-xs font-bold text-slate-500">Active Members</div>
          </div>
        </div>

      </div>

      {/* Row 1: Social Media Hub & Leaders Mentions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Social Media Overview (Mockup 2 Left) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Social Media Overview</h3>
              <p className="text-xs text-slate-500">Live feeds connected across official channels</p>
            </div>
            <button
              onClick={handleSyncSocial}
              disabled={syncing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {/* 4 Connected Social Platforms */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
              <div className="text-base mb-1 font-bold text-blue-600">Facebook</div>
              <div className="text-lg font-black text-slate-900">12,450</div>
              <div className="text-[10px] text-slate-500">Followers</div>
              <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ● Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-100 text-center">
              <div className="text-base mb-1 font-bold text-pink-600">Instagram</div>
              <div className="text-lg font-black text-slate-900">8,920</div>
              <div className="text-[10px] text-slate-500">Followers</div>
              <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ● Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 text-center">
              <div className="text-base mb-1 font-bold text-red-600">YouTube</div>
              <div className="text-lg font-black text-slate-900">25,300</div>
              <div className="text-[10px] text-slate-500">Subscribers</div>
              <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ● Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <div className="text-base mb-1 font-bold text-slate-800">X / Twitter</div>
              <div className="text-lg font-black text-slate-900">4,870</div>
              <div className="text-[10px] text-slate-500">Followers</div>
              <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ● Connected
              </span>
            </div>
          </div>

          {/* Recent Social Media Posts with Auto-Added Tag */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
              <span>Recent Social Media Posts</span>
              <button onClick={() => setAdminTab('social')} className="text-orange-600 hover:underline">
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {(socialData?.posts || []).slice(0, 3).map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                      <img src={p.media || '/images/poli1.png'} alt="Post" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{p.content}</h5>
                      <span className="text-[10px] text-slate-400 capitalize">{p.platform} • {p.date}</span>
                    </div>
                  </div>

                  <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ● Auto Added
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaders & Mentions List (Mockup 2 Right) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Leaders & Mentions</h3>
              <button onClick={() => setAdminTab('leaders')} className="text-xs text-orange-600 font-bold">
                View All
              </button>
            </div>

            <div className="space-y-3 pt-3">
              {leaders.slice(0, 4).map((l) => (
                <div key={l.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300">
                      <img src={l.photo} alt={l.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{l.name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{l.position}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-black text-slate-800">{l.posts} posts</div>
                    <div className="text-[9px] text-emerald-600 font-bold">{l.engagement} reach</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setAdminTab('leaders')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition text-center"
            >
              Manage Leader Network
            </button>
          </div>
        </div>

      </div>

      {/* Row 2: Constituency Map & Development Status Donut Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Development Status Donut Chart (Mockup 2 Center) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Development Work Status</h3>
              <p className="text-xs text-slate-500">Progress across 125 registered works</p>
            </div>
            <button onClick={() => setAdminTab('works')} className="text-xs text-orange-600 font-bold">
              View All Works
            </button>
          </div>

          {/* Donut representation */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Circular SVG Donut */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background track */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                {/* Completed (36%) - Green */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="36 64" strokeDashoffset="0" />
                {/* In Progress (38%) - Blue */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="38 62" strokeDashoffset="-36" />
                {/* Approved (16%) - Purple */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4" strokeDasharray="16 84" strokeDashoffset="-74" />
                {/* Not Started (10%) - Slate */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f43f5e" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-90" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 leading-none">{worksStats.total || 125}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5">Total Works</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">Completed:</span>
                <span className="font-extrabold text-slate-900">{worksStats.completed} (36%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-slate-600">In Progress:</span>
                <span className="font-extrabold text-slate-900">{worksStats.inProgress} (38%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-slate-600">Approved:</span>
                <span className="font-extrabold text-slate-900">{worksStats.approved} (16%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-slate-600">Not Started:</span>
                <span className="font-extrabold text-slate-900">{worksStats.notStarted} (10%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel (Mockup 2 Right) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-base font-extrabold text-slate-900">Quick Actions</h3>
          <p className="text-xs text-slate-500">One-click administrative tools & workflows</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => setAdminTab('works')}
              className="p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition shadow-sm"
            >
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <span>Add New Work</span>
            </button>

            <button
              onClick={() => setAdminTab('events')}
              className="p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition shadow-sm"
            >
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Create Event</span>
            </button>

            <button
              onClick={() => {
                const text = prompt('Enter notification alert message:');
                if (text) showToast(`Notification dispatched: ${text}`, 'success');
              }}
              className="p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition shadow-sm"
            >
              <Bell className="w-5 h-5 text-rose-600" />
              <span>Send Notification</span>
            </button>

            <button
              onClick={() => setAdminTab('citizens')}
              className="p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition shadow-sm"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Import Citizens</span>
            </button>

            <button
              onClick={() => setAdminTab('team')}
              className="p-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition shadow-sm"
            >
              <UploadCloud className="w-5 h-5 text-indigo-600" />
              <span>Upload Members</span>
            </button>

            <button
              onClick={() => setAdminTab('ai-assistant')}
              className="p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition shadow-sm"
            >
              <Bot className="w-5 h-5 text-amber-600" />
              <span>AI Generate Article</span>
            </button>
          </div>
        </div>

      </div>

      {/* Row 3: Citizens Registrations, Team Members, and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Latest Citizen Registrations (Mockup 2 Bottom Left) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Latest Citizen Registrations</h3>
            <button onClick={() => setAdminTab('citizens')} className="text-xs text-orange-600 font-bold">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Mobile</th>
                  <th className="pb-2">Village</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {citizens.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900">{c.name}</td>
                    <td className="py-2.5 text-slate-500">{c.mobile}</td>
                    <td className="py-2.5">{c.village}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.type === 'Supporter' ? 'bg-amber-100 text-amber-800' :
                        c.type === 'Volunteer' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Members List (Mockup 2 Bottom Center) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Team Members</h3>
            <button onClick={() => setAdminTab('team')} className="text-xs text-orange-600 font-bold">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {team.map((t) => (
              <div key={t.id} className="p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900">{t.name}</div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {t.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.area}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events (Mockup 2 Bottom Right) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Upcoming Events</h3>
            <button onClick={() => setAdminTab('events')} className="text-xs text-orange-600 font-bold">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black leading-none">{ev.dateDay}</span>
                  <span className="text-[8px] uppercase font-bold">{ev.dateMonth}</span>
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 truncate">{ev.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{ev.location}</div>
                  <div className="text-[9px] text-orange-600 font-bold mt-0.5">{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
