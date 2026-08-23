"use client";
import React from "react";
import { CheckSquare, AlertTriangle, TrendingUp, TrendingDown, Users } from "lucide-react";

export default function AcademicAttendanceTab() {
  const gradeAttendance = [
    { grade: "Grade 1", rate: 96.2, trend: 0.5 },
    { grade: "Grade 2", rate: 95.8, trend: 0.2 },
    { grade: "Grade 3", rate: 94.1, trend: -0.4 },
    { grade: "Grade 4", rate: 93.5, trend: -1.2 },
    { grade: "Grade 5", rate: 97.0, trend: 1.1 },
    { grade: "Grade 6", rate: 91.2, trend: -3.5 },
    { grade: "Grade 7", rate: 94.8, trend: 0.3 },
    { grade: "Grade 8", rate: 92.4, trend: -0.8 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-lg font-black text-slate-800">Attendance Insights</h2>
            <p className="text-sm text-slate-500">Track daily attendance rates and identify chronic absenteeism.</p>
         </div>
         <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2">
            Today's Rate: 94.2%
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Chronic Absenteeism */}
         <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-2">
               <AlertTriangle className="w-4 h-4 text-rose-500" /> Chronic Absenteeism
            </h3>
            <p className="text-xs text-rose-600 mb-6">Students with attendance below 80% this term.</p>
            
            <div className="text-center mb-6">
               <div className="text-5xl font-black text-rose-700 mb-2">24</div>
               <div className="text-xs font-bold text-rose-500 uppercase">Students At Risk</div>
            </div>

            <div className="space-y-2">
               <button className="w-full bg-white border border-rose-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-rose-100 hover:text-rose-800 transition-colors">
                  View Student List
               </button>
               <button className="w-full bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-rose-700 transition-colors">
                  Send Parent Alerts (SMS)
               </button>
            </div>
         </div>

         {/* Grade Breakdown */}
         <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
               <Users className="w-4 h-4 text-indigo-500" /> Attendance by Grade
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {gradeAttendance.map((item, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer">
                     <div className="text-xs font-bold text-slate-500 mb-2">{item.grade}</div>
                     <div className={`text-2xl font-black mb-1 ${item.rate < 93 ? 'text-amber-600' : 'text-slate-800'}`}>
                        {item.rate}%
                     </div>
                     <div className={`flex items-center justify-center gap-1 text-[10px] font-bold uppercase ${item.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.trend > 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                        {Math.abs(item.trend)}%
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
}
