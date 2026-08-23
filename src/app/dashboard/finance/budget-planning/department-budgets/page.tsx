"use client";

import React, { useState } from "react";
import { Building, Search, Filter, MoreVertical, Plus, Settings2, BarChart2 } from "lucide-react";

export default function DepartmentBudgetsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const departments = [
    { id: "DEP-01", name: "Academic Resources", head: "Dr. Sarah Ochieng", budget: "40,000,000", spent: "18,500,000", pct: 46, status: "on-track", items: 24 },
    { id: "DEP-02", name: "Administration", head: "Mr. James Kamau", budget: "35,000,000", spent: "12,000,000", pct: 34, status: "on-track", items: 15 },
    { id: "DEP-03", name: "Infrastructure & IT", head: "Eng. David Mutua", budget: "10,000,000", spent: "9,200,000", pct: 92, status: "warning", items: 8 },
    { id: "DEP-04", name: "Transport", head: "Peter Njoroge", budget: "15,000,000", spent: "5,300,000", pct: 35, status: "on-track", items: 12 },
    { id: "DEP-05", name: "Sports & Co-curricular", head: "Coach Brian", budget: "5,000,000", spent: "4,800,000", pct: 96, status: "critical", items: 6 },
    { id: "DEP-06", name: "Health & Welfare", head: "Nurse Mary", budget: "8,000,000", spent: "3,100,000", pct: 38, status: "on-track", items: 9 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Department Allocations</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and track budgets distributed across departments.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search departments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900 shadow-sm" 
            />
          </div>
          <button className="p-2 text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all">
             <Plus className="w-4 h-4" /> Allocate Funds
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((dept) => (
          <div key={dept.id} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col">
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  dept.status === 'critical' ? 'bg-rose-50 text-rose-600' :
                  dept.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                  'bg-primary-50 text-primary-600'
                }`}>
                  <Building className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-bold text-slate-800 line-clamp-1">{dept.name}</h3>
                   <p className="text-xs font-semibold text-slate-500">{dept.head}</p>
                </div>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-primary-900 bg-slate-50 hover:bg-primary-50 rounded-lg transition-colors">
                 <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2 mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Allocated Budget</p>
                <p className="text-lg font-black text-slate-800">KSh {dept.budget}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spent</p>
                <p className="text-lg font-black text-slate-800">KSh {dept.spent}</p>
              </div>
            </div>

            <div className="mt-auto">
               <div className="flex justify-between items-end mb-2">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    dept.status === 'critical' ? 'text-rose-600' :
                    dept.status === 'warning' ? 'text-amber-600' :
                    'text-emerald-600'
                  }`}>
                    {dept.pct}% Utilized
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{dept.items} Line Items</p>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-1000 ${
                    dept.status === 'critical' ? 'bg-rose-500' :
                    dept.status === 'warning' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`} style={{ width: `${dept.pct}%` }}></div>
               </div>
            </div>

            {/* Quick Actions Overlay (Appears on Hover) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 rounded-b-3xl flex justify-around opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
               <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-900">
                 <Settings2 className="w-4 h-4" /> Reallocate
               </button>
               <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-900">
                 <BarChart2 className="w-4 h-4" /> Breakdown
               </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
