"use client";

import React, { useState } from "react";
import { Calculator, Download, Filter, FileText, ChevronDown } from "lucide-react";

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState("ledger");

  const ledgerEntries = [
    { date: "Oct 12, 2026", ref: "JE-2026-1042", account: "1010 - Main Bank Account", description: "Term 2 Fee Deposit (Batch A)", debit: "4,250,000", credit: "-", type: "Asset" },
    { date: "Oct 12, 2026", ref: "JE-2026-1042", account: "4010 - Tuition Revenue", description: "Term 2 Fee Deposit (Batch A)", debit: "-", credit: "4,250,000", type: "Revenue" },
    { date: "Oct 14, 2026", ref: "JE-2026-1043", account: "5020 - Teacher Salaries", description: "October Payroll", debit: "2,100,000", credit: "-", type: "Expense" },
    { date: "Oct 14, 2026", ref: "JE-2026-1043", account: "1010 - Main Bank Account", description: "October Payroll", debit: "-", credit: "2,100,000", type: "Asset" },
    { date: "Oct 15, 2026", ref: "JE-2026-1044", account: "1050 - Inventory (Textbooks)", description: "Purchase of Math Textbooks", debit: "350,000", credit: "-", type: "Asset" },
    { date: "Oct 15, 2026", ref: "JE-2026-1044", account: "2010 - Accounts Payable", description: "Purchase of Math Textbooks", debit: "-", credit: "350,000", type: "Liability" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">General Ledger</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Double-entry accounting records and chart of accounts.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex-1 sm:flex-none">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Export Ledger
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Internal Tabs */}
        <div className="flex border-b border-slate-200/60 bg-slate-50/50 px-4 pt-4 gap-6">
          <button 
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ledger' ? 'border-primary-900 text-primary-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('ledger')}
          >
            Journal Entries
          </button>
          <button 
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'chart' ? 'border-primary-900 text-primary-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('chart')}
          >
            Chart of Accounts
          </button>
        </div>

        {/* Ledger Content */}
        {activeTab === 'ledger' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Ref</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Account</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Debit (KSh)</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Credit (KSh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgerEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-slate-800">{entry.date}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{entry.ref}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-primary-700">{entry.account}</div>
                      <span className={`inline-flex items-center px-2 py-0.5 mt-1 text-[9px] font-black uppercase tracking-wider rounded-md ${
                        entry.type === 'Asset' ? 'bg-emerald-100 text-emerald-700' :
                        entry.type === 'Liability' ? 'bg-amber-100 text-amber-700' :
                        entry.type === 'Revenue' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600">{entry.description}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-800 text-right">{entry.debit}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-800 text-right">{entry.credit}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/50 font-black text-sm text-slate-800 border-t-2 border-slate-200">
                <tr>
                  <td colSpan={3} className="py-4 px-6 text-right">Total for Period</td>
                  <td className="py-4 px-6 text-right">6,700,000</td>
                  <td className="py-4 px-6 text-right">6,700,000</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Chart of Accounts Stub */}
        {activeTab === 'chart' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">Chart of Accounts Mapping</h3>
            <p className="text-sm font-medium text-slate-500 max-w-sm mt-2 mb-6">
              Manage your ledger codes and account classifications (Assets, Liabilities, Equity, Revenue, Expenses).
            </p>
            <button className="px-4 py-2 bg-primary-50 text-primary-700 font-bold text-sm rounded-xl hover:bg-primary-100 transition-colors">
              Manage Accounts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
