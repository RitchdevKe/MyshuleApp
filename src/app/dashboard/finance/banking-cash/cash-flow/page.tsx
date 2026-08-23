"use client";

import React from "react";
import { TrendingUp, ArrowDownLeft, ArrowUpRight, BarChart3, Download, Filter, DownloadCloud } from "lucide-react";

export default function CashFlowPage() {
  const categories = [
    { name: "Tuition Fees", type: "in", amount: "8,500,000", pct: 68 },
    { name: "Transport Fees", type: "in", amount: "2,100,000", pct: 17 },
    { name: "Other Income", type: "in", amount: "1,900,000", pct: 15 },
    { name: "Payroll & Salaries", type: "out", amount: "2,500,000", pct: 60 },
    { name: "Operations & Maintenance", type: "out", amount: "1,200,000", pct: 28 },
    { name: "Utilities", type: "out", amount: "500,000", pct: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Cash Flow Analysis</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track money moving in and out of the institution.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
            <option>Last Year</option>
          </select>
          <button className="p-2 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-500 hover:text-primary-900 transition-colors">
            <DownloadCloud className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-3xl border border-emerald-200/50 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-emerald-200/40 group-hover:scale-110 transition-transform duration-500">
               <ArrowDownLeft className="w-32 h-32" />
            </div>
            <div className="relative z-10">
               <div className="w-10 h-10 bg-emerald-200/50 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
                  <ArrowDownLeft className="w-5 h-5" />
               </div>
               <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Total Inflows</p>
               <p className="text-3xl font-black text-emerald-950 tracking-tight">KSh 12.5M</p>
               <p className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +15% vs last period
               </p>
            </div>
         </div>

         <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 rounded-3xl border border-rose-200/50 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-rose-200/40 group-hover:scale-110 transition-transform duration-500">
               <ArrowUpRight className="w-32 h-32" />
            </div>
            <div className="relative z-10">
               <div className="w-10 h-10 bg-rose-200/50 text-rose-700 rounded-xl flex items-center justify-center mb-4">
                  <ArrowUpRight className="w-5 h-5" />
               </div>
               <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">Total Outflows</p>
               <p className="text-3xl font-black text-rose-950 tracking-tight">KSh 4.2M</p>
               <p className="text-xs font-bold text-rose-700 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2% vs last period
               </p>
            </div>
         </div>

         <div className="bg-primary-900 p-6 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-white/5">
               <BarChart3 className="w-32 h-32" />
            </div>
            <div className="relative z-10">
               <div className="w-10 h-10 bg-primary-800 text-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
               </div>
               <p className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-1">Net Cash Flow</p>
               <p className="text-3xl font-black text-white tracking-tight">KSh 8.3M</p>
               <p className="text-xs font-bold text-primary-300 mt-2">Positive trajectory</p>
            </div>
         </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Chart Mockup Area */}
         <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800">Cash Flow Trend</h3>
               <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Inflows</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Outflows</div>
               </div>
            </div>
            
            {/* CSS Mockup Chart */}
            <div className="flex-1 border-b border-l border-slate-200 relative pt-4 pl-4 flex items-end justify-between px-6 pb-2">
               {/* Y-Axis Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-200"></div> {/* Baseline */}
               </div>

               {/* Bars */}
               {[
                  { in: 60, out: 30, label: "Week 1" },
                  { in: 80, out: 40, label: "Week 2" },
                  { in: 40, out: 60, label: "Week 3" },
                  { in: 90, out: 35, label: "Week 4" },
               ].map((data, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-2 w-16">
                     <div className="flex items-end gap-1 h-48 w-full justify-center">
                        <div className="w-4 bg-emerald-400 rounded-t-sm transition-all hover:bg-emerald-500 cursor-pointer" style={{ height: `${data.in}%` }}></div>
                        <div className="w-4 bg-rose-400 rounded-t-sm transition-all hover:bg-rose-500 cursor-pointer" style={{ height: `${data.out}%` }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 mt-2">{data.label}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Categories Breakdown */}
         <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col h-[400px]">
            <h3 className="font-bold text-slate-800 mb-6">Top Categories</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 hide-scrollbar">
               {categories.map((cat, idx) => (
                  <div key={idx}>
                     <div className="flex justify-between items-end mb-2">
                        <div>
                           <p className="text-sm font-bold text-slate-700">{cat.name}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-wider ${cat.type === 'in' ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {cat.pct}% of {cat.type === 'in' ? 'Inflows' : 'Outflows'}
                           </p>
                        </div>
                        <p className="text-sm font-black text-slate-800">KSh {cat.amount}</p>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${cat.type === 'in' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${cat.pct}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
            <button className="w-full mt-4 py-2.5 text-sm font-bold text-primary-900 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
               View Full Report
            </button>
         </div>

      </div>
    </div>
  );
}
