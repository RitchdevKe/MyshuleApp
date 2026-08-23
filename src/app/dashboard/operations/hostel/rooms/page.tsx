"use client";

import React from "react";
import { BedDouble, Search, Filter, Plus, Home, Settings, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RoomsPage() {
  const rooms = [
    { id: "RM-NW-101", hostel: "North Wing", floor: "1st Floor", type: "Bunk Beds (4)", capacity: 4, occupied: 4, status: "Full", condition: "Good" },
    { id: "RM-NW-102", hostel: "North Wing", floor: "1st Floor", type: "Bunk Beds (4)", capacity: 4, occupied: 3, status: "Available", condition: "Excellent" },
    { id: "RM-SW-201", hostel: "South Wing", floor: "2nd Floor", type: "Single Beds (2)", capacity: 2, occupied: 2, status: "Full", condition: "Good" },
    { id: "RM-SW-202", hostel: "South Wing", floor: "2nd Floor", type: "Single Beds (2)", capacity: 2, occupied: 0, status: "Maintenance", condition: "Needs Repair" },
    { id: "RM-EA-101", hostel: "East Annex", floor: "Ground", type: "Bunk Beds (6)", capacity: 6, occupied: 5, status: "Available", condition: "Fair" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl hidden md:block">
                 <BedDouble className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Rooms & Beds</h2>
                 <p className="text-sm font-medium text-slate-500">Manage individual room capacity and bed availability.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Add Room
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Room ID or Hostel..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Hostels</option>
                 <option>North Wing</option>
                 <option>South Wing</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Status
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Room Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Capacity</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Occupancy</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {rooms.map((room) => (
                   <tr key={room.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-black text-slate-800 text-sm block mb-1">{room.id}</span>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                           <Home className="w-3 h-3 text-slate-400" /> {room.hostel} • {room.floor}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100/50">{room.type}</span>
                     </td>
                     <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center">
                           <span className={`text-lg font-black ${room.capacity - room.occupied > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                              {room.occupied} <span className="text-sm text-slate-400">/ {room.capacity}</span>
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Beds Filled</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                            room.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 
                            room.status === 'Full' ? 'bg-blue-50 text-blue-600' : 
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {room.status === 'Available' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {room.status === 'Maintenance' && <AlertCircle className="w-3.5 h-3.5" />}
                            {room.status}
                          </span>
                          <span className={`text-[10px] font-bold ml-1 ${
                             room.condition === 'Excellent' || room.condition === 'Good' ? 'text-slate-500' : 'text-rose-500'
                          }`}>
                             Condition: {room.condition}
                          </span>
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <Settings className="w-5 h-5" />
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
