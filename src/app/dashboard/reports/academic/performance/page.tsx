"use client";
import React from "react";
import { BarChart2, TrendingUp, TrendingDown, Minus, Download, Filter, Target } from "lucide-react";

export default function AcademicPerformanceTab() {
  const subjects = [
    { name: "Mathematics", avg: 62.4, trend: -2.1, status: "declining" },
    { name: "English", avg: 74.8, trend: 1.5, status: "improving" },
    { name: "Kiswahili", avg: 71.2, trend: 0.2, status: "steady" },
    { name: "Science", avg: 68.9, trend: 3.4, status: "improving" },
    { name: "Social Studies", avg: 76.5, trend: -0.8, status: "declining" },
    { name: "CRE", avg: 81.2, trend: 2.1, status: "improving" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-lg font-black text-slate-800">Performance Analytics</h2>
            <p className="text-sm text-slate-500">Detailed breakdown of academic performance across subjects and classes.</p>
         </div>
         <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export Report
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Subject Performance */}
         <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-black text-slate-800">Subject Performance</h3>
               <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filter
               </button>
            </div>
            <div className="p-5 space-y-6">
               {subjects.map((subject, index) => (
                  <div key={index}>
                     <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-slate-800 text-sm">{subject.name}</div>
                        <div className="flex items-center gap-4">
                           <div className="text-sm font-black text-slate-700">{subject.avg}%</div>
                           <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider w-16 justify-end ${
                              subject.status === 'improving' ? 'text-emerald-600' : 
                              subject.status === 'declining' ? 'text-rose-600' : 'text-slate-500'
                           }`}>
                              {subject.trend > 0 ? '+' : ''}{subject.trend}% 
                              {subject.status === 'improving' && <TrendingUp className="w-3 h-3" />}
                              {subject.status === 'declining' && <TrendingDown className="w-3 h-3" />}
                              {subject.status === 'steady' && <Minus className="w-3 h-3" />}
                           </div>
                        </div>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                           className={`h-2 rounded-full ${
                              subject.avg >= 80 ? 'bg-emerald-500' : 
                              subject.avg >= 65 ? 'bg-indigo-500' : 
                              subject.avg >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                           }`} 
                           style={{ width: `${subject.avg}%` }}
                        ></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Matrix */}
         <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
               <Target className="w-24 h-24 text-emerald-100 absolute -right-4 -bottom-4 opacity-50 group-hover:scale-110 transition-transform" />
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-2">Top Performing Class</h3>
                  <div className="text-3xl font-black text-emerald-800 mb-1">Grade 8 East</div>
                  <div className="text-sm font-bold text-emerald-700">Average: 78.4%</div>
                  <div className="mt-4 pt-4 border-t border-emerald-200/50">
                     <div className="text-xs text-emerald-700 font-medium">Strongest in: Science (84%)</div>
                  </div>
               </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
               <TrendingDown className="w-24 h-24 text-rose-100 absolute -right-4 -bottom-4 opacity-50 group-hover:scale-110 transition-transform" />
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-rose-600 mb-2">Needs Intervention</h3>
                  <div className="text-3xl font-black text-rose-800 mb-1">Grade 9 West</div>
                  <div className="text-sm font-bold text-rose-700">Average: 58.1%</div>
                  <div className="mt-4 pt-4 border-t border-rose-200/50">
                     <div className="text-xs text-rose-700 font-medium">Weakest in: Mathematics (42%)</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
