"use client";

import React from "react";
import { Grid, Building2, MapPin, Search, Plus, BarChart3, AlertCircle } from "lucide-react";

export default function StoresPage() {
  const stores = [
    { id: "STR-01", name: "Main HQ Storage", location: "Basement, Block A", manager: "Robert Kiprono", itemsCount: 845, totalValue: "$850,000", capacity: 75 },
    { id: "STR-02", name: "North Wing IT Room", location: "Floor 2, Block B", manager: "David Kim", itemsCount: 124, totalValue: "$180,500", capacity: 90 },
    { id: "STR-03", name: "Stationery Cupboard", location: "Floor 1, Block A", manager: "Jane Doe", itemsCount: 250, totalValue: "$12,400", capacity: 45 },
    { id: "STR-04", name: "Maintenance Depot", location: "Ground Floor, Annex", manager: "Michael Ochieng", itemsCount: 65, totalValue: "$17,100", capacity: 60 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Store & Warehouse Management</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Search className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Plus className="w-4 h-4" />
               Add Store Location
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
         {stores.map((store) => (
            <div key={store.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col sm:flex-row group">
               
               {/* Identity Section */}
               <div className="p-6 sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200/60 bg-slate-50/50 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-primary-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl inline-block mb-3">
                           <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">{store.id}</span>
                     </div>
                     <h3 className="text-lg font-black text-slate-800 leading-tight">{store.name}</h3>
                     
                     <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <MapPin className="w-4 h-4 text-slate-400" />
                           {store.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                              <span className="text-[8px] font-black text-slate-600">{store.manager.charAt(0)}</span>
                           </div>
                           Manager: <span className="font-bold text-slate-700">{store.manager}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Metrics Section */}
               <div className="p-6 sm:w-1/2 flex flex-col justify-between">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Capacity Utilization</p>
                     <div className="flex items-end gap-2 mb-2">
                        <span className={`text-3xl font-black ${store.capacity >= 90 ? 'text-rose-600' : 'text-slate-800'}`}>
                           {store.capacity}%
                        </span>
                        {store.capacity >= 90 && (
                           <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md uppercase tracking-wider mb-1.5">
                              <AlertCircle className="w-3 h-3" /> Near Limit
                           </span>
                        )}
                     </div>
                     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                        <div className={`h-full rounded-full transition-all duration-1000 ${
                           store.capacity >= 90 ? 'bg-rose-500' : store.capacity >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} style={{ width: `${store.capacity}%` }}></div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Unique Items</p>
                           <p className="text-xl font-black text-slate-800">{store.itemsCount}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Value</p>
                           <p className="text-xl font-black text-primary-600">{store.totalValue}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100">
                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                        <BarChart3 className="w-4 h-4" /> View Inventory Report
                     </button>
                  </div>
               </div>

            </div>
         ))}
      </div>
    </div>
  );
}
