"use client";

import React from "react";
import { FileText, ChevronRight, Search, Filter, Plus } from "lucide-react";

export default function JournalsPage() {
  const journals = [
    { je: "JE-2023-089", date: "Oct 20, 2023", desc: "Depreciation of Lab Equipment", amount: 25000, status: "Posted", prepBy: "Jane Smith" },
    { je: "JE-2023-090", date: "Oct 21, 2023", desc: "Accrued Payroll Expenses", amount: 850000, status: "Draft", prepBy: "John Doe" },
    { je: "JE-2023-091", date: "Oct 22, 2023", desc: "Correction: Transport Overcharge", amount: 15000, status: "Posted", prepBy: "Alice Johnson" },
    { je: "JE-2023-092", date: "Oct 23, 2023", desc: "Prepaid Insurance Allocation", amount: 45000, status: "Pending Approval", prepBy: "Jane Smith" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search journals by ID or description..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Status: All
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-lg">Journal Entries</h3>
          <span className="text-sm font-medium text-slate-500">Showing {journals.length} entries</span>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-primary-900 text-xs uppercase font-bold text-white">
              <tr>
                <th className="px-6 py-4">Entry ID</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Prepared By</th>
                <th className="px-6 py-4 text-right">Total Amount (KSh)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journals.map((journal) => (
                <tr key={journal.je} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{journal.je}</div>
                    <div className="text-xs text-slate-400 font-medium">{journal.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{journal.desc}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">
                    {journal.prepBy}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-800">
                    {journal.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold
                      ${journal.status === 'Posted' ? 'bg-green-50 text-green-700' : 
                        journal.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                        'bg-orange-50 text-orange-700'}
                    `}>
                      {journal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-900 ml-auto transition-colors" />
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
