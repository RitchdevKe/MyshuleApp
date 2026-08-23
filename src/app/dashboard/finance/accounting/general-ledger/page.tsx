"use client";

import React, { useState } from "react";
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, ChevronDown } from "lucide-react";

export default function GeneralLedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState("1001 - Main Bank Account");

  const transactions = [
    { id: "TRX-001", date: "Oct 15, 2023", ref: "INV-2023-081", desc: "Term 3 Tuition Fees - John Doe", type: "debit", amount: 45000, balance: 4865000 },
    { id: "TRX-002", date: "Oct 14, 2023", ref: "BILL-542", desc: "Stationery Supplies (Kenya Paper Mills)", type: "credit", amount: 12500, balance: 4820000 },
    { id: "TRX-003", date: "Oct 12, 2023", ref: "JV-102", desc: "Depreciation of Lab Equipment", type: "credit", amount: 25000, balance: 4832500 },
    { id: "TRX-004", date: "Oct 10, 2023", ref: "INV-2023-080", desc: "Transport Fees - Sarah Smith", type: "debit", amount: 15000, balance: 4857500 },
    { id: "TRX-005", date: "Oct 05, 2023", ref: "PAY-10", desc: "Staff Payroll - September", type: "credit", amount: 850000, balance: 4842500 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Filters and Selection */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-1 min-w-[250px]">
            <select 
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900 cursor-pointer"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <optgroup label="Assets">
                <option>1001 - Main Bank Account</option>
                <option>1100 - Accounts Receivable</option>
              </optgroup>
              <optgroup label="Liabilities">
                <option>2001 - Accounts Payable</option>
              </optgroup>
              <optgroup label="Revenue">
                <option>4001 - Tuition Fees</option>
              </optgroup>
            </select>
            <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
            />
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Date Range
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4 text-slate-400" />
            Export
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Account Transactions</h3>
            <p className="text-sm font-medium text-slate-500">Showing entries for {selectedAccount}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">Closing Balance</p>
            <p className="font-black text-xl text-primary-900">KSh 4,820,000</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-primary-900 text-xs uppercase font-bold text-white">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Ref / Description</th>
                <th className="px-6 py-4 text-right">Debit (KSh)</th>
                <th className="px-6 py-4 text-right">Credit (KSh)</th>
                <th className="px-6 py-4 text-right">Balance (KSh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{trx.date}</div>
                    <div className="text-xs text-slate-400 font-medium">{trx.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{trx.ref}</div>
                    <div className="text-slate-500">{trx.desc}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    {trx.type === 'debit' ? (
                      <span className="flex items-center justify-end gap-1">
                        <ArrowDownLeft className="w-4 h-4" />
                        {trx.amount.toLocaleString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-rose-600">
                    {trx.type === 'credit' ? (
                      <span className="flex items-center justify-end gap-1">
                        <ArrowUpRight className="w-4 h-4" />
                        {trx.amount.toLocaleString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-800">
                    {trx.balance.toLocaleString()}
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