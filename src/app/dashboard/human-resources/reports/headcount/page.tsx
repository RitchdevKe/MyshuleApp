"use client";

import React from "react";
import { Users, UserPlus, Heart, Briefcase, Filter, Download } from "lucide-react";

export default function HeadcountPage() {
  const departments = [
    { name: "Academic Staff", count: 120, percent: 55, color: "bg-blue-500" },
    { name: "Administration", count: 35, percent: 16, color: "bg-emerald-500" },
    { name: "Support & Maintenance", count: 40, percent: 18, color: "bg-amber-500" },
    { name: "IT & Technology", count: 12, percent: 6, color: "bg-indigo-500" },
    { name: "Management", count: 11, percent: 5, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Headcount & Demographics Overview</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl inline-block mb-4">
                <Users className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Employees</p>
             <p className="text-4xl font-black text-slate-800">218</p>
             <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">+4 from last month</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl inline-block mb-4">
                <Heart className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gender Ratio (M/F)</p>
             <p className="text-4xl font-black text-slate-800">48<span className="text-2xl text-slate-400">/52</span></p>
             <p className="text-xs font-bold text-slate-500 mt-2">Balanced demographics</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl inline-block mb-4">
                <Briefcase className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Average Tenure</p>
             <p className="text-4xl font-black text-slate-800">4.2 <span className="text-lg text-slate-500">yrs</span></p>
             <p className="text-xs font-bold text-emerald-600 mt-2">Above industry average</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl inline-block mb-4">
                <UserPlus className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">New Hires YTD</p>
             <p className="text-4xl font-black text-slate-800">24</p>
             <p className="text-xs font-bold text-slate-500 mt-2">On track with hiring plan</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Headcount by Department */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6">Headcount by Department</h3>
            <div className="space-y-5">
               {departments.map((dept, index) => (
                  <div key={index}>
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-700">{dept.name}</span>
                        <div className="text-right">
                           <span className="text-sm font-black text-slate-800">{dept.count}</span>
                           <span className="text-xs font-medium text-slate-400 ml-2">({dept.percent}%)</span>
                        </div>
                     </div>
                     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.percent}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Age Distribution (CSS visualization) */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-black text-slate-800 mb-6">Age Distribution</h3>
            <div className="flex-grow flex items-end justify-between gap-2 h-48 mt-4 border-b-2 border-slate-100 pb-2">
               {/* Custom CSS Bar Chart */}
               {[
                  { range: "18-25", count: 15, h: "h-[15%]" },
                  { range: "26-35", count: 75, h: "h-[75%]" },
                  { range: "36-45", count: 82, h: "h-[82%]" },
                  { range: "46-55", count: 34, h: "h-[34%]" },
                  { range: "56+", count: 12, h: "h-[12%]" }
               ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center justify-end w-full h-full group relative">
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity whitespace-nowrap z-10">
                        {bar.count} employees
                     </div>
                     <div className={`w-full max-w-[40px] bg-primary-200 hover:bg-primary-500 rounded-t-lg transition-all duration-300 ${bar.h}`}></div>
                     <span className="text-[10px] font-bold text-slate-500 mt-2">{bar.range}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
