import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  BarChart2,
  Eye,
  Share2,
  Users,
  HardHat,
  Download,
  Database,
  TrendingUp,
  BookOpen,
  Search,
  User,
  Smartphone,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [readLogsData, setReadLogsData] = useState({ logs: [], totalReads: 0, uniqueReaders: 0, uniqueArticles: 0 });
  const [searchReaderQuery, setSearchReaderQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  useEffect(() => {
    api.getAnalytics().then(res => {
      if (res.success) setData(res);
    });

    api.getReadLogs().then(res => {
      if (res.success) {
        setReadLogsData(res);
      }
    });
  }, []);


  const overview = data?.overview || {
    totalCitizens: 542318,
    totalPosts: 1248,
    developmentWorks: 125,
    totalReach: '2.4M',
    whatsappShares: 84210,
    totalViews: 542318
  };

  const topVillages = data?.topVillages || [];
  const socialReach = data?.socialReach || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Analytics & Constituency Intelligence Reports</h2>
          <p className="text-xs text-slate-500">वेबसाइट विज़िट्स, सोशल मीडिया रीच, WhatsApp शेयरिंग एवं गाँववार सक्रियता की रिपोर्ट</p>
        </div>

        {/* Database Migration Export Buttons */}
        <div className="flex items-center space-x-2">
          <a
            href="/api/export/mongodb"
            download
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
            title="Download MongoDB JSON Dump"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>MongoDB Dump</span>
          </a>

          <a
            href="/api/export/postgresql"
            download
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow transition"
            title="Download PostgreSQL SQL Schema"
          >
            <Download className="w-3.5 h-3.5 text-blue-200" />
            <span>PostgreSQL Dump</span>
          </a>
        </div>
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Website Views</span>
            <Eye className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">5,42,318</div>
          <span className="text-[10px] text-emerald-600 font-bold">+16% this month</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Total Social Reach</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">2.4M</div>
          <span className="text-[10px] text-emerald-600 font-bold">+32% reach</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>WhatsApp Shares</span>
            <Share2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">84,210</div>
          <span className="text-[10px] text-emerald-600 font-bold">Virality High</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Active Works Tracked</span>
            <HardHat className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">125+</div>
          <span className="text-[10px] text-blue-600 font-bold">In 80 Villages</span>
        </div>
      </div>

      {/* Village-Level Breakdown & Social Platform Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Active Villages */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-900">सर्वाधिक सक्रिय गाँव (Top Active Villages)</h3>
          <div className="space-y-2.5">
            {topVillages.map((v, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{v.name}</div>
                  <div className="text-[10px] text-slate-500">{v.citizensCount?.toLocaleString('en-IN')} नागरिक पंजीकृत</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                  {v.worksCount} विकास कार्य
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Reach Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-900">सोशल मीडिया प्लेटफॉर्म विस्तार (Platform Reach)</h3>
          <div className="space-y-2.5">
            {socialReach.map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{s.platform}</div>
                  <div className="text-[10px] text-slate-500">{s.followers} जुड़े हुए सदस्य</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-xs text-slate-800">{s.reach} रीच</div>
                  <span className="text-[10px] font-bold text-emerald-600">{s.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SPECIAL SECTION: CONTENT READERSHIP & VIEWS AUDIT LOG (User Request) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span>कंटेंट एवं समाचार पाठक विश्लेषण (Readership Tracker)</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              कौन पाठक किस समाचार या सूचना को पढ़ रहा है? (Live Reader Analytics)
            </h3>
            <p className="text-xs text-slate-500">
              पोर्टल पर प्रकाशित खबरों, सरकारी योजनाओं व विकास गतिविधियों पर होने वाले प्रत्येक क्लिक और पाठक की वास्तविक लॉग रिपोर्ट।
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-center">
              <div className="text-xs font-bold text-slate-500">कुल पठन (Views)</div>
              <div className="text-lg font-black text-orange-700">{readLogsData.totalReads}</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-xs font-bold text-slate-500">विशिष्ट पाठक</div>
              <div className="text-lg font-black text-emerald-700">{readLogsData.uniqueReaders}</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-xs font-bold text-slate-500">पढ़ी गई सामग्री</div>
              <div className="text-lg font-black text-blue-700">{readLogsData.uniqueArticles}</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchReaderQuery}
              onChange={(e) => setSearchReaderQuery(e.target.value)}
              placeholder="समाचार शीर्षक, पाठक का नाम या मोबाइल खोजें..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>भूमिका:</span>
            </span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:bg-white"
            >
              <option value="All">सभी पाठक (All)</option>
              <option value="Citizen">नागरिक (Citizen)</option>
              <option value="Volunteer">स्वयंसेवक (Volunteer)</option>
              <option value="Staff">स्टाफ / एडमिन</option>
              <option value="Guest">अतिथि (Guest)</option>
            </select>
          </div>
        </div>

        {/* Reader Logs Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">दिनांक व समय</th>
                <th className="p-3.5">पढ़ी गई सूचना / समाचार</th>
                <th className="p-3.5">कैटेगरी</th>
                <th className="p-3.5">पाठक का नाम</th>
                <th className="p-3.5">भूमिका</th>
                <th className="p-3.5">मोबाइल</th>
                <th className="p-3.5">डिवाइस / माध्यम</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {(readLogsData.logs || [])
                .filter((l) => {
                  const matchesSearch = !searchReaderQuery ||
                    (l.title && l.title.toLowerCase().includes(searchReaderQuery.toLowerCase())) ||
                    (l.readerName && l.readerName.toLowerCase().includes(searchReaderQuery.toLowerCase())) ||
                    (l.readerMobile && l.readerMobile.includes(searchReaderQuery));
                  const matchesRole = selectedRoleFilter === 'All' || (l.readerRole && l.readerRole.toLowerCase() === selectedRoleFilter.toLowerCase());
                  return matchesSearch && matchesRole;
                })
                .slice(0, 50)
                .map((log) => (
                  <tr key={log.id} className="hover:bg-orange-50/40 transition">
                    <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">
                      {log.title}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.category || 'समाचार'}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-1.5 whitespace-nowrap">
                      <User className="w-3.5 h-3.5 text-orange-500" />
                      <span>{log.readerName}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.readerRole === 'Super Admin' || log.readerRole === 'Staff' ? 'bg-purple-100 text-purple-800' :
                        log.readerRole === 'Volunteer' ? 'bg-blue-100 text-blue-800' :
                        log.readerRole === 'Citizen' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {log.readerRole || 'Citizen'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                      {log.readerMobile || '—'}
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px] flex items-center space-x-1">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.device}</span>
                    </td>
                  </tr>
                ))}
              {readLogsData.logs?.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    अभी कोई पठन लॉग उपलब्ध नहीं है। जैसे ही कोई पाठक पोर्टल पर समाचार खोलेगा, उसका विवरण यहाँ स्वतः प्रदर्शित होगा।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

