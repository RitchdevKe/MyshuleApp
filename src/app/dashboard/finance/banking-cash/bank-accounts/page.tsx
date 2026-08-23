"use client";

import React from "react";
import { Landmark, ArrowUpRight, ArrowDownLeft, Settings2, Plus, ArrowRightLeft, FileText, MoreVertical } from "lucide-react";

export default function BankAccountsPage() {
  const accounts = [
    { name: "KCB Main Account", num: "1122334455", bal: "4,820,000", in: "450,000", out: "120,000", color: "emerald", type: "Checking" },
    { name: "Equity Fees Collection", num: "0987654321", bal: "3,100,000", in: "850,000", out: "40,000", color: "blue", type: "Collection" },
    { name: "M-Pesa Paybill", num: "888999", bal: "450,000", in: "210,000", out: "0", color: "emerald", type: "Mobile Money" },
    { name: "School Bus Fund", num: "44556677", bal: "1,200,000", in: "50,000", out: "80,000", color: "purple", type: "Savings" },
  ];

  const transactions = [
    { id: "TX-1092", date: "Today, 10:45 AM", desc: "School Fees - Term 3", ref: "John Doe (STD 8)", account: "Equity Fees Collection", type: "in", amount: "45,000", status: "Completed" },
    { id: "TX-1091", date: "Today, 09:15 AM", desc: "Supplier Payment - Books", ref: "Text Book Centre Ltd", account: "KCB Main Account", type: "out", amount: "120,000", status: "Completed" },
    { id: "TX-1090", date: "Yesterday, 14:30 PM", desc: "M-Pesa Settlement", ref: "Safaricom PLC", account: "M-Pesa Paybill", type: "in", amount: "210,000", status: "Completed" },
    { id: "TX-1089", date: "Yesterday, 11:00 AM", desc: "Bus Maintenance", ref: "Auto Garage Ltd", account: "School Bus Fund", type: "out", amount: "80,000", status: "Pending" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800">Connected Accounts</h2>
          <p className="text-sm font-medium text-slate-500">Manage your bank and mobile money accounts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all">
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((bank, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 bg-${bank.color}-50 text-${bank.color}-600 rounded-2xl shadow-inner`}>
                  <Landmark className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-800">{bank.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider">{bank.type}</span>
                     <p className="text-sm font-semibold text-slate-500">• {bank.num}</p>
                   </div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-primary-900 bg-white hover:bg-primary-50 rounded-xl transition-colors shadow-sm border border-slate-100">
                 <Settings2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
              <p className="text-4xl font-black text-slate-800 tracking-tight">KSh {bank.bal}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                     <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In (30D)</p>
                     <p className="text-sm font-bold text-slate-700">KSh {bank.in}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                     <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Out (30D)</p>
                     <p className="text-sm font-bold text-slate-700">KSh {bank.out}</p>
                  </div>
               </div>
            </div>

            {/* Quick Actions Overlay (Appears on Hover) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 rounded-b-3xl flex justify-around opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
               <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-900">
                 <ArrowRightLeft className="w-4 h-4" /> Transfer
               </button>
               <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-900">
                 <FileText className="w-4 h-4" /> Statement
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800">Recent Bank Transactions</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Across all connected accounts</p>
          </div>
          <button className="text-sm font-bold text-primary-900 hover:text-primary-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                         {tx.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{tx.desc}</p>
                        <p className="text-xs text-slate-500 font-medium">{tx.ref} • {tx.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{tx.account}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className={`text-sm font-black ${tx.type === 'in' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === 'in' ? '+' : '-'}KSh {tx.amount}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-xl transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
