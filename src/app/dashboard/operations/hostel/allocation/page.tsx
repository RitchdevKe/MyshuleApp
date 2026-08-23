"use client";

import React from "react";
import { Key, Search, Filter, UserPlus, CheckCircle2, Clock, AlertCircle, RefreshCcw } from "lucide-react";

export default function AllocationPage() {
  const allocations = [
    { id: "ALC-884", student: "Michael Johnson", grade: "Grade 10", hostel: "North Wing", room: "RM-NW-101", bed: "B2", status: "Checked In", date: "Aug 01, 2024" },
    { id: "ALC-885", student: "David Smith", grade: "Grade 11", hostel: "North Wing", room: "RM-NW-102", bed: "A1", status: "Pending Check-In", date: "Aug 15, 2024" },
    { id: "ALC-886", student: "Sarah Williams", grade: "Grade 12", hostel: "South Wing", room: "RM-SW-201", bed: "A1", status: "Checked In", date: "Aug 02, 2024" },
    { id: "ALC-887", student: "Emily Brown", grade: "Grade 9", hostel: "West Block", room: "RM-WB-105", bed: "B1", status: "Vacated", date: "Jul 30, 2024" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl hidden md:block">
                 <Key className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Student Allocation</h2>
                 <p className="text-sm font-medium text-slate-500">Assign students to rooms and track check-in status.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <UserPlus className="w-4 h-4" />
              Allocate Student
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Student Name or Room..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Checked In</option>
                 <option>Pending</option>
                 <option>Vacated</option>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Room</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Bed #</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Date</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {allocations.map((alloc) => (
                   <tr key={alloc.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{alloc.student}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{alloc.id}</span>
                           <span className="text-[10px] font-medium text-slate-500">{alloc.grade}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-primary-700 text-sm">{alloc.room}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{alloc.hostel}</p>
                     </td>
                     <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-black text-sm border border-slate-200">
                           {alloc.bed}
                        </span>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                            alloc.status === 'Checked In' ? 'bg-emerald-50 text-emerald-600' : 
                            alloc.status === 'Pending Check-In' ? 'bg-amber-50 text-amber-600' : 
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {alloc.status === 'Checked In' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {alloc.status === 'Pending Check-In' && <Clock className="w-3.5 h-3.5" />}
                            {alloc.status === 'Vacated' && <AlertCircle className="w-3.5 h-3.5" />}
                            {alloc.status}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 ml-1 mt-0.5">{alloc.date}</span>
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <RefreshCcw className="w-5 h-5" />
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
