"use client";

import React, { useState } from "react";
import { AlertCircle, FileText, Send, Mail, Search } from "lucide-react";

export default function ReceivablesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const debtors = [
    { id: "STU-2023-014", name: "Kamau, James", grade: "Grade 8", parent: "Peter Kamau", phone: "+254 712 345 678", amount: "KSh 45,000", days: 120, status: "Critical" },
    { id: "STU-2024-088", name: "Ochieng, Sarah", grade: "Grade 5", parent: "Mary Ochieng", phone: "+254 722 987 654", amount: "KSh 32,500", days: 95, status: "Critical" },
    { id: "STU-2025-102", name: "Wanjiku, Faith", grade: "Grade 3", parent: "John Njoroge", phone: "+254 733 456 123", amount: "KSh 18,000", days: 45, status: "Warning" },
    { id: "STU-2022-045", name: "Mutua, Brian", grade: "Grade 10", parent: "Alice Mutua", phone: "+254 799 112 233", amount: "KSh 12,500", days: 30, status: "Notice" },
    { id: "STU-2026-005", name: "Hassan, Amina", grade: "Grade 1", parent: "Ahmed Hassan", phone: "+254 700 445 566", amount: "KSh 8,000", days: 15, status: "Notice" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Accounts Receivable</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track outstanding fee balances and manage debtor follow-ups.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm">
          <Send className="w-4 h-4" /> Send Bulk Reminders
        </button>
      </div>

      {/* Aging Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-1">0-30 Days</div>
            <div className="text-xl font-black text-emerald-800">KSh 2.1M</div>
         </div>
         <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1">31-60 Days</div>
            <div className="text-xl font-black text-amber-800">KSh 1.4M</div>
         </div>
         <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] font-black uppercase tracking-wider text-orange-600 mb-1">61-90 Days</div>
            <div className="text-xl font-black text-orange-800">KSh 0.8M</div>
         </div>
         <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 mb-1">90+ Days</div>
            <div className="text-xl font-black text-rose-800">KSh 1.7M</div>
         </div>
      </div>

      {/* Debtor List */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Top Debtors</h3>
            <div className="relative w-full sm:w-72">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                  type="text" 
                  placeholder="Search student or parent..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
               <thead>
                  <tr className="bg-white border-b border-slate-100">
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Parent Details</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Due</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Aging</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {debtors.map((debtor, idx) => (
                     <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                           <div className="font-bold text-sm text-slate-800">{debtor.name}</div>
                           <div className="text-xs text-slate-500 mt-0.5">{debtor.id} • {debtor.grade}</div>
                        </td>
                        <td className="py-4 px-6">
                           <div className="font-bold text-sm text-slate-700">{debtor.parent}</div>
                           <div className="text-xs text-slate-500 mt-0.5">{debtor.phone}</div>
                        </td>
                        <td className="py-4 px-6 font-black text-sm text-rose-600">{debtor.amount}</td>
                        <td className="py-4 px-6 text-sm font-medium text-slate-600">{debtor.days} days</td>
                        <td className="py-4 px-6">
                           <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                              debtor.status === 'Critical' ? 'bg-rose-100 text-rose-700' :
                              debtor.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                              'bg-indigo-100 text-indigo-700'
                           }`}>
                              {debtor.status === 'Critical' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {debtor.status}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                           <div className="flex justify-end gap-2">
                              <button className="p-1.5 text-slate-400 hover:text-primary-600 bg-white border border-slate-200 hover:border-primary-300 rounded shadow-sm transition-colors" title="Send Email Reminder">
                                 <Mail className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-primary-600 bg-white border border-slate-200 hover:border-primary-300 rounded shadow-sm transition-colors" title="Generate Invoice/Statement">
                                 <FileText className="w-4 h-4" />
                              </button>
                           </div>
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
