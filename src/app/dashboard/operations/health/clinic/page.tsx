"use client";

import React from "react";
import { Activity, Plus, Search, Filter, ShieldAlert, HeartPulse, Stethoscope, Syringe, Settings2, ShieldCheck, AlertCircle } from "lucide-react";

export default function ClinicPage() {
  const inventory = [
    { id: "MED-01", name: "Epinephrine Auto-Injector (EpiPen)", category: "Emergency", stock: 12, minStock: 10, expiry: "Nov 2024", status: "Adequate" },
    { id: "MED-02", name: "Standard First Aid Kit", category: "Supplies", stock: 8, minStock: 15, expiry: "N/A", status: "Low Stock" },
    { id: "MED-03", name: "Ibuprofen (200mg)", category: "Pain Relief", stock: 150, minStock: 50, expiry: "Dec 2025", status: "Adequate" },
    { id: "MED-04", name: "Albuterol Inhaler", category: "Respiratory", stock: 5, minStock: 10, expiry: "Jan 2025", status: "Low Stock" },
    { id: "MED-05", name: "Antiseptic Wipes", category: "Supplies", stock: 500, minStock: 200, expiry: "Oct 2025", status: "Adequate" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <Stethoscope className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Today's Visits</p>
               <h3 className="text-2xl font-black text-slate-800">14</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
               <HeartPulse className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Cases</p>
               <h3 className="text-2xl font-black text-slate-800">2</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
               <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Low Stock Alerts</p>
               <h3 className="text-2xl font-black text-slate-800">2</h3>
            </div>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
                 <Syringe className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Medical Inventory</h2>
                 <p className="text-sm font-medium text-slate-500">Track critical medical supplies and expiry dates.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Add Stock
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Item Name or Category..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Categories</option>
                 <option>Emergency</option>
                 <option>Supplies</option>
                 <option>Pain Relief</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Item Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Stock Level</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Expiry</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {inventory.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{item.name}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{item.id}</span>
                     </td>
                     <td className="py-4 px-6">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100/50">{item.category}</span>
                     </td>
                     <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center">
                           <span className={`text-lg font-black ${item.stock < item.minStock ? 'text-amber-600' : 'text-slate-800'}`}>
                              {item.stock}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Min: {item.minStock}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                            item.status === 'Adequate' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {item.status === 'Adequate' && <ShieldCheck className="w-3.5 h-3.5" />}
                            {item.status === 'Low Stock' && <AlertCircle className="w-3.5 h-3.5" />}
                            {item.status}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 ml-1">Expiry: {item.expiry}</span>
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <Settings2 className="w-5 h-5" />
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
