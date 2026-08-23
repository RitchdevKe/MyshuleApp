"use client";

import React from "react";
import { Search, Filter, ArrowDownLeft, Smartphone, SplitSquareHorizontal, CreditCard, Banknote } from "lucide-react";

export default function PaymentsReceiptsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Mini Stats for Receipts */}
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
               <ArrowDownLeft className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Collections</p>
               <p className="text-2xl font-black text-slate-800">KSh 145,000</p>
            </div>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center shrink-0">
               <Smartphone className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">M-Pesa Volume</p>
               <p className="text-2xl font-black text-slate-800">KSh 95,000</p>
            </div>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
               <SplitSquareHorizontal className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unallocated Funds</p>
               <p className="text-2xl font-black text-slate-800">KSh 50,000</p>
            </div>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100/80 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search receipt no, name, reference..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              Channel: All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-black">
                <th className="p-4 pl-6">Receipt No.</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Student</th>
                <th className="p-4">Channel & Ref</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
              {[
                { id: "RCP-24-001", date: "Today, 10:45 AM", name: "John Doe", channel: "M-Pesa", ref: "RKT123456", amount: "20,000", status: "Allocated", icon: Smartphone },
                { id: "RCP-24-002", date: "Today, 09:15 AM", name: "Jane Smith", channel: "Bank Transfer", ref: "KCB-9876", amount: "45,000", status: "Unallocated", icon: CreditCard },
                { id: "RCP-24-003", date: "Yesterday, 14:30 PM", name: "Michael Johnson", channel: "Cash", ref: "Walk-in", amount: "12,000", status: "Allocated", icon: Banknote },
                { id: "RCP-24-004", date: "Yesterday, 11:00 AM", name: "Emily Davis", channel: "M-Pesa", ref: "RKT987654", amount: "5,000", status: "Pending", icon: Smartphone },
              ].map((row, i) => {
                const ChanIcon = row.icon;
                return (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="p-4 pl-6 font-bold text-primary-900">{row.id}</td>
                  <td className="p-4 text-slate-500 font-semibold">{row.date}</td>
                  <td className="p-4 font-bold text-slate-800">{row.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                         <ChanIcon className="w-4 h-4" />
                       </div>
                       <div className="flex flex-col">
                         <span className="font-bold text-slate-700 leading-tight">{row.channel}</span>
                         <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{row.ref}</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-black text-slate-800">KSh {row.amount}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                      row.status === 'Allocated' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      row.status === 'Unallocated' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
