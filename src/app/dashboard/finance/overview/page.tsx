"use client";

import React, { useState } from "react";
import { 
  TrendingUp, DollarSign, CreditCard, 
  AlertCircle, ArrowDownRight, Activity, Wallet,
  PieChart, BarChart3, LineChart, Building,
  ArrowRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const cashFlowData = [
  { name: 'Jan', inflow: 4.2, outflow: 2.4 },
  { name: 'Feb', inflow: 3.8, outflow: 2.8 },
  { name: 'Mar', inflow: 5.1, outflow: 3.1 },
  { name: 'Apr', inflow: 2.9, outflow: 2.7 },
  { name: 'May', inflow: 6.4, outflow: 3.5 },
  { name: 'Jun', inflow: 4.8, outflow: 3.2 },
];

const TABS = [
  { id: "summary", label: "Summary", icon: PieChart },
  { id: "cashflow", label: "Cash Flow", icon: LineChart },
  { id: "receivables", label: "Receivables", icon: CreditCard },
  { id: "budget", label: "Budget", icon: BarChart3 },
  { id: "accounts", label: "Accounts", icon: Building },
];

export default function FinanceOverviewPage() {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Card */}
      <div className="bg-primary-900 p-5 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Finance Overview</h1>
          <p className="text-sm text-primary-200 font-medium mt-1">Monitor the financial health of the institution.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="px-4 py-2.5 bg-primary-800 border border-primary-700 rounded-xl text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all cursor-pointer">
            <option>Financial Year 2026</option>
            <option>Financial Year 2025</option>
          </select>
          <select className="px-4 py-2.5 bg-primary-800 border border-primary-700 rounded-xl text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all cursor-pointer">
            <option>Term 2</option>
            <option>Term 1</option>
          </select>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                isActive
                  ? "bg-secondary-500 text-white shadow-secondary-500/20"
                  : "bg-primary-900 text-white hover:bg-primary-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conditional Rendering of Tabs */}

      {/* TAB: SUMMARY */}
      {activeTab === "summary" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-200/50 transition-all duration-300">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/50 backdrop-blur-sm">
                  <TrendingUp className="w-3.5 h-3.5" /> 8%
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Total Revenue</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">KSh 24.8M</h3>
            </div>

            <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-200/50 transition-all duration-300">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-1.5 rounded-lg border border-blue-200/50 backdrop-blur-sm">
                  86% Coll.
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Collected</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">KSh 21.4M</h3>
            </div>

            <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-rose-200/50 transition-all duration-300">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-extrabold text-rose-700 bg-rose-100/80 px-2.5 py-1.5 rounded-lg border border-rose-200/50 backdrop-blur-sm">
                  14% Pend.
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Outstanding</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">KSh 3.4M</h3>
            </div>

            <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-200/50 transition-all duration-300">
                  <ArrowDownRight className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-100/80 px-2.5 py-1.5 rounded-lg border border-amber-200/50 backdrop-blur-sm">
                  Bud. 63%
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Expenses</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">KSh 15.7M</h3>
            </div>

            <div className="bg-gradient-to-br from-primary-900 to-primary-950 p-6 rounded-3xl border border-primary-800 shadow-lg flex flex-col relative overflow-hidden group hover:shadow-primary-900/40 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-secondary-500 opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-white/10 text-white rounded-2xl backdrop-blur-md border border-white/10">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-400 bg-emerald-400/10 px-2.5 py-1.5 rounded-lg border border-emerald-400/20 backdrop-blur-sm">
                  Healthy
                </span>
              </div>
              <p className="text-sm font-bold text-primary-200 mb-1 relative z-10">Net Position</p>
              <h3 className="text-3xl font-black text-white tracking-tight relative z-10">KSh 5.7M</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Alerts Summary */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10"></div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Action Required</h3>
                <button 
                  onClick={() => setActiveTab("receivables")} 
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View Receivables <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 items-start p-4 bg-rose-50/80 rounded-2xl border border-rose-100/80 hover:bg-rose-50 transition-colors cursor-pointer group">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm border border-rose-100 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm text-rose-900 font-bold">42 accounts overdue</p>
                    <p className="text-xs text-rose-700/80 font-medium mt-0.5">Totaling KSh 1.2M in arrears.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-4 bg-amber-50/80 rounded-2xl border border-amber-100/80 hover:bg-amber-50 transition-colors cursor-pointer group">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm border border-amber-100 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-900 font-bold">Supplier bills due</p>
                    <p className="text-xs text-amber-700/80 font-medium mt-0.5">KSh 850,000 pending this week.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash Flow Mini */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Cash Flow (3 mo)</h3>
                </div>
                <button 
                  onClick={() => setActiveTab("cashflow")} 
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  Full Report <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 w-full h-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData.slice(-3)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInflowMini" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={false} width={0} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInflowMini)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CASH FLOW */}
      {activeTab === "cashflow" && (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800">Detailed Cash Flow Analysis</h3>
              <p className="text-sm font-bold text-slate-400 mt-1">Inflow vs Outflow (Millions KSh)</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                <span className="text-xs font-bold text-slate-600">Inflow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50"></div>
                <span className="text-xs font-bold text-slate-600">Outflow</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => `KSh ${value}M`}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800 }}
                  labelStyle={{ fontWeight: 800, color: '#475569', marginBottom: '4px' }}
                  formatter={(value) => [`KSh ${value}M`, undefined]}
                />
                <Area type="monotone" dataKey="inflow" name="Inflow" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInflow)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
                <Area type="monotone" dataKey="outflow" name="Outflow" stroke="#fb7185" strokeWidth={3} fillOpacity={1} fill="url(#colorOutflow)" activeDot={{ r: 6, strokeWidth: 0, fill: '#fb7185' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB: RECEIVABLES */}
      {activeTab === "receivables" && (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h3 className="text-lg font-black text-slate-800 mb-6">Receivables Aging</h3>
          <div className="space-y-6 max-w-3xl">
            <div className="group">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">Current (0-30 Days)</span>
                <span className="font-black text-slate-800 text-lg">KSh 1.2M</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-[35%] rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-600 group-hover:text-amber-500 transition-colors">31–60 Days</span>
                <span className="font-black text-slate-800 text-lg">KSh 850K</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-amber-300 to-amber-400 w-[25%] rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] delay-75"></div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-600 group-hover:text-orange-500 transition-colors">61–90 Days</span>
                <span className="font-black text-slate-800 text-lg">KSh 600K</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 w-[18%] rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] delay-150"></div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-600 group-hover:text-rose-500 transition-colors">90+ Days (High Risk)</span>
                <span className="font-black text-slate-800 text-lg">KSh 750K</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-rose-500 to-rose-600 w-[22%] rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BUDGET */}
      {activeTab === "budget" && (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
          <h3 className="text-lg font-black text-slate-800 mb-6">Departmental Budget Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-600">Academics</span>
                  <span className="font-black text-slate-700 bg-slate-100 px-2 rounded-md">82% Used</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-emerald-500 w-[82%] rounded-full group-hover:scale-x-[1.02] origin-left transition-transform"></div>
                </div>
              </div>
              <div className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-600">Transport</span>
                  <span className="font-black text-slate-700 bg-slate-100 px-2 rounded-md">91% Used</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-amber-500 w-[91%] rounded-full group-hover:scale-x-[1.02] origin-left transition-transform"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-600 flex items-center gap-1">ICT (Over Budget) <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" /></span>
                  <span className="font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 rounded-md">113% Used</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-rose-500 w-[100%] rounded-full"></div>
                </div>
              </div>
              <div className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-600">Administration</span>
                  <span className="font-black text-slate-700 bg-slate-100 px-2 rounded-md">67% Used</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-blue-500 w-[67%] rounded-full group-hover:scale-x-[1.02] origin-left transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ACCOUNTS */}
      {activeTab === "accounts" && (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h3 className="text-lg font-black text-slate-800 mb-6">Cash & Bank Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-primary-600 transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider">Main Bank A/C</span>
              </div>
              <p className="text-2xl font-black text-slate-800">KSh 4.82M</p>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-primary-600 transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider">Fees A/C</span>
              </div>
              <p className="text-2xl font-black text-slate-800">KSh 2.15M</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-primary-600 transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider">M-Pesa Till</span>
              </div>
              <p className="text-2xl font-black text-slate-800">KSh 1.18M</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-primary-600 transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider">Petty Cash</span>
              </div>
              <p className="text-2xl font-black text-slate-800">KSh 45K</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
