"use client";

import React from "react";
import { PieChart, Download, Filter, Target, AlertTriangle, TrendingUp } from "lucide-react";

export default function BudgetsPage() {
  const departments = [
    { name: "Academic Resources", budget: 15.0, actual: 14.2, variance: -5.3, status: "Under Budget" },
    { name: "Administration", budget: 8.5, actual: 8.4, variance: -1.2, status: "On Track" },
    { name: "Transport", budget: 12.0, actual: 14.5, variance: 20.8, status: "Over Budget" },
    { name: "Maintenance & Facilities", budget: 6.0, actual: 5.2, variance: -13.3, status: "Under Budget" },
    { name: "Technology (IT)", budget: 4.5, actual: 4.8, variance: 6.7, status: "Over Budget" },
    { name: "Extracurriculars", budget: 3.0, actual: 2.1, variance: -30.0, status: "Under Budget" },
  ];

  const totalBudget = departments.reduce((acc, curr) => acc + curr.budget, 0);
  const totalActual = departments.reduce((acc, curr) => acc + curr.actual, 0);
  const totalVariance = ((totalActual - totalBudget) / totalBudget) * 100;

  return (
    <div className="p-6 space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Budget vs Actuals</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitor departmental spending against allocated budgets.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex-1 sm:flex-none">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Target className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Total Allocated Budget</h3>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">KSh {totalBudget.toFixed(1)}M</div>
            <p className="text-xs font-bold text-slate-500">Financial Year 2026</p>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Total Actual Spend</h3>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">KSh {totalActual.toFixed(1)}M</div>
            <p className="text-xs font-bold text-slate-500">YTD Actuals</p>
         </div>

         <div className={`bg-white/80 backdrop-blur-xl border p-6 rounded-2xl shadow-sm ${totalVariance > 0 ? 'border-rose-200/60' : 'border-emerald-200/60'}`}>
            <div className="flex items-center gap-3 mb-2">
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${totalVariance > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {totalVariance > 0 ? <AlertTriangle className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
               </div>
               <h3 className={`text-xs font-black uppercase tracking-wider ${totalVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>Overall Variance</h3>
            </div>
            <div className={`text-3xl font-black mb-1 ${totalVariance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
               {totalVariance > 0 ? '+' : ''}{totalVariance.toFixed(1)}%
            </div>
            <p className={`text-xs font-bold ${totalVariance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
               {totalVariance > 0 ? 'Over budget globally' : 'Under budget globally'}
            </p>
         </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Departmental Breakdown</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
               <thead>
                  <tr className="bg-white border-b border-slate-100">
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Budget (M)</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actual (M)</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Variance (%)</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Utilization</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {departments.map((dept, idx) => (
                     <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-sm text-slate-800">{dept.name}</td>
                        <td className="py-4 px-6 text-sm font-medium text-slate-600">{dept.budget.toFixed(1)}</td>
                        <td className="py-4 px-6 text-sm font-bold text-slate-800">{dept.actual.toFixed(1)}</td>
                        <td className={`py-4 px-6 text-sm font-black ${dept.variance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                           {dept.variance > 0 ? '+' : ''}{dept.variance}%
                        </td>
                        <td className="py-4 px-6">
                           <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                              dept.status === 'Over Budget' ? 'bg-rose-100 text-rose-700' :
                              dept.status === 'Under Budget' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-amber-100 text-amber-700'
                           }`}>
                              {dept.status}
                           </span>
                        </td>
                        <td className="py-4 px-6 w-48">
                           <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                 <div 
                                    className={`h-2 rounded-full ${dept.variance > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                    style={{ width: `${Math.min((dept.actual / dept.budget) * 100, 100)}%` }}
                                 ></div>
                              </div>
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
