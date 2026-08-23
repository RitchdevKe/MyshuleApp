"use client";

import React from "react";
import { CheckCircle2, Search, Filter, Calendar, Clock, AlertCircle, XCircle } from "lucide-react";

export default function AttendancePage() {
  const attendance = [
    { id: "ATT-101", student: "Michael Johnson", hostel: "North Wing", room: "RM-NW-101", status: "Present", time: "19:05", date: "Aug 11, 2024" },
    { id: "ATT-102", student: "David Smith", hostel: "North Wing", room: "RM-NW-102", status: "Absent", time: "-", date: "Aug 11, 2024" },
    { id: "ATT-103", student: "Sarah Williams", hostel: "South Wing", room: "RM-SW-201", status: "Present", time: "19:12", date: "Aug 11, 2024" },
    { id: "ATT-104", student: "Emily Brown", hostel: "West Block", room: "RM-WB-105", status: "On Leave", time: "-", date: "Aug 11, 2024" },
    { id: "ATT-105", student: "James Wilson", hostel: "East Annex", room: "RM-EA-101", status: "Present", time: "18:55", date: "Aug 11, 2024" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
                 <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Daily Boarding Attendance</h2>
                 <p className="text-sm font-medium text-slate-500">Track evening roll calls and student presence in hostels.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <CheckCircle2 className="w-4 h-4" />
              Mark Attendance
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Student or Room..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Calendar className="w-4 h-4" />
                 Today
              </button>
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Present</option>
                 <option>Absent</option>
                 <option>On Leave</option>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Hostel & Room</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {attendance.map((record) => (
                   <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{record.student}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{record.id}</span>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-primary-700 text-sm">{record.room}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{record.hostel}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700 text-sm">{record.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                           <Clock className="w-3.5 h-3.5" /> {record.time}
                        </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                         record.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 
                         record.status === 'Absent' ? 'bg-rose-50 text-rose-600' : 
                         'bg-amber-50 text-amber-600'
                       }`}>
                         {record.status === 'Present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {record.status === 'Absent' && <XCircle className="w-3.5 h-3.5" />}
                         {record.status === 'On Leave' && <AlertCircle className="w-3.5 h-3.5" />}
                         {record.status}
                       </span>
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
