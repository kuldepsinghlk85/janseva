import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, Clock, Laptop, User, Search, Filter } from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');

  useEffect(() => {
    api.getAuditLogs().then(res => {
      if (res.success) setLogs(res.logs);
    });
  }, []);

  const modules = ['All', 'Content Readership', 'Viral Sharing', 'Citizen Database', 'Citizen Portal', 'Jan Samvad', 'Direct MLA Communication'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.module && log.module.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesModule = selectedModule === 'All' || log.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold mb-1">
            <Shield className="w-3.5 h-3.5 text-slate-700" />
            <span>सुरक्षा एवं गतिविधि ऑडिट</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">User Activity & Audit Logs</h2>
          <p className="text-xs text-slate-500">प्रशासनिक पैनल में किए गए सभी बदलावों, अप्रूवल, लॉगिन, नागरिक पठन व शेयरिंग का पूर्ण ऑडिट रिकॉर्ड</p>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खोजें (User, Action)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            />
          </div>

          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white"
          >
            {modules.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>


      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Action Performed</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Device & Environment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.user}</span>

                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">
                    {log.action}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                      {log.module}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 text-[11px]">
                    {log.device}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
