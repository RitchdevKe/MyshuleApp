"use client";

import React from "react";
import { UserMinus, Users, Calendar, ArrowRight, ArrowDownRight, Filter, Download } from "lucide-react";

export default function TurnoverPage() {
  const departures = [
    { id: "OFF-24-12", employee: "David Kim", department: "IT & Technology", reason: "Resignation (Better Offer)", date: "Jul 31, 2024", tenure: "2.1 yrs" },
    { id: "OFF-24-11", employee: "Alice Wanjiku", department: "Academic Staff", reason: "Relocation", date: "Jul 15, 2024", tenure: "5.5 yrs" },
    { id: "OFF-24-10", employee: "Robert Kiprono", department: "Support & Maintenance", reason: "Contract Ended", date: "Jun 30, 2024", tenure: "1.0 yrs" },
    { id: "OFF-24-09", employee: "Sarah Palmer", department: "Management", reason: "Retirement", date: "Jun 15, 2024", tenure: "12.4 yrs" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Turnover & Retention Analytics</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Filter Period
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Download className="w-4 h-4" />
               Export PDF
            </button>
         </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <UserMinus className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">YTD Turnover Rate</p>
               <p className="text-2xl font-black text-slate-800">8.4%</p>
             </div>
           </div>
           <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowDownRight className="w-4 h-4" /> 1.2%
           </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Calendar className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Retention</p>
               <p className="text-2xl font-black text-slate-800">4.2 yrs</p>
             </div>
           </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Users className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Headcount Change</p>
               <p className="text-2xl font-black text-slate-800">+12</p>
             </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">YTD</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Reasons for Departure (CSS visualization) */}
         <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6">Reasons for Departure (YTD)</h3>
            <div className="space-y-5">
               {[
                  { reason: "Resignation (Other Offers)", count: 8, percent: 45, color: "bg-rose-500" },
                  { reason: "Contract Ended", count: 4, percent: 22, color: "bg-amber-500" },
                  { reason: "Relocation", count: 3, percent: 16, color: "bg-blue-500" },
                  { reason: "Retirement", count: 2, percent: 11, color: "bg-emerald-500" },
                  { reason: "Termination", count: 1, percent: 6, color: "bg-slate-800" },
               ].map((item, index) => (
                  <div key={index}>
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-700">{item.reason}</span>
                        <div className="text-right">
                           <span className="text-sm font-black text-slate-800">{item.count}</span>
                        </div>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Recent Departures Table */}
         <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-lg font-black text-slate-800">Recent Departures Log</h3>
               <button className="text-sm font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
               </button>
            </div>
            
            <div className="overflow-x-auto flex-grow">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-slate-200/60">
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee & Dept</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenure</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Exit Date</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {departures.map((dep) => (
                        <tr key={dep.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="py-4 px-6">
                              <p className="font-bold text-slate-800 text-sm">{dep.employee}</p>
                              <p className="text-xs font-medium text-slate-500">{dep.department}</p>
                           </td>
                           <td className="py-4 px-6">
                              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{dep.reason}</span>
                           </td>
                           <td className="py-4 px-6">
                              <span className="font-bold text-slate-700 text-sm">{dep.tenure}</span>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <span className="font-medium text-slate-600 text-sm">{dep.date}</span>
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
