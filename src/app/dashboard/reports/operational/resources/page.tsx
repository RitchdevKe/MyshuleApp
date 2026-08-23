"use client";

import React from "react";
import { Download, Building2, Bus, BookOpen, FlaskConical, Map, Calendar } from "lucide-react";

export default function ResourcesPage() {
  const transportRoutes = [
    { route: "R01 - Westlands", bus: "KCD 123X", capacity: 45, enrolled: 42, util: 93 },
    { route: "R02 - Kilimani", bus: "KCE 456Y", capacity: 45, enrolled: 45, util: 100 },
    { route: "R03 - Lavington", bus: "KCF 789Z", capacity: 33, enrolled: 28, util: 84 },
    { route: "R04 - Karen", bus: "KCG 112A", capacity: 60, enrolled: 48, util: 80 },
    { route: "R05 - Langata", bus: "KCH 334B", capacity: 45, enrolled: 20, util: 44 },
  ];

  const facilities = [
    { name: "Main Library", icon: BookOpen, capacity: 250, current: 185, status: "Active" },
    { name: "Science Lab A", icon: FlaskConical, capacity: 40, current: 35, status: "Active" },
    { name: "Computer Lab 1", icon: Building2, capacity: 60, current: 60, status: "Full" },
    { name: "Sports Arena", icon: Map, capacity: 1000, current: 450, status: "Active" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Resource Utilization</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitor transport routes, facility occupancy, and physical assets.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm">
          <Download className="w-4 h-4" /> Download Manifests
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Transport Fleet */}
         <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-500" /> Transport Fleet Utilization
               </h3>
            </div>
            <div className="flex-1 p-6">
               <div className="space-y-5">
                  {transportRoutes.map((route, i) => (
                     <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                           <div>
                              <div className="font-bold text-slate-800 text-sm">{route.route}</div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bus: {route.bus} • Cap: {route.capacity}</div>
                           </div>
                           <div className="text-right">
                              <div className={`font-black text-sm ${route.util < 50 ? 'text-rose-600' : route.util === 100 ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                 {route.util}%
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{route.enrolled} Enrolled</div>
                           </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                           <div 
                              className={`h-2 rounded-full transition-all ${
                                 route.util < 50 ? 'bg-rose-400' : 
                                 route.util === 100 ? 'bg-indigo-500' : 
                                 'bg-emerald-400'
                              }`} 
                              style={{ width: `${route.util}%` }}
                           ></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Specialized Facilities */}
         <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" /> Live Facility Occupancy
               </h3>
               <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
               </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {facilities.map((fac, i) => {
                  const Icon = fac.icon;
                  const occPercent = Math.round((fac.current / fac.capacity) * 100);
                  return (
                     <div key={i} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                           </div>
                           <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              fac.status === 'Full' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                           }`}>
                              {fac.status}
                           </span>
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-sm mb-1">{fac.name}</div>
                           <div className="flex justify-between items-end mb-1">
                              <div className="text-xs text-slate-500">{fac.current} / {fac.capacity}</div>
                              <div className="text-xs font-black text-blue-600">{occPercent}%</div>
                           </div>
                           <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div 
                                 className={`h-1.5 rounded-full ${occPercent >= 100 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                                 style={{ width: `${Math.min(occPercent, 100)}%` }}
                              ></div>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
      
      {/* Hostel Accomodation Tracker */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Building2 className="w-32 h-32" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 mb-1">
                  Hostel & Dormitory Boarding
               </h3>
               <p className="text-sm font-medium text-slate-400">Current bed occupancy across all 4 boarding houses.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex-1 md:flex-none">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Total Beds</div>
                  <div className="text-2xl font-black text-white">800</div>
               </div>
               <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex-1 md:flex-none">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Occupied</div>
                  <div className="text-2xl font-black text-emerald-400">752 <span className="text-xs text-slate-400 font-medium">(94%)</span></div>
               </div>
               <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex-1 md:flex-none">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Available</div>
                  <div className="text-2xl font-black text-rose-400">48</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
