"use client";

import React, { useState, useEffect } from "react";
import { Download, Filter, Calendar } from "lucide-react";
import { getBalanceSheetData } from "./actions";

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState("2026-10-31");
  const [data, setData] = useState<{
    assets: { name: string; balance: number }[];
    liabilities: { name: string; balance: number }[];
    equity: { name: string; balance: number }[];
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await getBalanceSheetData(asOfDate);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [asOfDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);
  };

  const formatCompact = (amount: number) => {
    return new Intl.NumberFormat("en-KE", { notation: "compact", maximumFractionDigits: 1 }).format(amount);
  };

  const liquidityRatio = data?.totalLiabilities ? (data.totalAssets / data.totalLiabilities).toFixed(2) : "N/A";
  const debtToEquity = data?.totalEquity ? (data.totalLiabilities / data.totalEquity).toFixed(2) : "N/A";
  
  const isBalanced = data ? Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 0.01 : true;

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800">Statement of Financial Position</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Snapshot of Assets, Liabilities, and Equity.</p>
         </div>
         <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
                <input 
                  type="date" 
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer" 
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
             <button className="p-2.5 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-500 hover:text-primary-900 transition-colors">
                <Filter className="w-5 h-5" />
             </button>
             <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20"
             >
                <Download className="w-4 h-4" /> Export PDF
             </button>
         </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-200 rounded-3xl"></div>
            <div className="h-32 bg-slate-200 rounded-3xl"></div>
            <div className="h-32 bg-slate-200 rounded-3xl"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-200 rounded-3xl"></div>
            <div className="h-96 bg-slate-200 rounded-3xl"></div>
          </div>
        </div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Assets</p>
                <p className="text-3xl font-black text-slate-800 tracking-tight">{formatCompact(data.totalAssets)}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 inline-flex px-2 py-1 rounded-md">
                   Liquidity Ratio: {liquidityRatio}
                </div>
             </div>
             <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Liabilities</p>
                <p className="text-3xl font-black text-slate-800 tracking-tight">{formatCompact(data.totalLiabilities)}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 inline-flex px-2 py-1 rounded-md">
                   Debt-to-Equity: {debtToEquity}
                </div>
             </div>
             <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Equity</p>
                <p className="text-3xl font-black text-primary-900 tracking-tight">{formatCompact(data.totalEquity)}</p>
                <div className={`mt-4 flex items-center gap-2 text-xs font-bold inline-flex px-2 py-1 rounded-md ${isBalanced ? 'text-slate-500 bg-slate-100' : 'text-rose-600 bg-rose-50'}`}>
                   {isBalanced ? "Matches Assets - Liabilities" : "Out of Balance"}
                </div>
             </div>
          </div>

          {/* Dual Column Layout for Balance Sheet */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             
             {/* ASSETS COLUMN */}
             <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-200/80 bg-slate-50/50">
                   <h3 className="text-lg font-black text-slate-800 tracking-tight">Assets</h3>
                </div>
                
                <div className="flex-1 p-6 space-y-6">
                   <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Accounts</h4>
                      <div className="space-y-3 text-sm">
                         {data.assets.length === 0 && <span className="text-slate-500 italic">No asset accounts found.</span>}
                         {data.assets.map((account, idx) => (
                           <div key={idx} className="flex justify-between items-center">
                              <span className="font-medium text-slate-600">{account.name}</span>
                              <span className="font-bold text-slate-800">{formatCurrency(account.balance)}</span>
                           </div>
                         ))}
                         {data.assets.length > 0 && (
                           <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                              <span className="font-black text-slate-800">Total Assets</span>
                              <span className="font-black text-slate-800">{formatCurrency(data.totalAssets)}</span>
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="p-6 border-t border-slate-200/80 bg-primary-50/50 flex justify-between items-center">
                   <span className="text-lg font-black text-primary-900 uppercase tracking-wider">Total Assets</span>
                   <span className="text-xl font-black text-primary-900 border-double border-b-4 border-primary-900 pb-1">{formatCurrency(data.totalAssets)}</span>
                </div>
             </div>

             {/* LIABILITIES & EQUITY COLUMN */}
             <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-200/80 bg-slate-50/50">
                   <h3 className="text-lg font-black text-slate-800 tracking-tight">Liabilities & Equity</h3>
                </div>
                
                <div className="flex-1 p-6 space-y-6">
                   
                   {/* Liabilities */}
                   <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Liabilities</h4>
                      <div className="space-y-3 text-sm">
                         {data.liabilities.length === 0 && <span className="text-slate-500 italic">No liability accounts found.</span>}
                         {data.liabilities.map((account, idx) => (
                           <div key={idx} className="flex justify-between items-center">
                              <span className="font-medium text-slate-600">{account.name}</span>
                              <span className="font-bold text-slate-800">{formatCurrency(account.balance)}</span>
                           </div>
                         ))}
                         {data.liabilities.length > 0 && (
                           <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                              <span className="font-black text-slate-800">Total Liabilities</span>
                              <span className="font-black text-slate-800">{formatCurrency(data.totalLiabilities)}</span>
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Equity */}
                   <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Equity</h4>
                      <div className="space-y-3 text-sm">
                         {data.equity.length === 0 && <span className="text-slate-500 italic">No equity accounts found.</span>}
                         {data.equity.map((account, idx) => (
                           <div key={idx} className="flex justify-between items-center">
                              <span className="font-medium text-slate-600">{account.name}</span>
                              <span className="font-bold text-slate-800">{formatCurrency(account.balance)}</span>
                           </div>
                         ))}
                         {data.equity.length > 0 && (
                           <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                              <span className="font-black text-slate-800">Total Equity</span>
                              <span className="font-black text-slate-800">{formatCurrency(data.totalEquity)}</span>
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="p-6 border-t border-slate-200/80 bg-primary-50/50 flex justify-between items-center">
                   <span className="text-lg font-black text-primary-900 uppercase tracking-wider">Total L & E</span>
                   <span className="text-xl font-black text-primary-900 border-double border-b-4 border-primary-900 pb-1">{formatCurrency(data.totalLiabilities + data.totalEquity)}</span>
                </div>
             </div>

          </div>
        </>
      ) : null}
    </div>
  );
}
