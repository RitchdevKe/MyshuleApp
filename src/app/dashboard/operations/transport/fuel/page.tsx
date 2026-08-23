"use client";

import React from "react";
import { Fuel, Search, Filter, Plus, TrendingDown, TrendingUp, Download, Receipt } from "lucide-react";

export default function FuelPage() {
  const fuelLogs = [
    { id: "FL-2024-892", vehicle: "KBC 123Z", driver: "John Smith", date: "Aug 11, 2024", volume: "45 Liters", cost: "$58.50", odometer: "42,150 km", efficiency: "6.2 km/L", trend: "down" },
    { id: "FL-2024-891", vehicle: "KDE 456X", driver: "David Kim", date: "Aug 10, 2024", volume: "30 Liters", cost: "$39.00", odometer: "18,400 km", efficiency: "8.5 km/L", trend: "up" },
    { id: "FL-2024-890", vehicle: "KDD 112A", driver: "Alice Johnson", date: "Aug 09, 2024", volume: "55 Liters", cost: "$71.50", odometer: "36,800 km", efficiency: "5.9 km/L", trend: "down" },
    { id: "FL-2024-889", vehicle: "KAZ 789Y", driver: "Robert Kiprono", date: "Aug 08, 2024", volume: "40 Liters", cost: "$54.00", odometer: "55,200 km", efficiency: "10.2 km/L", trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl hidden md:block">
                 <Fuel className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Fuel Consumption Tracker</h2>
                 <p className="text-sm font-medium text-slate-500">Log fuel purchases and monitor fleet efficiency metrics.</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Download className="w-4 h-4" />
                 Export Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                 <Plus className="w-4 h-4" />
                 Log Fuel Entry
              </button>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Vehicle, Driver, or Log ID..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Vehicles</option>
                 <option>KBC 123Z</option>
                 <option>KDE 456X</option>
                 <option>KDD 112A</option>
                 <option>KAZ 789Y</option>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Entry Info</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle & Driver</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fuel & Cost</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Odometer & Efficiency</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Receipt</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {fuelLogs.map((log) => (
                   <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm">{log.id}</span>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{log.date}</p>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-primary-700 text-sm">{log.vehicle}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{log.driver}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1">
                           <Fuel className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700 text-sm">{log.volume}</span>
                        </div>
                        <p className="text-xs font-black text-slate-800">{log.cost}</p>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-slate-600 text-sm">{log.odometer}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg: {log.efficiency}</span>
                           {log.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                           ) : (
                              <TrendingDown className="w-3 h-3 text-rose-500" />
                           )}
                        </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <Receipt className="w-5 h-5" />
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
