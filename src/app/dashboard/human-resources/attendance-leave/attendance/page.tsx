"use client";

import React from "react";
import { Clock, Filter, MoreVertical, LogIn, LogOut } from "lucide-react";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2 w-full md:w-auto">
            <input type="date" className="px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer" defaultValue="2026-10-25" />
         </div>
         <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
               <option>All Departments</option>
               <option>Academics</option>
               <option>Administration</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Filters
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[
           { name: "Jane Doe", dept: "Academics", in: "07:45 AM", out: "04:15 PM", status: "Present" },
           { name: "John Smith", dept: "Transport", in: "06:30 AM", out: "--:--", status: "Present" },
           { name: "Alice Johnson", dept: "Administration", in: "--:--", out: "--:--", status: "Absent" },
         ].map((record, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl transition-all duration-300">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                        {`E${i+1}`}
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-800">{record.name}</h3>
                        <p className="text-xs font-bold text-slate-500">{record.dept}</p>
                     </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                     record.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                     {record.status}
                  </span>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                     <LogIn className="w-4 h-4 text-emerald-500" />
                     {record.in}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                     <LogOut className="w-4 h-4 text-rose-500" />
                     {record.out}
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
