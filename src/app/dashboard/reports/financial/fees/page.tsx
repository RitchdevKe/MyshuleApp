"use client";

import React, { useState } from "react";
import { DollarSign, Download, Filter, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

export default function FeesPage() {
  const [activeView, setActiveView] = useState("collection");

  return (
    <div className="p-6 space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Fee Analytics</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Detailed breakdown of expected vs collected fees.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex-1 sm:flex-none">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                     <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Total Expected</h3>
               </div>
               <div className="text-3xl font-black text-slate-800 mb-1">KSh 142.5M</div>
               <p className="text-xs font-bold text-emerald-600">+12% vs last term</p>
            </div>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                     <DollarSign className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Collected (72%)</h3>
               </div>
               <div className="text-3xl font-black text-primary-900 mb-1">KSh 102.6M</div>
               <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary-600 h-full rounded-full" style={{ width: '72%' }}></div>
               </div>
            </div>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-rose-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                     <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-rose-600">Outstanding</h3>
               </div>
               <div className="text-3xl font-black text-rose-700 mb-1">KSh 39.9M</div>
               <p className="text-xs font-bold text-rose-500">432 students with arrears</p>
            </div>
         </div>
      </div>

      {/* Breakdown by Grade */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
               <BarChart3 className="w-4 h-4 text-slate-400" /> Collection by Grade
            </h3>
         </div>
         <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
               <thead>
                  <tr className="bg-white border-b border-slate-100">
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Expected</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Collected</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {[
                     { grade: "Grade 1", expected: "12.5M", collected: "10.2M", outstanding: "2.3M", percent: 81 },
                     { grade: "Grade 2", expected: "12.8M", collected: "11.1M", outstanding: "1.7M", percent: 86 },
                     { grade: "Grade 3", expected: "13.2M", collected: "9.5M", outstanding: "3.7M", percent: 71 },
                     { grade: "Grade 4", expected: "14.0M", collected: "8.2M", outstanding: "5.8M", percent: 58 },
                     { grade: "Grade 5", expected: "14.5M", collected: "12.3M", outstanding: "2.2M", percent: 84 },
                  ].map((row, idx) => (
                     <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-sm text-slate-800">{row.grade}</td>
                        <td className="py-4 px-6 text-sm font-medium text-slate-600">{row.expected}</td>
                        <td className="py-4 px-6 text-sm font-bold text-emerald-600">{row.collected}</td>
                        <td className="py-4 px-6 text-sm font-bold text-rose-600">{row.outstanding}</td>
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                 <div className={`h-2 rounded-full ${row.percent < 60 ? 'bg-rose-500' : row.percent < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${row.percent}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-600 min-w-[3ch]">{row.percent}%</span>
                           </div>
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
