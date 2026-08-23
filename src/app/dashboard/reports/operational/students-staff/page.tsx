"use client";

import React from "react";
import { Download, Users, UserPlus, GraduationCap, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function StudentsStaffPage() {
  const staffDepts = [
    { name: "Academic (Teachers)", count: 124, percent: 66, trend: "+2" },
    { name: "Administration", count: 18, percent: 10, trend: "0" },
    { name: "Support & Facilities", count: 25, percent: 13, trend: "-1" },
    { name: "Transport", count: 12, percent: 6, trend: "0" },
    { name: "Kitchen & Catering", count: 8, percent: 5, trend: "+1" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Students & Staff Demographics</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Analyze school population, ratios, and departmental staffing.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm">
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Students */}
        <div className="bg-white/80 backdrop-blur-xl border border-indigo-200/60 p-6 rounded-2xl shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <GraduationCap className="w-16 h-16 text-indigo-900" />
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <Users className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-700">Total Enrolled</h3>
           </div>
           <div className="text-4xl font-black text-slate-800 mb-1">2,438</div>
           <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3 h-3" /> +12% from last year
           </div>
        </div>

        {/* Total Staff */}
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-200/60 p-6 rounded-2xl shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <UserPlus className="w-16 h-16 text-emerald-900" />
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                 <Users className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700">Total Staff</h3>
           </div>
           <div className="text-4xl font-black text-slate-800 mb-1">187</div>
           <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="text-emerald-600 flex items-center"><ArrowUpRight className="w-3 h-3" /> +2</span> new hires this term
           </div>
        </div>

        {/* Student/Teacher Ratio */}
        <div className="bg-white/80 backdrop-blur-xl border border-amber-200/60 p-6 rounded-2xl shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                 <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-700">Student-to-Teacher Ratio</h3>
           </div>
           <div className="text-4xl font-black text-slate-800 mb-1">19.6 : 1</div>
           <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              Optimal range (target: 20:1)
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Staff Breakdown */}
         <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Staff by Department</h3>
            <div className="space-y-5">
               {staffDepts.map((dept, i) => (
                  <div key={i}>
                     <div className="flex justify-between items-end mb-2">
                        <div>
                           <div className="font-bold text-slate-700 text-sm">{dept.name}</div>
                        </div>
                        <div className="flex gap-4 items-center">
                           <div className="text-xs font-medium text-slate-500">{dept.count} members</div>
                           <div className="font-black text-sm text-slate-800 w-12 text-right">{dept.percent}%</div>
                        </div>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${dept.percent}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Student Gender Distribution & School Sections */}
         <div className="space-y-6">
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Student Gender Distribution</h3>
               <div className="flex h-12 rounded-xl overflow-hidden mb-4">
                  <div className="bg-indigo-400 flex items-center justify-center text-white font-black text-sm" style={{ width: '48%' }}>
                     Boys (48%)
                  </div>
                  <div className="bg-rose-400 flex items-center justify-center text-white font-black text-sm" style={{ width: '52%' }}>
                     Girls (52%)
                  </div>
               </div>
               <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>1,170 Boys</span>
                  <span>1,268 Girls</span>
               </div>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Enrollment by Section</h3>
               <div className="flex items-end gap-2 h-32 mt-4 border-b border-slate-200 pb-2">
                  <div className="flex-1 flex flex-col justify-end items-center group">
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-700 mb-1">640</div>
                     <div className="w-full bg-teal-400 rounded-t-md hover:bg-teal-500 transition-colors" style={{ height: '40%' }}></div>
                     <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Pre-Primary</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center group">
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-700 mb-1">1,024</div>
                     <div className="w-full bg-blue-400 rounded-t-md hover:bg-blue-500 transition-colors" style={{ height: '70%' }}></div>
                     <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Primary</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center group">
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-700 mb-1">774</div>
                     <div className="w-full bg-indigo-400 rounded-t-md hover:bg-indigo-500 transition-colors" style={{ height: '60%' }}></div>
                     <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Secondary</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
