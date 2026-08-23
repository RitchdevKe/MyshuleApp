"use client";

import React from "react";
import { Building2, Search, Filter, Map, Plus, Users, DoorOpen, Wrench, ShieldAlert } from "lucide-react";

export default function FacilitiesPage() {
  const facilities = [
    { id: "FAC-101", name: "Main Auditorium", block: "Block A", type: "Event Space", capacity: 500, status: "Active", nextMaintenance: "Sep 15, 2024", manager: "Jane Doe" },
    { id: "FAC-102", name: "Science Lab 1", block: "Block B", type: "Laboratory", capacity: 40, status: "Under Maintenance", nextMaintenance: "Ongoing", manager: "Dr. Smith" },
    { id: "FAC-103", name: "Central Library", block: "Block C", type: "Academic", capacity: 200, status: "Active", nextMaintenance: "Oct 01, 2024", manager: "Alice Johnson" },
    { id: "FAC-104", name: "Indoor Sports Arena", block: "Sports Complex", type: "Recreation", capacity: 1000, status: "Restricted", nextMaintenance: "Aug 20, 2024", manager: "Coach Carter" },
    { id: "FAC-105", name: "Cafeteria Main Hall", block: "Block D", type: "Dining", capacity: 350, status: "Active", nextMaintenance: "Sep 01, 2024", manager: "Chef Gordon" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
                 <Building2 className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Facilities & Spaces</h2>
                 <p className="text-sm font-medium text-slate-500">Manage building blocks, rooms, and space utilization.</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Map className="w-4 h-4" />
                 View Map
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                 <Plus className="w-4 h-4" />
                 Add Space
              </button>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Room Name, Block, or Type..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Blocks</option>
                 <option>Block A</option>
                 <option>Block B</option>
                 <option>Block C</option>
                 <option>Sports Complex</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/30">
           {facilities.map((facility) => (
              <div key={facility.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                 
                 <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{facility.id}</span>
                       <h3 className="text-lg font-black text-slate-800 leading-tight mt-1">{facility.name}</h3>
                       <p className="text-xs font-bold text-primary-600 mt-1">{facility.block}</p>
                    </div>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${
                       facility.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                       facility.status === 'Under Maintenance' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                       {facility.status === 'Active' && <DoorOpen className="w-4 h-4" />}
                       {facility.status === 'Under Maintenance' && <Wrench className="w-4 h-4" />}
                       {facility.status === 'Restricted' && <ShieldAlert className="w-4 h-4" />}
                    </span>
                 </div>

                 <div className="space-y-3 mb-5 relative z-10">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500 font-medium">Type</span>
                       <span className="font-bold text-slate-700">{facility.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500 font-medium flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Max Capacity</span>
                       <span className="font-bold text-slate-700">{facility.capacity} pax</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500 font-medium">Facility Manager</span>
                       <span className="font-bold text-slate-700">{facility.manager}</span>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Maintenance</p>
                       <p className={`text-sm font-bold mt-0.5 ${facility.nextMaintenance === 'Ongoing' ? 'text-amber-600' : 'text-slate-700'}`}>
                          {facility.nextMaintenance}
                       </p>
                    </div>
                    <button className="text-xs font-bold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors">
                       Details
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
