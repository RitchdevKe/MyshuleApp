"use client";

import React from "react";
import { TrendingUp, TrendingDown, RefreshCcw, Download } from "lucide-react";

export default function CashflowPage() {
  const months = ["January", "February", "March", "April", "May", "June"];
  
  // Dummy data for visualization
  const data = [
    { in: 14.2, out: 11.5, net: 2.7 },
    { in: 8.5, out: 9.2, net: -0.7 },
    { in: 9.1, out: 8.9, net: 0.2 },
    { in: 22.4, out: 12.1, net: 10.3 },
    { in: 15.6, out: 10.5, net: 5.1 },
    { in: 12.0, out: 11.0, net: 1.0 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Cashflow Analytics</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track monthly operating cash inflows and outflows.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm">
          <Download className="w-4 h-4" /> Download Statement
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 backdrop-blur-xl border border-emerald-200/60 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700">Total Inflows (YTD)</h3>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">KSh 81.8M</div>
            <p className="text-xs font-bold text-emerald-600">+4% vs last year</p>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-rose-200/60 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-wider text-rose-700">Total Outflows (YTD)</h3>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">KSh 63.2M</div>
            <p className="text-xs font-bold text-rose-600">+12% vs last year</p>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-indigo-200/60 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <RefreshCcw className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-wider text-indigo-700">Net Cashflow (YTD)</h3>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">KSh 18.6M</div>
            <p className="text-xs font-bold text-emerald-600">Healthy Cash Reserves</p>
         </div>
      </div>

      {/* Visual Chart Placeholder */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
         <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Monthly Cashflow Trend (Millions KSh)</h3>
         
         <div className="h-64 flex items-end gap-2 sm:gap-4 md:gap-8 mt-4 border-b border-slate-200 pb-4 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] font-bold text-slate-400">
               <span>25M</span>
               <span>20M</span>
               <span>15M</span>
               <span>10M</span>
               <span>5M</span>
               <span>0</span>
            </div>

            <div className="ml-10 flex-1 flex justify-between h-full items-end">
               {data.map((d, i) => (
                  <div key={i} className="flex gap-1 items-end h-full w-full justify-center group relative">
                     {/* Tooltip */}
                     <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs font-bold p-2 rounded-lg pointer-events-none transition-opacity z-10 whitespace-nowrap">
                        <div className="text-emerald-400">In: {d.in}M</div>
                        <div className="text-rose-400">Out: {d.out}M</div>
                     </div>
                     
                     <div className="w-4 sm:w-8 md:w-12 bg-emerald-400 hover:bg-emerald-500 rounded-t-sm transition-all cursor-pointer" style={{ height: `${(d.in / 25) * 100}%` }}></div>
                     <div className="w-4 sm:w-8 md:w-12 bg-rose-400 hover:bg-rose-500 rounded-t-sm transition-all cursor-pointer" style={{ height: `${(d.out / 25) * 100}%` }}></div>
                  </div>
               ))}
            </div>
         </div>
         
         {/* X-axis labels */}
         <div className="ml-10 flex justify-between mt-4">
            {months.map((m, i) => (
               <div key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center flex-1">{m.substring(0,3)}</div>
            ))}
         </div>
         
         <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div>
               <span className="text-xs font-bold text-slate-600">Cash Inflow</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-rose-400 rounded-sm"></div>
               <span className="text-xs font-bold text-slate-600">Cash Outflow</span>
            </div>
         </div>
      </div>
    </div>
  );
}
