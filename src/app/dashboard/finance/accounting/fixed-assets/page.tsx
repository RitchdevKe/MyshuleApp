"use client";

import React from "react";
import { Plus, MonitorSmartphone, Car, Building, MoreHorizontal, Settings2 } from "lucide-react";

export default function FixedAssetsPage() {
  const assets = [
    { id: "FA-001", name: "School Bus - KCD 123X", category: "Motor Vehicles", icon: Car, val: 4500000, dep: "15% SL", status: "Active" },
    { id: "FA-002", name: "Computer Lab (40 PCs)", category: "Computers & IT", icon: MonitorSmartphone, val: 2000000, dep: "30% RB", status: "Active" },
    { id: "FA-003", name: "Main Assembly Hall", category: "Buildings", icon: Building, val: 45000000, dep: "2.5% SL", status: "Active" },
    { id: "FA-004", name: "Library Books (Batch A)", category: "Library", icon: Settings2, val: 350000, dep: "20% SL", status: "Depreciated" },
  ];

  return (
    <div className="space-y-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 p-5 rounded-2xl border border-white/60 backdrop-blur-md shadow-sm">
         <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Asset Register</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Track school assets and automated depreciation.</p>
         </div>
         <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
            <Plus className="w-4 h-4" />
            Register Asset
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {assets.map((asset) => {
            const Icon = asset.icon;
            return (
              <div key={asset.id} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer">
                 <button className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-primary-900 bg-white/50 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-5 h-5" />
                 </button>
                 
                 <div className="w-12 h-12 bg-primary-50 text-primary-900 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                 </div>
                 
                 <div className="mb-6">
                   <h3 className="font-black text-slate-800 mb-1 leading-tight">{asset.name}</h3>
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{asset.category}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-xs font-bold text-slate-400">{asset.id}</span>
                   </div>
                 </div>
                 
                 <div className="space-y-3 pt-4 border-t border-slate-100/80">
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-semibold text-slate-500">Net Book Value</span>
                       <span className="font-black text-slate-800">KSh {asset.val.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-semibold text-slate-500">Depreciation</span>
                       <span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded text-xs">{asset.dep}</span>
                    </div>
                 </div>
              </div>
            );
         })}
      </div>
    </div>
  );
}