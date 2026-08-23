"use client";

import React from "react";
import { Coins, Plus, Wallet, FileText, CheckCircle2, XCircle, Search, Filter } from "lucide-react";

export default function PettyCashPage() {
  const transactions = [
    { id: "PC-089", date: "Today, 09:30 AM", desc: "Milk and Sugar for staff room", amount: "450", requestedBy: "Mary (Admin)", category: "Groceries", status: "Approved" },
    { id: "PC-088", date: "Yesterday, 14:15 PM", desc: "Emergency bulb replacement", amount: "1,200", requestedBy: "John (Maintenance)", category: "Repairs", status: "Approved" },
    { id: "PC-087", date: "15 Oct, 11:00 AM", desc: "Post office box renewal", amount: "1,900", requestedBy: "Sarah (Reception)", category: "Office Supplies", status: "Approved" },
    { id: "PC-086", date: "14 Oct, 08:45 AM", desc: "Guest refreshments", amount: "3,500", requestedBy: "Principal's Office", category: "Hospitality", status: "Pending" },
    { id: "PC-085", date: "12 Oct, 16:20 PM", desc: "Staff end of term party advance", amount: "15,000", requestedBy: "Social Committee", category: "Events", status: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Petty Cash Management</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage small expenditures, float balances, and top-ups.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-all">
             <Wallet className="w-4 h-4 text-primary-900" /> Top Up Float
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all">
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
               <p className="text-4xl font-black text-white tracking-tight">KSh 12,450</p>
               
               <div className="mt-6 pt-5 border-t border-primary-700/50 flex justify-between items-center">
                  <div>
                     <p className="text-primary-300 text-[10px] font-bold uppercase tracking-wider">Total Float Limit</p>
                     <p className="text-white text-sm font-bold">KSh 50,000</p>
                  </div>
                  <div className="text-right">
                     <p className="text-primary-300 text-[10px] font-bold uppercase tracking-wider">Last Top-up</p>
                     <p className="text-white text-sm font-bold">01 Oct 2026</p>
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
               <p className="text-3xl font-black text-slate-800 tracking-tight">KSh 37,550</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
               <div className="bg-rose-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 text-right">75% of float used</p>
         </div>

         {/* Pending Approvals Card */}
         <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-amber-200 transition-colors cursor-pointer group">
            <div>
               <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
               </div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Requests</p>
               <p className="text-3xl font-black text-slate-800 tracking-tight">3 <span className="text-sm font-medium text-slate-500">requests</span></p>
            </div>
            <p className="text-sm font-bold text-amber-600 mt-4">Review 3 items &rarr;</p>
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
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Requested By</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                     <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-800">{tx.date}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{tx.id}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-700">{tx.desc}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                              {tx.category}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-medium text-slate-600">{tx.requestedBy}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <p className="text-sm font-black text-slate-800">KSh {tx.amount}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              tx.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                              tx.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                              'bg-amber-100 text-amber-700'
                           }`}>
                              {tx.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                              {tx.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                              {tx.status === 'Pending' && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                              {tx.status}
                           </span>
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
