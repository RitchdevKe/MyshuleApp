"use client";

import React, { useState } from "react";
import { Download, Calendar, ChevronDown, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IncomeStatementClient({
  data
}: {
  data: {
    financialYears: { id: string; name: string }[];
    selectedYearId: string | undefined;
    revenues: { name: string; amount: number }[];
    cogs: { name: string; amount: number }[];
    expenses: { name: string; amount: number }[];
    totalRevenue: number;
    totalCogs: number;
    totalOperating: number;
    grossProfit: number;
    netIncome: number;
  }
}) {
  const router = useRouter();
  const [periodId, setPeriodId] = useState(data.selectedYearId || "");

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPeriodId(val);
    router.push(`?yearId=${val}`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const netMargin = data.totalRevenue > 0 ? (data.netIncome / data.totalRevenue) * 100 : 0;

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
         <div>
            <h2 className="text-xl font-black text-slate-800">Profit & Loss Statement</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Comprehensive breakdown of revenues, costs, and expenses.</p>
         </div>
         <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
                <select 
                  value={periodId}
                  onChange={handlePeriodChange}
                  className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
                >
                   {data.financialYears.map((fy) => (
                     <option key={fy.id} value={fy.id}>{fy.name}</option>
                   ))}
                   {!data.financialYears.length && <option value="">No Periods Found</option>}
                </select>
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
             <button className="p-2.5 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-500 hover:text-primary-900 transition-colors">
                <Filter className="w-5 h-5" />
             </button>
             <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20">
                <Download className="w-4 h-4" /> Export PDF
             </button>
         </div>
      </div>

      <div className="hidden print:block mb-6">
        <h2 className="text-2xl font-black text-slate-800">Profit & Loss Statement</h2>
        <p className="text-sm text-slate-500">Period: {data.financialYears.find(fy => fy.id === periodId)?.name || "All Time"}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-3xl border border-emerald-200/50 shadow-sm relative overflow-hidden print:border print:shadow-none">
            <p className="text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-emerald-950 tracking-tight">{formatCurrency(data.totalRevenue)}</p>
         </div>
         <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 rounded-3xl border border-rose-200/50 shadow-sm relative overflow-hidden print:border print:shadow-none">
            <p className="text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">Total Expenses</p>
            <p className="text-3xl font-black text-rose-950 tracking-tight">{formatCurrency(data.totalOperating + data.totalCogs)}</p>
         </div>
         <div className="bg-primary-900 p-6 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20 relative overflow-hidden print:bg-white print:border print:shadow-none">
            <p className="text-primary-200 print:text-slate-800 text-xs font-bold uppercase tracking-wider mb-1">Net Income</p>
            <p className="text-3xl font-black text-white print:text-slate-900 tracking-tight">{formatCurrency(data.netIncome)}</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/20 print:bg-slate-100 print:text-slate-700 inline-flex px-2 py-1 rounded-md">
               Net Margin: {netMargin.toFixed(1)}%
            </div>
         </div>
      </div>

      {/* Financial Statement Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden print:shadow-none print:border-none">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/80 border-b border-slate-200 print:bg-transparent">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-2/3">Account</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-1/3">Amount</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               
               {/* REVENUE */}
               <tr className="bg-slate-50/30 print:bg-transparent">
                  <td className="px-6 py-3 font-black text-slate-800" colSpan={2}>Operating Revenue</td>
               </tr>
               {data.revenues.length > 0 ? data.revenues.map((rev, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 border-b border-slate-50 print:border-b-slate-200">
                    <td className="px-8 py-3 font-medium text-slate-600">{rev.name}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-800">{formatCurrency(rev.amount)}</td>
                 </tr>
               )) : (
                 <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                    <td className="px-8 py-3 font-medium text-slate-400 italic">No revenue recorded</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-400">-</td>
                 </tr>
               )}
               <tr className="bg-emerald-50/50 border-y border-emerald-100 print:bg-transparent print:border-t-2">
                  <td className="px-6 py-3 font-black text-emerald-900 print:text-slate-900">Total Revenue</td>
                  <td className="px-6 py-3 text-right font-black text-emerald-900 print:text-slate-900">{formatCurrency(data.totalRevenue)}</td>
               </tr>

               {/* COGS */}
               <tr className="bg-slate-50/30 print:bg-transparent">
                  <td className="px-6 py-3 font-black text-slate-800 mt-4" colSpan={2}>Cost of Goods Sold (Direct Costs)</td>
               </tr>
               {data.cogs.length > 0 ? data.cogs.map((cog, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 border-b border-slate-50 print:border-b-slate-200">
                    <td className="px-8 py-3 font-medium text-slate-600">{cog.name}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-800">{formatCurrency(cog.amount)}</td>
                 </tr>
               )) : (
                 <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                    <td className="px-8 py-3 font-medium text-slate-400 italic">No direct costs recorded</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-400">-</td>
                 </tr>
               )}
               <tr className="bg-slate-50 border-y border-slate-200 print:bg-transparent print:border-t-2">
                  <td className="px-6 py-3 font-black text-slate-800">Total Direct Costs</td>
                  <td className="px-6 py-3 text-right font-black text-slate-800">{formatCurrency(data.totalCogs)}</td>
               </tr>
               <tr className="bg-primary-50 border-b border-primary-100 print:bg-transparent print:border-b-2">
                  <td className="px-6 py-3 font-black text-primary-900 print:text-slate-900">Gross Profit</td>
                  <td className="px-6 py-3 text-right font-black text-primary-900 print:text-slate-900">{formatCurrency(data.grossProfit)}</td>
               </tr>

               {/* EXPENSES */}
               <tr className="bg-slate-50/30 print:bg-transparent">
                  <td className="px-6 py-3 font-black text-slate-800 mt-4" colSpan={2}>Operating Expenses</td>
               </tr>
               {data.expenses.length > 0 ? data.expenses.map((exp, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 border-b border-slate-50 print:border-b-slate-200">
                    <td className="px-8 py-3 font-medium text-slate-600">{exp.name}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-800">{formatCurrency(exp.amount)}</td>
                 </tr>
               )) : (
                 <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                    <td className="px-8 py-3 font-medium text-slate-400 italic">No operating expenses recorded</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-400">-</td>
                 </tr>
               )}
               <tr className="bg-rose-50/50 border-y border-rose-100 print:bg-transparent print:border-t-2">
                  <td className="px-6 py-3 font-black text-rose-900 print:text-slate-900">Total Operating Expenses</td>
                  <td className="px-6 py-3 text-right font-black text-rose-900 print:text-slate-900">{formatCurrency(data.totalOperating)}</td>
               </tr>

               {/* NET INCOME */}
               <tr className="bg-primary-900 text-white print:bg-transparent print:text-slate-900 print:border-y-4 print:border-double">
                  <td className="px-6 py-4 font-black text-lg">Net Income</td>
                  <td className="px-6 py-4 text-right font-black text-lg">{formatCurrency(data.netIncome)}</td>
               </tr>

            </tbody>
         </table>
      </div>

    </div>
  );
}
