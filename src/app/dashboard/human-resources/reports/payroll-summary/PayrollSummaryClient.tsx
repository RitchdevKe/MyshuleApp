"use client";

import React from "react";
import { Coins, Filter, Download, ArrowUpRight, Building2, TrendingUp, DollarSign } from "lucide-react";

type DepartmentCost = {
  name: string;
  cost: number;
  avgSalary: number;
  percent: number;
  color: string;
};

type PayrollSummaryProps = {
  data: {
    totalPayroll: number;
    totalAllowances: number;
    totalDeductions: number;
    totalNetPay: number;
    avgSalary: number;
    totalEmployees: number;
    topCostCenter: { name: string; cost: number; percent: number };
    departmentCosts: DepartmentCost[];
  };
};

export default function PayrollSummaryClient({ data }: PayrollSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Payroll & Compensation Summary</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Q2 2024
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Download className="w-4 h-4" />
               Export PDF
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
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Gross Payroll</p>
             <p className="text-4xl font-black text-slate-800">{formatCurrency(data.totalPayroll)}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-amber-50 rounded-tl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit mb-6">
                <Coins className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Allowances</p>
             <p className="text-4xl font-black text-slate-800">{formatCurrency(data.totalAllowances)}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-rose-50 rounded-tl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl w-fit mb-6">
                <TrendingUp className="w-6 h-6 rotate-180 text-rose-600" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Deductions</p>
             <p className="text-4xl font-black text-slate-800">{formatCurrency(data.totalDeductions)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-50 rounded-tl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-fit mb-6">
                <DollarSign className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Net Pay</p>
             <p className="text-4xl font-black text-slate-800">{formatCurrency(data.totalNetPay)}</p>
             <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" /> Calculated dynamically
             </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-50 rounded-tl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl w-fit mb-6">
                <DollarSign className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Salary (Org Wide)</p>
             <p className="text-4xl font-black text-slate-800">{formatCurrency(data.avgSalary)}</p>
             <p className="text-xs font-medium text-slate-500 mt-4 pt-4 border-t border-slate-100">Across {data.totalEmployees} active employees</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-50 rounded-tl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl w-fit mb-6">
                <Building2 className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Top Cost Center</p>
             <p className="text-3xl font-black text-slate-800">{data.topCostCenter.name}</p>
             <p className="text-xs font-bold text-primary-600 mt-4 pt-4 border-t border-slate-100 flex items-center gap-1">
                {data.topCostCenter.percent.toFixed(1)}% of total budget <ArrowUpRight className="w-3.5 h-3.5" />
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
                  {data.departmentCosts.map((dept, index) => (
                     <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                           <span className="font-bold text-slate-800 text-sm flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${dept.color}`}></div>
                              {dept.name}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                           <span className="font-bold text-slate-600 text-sm">{formatCurrency(dept.avgSalary)}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                           <span className="font-black text-slate-800 text-sm">{formatCurrency(dept.cost)}</span>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3 justify-end">
                              <span className="text-xs font-bold text-slate-500 w-8 text-right">{dept.percent.toFixed(1)}%</span>
                              <div className="h-1.5 w-full max-w-[100px] bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.percent}%` }}></div>
                              </div>
                           </div>
                        </td>
                     </tr>
                  ))}
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                     <td className="py-4 px-6 font-black text-slate-800 text-sm uppercase">Organization Total</td>
                     <td className="py-4 px-6 text-right font-black text-slate-800 text-sm">{formatCurrency(data.avgSalary)}</td>
                     <td className="py-4 px-6 text-right font-black text-primary-600 text-base">{formatCurrency(data.totalPayroll)}</td>
                     <td className="py-4 px-6"></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
