"use client";

import React from "react";
import { Monitor, Search, Filter, Plus, ArrowRight, Tag, ShieldCheck, AlertCircle } from "lucide-react";

export default function AssetRegisterPage() {
  const assets = [
    { id: "AST-2024-001", name: "School Bus (KBC 123Z)", category: "Vehicles", location: "Main Parking", status: "Active", condition: "Good", value: "$45,000", assignedTo: "Transport Dept" },
    { id: "AST-2024-042", name: "Dell PowerEdge Server", category: "IT Equipment", location: "Server Room A", status: "Active", condition: "Excellent", value: "$8,500", assignedTo: "IT Dept" },
    { id: "AST-2023-112", name: "Industrial Generator", category: "Machinery", location: "Power House", status: "Maintenance", condition: "Fair", value: "$22,000", assignedTo: "Facilities" },
    { id: "AST-2021-089", name: "Chemistry Lab Fume Hood", category: "Lab Equipment", location: "Science Block", status: "Active", condition: "Good", value: "$12,000", assignedTo: "Science Dept" },
    { id: "AST-2019-034", name: "Library Desktop PCs (x20)", category: "IT Equipment", location: "Main Library", status: "Depreciated", condition: "Poor", value: "$4,000", assignedTo: "Library" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Monitor className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Fixed Asset Register</h2>
                 <p className="text-sm font-medium text-slate-500">Track and manage high-value organizational assets.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Register Asset
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Asset ID, Name, or Tag..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Categories</option>
                 <option>Vehicles</option>
                 <option>IT Equipment</option>
                 <option>Machinery</option>
                 <option>Lab Equipment</option>
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
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Location & Dept</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Condition</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-slate-100 text-slate-500 rounded-lg shrink-0 mt-0.5">
                          <Tag className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">{asset.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{asset.id}</span>
                             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                             <span className="text-xs font-medium text-slate-500">{asset.category}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{asset.location}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{asset.assignedTo}</p>
                  </td>
                  <td className="py-4 px-6">
                     <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        asset.condition === 'Excellent' || asset.condition === 'Good' ? 'text-emerald-600' :
                        asset.condition === 'Fair' ? 'text-amber-600' : 'text-rose-600'
                     }`}>
                        {asset.condition}
                     </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{asset.value}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      asset.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                      asset.status === 'Maintenance' ? 'bg-amber-50 text-amber-600' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {asset.status === 'Active' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {asset.status === 'Maintenance' && <AlertCircle className="w-3.5 h-3.5" />}
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                           View <ArrowRight className="w-3 h-3" />
                        </button>
                     </div>
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
