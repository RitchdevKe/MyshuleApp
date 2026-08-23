"use client";

import React from "react";
import { Truck, Search, Filter, Plus, ShieldCheck, AlertCircle, Wrench, MoreHorizontal } from "lucide-react";

export default function VehiclesPage() {
  const vehicles = [
    { id: "VEH-01", plate: "KBC 123Z", type: "School Bus (60 Seater)", driver: "John Smith", status: "Active", condition: "Good", nextService: "15,000 km", fuelType: "Diesel" },
    { id: "VEH-02", plate: "KDE 456X", type: "Mini Bus (33 Seater)", driver: "David Kim", status: "Active", condition: "Excellent", nextService: "22,500 km", fuelType: "Diesel" },
    { id: "VEH-03", plate: "KAZ 789Y", type: "Van (14 Seater)", driver: "Robert Kiprono", status: "Maintenance", condition: "Fair", nextService: "Current", fuelType: "Petrol" },
    { id: "VEH-04", plate: "KDD 112A", type: "School Bus (60 Seater)", driver: "Alice Johnson", status: "Active", condition: "Good", nextService: "12,000 km", fuelType: "Diesel" },
    { id: "VEH-05", plate: "KCA 998B", type: "Staff Car (5 Seater)", driver: "Jane Doe", status: "Out of Service", condition: "Poor", nextService: "Overdue", fuelType: "Petrol" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Truck className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Fleet Management</h2>
                 <p className="text-sm font-medium text-slate-500">Track and manage the school's fleet of buses and vehicles.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Register Vehicle
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Plate, Type, or Driver..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Types</option>
                 <option>School Bus</option>
                 <option>Mini Bus</option>
                 <option>Van</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 More Filters
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Driver</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Condition</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Next Service</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div>
                       <span className="font-bold text-slate-800 text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">{vehicle.plate}</span>
                       <p className="text-xs font-bold text-slate-600 mt-1.5">{vehicle.type}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{vehicle.id} • {vehicle.fuelType}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{vehicle.driver}</p>
                  </td>
                  <td className="py-4 px-6">
                     <span className={`text-xs font-bold ${
                        vehicle.condition === 'Excellent' || vehicle.condition === 'Good' ? 'text-emerald-600' :
                        vehicle.condition === 'Fair' ? 'text-amber-600' : 'text-rose-600'
                     }`}>
                        {vehicle.condition}
                     </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className={`font-bold text-sm ${
                       vehicle.nextService === 'Overdue' ? 'text-rose-600' : 
                       vehicle.nextService === 'Current' ? 'text-amber-600' : 'text-slate-700'
                    }`}>{vehicle.nextService}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      vehicle.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                      vehicle.status === 'Maintenance' ? 'bg-amber-50 text-amber-600' : 
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {vehicle.status === 'Active' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {vehicle.status === 'Maintenance' && <Wrench className="w-3.5 h-3.5" />}
                      {vehicle.status === 'Out of Service' && <AlertCircle className="w-3.5 h-3.5" />}
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
