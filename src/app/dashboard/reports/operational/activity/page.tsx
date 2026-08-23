"use client";

import React, { useState } from "react";
import { Search, Filter, Download, Activity, Clock, User, ShieldAlert, CreditCard, BookOpen } from "lucide-react";

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const logs = [
    { id: "EVT-901", time: "10:45 AM", user: "Admin (J. Doe)", action: "Generated Term 2 Report Cards", type: "academic", icon: BookOpen },
    { id: "EVT-900", time: "10:32 AM", user: "Finance (S. Kama)", action: "Received M-PESA Payment: KSh 45,000 (STU-2023-014)", type: "finance", icon: CreditCard },
    { id: "EVT-899", time: "09:15 AM", user: "System", action: "Automated Daily Backup Completed successfully", type: "system", icon: Activity },
    { id: "EVT-898", time: "08:55 AM", user: "Security (Gate A)", action: "Unauthorized entry attempt flagged", type: "security", icon: ShieldAlert },
    { id: "EVT-897", time: "08:00 AM", user: "Teacher (M. Kariuki)", action: "Logged Grade 5 morning attendance (100%)", type: "academic", icon: User },
    { id: "EVT-896", time: "07:30 AM", user: "Transport (Route 2)", action: "Bus KCE 456Y departed terminal", type: "transport", icon: Activity },
    { id: "EVT-895", time: "Yesterday, 16:45", user: "Admin (J. Doe)", action: "Updated School Disciplinary Policy document", type: "system", icon: BookOpen },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">System Activity & Audit Log</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time chronological feed of critical events and user actions.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex-1 sm:flex-none">
            <Filter className="w-4 h-4" /> Filter Events
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
         {/* Search & Tools */}
         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
               <Clock className="w-4 h-4 text-primary-500" /> Event Timeline
            </h3>
            <div className="relative w-full sm:w-96">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                  type="text" 
                  placeholder="Search by ID, User, or Action..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         {/* Timeline Feed */}
         <div className="p-6">
            <div className="relative border-l border-slate-200 ml-4 space-y-8 pb-4">
               {logs.map((log, i) => {
                  const Icon = log.icon;
                  return (
                     <div key={i} className="relative pl-8">
                        {/* Timeline Node */}
                        <div className={`absolute -left-4 top-1.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${
                           log.type === 'finance' ? 'bg-emerald-500 text-white' :
                           log.type === 'security' ? 'bg-rose-500 text-white' :
                           log.type === 'academic' ? 'bg-indigo-500 text-white' :
                           'bg-slate-300 text-slate-700'
                        }`}>
                           <Icon className="w-3.5 h-3.5" />
                        </div>
                        
                        {/* Event Content */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                              <div className="text-xs font-black uppercase tracking-wider text-slate-500">{log.time} • {log.id}</div>
                              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-md">
                                 <User className="w-3 h-3" /> {log.user}
                              </div>
                           </div>
                           <p className="text-sm font-bold text-slate-800">{log.action}</p>
                        </div>
                     </div>
                  );
               })}
            </div>
            
            <div className="mt-4 text-center">
               <button className="text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors">
                  Load Older Events...
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
