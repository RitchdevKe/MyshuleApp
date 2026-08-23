"use client";

import React, { useState } from "react";
import { Search, Download, FileText, Filter } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  totalAmount: number;
  status: string;
}

interface InvoicesClientProps {
  invoices: Invoice[];
}

export default function InvoicesClient({ invoices }: InvoicesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
            />
         </div>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Download className="w-4 h-4" />
               Export All
            </button>
         </div>
      </div>

      <div className="p-6">
         {filteredInvoices.length === 0 ? (
           <div className="text-center py-12 text-slate-500">
             <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
             <p className="font-bold">No invoices found.</p>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-200/60">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredInvoices.map((inv) => (
                   <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shadow-inner shrink-0">
                              <FileText className="w-4 h-4" />
                           </div>
                           <span className="font-bold text-sm text-slate-800">{inv.invoiceNumber}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <span className="text-sm font-bold text-slate-700">{new Date(inv.issueDate).toLocaleDateString()}</span>
                     </td>
                     <td className="py-4 px-6">
                        <div className="text-sm font-black text-slate-800">${inv.totalAmount.toFixed(2)}</div>
                     </td>
                     <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                          inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                           {inv.status}
                        </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors">
                           <Download className="w-3.5 h-3.5" /> PDF
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
