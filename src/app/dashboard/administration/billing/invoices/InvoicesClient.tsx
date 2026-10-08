"use client";

import React, { useState, useTransition } from "react";
import { Search, Download, FileText, Filter, Plus, CreditCard, X } from "lucide-react";
import { createInvoice, recordPayment } from "@/app/actions/billing";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  totalAmount: number;
  status: string;
}

interface InvoicesClientProps {
  invoices: Invoice[];
  students?: any[];
  terms?: any[];
}

export default function InvoicesClient({ invoices, students = [], terms = [] }: InvoicesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleCreateInvoice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      studentId: formData.get("studentId"),
      academicTermId: formData.get("academicTermId"),
      dueDate: formData.get("dueDate"),
      amount: formData.get("amount"),
    };
    
    startTransition(async () => {
      await createInvoice(data);
      setIsInvoiceModalOpen(false);
      router.refresh();
    });
  }

  async function handleRecordPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedInvoice) return;
    
    const formData = new FormData(e.currentTarget);
    const data = {
      invoiceId: selectedInvoice.id,
      amount: formData.get("amount"),
      paymentDate: formData.get("paymentDate"),
      method: formData.get("method"),
    };
    
    startTransition(async () => {
      await recordPayment(data);
      setIsPaymentModalOpen(false);
      setSelectedInvoice(null);
      router.refresh();
    });
  }

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
            <button 
              onClick={() => setIsInvoiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-secondary-500/20">
               <Plus className="w-4 h-4" />
               Create Invoice
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Download className="w-4 h-4" />
               Export
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
                        <div className="text-sm font-black text-slate-800">${inv.totalAmount?.toFixed(2)}</div>
                     </td>
                     <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                          inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                           {inv.status}
                        </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.status !== 'PAID' && (
                            <button 
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsPaymentModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors">
                              <CreditCard className="w-3.5 h-3.5" /> Pay
                            </button>
                          )}
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors">
                             <Download className="w-3.5 h-3.5" /> PDF
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
      </div>

      {/* Create Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Create Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student</label>
                <select name="studentId" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Term</label>
                <select name="academicTermId" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                  <option value="">Select Term</option>
                  {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                <input type="date" name="dueDate" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount</label>
                <input type="number" step="0.01" name="amount" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
                  {isPending ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Record Payment</h3>
              <button onClick={() => { setIsPaymentModalOpen(false); setSelectedInvoice(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-4">Recording payment for invoice <span className="font-bold text-slate-800">{selectedInvoice.invoiceNumber}</span></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date</label>
                <input type="date" name="paymentDate" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Method</label>
                <select name="method" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount</label>
                <input type="number" step="0.01" name="amount" defaultValue={selectedInvoice.totalAmount} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => { setIsPaymentModalOpen(false); setSelectedInvoice(null); }} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
                  {isPending ? 'Saving...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
