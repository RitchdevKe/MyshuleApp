"use client";

import React from "react";
import { Heart, Search, Filter, Plus, Calendar, Clock, Activity, CornerUpLeft, CheckCircle2 } from "lucide-react";

export default function VisitsPage() {
  const visits = [
    { id: "VST-2401", student: "Sarah Williams", grade: "Grade 12", date: "Aug 11, 2024", timeIn: "09:15 AM", timeOut: "09:45 AM", symptom: "Headache", treatment: "Ibuprofen (200mg), Rest", status: "Returned to Class" },
    { id: "VST-2402", student: "David Kim", grade: "Grade 8", date: "Aug 11, 2024", timeIn: "10:30 AM", timeOut: "-", symptom: "Stomach Ache", treatment: "Observation", status: "In Clinic" },
    { id: "VST-2403", student: "Michael Johnson", grade: "Grade 9", date: "Aug 11, 2024", timeIn: "11:45 AM", timeOut: "12:30 PM", symptom: "Scraped Knee", treatment: "Cleaned, Bandaged", status: "Returned to Class" },
    { id: "VST-2404", student: "Emily Chen", grade: "Grade 10", date: "Aug 10, 2024", timeIn: "14:10 PM", timeOut: "15:00 PM", symptom: "Asthma Flare", treatment: "Inhaler Administered", status: "Sent Home" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl hidden md:block">
                 <Heart className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Clinic Visits Log</h2>
                 <p className="text-sm font-medium text-slate-500">Track daily student visits, symptoms, and administered treatments.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Log New Visit
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Student Name or Symptom..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Calendar className="w-4 h-4" />
                 Today
              </button>
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>In Clinic</option>
                 <option>Returned to Class</option>
                 <option>Sent Home</option>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Visit Info</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Symptom & Treatment</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Resolution Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {visits.map((visit) => (
                   <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{visit.student}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{visit.id}</span>
                           <span className="text-[10px] font-medium text-slate-500">{visit.grade}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1 text-sm font-bold text-slate-700">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           {visit.date}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                           <Clock className="w-3.5 h-3.5" /> {visit.timeIn} - {visit.timeOut}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-slate-700 text-sm mb-0.5">Symptom: <span className="text-primary-700">{visit.symptom}</span></p>
                        <p className="text-xs text-slate-500 line-clamp-1">Rx: {visit.treatment}</p>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                         visit.status === 'Returned to Class' ? 'bg-emerald-50 text-emerald-600' : 
                         visit.status === 'In Clinic' ? 'bg-amber-50 text-amber-600' : 
                         'bg-rose-50 text-rose-600'
                       }`}>
                         {visit.status === 'Returned to Class' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {visit.status === 'In Clinic' && <Activity className="w-3.5 h-3.5" />}
                         {visit.status === 'Sent Home' && <CornerUpLeft className="w-3.5 h-3.5" />}
                         {visit.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1 ml-auto">
                           Update
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
