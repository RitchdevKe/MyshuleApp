import React from "react";
import { TrendingUp, DollarSign, CreditCard, AlertCircle, ArrowDownRight, Activity, ArrowRight, Clock } from "lucide-react";

export default function SummaryTab({ data }: { data: Record<string, number> }) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `KSh ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `KSh ${(amount / 1000).toFixed(1)}K`;
    }
    return `KSh ${amount.toLocaleString()}`;
  };

  const {
    totalRevenue = 0,
    collected = 0,
    outstanding = 0,
    expenses = 0,
    netPosition = 0,
    collectionRate = 0,
    outstandingRate = 0,
    expenseRate = 0,
    overdueCount = 0,
    overdueAmount = 0
  } = data || {};

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">Financial Summary</h3>
          <p className="text-sm font-medium text-slate-500">Overview of key financial metrics for this period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden lg:col-span-1 md:col-span-2">
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
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{formatCurrency(totalRevenue)}</h3>
        </div>

        {/* Collected */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-200/50 transition-all duration-300">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-1.5 rounded-lg border border-blue-200/50 backdrop-blur-sm">
              {collectionRate}% Coll.
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Collected</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{formatCurrency(collected)}</h3>
        </div>

        {/* Outstanding */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-rose-200/50 transition-all duration-300">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-extrabold text-rose-700 bg-rose-100/80 px-2.5 py-1.5 rounded-lg border border-rose-200/50 backdrop-blur-sm">
              {outstandingRate}% Pend.
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Outstanding</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{formatCurrency(outstanding)}</h3>
        </div>

        {/* Expenses */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-200/50 transition-all duration-300">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-100/80 px-2.5 py-1.5 rounded-lg border border-amber-200/50 backdrop-blur-sm">
              Bud. {expenseRate}%
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Expenses</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{formatCurrency(expenses)}</h3>
        </div>

        {/* Net Position */}
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
          <h3 className="text-3xl font-black text-white tracking-tight relative z-10">{formatCurrency(netPosition)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Alerts Summary */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Action Required</h3>
            <button className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View Receivables <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3 items-start p-4 bg-rose-50/80 rounded-2xl border border-rose-100/80 hover:bg-rose-50 transition-colors cursor-pointer group">
              <div className="p-1.5 bg-white rounded-lg shadow-sm border border-rose-100 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              </div>
              <div>
                <p className="text-sm text-rose-900 font-bold">{overdueCount} accounts overdue</p>
                <p className="text-xs text-rose-700/80 font-medium mt-0.5">Totaling {formatCurrency(overdueAmount)} in arrears.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-4 bg-amber-50/80 rounded-2xl border border-amber-100/80 hover:bg-amber-50 transition-colors cursor-pointer group">
              <div className="p-1.5 bg-white rounded-lg shadow-sm border border-amber-100 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              </div>
              <div>
                <p className="text-sm text-amber-900 font-bold">Payroll Approval Pending</p>
                <p className="text-xs text-amber-700/80 font-medium mt-0.5">Due in 3 days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Progress */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Term Collection Progress</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">On Track</span>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-sm font-bold text-slate-500">Target</span>
                  <p className="text-lg font-black text-slate-800">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-600">Collected</span>
                  <p className="text-lg font-black text-emerald-700">{formatCurrency(collected)}</p>
                </div>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full relative overflow-hidden transition-all duration-1000"
                  style={{ width: `${collectionRate}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-bold text-slate-400">0%</span>
                <span className="text-xs font-black text-emerald-600">{collectionRate}%</span>
                <span className="text-xs font-bold text-slate-400">100%</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex gap-4">
              <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-1">Expected Today</p>
                <p className="text-base font-black text-slate-800">KSh 125K</p>
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-1">Expected This Week</p>
                <p className="text-base font-black text-slate-800">KSh 850K</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
