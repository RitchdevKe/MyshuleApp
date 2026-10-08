"use client";

import React, { useState } from "react";
import { ArrowRightLeft, Search, Filter, ArrowUpRight, ArrowDownRight, ArrowRight, Download } from "lucide-react";
import { format } from "date-fns";

type Movement = {
  id: string;
  movementType: string; // IN, OUT, TRANSFER
  quantity: number;
  reference: string | null;
  notes: string | null;
  date: Date;
  item: { name: string };
  sourceStore: { name: string } | null;
  destinationStore: { name: string } | null;
};

export default function MovementsClient({ movements }: { movements: Movement[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredMovements = movements.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (txn.reference || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === "All" || txn.movementType === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
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
            <input 
              type="text" 
              placeholder="Search by ID, Item, or Ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
            />
         </div>
         <div className="flex gap-2">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
               <option value="All">All Types</option>
               <option value="IN">Stock In</option>
               <option value="OUT">Stock Out</option>
               <option value="TRANSFER">Transfer</option>
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
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm font-medium text-slate-500">
                  No movements found.
                </td>
              </tr>
            ) : (
              filteredMovements.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{txn.id.slice(0, 8).toUpperCase()}</span>
                    <div className="mt-1">
                       <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                          txn.movementType === 'IN' ? 'bg-emerald-50 text-emerald-600' :
                          txn.movementType === 'OUT' ? 'bg-rose-50 text-rose-600' :
                          txn.movementType === 'TRANSFER' ? 'bg-amber-50 text-amber-600' :
                          'bg-slate-50 text-slate-600'
                       }`}>
                          {txn.movementType === 'IN' && <ArrowDownRight className="w-3 h-3" />}
                          {txn.movementType === 'OUT' && <ArrowUpRight className="w-3 h-3" />}
                          {txn.movementType === 'TRANSFER' && <ArrowRightLeft className="w-3 h-3" />}
                          {txn.movementType}
                       </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{txn.item.name}</p>
                    <p className={`text-xs font-black mt-0.5 ${
                       txn.movementType === 'IN' ? 'text-emerald-600' :
                       txn.movementType === 'OUT' ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                       {txn.movementType === 'IN' ? '+' : txn.movementType === 'OUT' ? '-' : ''}{txn.quantity} units
                    </p>
                  </td>
                  <td className="py-4 px-6">
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600 truncate max-w-[120px]" title={txn.sourceStore?.name || "External"}>
                          {txn.sourceStore?.name || "External"}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]" title={txn.destinationStore?.name || "External"}>
                          {txn.destinationStore?.name || "External"}
                        </span>
                     </div>
                  </td>
                  <td className="py-4 px-6">
                     <span className="text-xs font-bold text-primary-600 hover:underline cursor-pointer">{txn.reference || "-"}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <p className="font-bold text-slate-700 text-sm">
                       {format(new Date(txn.date), "MMM dd, yyyy, HH:mm")}
                     </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
