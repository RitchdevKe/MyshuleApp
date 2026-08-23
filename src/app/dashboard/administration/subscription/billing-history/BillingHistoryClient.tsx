"use client";

import React from "react";
import { Receipt, Download, FileText } from "lucide-react";
import { format } from "date-fns";

export default function BillingHistoryClient({ initialInvoices }: { initialInvoices: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Billing History</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">View and download your past invoices and receipts.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        {initialInvoices.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Billing History</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              You haven't been billed yet. Your future invoices will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-slate-700">
                        {format(new Date(invoice.issueDate), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{invoice.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-slate-700">
                        KES {invoice.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider inline-block
                        ${invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                          invoice.status === 'UNPAID' ? 'bg-amber-100 text-amber-700' : 
                          'bg-slate-100 text-slate-600'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
