"use client";

import React from "react";
import { FileText, Download, TrendingUp, Users, Calendar, AlertCircle } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { id: "REP-91", title: "Monthly Occupancy Summary", type: "Occupancy", date: "Aug 01, 2024", size: "1.2 MB" },
    { id: "REP-92", title: "Attendance Deficits", type: "Attendance", date: "Jul 31, 2024", size: "840 KB" },
    { id: "REP-93", title: "Maintenance Request Log", type: "Facilities", date: "Jul 15, 2024", size: "2.5 MB" },
    { id: "REP-94", title: "Fee Default Analysis", type: "Financial", date: "Jul 01, 2024", size: "1.8 MB" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
         <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
               <FileText className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800">Boarding Reports</h2>
               <p className="text-sm font-medium text-slate-500">Analytics and generated logs for hostel operations.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Avg Occupancy</span>
               </div>
               <div className="text-2xl font-black text-slate-800">86.8%</div>
               <div className="text-xs font-medium text-emerald-600 mt-1">+2.4% vs last term</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Total Boarders</span>
               </div>
               <div className="text-2xl font-black text-slate-800">278</div>
               <div className="text-xs font-medium text-slate-400 mt-1">Across 4 blocks</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Maintenance</span>
               </div>
               <div className="text-2xl font-black text-slate-800">12</div>
               <div className="text-xs font-medium text-amber-600 mt-1">Pending Requests</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Avg Attendance</span>
               </div>
               <div className="text-2xl font-black text-slate-800">94.2%</div>
               <div className="text-xs font-medium text-rose-600 mt-1">-1.1% this week</div>
            </div>
         </div>

         <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Generated Reports</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(report => (
               <div key={report.id} className="flex items-center justify-between p-4 bg-white border border-slate-200/60 rounded-2xl hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-start gap-3">
                     <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-primary-600 transition-colors">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm">{report.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{report.type}</span>
                           <span className="text-xs font-medium text-slate-500">{report.date} • {report.size}</span>
                        </div>
                     </div>
                  </div>
                  <button className="text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 p-2 rounded-xl transition-colors">
                     <Download className="w-4 h-4" />
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
