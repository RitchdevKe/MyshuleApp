"use client";

import React from "react";
import { Truck, Search, Filter, Plus, Clock, Calendar, CheckCircle2, ChevronRight, User } from "lucide-react";

export default function TripsPage() {
  const trips = [
    { id: "TRP-9042", title: "Morning School Run - North", vehicle: "KBC 123Z", driver: "John Smith", type: "Routine", date: "Aug 11, 2024", time: "06:30 AM - 07:45 AM", status: "Completed" },
    { id: "TRP-9043", title: "Morning School Run - East", vehicle: "KDE 456X", driver: "David Kim", type: "Routine", date: "Aug 11, 2024", time: "06:45 AM - 07:30 AM", status: "Completed" },
    { id: "TRP-9044", title: "Field Trip: National Museum", vehicle: "KDD 112A", driver: "Alice Johnson", type: "Ad-hoc", date: "Aug 12, 2024", time: "09:00 AM - 14:00 PM", status: "Scheduled" },
    { id: "TRP-9045", title: "Evening School Run - North", vehicle: "KBC 123Z", driver: "John Smith", type: "Routine", date: "Aug 11, 2024", time: "15:30 PM - 16:45 PM", status: "Scheduled" },
    { id: "TRP-9046", title: "Sports Fixture: Away Game", vehicle: "KAZ 789Y", driver: "Robert Kiprono", type: "Ad-hoc", date: "Aug 13, 2024", time: "13:00 PM - 18:00 PM", status: "Scheduled" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl hidden md:block">
                 <Truck className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Trip Log & Scheduling</h2>
                 <p className="text-sm font-medium text-slate-500">Track routine school runs and schedule ad-hoc trips.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Schedule Trip
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Trip Title, Vehicle, or Driver..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Types</option>
                 <option>Routine Runs</option>
                 <option>Ad-hoc Trips</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Date Range
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Trip Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Timing</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Team</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {trips.map((trip) => (
                   <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm">{trip.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{trip.id}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span className={`text-[10px] font-black uppercase tracking-wider ${
                              trip.type === 'Routine' ? 'text-indigo-600' : 'text-amber-600'
                           }`}>
                              {trip.type}
                           </span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 mb-1 text-sm">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700">{trip.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                           <Clock className="w-3.5 h-3.5" />
                           <span>{trip.time}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 mb-1 text-sm">
                           <User className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700">{trip.driver}</span>
                        </div>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded inline-block">
                           {trip.vehicle}
                        </p>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                         trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                         trip.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 
                         'bg-slate-100 text-slate-600'
                       }`}>
                         {trip.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {trip.status === 'In Progress' && <Truck className="w-3.5 h-3.5" />}
                         {trip.status === 'Scheduled' && <Clock className="w-3.5 h-3.5" />}
                         {trip.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <ChevronRight className="w-5 h-5" />
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
