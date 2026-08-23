"use client";

import React from "react";
import { ArrowRightLeft, Search, Filter, ArrowUpRight, ArrowDownRight, ArrowRight, Download } from "lucide-react";

export default function MovementsPage() {
  const movements = [
    { id: "TXN-8842", type: "Stock In", item: "MacBook Pro M3", qty: 5, ref: "GRN-2024-8842", from: "Supplier (TechCorp)", to: "Main HQ Storage", date: "Aug 11, 2024, 09:30 AM", user: "Jane Doe" },
    { id: "TXN-8841", type: "Transfer", item: "Ergonomic Chairs", qty: 2, ref: "TRF-0012", from: "Main HQ Storage", to: "North Wing IT Room", date: "Aug 10, 2024, 14:15 PM", user: "Michael Ochieng" },
    { id: "TXN-8840", type: "Stock Out", item: "A4 Printer Paper", qty: 10, ref: "ISS-2024-405", from: "Stationery Cupboard", to: "Department (Sales)", date: "Aug 09, 2024, 11:00 AM", user: "Sarah Palmer" },
    { id: "TXN-8839", type: "Stock In", item: "Dell Monitor", qty: 15, ref: "GRN-2024-8841", from: "Supplier (EduTech)", to: "North Wing IT Room", date: "Aug 09, 2024, 08:45 AM", user: "David Kim" },
    { id: "TXN-8838", type: "Adjustment", item: "Wireless Mouse", qty: -2, ref: "ADJ-004", from: "Inventory Count", to: "Written Off (Damaged)", date: "Aug 08, 2024, 16:30 PM", user: "Robert Kiprono" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl hidden md:block">
                 <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Stock Movements Ledger</h2>
                 <p className="text-sm font-medium text-slate-500">Immutable log of all inventory transactions and transfers.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export Ledger
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by TXN, Item, or Ref..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Types</option>
                 <option>Stock In</option>
                 <option>Stock Out</option>
                 <option>Transfer</option>
                 <option>Adjustment</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Date Range
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Item & Qty</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Movement Path</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Date & User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{txn.id}</span>
                    <div className="mt-1">
                       <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                          txn.type === 'Stock In' ? 'bg-emerald-50 text-emerald-600' :
                          txn.type === 'Stock Out' ? 'bg-rose-50 text-rose-600' :
                          txn.type === 'Transfer' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                       }`}>
                          {txn.type === 'Stock In' && <ArrowDownRight className="w-3 h-3" />}
                          {txn.type === 'Stock Out' && <ArrowUpRight className="w-3 h-3" />}
                          {txn.type === 'Transfer' && <ArrowRightLeft className="w-3 h-3" />}
                          {txn.type}
                       </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{txn.item}</p>
                    <p className={`text-xs font-black mt-0.5 ${
                       txn.qty > 0 && txn.type === 'Stock In' ? 'text-emerald-600' :
                       txn.qty < 0 || txn.type === 'Stock Out' ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                       {txn.qty > 0 && txn.type !== 'Stock Out' ? '+' : ''}{txn.type === 'Stock Out' ? -txn.qty : txn.qty} units
                    </p>
                  </td>
                  <td className="py-4 px-6">
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600 truncate max-w-[120px]" title={txn.from}>{txn.from}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]" title={txn.to}>{txn.to}</span>
                     </div>
                  </td>
                  <td className="py-4 px-6">
                     <span className="text-xs font-bold text-primary-600 hover:underline cursor-pointer">{txn.ref}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <p className="font-bold text-slate-700 text-sm">{txn.date}</p>
                     <p className="text-[10px] font-medium text-slate-500 mt-0.5">by {txn.user}</p>
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
