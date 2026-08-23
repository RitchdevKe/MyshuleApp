"use client";

import React from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

export default function AccountsPayablePage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Outstanding</p>
            <p className="text-3xl font-black text-slate-800">KSh 850,000</p>
         </div>
         <div className="bg-rose-50/80 backdrop-blur-md p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Overdue Bills</p>
            <p className="text-3xl font-black text-rose-700">KSh 120,000</p>
         </div>
         <button className="bg-primary-900 hover:bg-primary-800 transition-colors p-5 rounded-3xl shadow-sm shadow-primary-900/20 flex flex-col items-center justify-center gap-3 text-white group h-full">
            <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Record New Bill</span>
         </button>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
         {/* Toolbar */}
         <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-80">
               <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search vendors or bill refs..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
               />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
               <Filter className="w-4 h-4 text-slate-400" />
               Filter Status
            </button>
         </div>
         
         <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-primary-900 text-[11px] uppercase tracking-wider text-white font-black">
                     <th className="p-4 pl-6">Vendor</th>
                     <th className="p-4">Bill Ref</th>
                     <th className="p-4">Due Date</th>
                     <th className="p-4 text-right">Amount</th>
                     <th className="p-4 text-center">Status</th>
                     <th className="p-4 text-right"></th>
                  </tr>
               </thead>
               <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
                  {[
                     { vendor: "Textbook Centre Ltd", ref: "INV-8890", date: "Oct 20, 2023", amount: "450,000", status: "Open" },
                     { vendor: "Kenya Power", ref: "E-3321", date: "Oct 10, 2023", amount: "120,000", status: "Overdue" },
                     { vendor: "Safaricom PLC", ref: "INT-445", date: "Oct 25, 2023", amount: "45,000", status: "Open" },
                     { vendor: "Nairobi Water Co.", ref: "W-112", date: "Sep 28, 2023", amount: "35,000", status: "Paid" },
                  ].map((bill, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                        <td className="p-4 pl-6 font-bold text-slate-800">{bill.vendor}</td>
                        <td className="p-4 text-slate-500">{bill.ref}</td>
                        <td className={`p-4 font-semibold ${bill.status === 'Overdue' ? 'text-rose-600' : 'text-slate-600'}`}>{bill.date}</td>
                        <td className="p-4 text-right font-black text-slate-800">KSh {bill.amount}</td>
                        <td className="p-4 text-center">
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${
                              bill.status === 'Overdue' ? 'bg-rose-50 text-rose-700' : 
                              bill.status === 'Open' ? 'bg-amber-50 text-amber-700' :
                              'bg-green-50 text-green-700'
                           }`}>
                              {bill.status}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-5 h-5" />
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