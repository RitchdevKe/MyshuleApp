"use client";

import React from "react";
import { Calculator, Check } from "lucide-react";

export default function BillingRunsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 rounded-3xl border border-primary-200/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-lg font-black text-primary-900">Run Batch Billing</h2>
            <p className="text-sm text-primary-700 font-medium mt-1">Generate invoices for an entire class, grade, or school at once.</p>
         </div>
         <button className="flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-600/20 whitespace-nowrap">
            <Calculator className="w-5 h-5" />
            Start Billing Run
          </button>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-black">
              <th className="p-4 pl-6">Run Reference</th>
              <th className="p-4">Date Generated</th>
              <th className="p-4">Target Group</th>
              <th className="p-4 text-right">Invoices</th>
              <th className="p-4 text-right">Total Amount</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
            {[
              { ref: "BR-2026-T2-01", date: "May 1, 2026", target: "All Students (Term 2)", count: "450", amount: "22,500,000", status: "Posted" },
              { ref: "BR-2026-T2-02", date: "May 15, 2026", target: "Transport Users", count: "215", amount: "2,580,000", status: "Posted" },
              { ref: "BR-2026-T2-03", date: "Jun 1, 2026", target: "Grade 8 Remedial", count: "45", amount: "225,000", status: "Draft" },
            ].map((run, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="p-4 pl-6 font-bold text-primary-900">{run.ref}</td>
                <td className="p-4 text-slate-600 font-semibold">{run.date}</td>
                <td className="p-4 text-slate-800 font-bold">{run.target}</td>
                <td className="p-4 text-right text-slate-600 font-bold">{run.count}</td>
                <td className="p-4 text-right font-black text-slate-800">KSh {run.amount}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                    run.status === 'Posted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {run.status === 'Posted' && <Check className="w-3 h-3" />}
                    {run.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
