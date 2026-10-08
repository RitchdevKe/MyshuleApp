"use client";

import React, { useState, useTransition } from "react";
import { Coins, Plus, Wallet, FileText, CheckCircle2, XCircle, Search, Filter } from "lucide-react";
import { topUpFloat, logExpense } from "./actions";
import type { PettyCashAccount, PettyCashTransaction } from "@prisma/client";
import { format } from "date-fns";

export function PettyCashClient({
  account,
  transactions,
  spentThisMonth
}: {
  account: PettyCashAccount | null;
  transactions: PettyCashTransaction[];
  spentThisMonth: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showLogExpense, setShowLogExpense] = useState(false);
  
  const [topUpAmount, setTopUpAmount] = useState("");
  
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Office Supplies");
  const [expenseReqBy, setExpenseReqBy] = useState("");

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) return;

    startTransition(async () => {
      await topUpFloat(account.id, amt);
      setShowTopUp(false);
      setTopUpAmount("");
    });
  };

  const handleLogExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) return;

    startTransition(async () => {
      await logExpense(account.id, amt, expenseDesc, expenseCategory, expenseReqBy);
      setShowLogExpense(false);
      setExpenseAmount("");
      setExpenseDesc("");
      setExpenseReqBy("");
    });
  };

  const balance = account?.balance || 0;
  const floatLimit = 50000;
  const floatPercentage = Math.min((balance / floatLimit) * 100, 100);
  const spentPercentage = Math.min((spentThisMonth / floatLimit) * 100, 100);

  return (
    <div className="space-y-6">
      
      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Petty Cash Management</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage small expenditures, float balances, and top-ups.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowTopUp(true)}
            disabled={!account || isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50">
             <Wallet className="w-4 h-4 text-primary-900" /> Top Up Float
          </button>
          <button 
            onClick={() => setShowLogExpense(true)}
            disabled={!account || isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all disabled:opacity-50">
             <Plus className="w-4 h-4" /> Log Expense
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Float Card */}
         <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-6 rounded-3xl border border-primary-700 shadow-lg shadow-primary-900/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-white/10">
               <Coins className="w-32 h-32" />
            </div>
            <div className="relative z-10">
               <p className="text-primary-200 text-xs font-bold uppercase tracking-wider mb-2">Available Float Balance</p>
               <p className="text-4xl font-black text-white tracking-tight">KSh {balance.toLocaleString()}</p>
               
               <div className="mt-6 pt-5 border-t border-primary-700/50 flex justify-between items-center">
                  <div>
                     <p className="text-primary-300 text-[10px] font-bold uppercase tracking-wider">Total Float Limit</p>
                     <p className="text-white text-sm font-bold">KSh {floatLimit.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-primary-300 text-[10px] font-bold uppercase tracking-wider">Status</p>
                     <p className="text-white text-sm font-bold">{account?.isActive ? "Active" : "Inactive"}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Spent Summary Card */}
         <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
               <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" />
               </div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Spent This Month</p>
               <p className="text-3xl font-black text-slate-800 tracking-tight">KSh {spentThisMonth.toLocaleString()}</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
               <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${spentPercentage}%` }}></div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 text-right">{Math.round(spentPercentage)}% of float limit used</p>
         </div>

         {/* Pending Approvals Card (Mocked as real transactions for now) */}
         <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors cursor-pointer group">
            <div>
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
               </div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Transactions</p>
               <p className="text-3xl font-black text-slate-800 tracking-tight">{transactions.length} <span className="text-sm font-medium text-slate-500">records</span></p>
            </div>
            <p className="text-sm font-bold text-emerald-600 mt-4">View history &rarr;</p>
         </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-slate-800">Petty Cash Log</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search expenses..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900 shadow-sm" />
               </div>
               <button className="p-2 text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                  <Filter className="w-4 h-4" />
               </button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/80">
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Ref</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                     <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-800">{format(new Date(tx.date), "dd MMM yyyy, HH:mm")}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{tx.id.slice(0, 8)}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-700">{tx.description}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              tx.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                           }`}>
                              {tx.type === 'IN' ? 'Top Up' : 'Expense'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <p className="text-sm font-black text-slate-800">KSh {tx.amount.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                           </span>
                        </td>
                     </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm font-medium">
                        No transactions found.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Modals (Simple overlays) */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-4">Top Up Float</h3>
            <form onSubmit={handleTopUp} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Amount (KSh)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 outline-none"
                  placeholder="e.g. 10000"
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowTopUp(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 disabled:opacity-50">
                  {isPending ? "Processing..." : "Confirm Top Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLogExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-4">Log Expense</h3>
            <form onSubmit={handleLogExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select 
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 outline-none"
                >
                  <option>Office Supplies</option>
                  <option>Repairs</option>
                  <option>Groceries</option>
                  <option>Hospitality</option>
                  <option>Events</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <input 
                  type="text" 
                  required
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 outline-none"
                  placeholder="e.g. Milk and sugar"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Requested By</label>
                <input 
                  type="text" 
                  required
                  value={expenseReqBy}
                  onChange={(e) => setExpenseReqBy(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 outline-none"
                  placeholder="e.g. Mary (Admin)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Amount (KSh)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 outline-none"
                  placeholder="e.g. 500"
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowLogExpense(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 disabled:opacity-50">
                  {isPending ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
