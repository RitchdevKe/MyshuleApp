"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, Download, Filter, Calendar, Activity, ArrowRightLeft, Landmark, Loader2 } from "lucide-react";
import { getCashFlowData } from "./actions";

interface CashFlowDetail {
  name: string;
  amount: number;
}

interface CashFlowCategory {
  inflow: number;
  outflow: number;
  net: number;
  details: CashFlowDetail[];
}

interface CashFlowData {
  beginningBalance: number;
  endingBalance: number;
  netIncrease: number;
  operating: CashFlowCategory;
  investing: CashFlowCategory;
  financing: CashFlowCategory;
}

export default function CashFlowStatementPage() {
  const [period, setPeriod] = useState("FY 2026/2027 - Q1");
  const [data, setData] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await getCashFlowData(period);
        setData(result);
      } catch (error) {
        console.error("Failed to load cash flow data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
  };

  const formatMillions = (amount: number) => {
    return `KSh ${(amount / 1000000).toFixed(1)}M`;
  };

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800">Statement of Cash Flows</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Analysis of cash inflows and outflows by activity type.</p>
         </div>
         <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
                >
                   <option>FY 2026/2027 - Q1</option>
                   <option>FY 2025/2026 - Full Year</option>
                </select>
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
             <button className="p-2.5 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-500 hover:text-primary-900 transition-colors">
                <Filter className="w-5 h-5" />
             </button>
             <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20">
                <Download className="w-4 h-4" /> Export PDF
             </button>
         </div>
      </div>

      {/* Main Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
         
         {/* LEFT COLUMN: Summary / Net Cash Flow */}
         <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-primary-900 rounded-3xl border border-primary-800 p-8 shadow-xl shadow-primary-900/20 relative overflow-hidden group">
               <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
               
               <p className="text-primary-200 text-sm font-bold uppercase tracking-wider mb-2">
                 {data.netIncrease >= 0 ? 'Net Cash Increase' : 'Net Cash Decrease'}
               </p>
               <p className="text-4xl font-black text-white tracking-tight mb-8">{formatMillions(Math.abs(data.netIncrease))}</p>
               
               <div className="space-y-4 pt-6 border-t border-primary-800">
                  <div className="flex justify-between items-center text-primary-100">
                     <span className="text-sm font-medium">Beginning Cash Balance</span>
                     <span className="font-bold">{formatCurrency(data.beginningBalance)}</span>
                  </div>
                  <div className="flex justify-between items-center text-primary-100">
                     <span className="text-sm font-medium">Net Change in Cash</span>
                     <span className="font-bold">{data.netIncrease > 0 ? '+' : ''}{formatCurrency(data.netIncrease)}</span>
                  </div>
                  <div className="flex justify-between items-center text-white pt-2">
                     <span className="text-sm font-bold uppercase">Ending Cash Balance</span>
                     <span className="font-black text-lg">{formatCurrency(data.endingBalance)}</span>
                  </div>
               </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 p-6 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4">Cash Flow Insights</h3>
               <ul className="space-y-4">
                  <li className="flex gap-3 text-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                     <p className="text-slate-600 font-medium">Strong operating cash flow covers all investing and financing activities.</p>
                  </li>
                  <li className="flex gap-3 text-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                     <p className="text-slate-600 font-medium">Heavy investment in fixed assets this quarter due to new school bus purchase.</p>
                  </li>
               </ul>
            </div>

         </div>

         {/* RIGHT COLUMN: Detailed Breakdown */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Operating Activities */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 p-6 shadow-sm transition-all hover:shadow-md">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                     <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-slate-800 text-lg">Operating Activities</h3>
                     <p className="text-xs font-semibold text-slate-500">Cash generated from core school operations.</p>
                  </div>
                  <div className="text-right">
                     <p className={`text-lg font-black ${data.operating.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {data.operating.net > 0 ? '+' : ''} {formatMillions(data.operating.net)}
                     </p>
                  </div>
               </div>

               <div className="space-y-3 text-sm pl-13">
                  {data.operating.details.map((detail: CashFlowDetail, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-slate-600">
                       <span className="font-medium">{detail.name}</span>
                       <span className="font-bold">{detail.amount < 0 ? `(${formatCurrency(Math.abs(detail.amount))})` : formatCurrency(detail.amount)}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Investing Activities */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 p-6 shadow-sm transition-all hover:shadow-md">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                     <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-slate-800 text-lg">Investing Activities</h3>
                     <p className="text-xs font-semibold text-slate-500">Cash spent on long-term assets and infrastructure.</p>
                  </div>
                  <div className="text-right">
                     <p className={`text-lg font-black ${data.investing.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {data.investing.net > 0 ? '+' : ''} {formatMillions(data.investing.net)}
                     </p>
                  </div>
               </div>

               <div className="space-y-3 text-sm pl-13">
                  {data.investing.details.map((detail: CashFlowDetail, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-slate-600">
                       <span className="font-medium">{detail.name}</span>
                       <span className="font-bold">{detail.amount < 0 ? `(${formatCurrency(Math.abs(detail.amount))})` : formatCurrency(detail.amount)}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Financing Activities */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 p-6 shadow-sm transition-all hover:shadow-md">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                     <Landmark className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-slate-800 text-lg">Financing Activities</h3>
                     <p className="text-xs font-semibold text-slate-500">Cash from borrowing or shareholder equity.</p>
                  </div>
                  <div className="text-right">
                     <p className={`text-lg font-black ${data.financing.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {data.financing.net > 0 ? '+' : ''} {formatMillions(data.financing.net)}
                     </p>
                  </div>
               </div>

               <div className="space-y-3 text-sm pl-13">
                  {data.financing.details.map((detail: CashFlowDetail, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-slate-600">
                       <span className="font-medium">{detail.name}</span>
                       <span className="font-bold">{detail.amount < 0 ? `(${formatCurrency(Math.abs(detail.amount))})` : formatCurrency(detail.amount)}</span>
                    </div>
                  ))}
               </div>
            </div>

         </div>
      </div>

    </div>
  );
}
