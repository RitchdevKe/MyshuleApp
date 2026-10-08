"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, ArrowDownLeft, ArrowUpRight, BarChart3, DownloadCloud } from "lucide-react";

type Transaction = {
  id: string;
  type: "IN" | "OUT";
  amount: number;
  description: string;
  date: Date;
};

export default function CashFlowClient({ 
  bankTransactions, 
  pettyCashTransactions 
}: { 
  bankTransactions: Transaction[], 
  pettyCashTransactions: Transaction[] 
}) {
  const [period, setPeriod] = useState("Last 30 Days");

  const allTransactions = useMemo(() => {
    return [...bankTransactions, ...pettyCashTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bankTransactions, pettyCashTransactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return allTransactions.filter(t => {
      const d = new Date(t.date);
      if (period === "Last 30 Days") {
        return (now.getTime() - d.getTime()) <= 30 * 24 * 60 * 60 * 1000;
      }
      if (period === "This Quarter") {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        return Math.floor(d.getMonth() / 3) === currentQuarter && d.getFullYear() === now.getFullYear();
      }
      if (period === "Year to Date") {
        return d.getFullYear() === now.getFullYear();
      }
      if (period === "Last Year") {
        return d.getFullYear() === now.getFullYear() - 1;
      }
      return true;
    });
  }, [allTransactions, period]);

  const { totalInflows, totalOutflows } = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.type === "IN") acc.totalInflows += t.amount;
        if (t.type === "OUT") acc.totalOutflows += t.amount;
        return acc;
      },
      { totalInflows: 0, totalOutflows: 0 }
    );
  }, [filteredTransactions]);

  const netCashFlow = totalInflows - totalOutflows;

  // Chart data grouping (by week or month depending on period)
  const chartData = useMemo(() => {
    // For simplicity, let's group into 4 segments based on the filtered data time range
    if (filteredTransactions.length === 0) return [];

    const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const startTime = new Date(sorted[0].date).getTime();
    const endTime = new Date(sorted[sorted.length - 1].date).getTime();
    const range = endTime - startTime;
    
    // If range is very small, just make it 1 segment
    const segmentDuration = range > 0 ? range / 4 : 1;

    const segments = [
      { label: "Period 1", in: 0, out: 0, maxIn: 0, maxOut: 0 },
      { label: "Period 2", in: 0, out: 0, maxIn: 0, maxOut: 0 },
      { label: "Period 3", in: 0, out: 0, maxIn: 0, maxOut: 0 },
      { label: "Period 4", in: 0, out: 0, maxIn: 0, maxOut: 0 },
    ];

    filteredTransactions.forEach(t => {
      const tTime = new Date(t.date).getTime();
      let index = Math.floor((tTime - startTime) / segmentDuration);
      if (index >= 4) index = 3;
      if (index < 0) index = 0;

      if (t.type === "IN") segments[index].in += t.amount;
      if (t.type === "OUT") segments[index].out += t.amount;
    });

    const maxVal = Math.max(...segments.map(s => Math.max(s.in, s.out)));

    return segments.map(s => ({
      ...s,
      inPct: maxVal > 0 ? (s.in / maxVal) * 100 : 0,
      outPct: maxVal > 0 ? (s.out / maxVal) * 100 : 0
    }));
  }, [filteredTransactions]);

  const categoriesBreakdown = useMemo(() => {
    const categoryTotals = filteredTransactions.reduce((acc, t) => {
      const key = t.description || "Uncategorized";
      if (!acc[key]) acc[key] = { name: key, type: t.type === "IN" ? "in" : "out", amount: 0, rawAmount: 0 };
      acc[key].amount += t.amount;
      acc[key].rawAmount += t.amount;
      return acc;
    }, {} as Record<string, { name: string; type: "in" | "out"; amount: number, rawAmount: number }>);

    const cats = Object.values(categoryTotals).sort((a, b) => b.rawAmount - a.rawAmount).slice(0, 6);
    
    return cats.map(cat => {
      const total = cat.type === "in" ? totalInflows : totalOutflows;
      const pct = total > 0 ? Math.round((cat.rawAmount / total) * 100) : 0;
      return {
        ...cat,
        amountFormatted: cat.rawAmount.toLocaleString(),
        pct
      };
    });
  }, [filteredTransactions, totalInflows, totalOutflows]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Cash Flow Analysis</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track money moving in and out of the institution.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
          >
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
               <p className="text-3xl font-black text-emerald-950 tracking-tight">KSh {totalInflows.toLocaleString()}</p>
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
               <p className="text-3xl font-black text-rose-950 tracking-tight">KSh {totalOutflows.toLocaleString()}</p>
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
               <p className="text-3xl font-black text-white tracking-tight">KSh {netCashFlow.toLocaleString()}</p>
               <p className="text-xs font-bold text-primary-300 mt-2">{netCashFlow >= 0 ? "Positive trajectory" : "Negative trajectory"}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800">Cash Flow Trend</h3>
               <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Inflows</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Outflows</div>
               </div>
            </div>
            
            <div className="flex-1 border-b border-l border-slate-200 relative pt-4 pl-4 flex items-end justify-between px-6 pb-2">
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-200"></div>
               </div>

               {chartData.map((data, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-2 w-16">
                     <div className="flex items-end gap-1 h-48 w-full justify-center">
                        <div className="w-4 bg-emerald-400 rounded-t-sm transition-all hover:bg-emerald-500 cursor-pointer" style={{ height: `${data.inPct}%` }}></div>
                        <div className="w-4 bg-rose-400 rounded-t-sm transition-all hover:bg-rose-500 cursor-pointer" style={{ height: `${data.outPct}%` }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 mt-2">{data.label}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col h-[400px]">
            <h3 className="font-bold text-slate-800 mb-6">Top Categories</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 hide-scrollbar">
               {categoriesBreakdown.length === 0 && (
                 <p className="text-sm text-slate-500 text-center mt-10">No data for selected period.</p>
               )}
               {categoriesBreakdown.map((cat, idx) => (
                  <div key={idx}>
                     <div className="flex justify-between items-end mb-2">
                        <div>
                           <p className="text-sm font-bold text-slate-700">{cat.name}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-wider ${cat.type === 'in' ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {cat.pct}% of {cat.type === 'in' ? 'Inflows' : 'Outflows'}
                           </p>
                        </div>
                        <p className="text-sm font-black text-slate-800">KSh {cat.amountFormatted}</p>
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
