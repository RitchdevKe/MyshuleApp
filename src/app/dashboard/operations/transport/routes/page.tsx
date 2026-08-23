"use client";

import React from "react";
import { Map, Search, Filter, Plus, Navigation2, Users, MapPin, Clock } from "lucide-react";

export default function RoutesPage() {
  const routes = [
    { id: "RT-01A", name: "North City Morning Run", vehicle: "KBC 123Z", driver: "John Smith", stops: 8, students: 45, estTime: "1h 15m", status: "Active" },
    { id: "RT-01B", name: "North City Evening Run", vehicle: "KBC 123Z", driver: "John Smith", stops: 8, students: 45, estTime: "1h 20m", status: "Active" },
    { id: "RT-02A", name: "East Suburbs Express", vehicle: "KDE 456X", driver: "David Kim", stops: 4, students: 28, estTime: "45m", status: "Active" },
    { id: "RT-03A", name: "West Valley Loop", vehicle: "KDD 112A", driver: "Alice Johnson", stops: 12, students: 55, estTime: "1h 30m", status: "Active" },
    { id: "RT-04A", name: "Downtown Special", vehicle: "KAZ 789Y", driver: "Robert Kiprono", stops: 5, students: 12, estTime: "40m", status: "Suspended" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Transport Routes</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Map className="w-4 h-4" />
               Route Map
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Plus className="w-4 h-4" />
               Create Route
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {routes.map((route) => (
            <div key={route.id} className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20 group-hover:scale-110 transition-transform ${
                  route.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
               }`}></div>
               
               <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className={`p-3 rounded-2xl ${route.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Navigation2 className="w-5 h-5" />
                     </div>
                     <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{route.id}</span>
                        <h3 className="text-lg font-black text-slate-800 leading-tight">{route.name}</h3>
                     </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${
                     route.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                     {route.status}
                  </span>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Students Assigned
                     </p>
                     <p className="text-xl font-black text-slate-800">{route.students}</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Total Stops
                     </p>
                     <p className="text-xl font-black text-slate-800">{route.stops}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100 relative z-10">
                  <div className="flex flex-col gap-1 text-slate-600">
                     <span className="font-bold">Vehicle: <span className="text-primary-600">{route.vehicle}</span></span>
                     <span className="font-medium text-xs">Driver: {route.driver}</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Est. Duration</span>
                     <span className="flex items-center gap-1 font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {route.estTime}
                     </span>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
