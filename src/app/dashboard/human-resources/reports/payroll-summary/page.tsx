"use client";

import React from "react";
import { Coins, Filter, Download, ArrowUpRight, Building2, TrendingUp, DollarSign } from "lucide-react";

export default function PayrollSummaryPage() {
  const departmentCosts = [
    { name: "Academic Staff", cost: "$1,250,000", avgSalary: "$10,416", percent: 45, color: "bg-blue-500" },
    { name: "Administration", cost: "$420,000", avgSalary: "$12,000", percent: 15, color: "bg-emerald-500" },
    { name: "Support & Maintenance", cost: "$380,000", avgSalary: "$9,500", percent: 14, color: "bg-amber-500" },
    { name: "IT & Technology", cost: "$240,000", avgSalary: "$20,000", percent: 9, color: "bg-indigo-500" },
    { name: "Management", cost: "$488,400", avgSalary: "$44,400", percent: 17, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Payroll & Compensation Summary</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Q2 2024
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Download className="w-4 h-4" />
               Export CSV
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary-50 rounded-tl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl w-fit mb-6">
                <Coins className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Payroll YTD</p>
             <p className="text-4xl font-black text-slate-800">$2,778,400</p>
             <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" /> +4.2% vs last year
             </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-50 rounded-tl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-fit mb-6">
                <DollarSign className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Salary (Org Wide)</p>
             <p className="text-4xl font-black text-slate-800">$12,745</p>
             <p className="text-xs font-medium text-slate-500 mt-4 pt-4 border-t border-slate-100">Across 218 active employees</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-50 rounded-tl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl w-fit mb-6">
                <Building2 className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Top Cost Center</p>
             <p className="text-3xl font-black text-slate-800">Academic Staff</p>
             <p className="text-xs font-bold text-primary-600 mt-4 pt-4 border-t border-slate-100 flex items-center gap-1">
                45% of total budget <ArrowUpRight className="w-3.5 h-3.5" />
             </p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden flex flex-col">
         <div className="p-6 border-b border-slate-200/60 bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-800">Expenditure by Department (YTD)</h3>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-200/60 bg-white">
                     <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">Department</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Avg Salary</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total Expenditure</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">% of Budget</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {departmentCosts.map((dept, index) => (
                     <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                           <span className="font-bold text-slate-800 text-sm flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${dept.color}`}></div>
                              {dept.name}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                           <span className="font-bold text-slate-600 text-sm">{dept.avgSalary}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                           <span className="font-black text-slate-800 text-sm">{dept.cost}</span>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3 justify-end">
                              <span className="text-xs font-bold text-slate-500 w-8 text-right">{dept.percent}%</span>
                              <div className="h-1.5 w-full max-w-[100px] bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.percent}%` }}></div>
                              </div>
                           </div>
                        </td>
                     </tr>
                  ))}
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                     <td className="py-4 px-6 font-black text-slate-800 text-sm uppercase">Organization Total</td>
                     <td className="py-4 px-6 text-right font-black text-slate-800 text-sm">$12,745</td>
                     <td className="py-4 px-6 text-right font-black text-primary-600 text-base">$2,778,400</td>
                     <td className="py-4 px-6"></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
