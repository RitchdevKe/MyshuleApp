"use client";

import React from "react";
import { Plus, Search, Filter, MoreHorizontal, FileText, Send } from "lucide-react";

export default function AccountsReceivablePage() {
  const invoices = [
    { id: "INV-2023-080", customer: "Sarah Smith (Parent)", date: "Oct 10, 2023", dueDate: "Oct 24, 2023", amount: 15000, status: "Open" },
    { id: "INV-2023-081", customer: "John Doe (Parent)", date: "Oct 15, 2023", dueDate: "Oct 29, 2023", amount: 45000, status: "Paid" },
    { id: "INV-2023-075", customer: "Ministry of Education (Grant)", date: "Sep 01, 2023", dueDate: "Sep 30, 2023", amount: 1500000, status: "Overdue" },
    { id: "INV-2023-082", customer: "Jane Doe (Parent)", date: "Oct 18, 2023", dueDate: "Nov 01, 2023", amount: 22000, status: "Draft" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Outstanding</p>
          <p className="text-2xl font-black text-slate-800">KSh 1,515,000</p>
        </div>
        <div className="bg-rose-50/80 backdrop-blur-md p-5 rounded-3xl border border-rose-100 shadow-sm">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Overdue Invoices</p>
          <p className="text-2xl font-black text-rose-700">KSh 1,500,000</p>
        </div>
        <div className="bg-emerald-50/80 backdrop-blur-md p-5 rounded-3xl border border-emerald-100 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Collected (This Month)</p>
          <p className="text-2xl font-black text-emerald-700">KSh 45,000</p>
        </div>
        <button className="bg-primary-900 hover:bg-primary-800 transition-colors p-5 rounded-3xl shadow-sm shadow-primary-900/20 flex flex-col items-center justify-center gap-2 text-white group h-full">
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-sm">New Invoice</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by customer or invoice..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              Filter
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
              <Send className="w-4 h-4 text-slate-400" />
              Send Reminders
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary-900 text-[11px] uppercase tracking-wider text-white font-black">
              <tr>
                <th className="p-4 pl-6">Invoice No.</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Dates</th>
                <th className="p-4 text-right">Amount (KSh)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
              {invoices.map((inv, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-900 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800">{inv.id}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{inv.customer}</td>
                  <td className="p-4">
                    <div className="text-slate-800">{inv.date}</div>
                    <div className="text-xs text-slate-400 font-medium">Due: {inv.dueDate}</div>
                  </td>
                  <td className="p-4 text-right font-black text-slate-800">
                    {inv.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${
                      inv.status === 'Paid' ? 'bg-green-50 text-green-700' : 
                      inv.status === 'Open' ? 'bg-amber-50 text-amber-700' :
                      inv.status === 'Overdue' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {inv.status}
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