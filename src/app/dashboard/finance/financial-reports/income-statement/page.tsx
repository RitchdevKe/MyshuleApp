"use client";

import React, { useState } from "react";
import { LineChart, Download, Calendar, ChevronDown, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function IncomeStatementPage() {
  const [period, setPeriod] = useState("FY 2026/2027 - Q1");

  return (
    <div className="space-y-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800">Profit & Loss Statement</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Comprehensive breakdown of revenues, costs, and expenses.</p>
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
                   <option>FY 2025/2026 - Q4</option>
                </select>
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
             <button className="p-2.5 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-500 hover:text-primary-900 transition-colors">
                <Filter className="w-5 h-5" />
             </button>
             <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20">
                <Download className="w-4 h-4" /> Export PDF
             </button>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-3xl border border-emerald-200/50 shadow-sm relative overflow-hidden">
            <p className="text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-emerald-950 tracking-tight">KSh 45.2M</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-200/50 inline-flex px-2 py-1 rounded-md">
               <ArrowUpRight className="w-3 h-3" /> 12% vs last period
            </div>
         </div>
         <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 rounded-3xl border border-rose-200/50 shadow-sm relative overflow-hidden">
            <p className="text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">Total Expenses</p>
            <p className="text-3xl font-black text-rose-950 tracking-tight">KSh 32.8M</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-200/50 inline-flex px-2 py-1 rounded-md">
               <ArrowUpRight className="w-3 h-3" /> 4% vs last period
            </div>
         </div>
         <div className="bg-primary-900 p-6 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20 relative overflow-hidden">
            <p className="text-primary-200 text-xs font-bold uppercase tracking-wider mb-1">Net Income</p>
            <p className="text-3xl font-black text-white tracking-tight">KSh 12.4M</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/20 inline-flex px-2 py-1 rounded-md">
               Net Margin: 27.4%
            </div>
         </div>
      </div>

      {/* Financial Statement Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-2/3">Account</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-1/3">Amount (KSh)</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               
               {/* REVENUE */}
               <tr className="bg-slate-50/30">
                  <td className="px-6 py-3 font-black text-slate-800" colSpan={2}>Operating Revenue</td>
               </tr>
               <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                  <td className="px-8 py-3 font-medium text-slate-600">Tuition Fees</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">38,500,000</td>
               </tr>
               <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                  <td className="px-8 py-3 font-medium text-slate-600">Transport Fees</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">4,200,000</td>
               </tr>
               <tr className="hover:bg-slate-50/50">
                  <td className="px-8 py-3 font-medium text-slate-600">Other Income (Clubs, Meals)</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">2,500,000</td>
               </tr>
               <tr className="bg-emerald-50/50 border-y border-emerald-100">
                  <td className="px-6 py-3 font-black text-emerald-900">Total Revenue</td>
                  <td className="px-6 py-3 text-right font-black text-emerald-900">45,200,000</td>
               </tr>

               {/* COGS */}
               <tr className="bg-slate-50/30">
                  <td className="px-6 py-3 font-black text-slate-800 mt-4" colSpan={2}>Cost of Goods Sold (Direct Costs)</td>
               </tr>
               <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                  <td className="px-8 py-3 font-medium text-slate-600">Educational Materials & Books</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">3,100,000</td>
               </tr>
               <tr className="hover:bg-slate-50/50">
                  <td className="px-8 py-3 font-medium text-slate-600">Food & Catering Supplies</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">1,800,000</td>
               </tr>
               <tr className="bg-slate-50 border-y border-slate-200">
                  <td className="px-6 py-3 font-black text-slate-800">Total Direct Costs</td>
                  <td className="px-6 py-3 text-right font-black text-slate-800">4,900,000</td>
               </tr>
               <tr className="bg-primary-50 border-b border-primary-100">
                  <td className="px-6 py-3 font-black text-primary-900">Gross Profit</td>
                  <td className="px-6 py-3 text-right font-black text-primary-900">40,300,000</td>
               </tr>

               {/* EXPENSES */}
               <tr className="bg-slate-50/30">
                  <td className="px-6 py-3 font-black text-slate-800 mt-4" colSpan={2}>Operating Expenses</td>
               </tr>
               <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                  <td className="px-8 py-3 font-medium text-slate-600">Payroll & Benefits</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">18,500,000</td>
               </tr>
               <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                  <td className="px-8 py-3 font-medium text-slate-600">Infrastructure & Maintenance</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">4,200,000</td>
               </tr>
               <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                  <td className="px-8 py-3 font-medium text-slate-600">Transport & Fuel</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">2,800,000</td>
               </tr>
               <tr className="hover:bg-slate-50/50 border-b border-slate-50">
                  <td className="px-8 py-3 font-medium text-slate-600">Utilities (Water, Power, Internet)</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">1,200,000</td>
               </tr>
               <tr className="hover:bg-slate-50/50">
                  <td className="px-8 py-3 font-medium text-slate-600">Administrative Expenses</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">1,200,000</td>
               </tr>
               <tr className="bg-rose-50/50 border-y border-rose-100">
                  <td className="px-6 py-3 font-black text-rose-900">Total Operating Expenses</td>
                  <td className="px-6 py-3 text-right font-black text-rose-900">27,900,000</td>
               </tr>

               {/* NET INCOME */}
               <tr className="bg-primary-900 text-white">
                  <td className="px-6 py-4 font-black text-lg">Net Income</td>
                  <td className="px-6 py-4 text-right font-black text-lg">12,400,000</td>
               </tr>

            </tbody>
         </table>
      </div>

    </div>
  );
}
