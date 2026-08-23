"use client";

import React from "react";
import { ShieldAlert, Search, Filter, Plus, Calendar, User, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";

export default function WelfarePage() {
  const cases = [
    { id: "WLF-2401", student: "Emily Chen", grade: "Grade 10", counselor: "Ms. Adams", lastSession: "Aug 10, 2024", type: "Academic Stress", status: "Active Monitoring", severity: "Medium" },
    { id: "WLF-2402", student: "James Wilson", grade: "Grade 8", counselor: "Mr. Roberts", lastSession: "Aug 05, 2024", type: "Peer Conflict", status: "Resolved", severity: "Low" },
    { id: "WLF-2403", student: "Sarah Williams", grade: "Grade 12", counselor: "Dr. Hughes", lastSession: "Aug 11, 2024", type: "University Anxiety", status: "Active Monitoring", severity: "High" },
    { id: "WLF-2404", student: "Michael Johnson", grade: "Grade 9", counselor: "Ms. Adams", lastSession: "Jul 28, 2024", type: "Behavioral", status: "Follow-up Required", severity: "Medium" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Student Welfare & Counseling</h2>
                 <p className="text-sm font-medium text-slate-500">Track counseling sessions, psychological well-being, and welfare alerts.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Log Session
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Student Name or Case ID..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Active Monitoring</option>
                 <option>Follow-up Required</option>
                 <option>Resolved</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Case Info</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Counselor & Date</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Case Type & Severity</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {cases.map((welfare) => (
                   <tr key={welfare.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{welfare.student}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{welfare.id}</span>
                           <span className="text-[10px] font-medium text-slate-500">{welfare.grade}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-slate-700 text-sm mb-1">{welfare.counselor}</p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                           <Calendar className="w-3.5 h-3.5" /> {welfare.lastSession}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100/50 block w-max mb-1.5">{welfare.type}</span>
                        <div className="flex items-center gap-1.5">
                           <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded border ${
                              welfare.severity === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                              welfare.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-blue-50 text-blue-700 border-blue-200'
                           }`}>
                              {welfare.severity} Priority
                           </span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                         welfare.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 
                         welfare.status === 'Follow-up Required' ? 'bg-amber-50 text-amber-600' : 
                         'bg-indigo-50 text-indigo-600'
                       }`}>
                         {welfare.status === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {welfare.status === 'Active Monitoring' && <Search className="w-3.5 h-3.5" />}
                         {welfare.status === 'Follow-up Required' && <AlertCircle className="w-3.5 h-3.5" />}
                         {welfare.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <MessageSquare className="w-5 h-5" />
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
