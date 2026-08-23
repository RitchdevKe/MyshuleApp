"use client";

import React, { useState, useTransition } from "react";
import { Search, Filter, Plus, MoreHorizontal, FileText, ChevronLeft, ChevronRight, DollarSign, Wallet, ArrowUpRight, CheckCircle2, Sparkles, GraduationCap, X } from "lucide-react";
import { recordPayment } from "@/app/actions/finance";

type Invoice = {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: string;
  dueDate: string;
};

type ParentFinance = {
  id: string;
  parentName: string;
  linkedStudents: { name: string; isSponsor: boolean }[];
  responsibility: string;
  balance: number;
  lastStatement: string;
  status: "Cleared" | "Pending" | "Overdue";
  invoices: Invoice[];
};

type Props = {
  data: ParentFinance[];
  kpis: {
    totalOutstanding: number;
    clearedAccounts: number;
    pendingAccounts: number;
    statementsSent: number;
  };
};

export default function FinanceClient({ data, kpis }: Props) {
  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState<ParentFinance | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isPending, startTransition] = useTransition();

  const filtered = data.filter(m => 
    m.parentName.toLowerCase().includes(search.toLowerCase()) || 
    m.id.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    
    startTransition(async () => {
      try {
        await recordPayment({
          invoiceId: selectedInvoice.id,
          amount: parseFloat(paymentAmount),
          paymentMethod: paymentMethod as any,
        });
        
        // Optimistically update local state for better UX
        if (selectedParent) {
           const updatedInvoices = selectedParent.invoices.map(inv => {
             if (inv.id === selectedInvoice.id) {
                const amountPaid = inv.amountPaid + parseFloat(paymentAmount);
                const balanceDue = inv.totalAmount - amountPaid;
                return { ...inv, amountPaid, balanceDue, status: balanceDue <= 0 ? 'PAID' : 'PARTIALLY_PAID' };
             }
             return inv;
           });
           const newBalance = updatedInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
           setSelectedParent({
             ...selectedParent,
             balance: newBalance,
             status: newBalance === 0 ? "Cleared" : "Pending",
             invoices: updatedInvoices
           });
        }
        
        setPaymentModalOpen(false);
        setPaymentAmount("");
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Outstanding", value: formatCurrency(kpis.totalOutstanding), icon: DollarSign,    color: "from-rose-500 to-rose-700" },
          { label: "Cleared Accounts",  value: kpis.clearedAccounts.toString(),      icon: CheckCircle2,  color: "from-emerald-500 to-teal-600" },
          { label: "Pending Accounts",  value: kpis.pendingAccounts.toString(),       icon: Wallet,        color: "from-amber-500 to-orange-500" },
          { label: "Statements Sent",   value: kpis.statementsSent.toString(),      icon: FileText,      color: "from-primary-600 to-primary-800" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-xl font-black leading-tight">{c.value}</p>
                <p className="text-xs font-bold text-white/80">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[500px]">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search parents or accounts..."
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-64 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
              <ArrowUpRight className="w-4 h-4" /> Send Reminders
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4" /> Generate Statement
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Account</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Linked Students</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Fee Responsibility</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Current Balance</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Last Statement</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => {
                const isCleared = row.status === 'Cleared';
                const isOverdue = row.status === 'Overdue';

                return (
                  <tr key={row.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{row.parentName}</div>
                      <div className="text-[10px] font-black text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded mt-0.5 w-fit">{row.id.slice(0,8)}...</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        {row.linkedStudents.map((s, j) => (
                          <span key={j} className="flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg w-fit">
                            <GraduationCap className="w-2.5 h-2.5" /> {s.name} {s.isSponsor ? "(Sponsor)" : ""}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border bg-primary-50 border-primary-100 text-primary-700">
                        {row.responsibility}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`font-black ${isOverdue ? 'text-rose-600' : isCleared ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {formatCurrency(row.balance)}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isCleared ? 'bg-emerald-50 text-emerald-700' : 
                          isOverdue ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-600">
                      {row.lastStatement}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedParent(row)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Sparkles className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-bold text-lg text-slate-500">No accounts found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60 mt-auto">
          <span className="font-bold">Showing <span className="text-primary-900">{filtered.length}</span> accounts</span>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg font-bold disabled:opacity-40" disabled>
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-900 text-white text-xs font-black">1</button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg font-bold">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Parent Details */}
      {selectedParent && !paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-slate-800">{selectedParent.parentName} - Financial Details</h2>
                <p className="text-sm font-bold text-slate-500">ID: {selectedParent.id}</p>
              </div>
              <button onClick={() => setSelectedParent(null)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 mb-1">Total Outstanding Balance</p>
                  <p className={`text-2xl font-black ${selectedParent.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatCurrency(selectedParent.balance)}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 mb-1">Account Status</p>
                  <p className="text-xl font-black text-slate-800">{selectedParent.status}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-600" /> Invoices
                </h3>
                {selectedParent.invoices.length > 0 ? (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-bold text-slate-600">Invoice #</th>
                          <th className="px-4 py-3 font-bold text-slate-600">Due Date</th>
                          <th className="px-4 py-3 font-bold text-slate-600">Total</th>
                          <th className="px-4 py-3 font-bold text-slate-600">Paid</th>
                          <th className="px-4 py-3 font-bold text-slate-600">Balance</th>
                          <th className="px-4 py-3 font-bold text-slate-600">Status</th>
                          <th className="px-4 py-3 font-bold text-slate-600 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedParent.invoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-bold text-slate-800">{inv.invoiceNumber}</td>
                            <td className="px-4 py-3 text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{formatCurrency(inv.totalAmount)}</td>
                            <td className="px-4 py-3 text-emerald-600 font-bold">{formatCurrency(inv.amountPaid)}</td>
                            <td className="px-4 py-3 text-rose-600 font-bold">{formatCurrency(inv.balanceDue)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-[10px] font-black uppercase rounded ${
                                inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                inv.status === 'UNPAID' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                               <button 
                                 disabled={inv.balanceDue <= 0}
                                 onClick={() => {
                                   setSelectedInvoice(inv);
                                   setPaymentAmount(inv.balanceDue.toString());
                                   setPaymentModalOpen(true);
                                 }} 
                                 className="px-3 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 transition-colors">
                                 Pay
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No invoices found for this parent's students.</p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
                Print Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                 <h3 className="font-black text-slate-800">Record Payment</h3>
                 <button onClick={() => setPaymentModalOpen(false)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                   <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
                 <div>
                   <p className="text-sm font-bold text-slate-700 mb-2">Invoice: {selectedInvoice.invoiceNumber}</p>
                   <p className="text-sm text-slate-500 mb-4">Balance Due: {formatCurrency(selectedInvoice.balanceDue)}</p>
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1">Amount to Pay</label>
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">KES</span>
                     <input
                       type="number"
                       required
                       min="1"
                       max={selectedInvoice.balanceDue}
                       value={paymentAmount}
                       onChange={e => setPaymentAmount(e.target.value)}
                       className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                   <select 
                     value={paymentMethod}
                     onChange={e => setPaymentMethod(e.target.value)}
                     className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                   >
                     <option value="CASH">Cash</option>
                     <option value="BANK_TRANSFER">Bank Transfer</option>
                     <option value="MOBILE_MONEY">Mobile Money</option>
                     <option value="CREDIT_CARD">Credit Card</option>
                     <option value="CHEQUE">Cheque</option>
                   </select>
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                   <button 
                     type="button" 
                     onClick={() => setPaymentModalOpen(false)}
                     className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     disabled={isPending}
                     className="px-4 py-2 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md disabled:opacity-50 transition-colors"
                   >
                     {isPending ? "Recording..." : "Confirm Payment"}
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
