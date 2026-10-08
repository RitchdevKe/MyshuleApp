import React from "react";
import { format } from "date-fns";

export default function ReceivablesTab({ data }: { data: any }) {
  if (!data) return <div>No Data</div>;

  const { current = 0, days31to60 = 0, days61to90 = 0, over90 = 0, total = 1, invoicesList = [] } = data;
  const safeTotal = total > 0 ? total : 1;

  const formatAmount = (num: number) => {
    if (num >= 1000000) return `KSh ${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `KSh ${(num / 1000).toFixed(0)}K`;
    return `KSh ${num.toLocaleString()}`;
  };

  const getPercent = (val: number) => Math.round((val / safeTotal) * 100) + "%";

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h3 className="text-lg font-black text-slate-800 mb-6">Receivables Aging</h3>
        <div className="space-y-6 max-w-3xl">
          <div className="group">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">Current (0-30 Days)</span>
              <span className="font-black text-slate-800 text-lg">{formatAmount(current)}</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full relative overflow-hidden transition-all duration-1000" 
                style={{ width: getPercent(current) }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-600 group-hover:text-amber-500 transition-colors">31–60 Days</span>
              <span className="font-black text-slate-800 text-lg">{formatAmount(days31to60)}</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full relative overflow-hidden transition-all duration-1000" 
                style={{ width: getPercent(days31to60) }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] delay-75"></div>
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-600 group-hover:text-orange-500 transition-colors">61–90 Days</span>
              <span className="font-black text-slate-800 text-lg">{formatAmount(days61to90)}</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full relative overflow-hidden transition-all duration-1000" 
                style={{ width: getPercent(days61to90) }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] delay-150"></div>
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-600 group-hover:text-rose-500 transition-colors">90+ Days (High Risk)</span>
              <span className="font-black text-slate-800 text-lg">{formatAmount(over90)}</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full relative overflow-hidden transition-all duration-1000" 
                style={{ width: getPercent(over90) }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] delay-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
        <h3 className="text-lg font-black text-slate-800 mb-6">Recent Unpaid Invoices</h3>
        {invoicesList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl font-bold">Invoice #</th>
                  <th className="px-4 py-3 font-bold">Student</th>
                  <th className="px-4 py-3 font-bold">Due Date</th>
                  <th className="px-4 py-3 font-bold text-right rounded-tr-xl">Balance Due</th>
                </tr>
              </thead>
              <tbody>
                {invoicesList.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {invoice.student?.firstName} {invoice.student?.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800 text-right">
                      KSh {invoice.balanceDue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 font-medium">
            No unpaid invoices found.
          </div>
        )}
      </div>
    </div>
  );
}
