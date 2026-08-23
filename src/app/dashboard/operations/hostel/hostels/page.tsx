"use client";

import React from "react";
import { Home, Search, Filter, Plus, Users, Shield, MapPin, Settings2 } from "lucide-react";

export default function HostelsPage() {
  const hostels = [
    { id: "HST-01", name: "North Wing", type: "Boys", capacity: 120, occupied: 115, warden: "Mr. James Smith", contact: "+1 234 567 8900", status: "Active" },
    { id: "HST-02", name: "South Wing", type: "Girls", capacity: 120, occupied: 108, warden: "Ms. Sarah Johnson", contact: "+1 234 567 8901", status: "Active" },
    { id: "HST-03", name: "East Annex", type: "Boys", capacity: 40, occupied: 35, warden: "Mr. David Kim", contact: "+1 234 567 8902", status: "Active" },
    { id: "HST-04", name: "West Block", type: "Girls", capacity: 40, occupied: 20, warden: "Mrs. Emily Chen", contact: "+1 234 567 8903", status: "Maintenance" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Home className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Hostel Buildings</h2>
                 <p className="text-sm font-medium text-slate-500">Manage hostel blocks, capacities, and assigned wardens.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Add Hostel
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Hostel Name or Warden..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Types</option>
                 <option>Boys</option>
                 <option>Girls</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hostels.map((hostel) => (
            <div key={hostel.id} className="border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white">
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-slate-800">{hostel.name}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                           hostel.type === 'Boys' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                           {hostel.type}
                        </span>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{hostel.id}</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg ${
                     hostel.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                     {hostel.status}
                  </span>
               </div>
               
               <div className="flex items-center gap-6 py-4 border-y border-slate-100 mb-4">
                  <div className="flex-1">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy</span>
                        <div className="text-right">
                           <span className="text-lg font-black text-slate-800">{hostel.occupied}</span>
                           <span className="text-sm font-medium text-slate-400"> / {hostel.capacity}</span>
                        </div>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                           className={`h-full rounded-full ${
                              (hostel.occupied / hostel.capacity) > 0.9 ? 'bg-rose-500' : 'bg-emerald-500'
                           }`}
                           style={{ width: `${(hostel.occupied / hostel.capacity) * 100}%` }}
                        ></div>
                     </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="flex-1">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Availability</span>
                     <span className="text-lg font-black text-emerald-600">{hostel.capacity - hostel.occupied} <span className="text-sm font-medium text-slate-400">Beds</span></span>
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-slate-500" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{hostel.warden}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Warden • {hostel.contact}</p>
                     </div>
                  </div>
                  <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors">
                     <Settings2 className="w-5 h-5" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
