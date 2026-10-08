"use client";

import React, { useState } from "react";
import { Building, Search, Filter, MoreVertical, Plus, Settings2, BarChart2, X } from "lucide-react";
import { allocateFunds } from "./actions";

export default function DepartmentBudgetsClient({ 
  departments,
  budgets
}: { 
  departments: any[],
  budgets: any[]
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAllocate(formData: FormData) {
    setIsSubmitting(true);
    try {
      await allocateFunds(formData);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Allocate Funds</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleAllocate} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Budget</label>
                <select 
                  name="budgetId" 
                  required 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 bg-slate-50 focus:bg-white transition-colors"
                >
                  <option value="">Select a budget...</option>
                  {budgets.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Department Name</label>
                <input 
                  type="text" 
                  name="departmentName" 
                  required 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 bg-slate-50 focus:bg-white transition-colors" 
                  placeholder="e.g. Academic Resources" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Amount to Allocate (KSh)</label>
                <input 
                  type="number" 
                  name="amount" 
                  required 
                  min="1" 
                  step="any" 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 bg-slate-50 focus:bg-white transition-colors" 
                  placeholder="e.g. 1000000" 
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary-900 text-white p-3 rounded-xl font-bold shadow-md shadow-primary-900/20 hover:bg-primary-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? "Allocating..." : "Allocate Funds"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all"
          >
             <Plus className="w-4 h-4" /> Allocate Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {departments.filter(d => d.departmentName.toLowerCase().includes(searchTerm.toLowerCase())).map((dept) => {
          const pct = dept.allocatedAmount > 0 ? (dept.spentAmount / dept.allocatedAmount) * 100 : 0;
          let status = 'on-track';
          if (pct > 90) status = 'critical';
          else if (pct > 75) status = 'warning';

          return (
            <div key={dept.id} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    status === 'critical' ? 'bg-rose-50 text-rose-600' :
                    status === 'warning' ? 'bg-amber-50 text-amber-600' :
                    'bg-primary-50 text-primary-600'
                  }`}>
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-800 line-clamp-1">{dept.departmentName}</h3>
                     <p className="text-xs font-semibold text-slate-500">{dept.budgetName}</p>
                  </div>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-primary-900 bg-slate-50 hover:bg-primary-50 rounded-lg transition-colors">
                   <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-2 mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Allocated Budget</p>
                  <p className="text-lg font-black text-slate-800">KSh {dept.allocatedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="text-lg font-black text-slate-800">KSh {dept.spentAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-auto">
                 <div className="flex justify-between items-end mb-2">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${
                      status === 'critical' ? 'text-rose-600' :
                      status === 'warning' ? 'text-amber-600' :
                      'text-emerald-600'
                    }`}>
                      {pct.toFixed(1)}% Utilized
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">0 Line Items</p>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-1000 ${
                      status === 'critical' ? 'bg-rose-500' :
                      status === 'warning' ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                 </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 rounded-b-3xl flex justify-around opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                 <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-900">
                   <Settings2 className="w-4 h-4" /> Reallocate
                 </button>
                 <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-900">
                   <BarChart2 className="w-4 h-4" /> Breakdown
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
