"use client";
import React from "react";
import { Activity, Building } from "lucide-react";

export default function OperationalOverviewTab() {
  return (
    <div className="p-6 space-y-8">
      
      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-2xl font-black text-slate-800 mb-1">2,438</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Students</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-2xl font-black text-slate-800 mb-1">187</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Staff</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-2xl font-black text-emerald-600 mb-1">96.1%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Attendance</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-2xl font-black text-indigo-600 mb-1">88.4%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Fee Collection</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-2xl font-black text-amber-600 mb-1">73%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Lib Usage</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-2xl font-black text-blue-600 mb-1">81%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Transport Util</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-2xl font-black text-teal-600 mb-1">94%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Hostel Occ</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Live Activity Feed */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> Today's Activity Pulse
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">482</div>
              <div>
                <div className="font-bold text-slate-700 text-sm">Attendance Records</div>
                <div className="text-xs text-slate-500">Logged since 7:00 AM</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black">126</div>
              <div>
                <div className="font-bold text-slate-700 text-sm">Fee Transactions</div>
                <div className="text-xs text-slate-500">Processed today</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-black">19</div>
              <div>
                <div className="font-bold text-slate-700 text-sm">Disciplinary Actions</div>
                <div className="text-xs text-slate-500">Recorded across 3 campuses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-500" /> Key Resource Utilization
          </h3>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-4 shadow-sm">
               <div className="flex justify-between items-end mb-2">
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">Science Lab A</h4>
                   <div className="text-xs text-slate-500">Capacity: 40 Students</div>
                 </div>
                 <div className="text-right">
                   <div className="font-black text-lg text-amber-600">87%</div>
                 </div>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                 <div className="bg-amber-500 h-2 rounded-full" style={{ width: '87%' }}></div>
               </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-4 shadow-sm">
               <div className="flex justify-between items-end mb-2">
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">School Bus 04</h4>
                   <div className="text-xs text-slate-500">Route: Westlands</div>
                 </div>
                 <div className="text-right">
                   <div className="font-black text-lg text-rose-600">95%</div>
                 </div>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                 <div className="bg-rose-500 h-2 rounded-full" style={{ width: '95%' }}></div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
