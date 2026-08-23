import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Banknote, Receipt, ArrowUpRight, ArrowDownRight, Users, BellRing, Target } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function FinanceDashTab() {
  const [invoicesLogs, setInvoicesLogs] = useState([
    { id: 'INV-2026-01', name: 'Douglas Omari', form: 4, amount: 25000, paid: 25000, balance: 0, date: '2026-05-15', status: 'Fully Paid' },
    { id: 'INV-2026-02', name: 'Emily Wanjala', form: 4, amount: 25000, paid: 12500, balance: 12500, date: '2026-05-15', status: 'Partially Paid' },
    { id: 'INV-2026-03', name: 'Pius Mwambia', form: 2, amount: 22000, paid: 7000, balance: 15000, date: '2026-05-15', status: 'Partially Paid' },
    { id: 'INV-2026-04', name: 'Adrian Kipirono', form: 4, amount: 25000, paid: 20000, balance: 5000, date: '2026-05-16', status: 'Partially Paid' }
  ]);

  const financeOverviewData = [
    { month: 'Jan', collection: 820000, target: 800000 },
    { month: 'Feb', collection: 620000, target: 700000 },
    { month: 'Mar', collection: 930000, target: 850000 },
    { month: 'Apr', collection: 510000, target: 700000 },
    { month: 'May', collection: 880000, target: 850000 },
    { month: 'Jun', collection: 450000, target: 500000 },
  ];

  const totalGoal = 3800000;
  const actualCollected = invoicesLogs.reduce((acc, i) => acc + i.paid, 0) + 4120000; // Added base amount to make it look realistic based on chart
  const outstandingVal = invoicesLogs.reduce((acc, i) => acc + i.balance, 0) + 850000;
  const activeAccounts = 412;
  const collectedPercentage = Math.min(100, Math.round((actualCollected / 5000000) * 100)); // Using 5M as term target

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 p-2.5 rounded-lg text-xs tabular-nums">
          <p className="text-slate-300 mb-1.5 font-medium">{label} 2026</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-400 capitalize">{entry.name}:</span>
              <span className="text-white font-medium">KES {entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-br from-[#3D1D3F] via-[#2A142C] to-[#C20F47]/30 rounded-[1.5rem] p-4 relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-white">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Financial Command Center
            </h2>
            <p className="text-white/50 mt-1 text-xs max-w-2xl">
              Liquidity, collections, and ledger forecasts at a glance.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-emerald-300 mb-0.5">Total Liquidity</span>
                <span className="block text-xl font-bold text-white tabular-nums">{(actualCollected / 1000000).toFixed(2)}M</span>
                <span className="block text-[11px] font-medium text-emerald-200 mt-0.5 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.4%
                </span>
             </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-10 -translate-y-1/2 translate-x-1/3" />
      </div>

      {/* Dynamic HUD Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-emerald-500" /> Collection Target
          </span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums block mt-1.5">
            {collectedPercentage}%
          </span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
             <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${collectedPercentage}%` }} />
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-2">
            On track for Q2
          </span>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Pending Arrears
          </span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums block mt-1.5 truncate">
            KES {outstandingVal.toLocaleString()}
          </span>
          <span className="text-[11px] text-rose-600 font-medium block mt-2">
            Needs follow-up
          </span>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-500" /> Active Billing
          </span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums block mt-1.5">
            {activeAccounts}
          </span>
          <span className="text-[11px] text-indigo-600 font-medium block mt-2">
            Student ledger accounts
          </span>
        </div>
        
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm relative overflow-hidden">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-500" /> Term Objective
          </span>
          <span className="text-2xl font-bold tabular-nums block mt-1.5 text-slate-900">
            KES 5.0M
          </span>
          <span className="text-[11px] text-slate-400 font-medium block mt-2">
            Primary collections goal
          </span>
           <CreditCard className="w-16 h-16 text-slate-900 opacity-5 absolute -right-1 -bottom-1 z-0" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Main Chart Area */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Revenue vs Target</h3>
              <p className="text-xs text-slate-400 mt-0.5">Revenue inflows this academic term</p>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
               <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Inflows</span>
               <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span> Projections</span>
            </div>
          </div>
          <div className="p-4 flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollection" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} formatter={(v: number) => `${Math.round(v/1000)}k`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="collection" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCollection)" name="Collections" />
                <Line type="step" dataKey="target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Quarterly Target" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Ledger Posting Desk */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-2">
              <Receipt className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Rapid Checkout</h4>
            <p className="text-xs text-slate-400 mt-0.5">Record a fee payment against an open invoice.</p>
          </div>
          
          <div className="p-4 space-y-3 flex-1">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Open Invoice</label>
              <select 
                id="dash-payment-invoice"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium text-slate-800 cursor-pointer transition"
              >
                <option value="">-- Search arrears --</option>
                {invoicesLogs.filter(i => i.balance > 0).map(i => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.id}) - Due: KES {i.balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Payment Amount</label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 tabular-nums">KES</span>
                  <input 
                    type="number" 
                    id="dash-payment-amount"
                    placeholder="0.00"
                    className="w-full pl-11 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium text-slate-900 tabular-nums transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Channel</label>
                <select 
                  id="dash-payment-mode"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium text-slate-800 cursor-pointer transition"
                >
                  <option value="MPESA">M-PESA Paybill</option>
                  <option value="Cash">Physical Cash</option>
                  <option value="Bank Transfer">Bank Transfer (EFT)</option>
                  <option value="Cheque">Banker Cheque</option>
                </select>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={() => {
                  const selectEl = document.getElementById('dash-payment-invoice') as HTMLSelectElement;
                  const amountEl = document.getElementById('dash-payment-amount') as HTMLInputElement;
                  const modeEl = document.getElementById('dash-payment-mode') as HTMLSelectElement;

                  const invId = selectEl?.value;
                  const pAmountStr = amountEl?.value;
                  const pMode = modeEl?.value || 'MPESA';

                  if (!invId) {
                    toast.error('Specify a target invoice to reconcile.');
                    return;
                  }
                  if (!pAmountStr || Number(pAmountStr) <= 0) {
                    toast.error('Enter a valid positive transaction value.');
                    return;
                  }

                  const amtNum = Number(pAmountStr);

                  // Update invoice state locally for mockup
                  let updated = false;
                  setInvoicesLogs(prev => prev.map(inv => {
                    if (inv.id === invId) {
                      if (amtNum > inv.balance) {
                        toast.error(`Payment exceeds the outstanding dues of KES ${inv.balance.toLocaleString()}`);
                        return inv;
                      }
                      updated = true;
                      const newPaid = inv.paid + amtNum;
                      const newBalance = inv.amount - newPaid;
                      return {
                        ...inv,
                        paid: newPaid,
                        balance: newBalance,
                        status: newBalance === 0 ? 'Fully Paid' : 'Partially Paid'
                      };
                    }
                    return inv;
                  }));

                  if (updated) {
                    toast.success(`KES ${amtNum.toLocaleString()} receipted via ${pMode} for ${invId}.`);
                    amountEl.value = '';
                    selectEl.value = '';
                  }
                }}
                className="w-full py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer border-none"
              >
                Issue Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
