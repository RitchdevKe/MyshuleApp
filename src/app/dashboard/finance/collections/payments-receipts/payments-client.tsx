"use client";

import React, { useState } from "react";
import { Search, Filter, ArrowDownLeft, Smartphone, SplitSquareHorizontal, CreditCard, Banknote, Plus, X } from "lucide-react";
import { PaymentMethod } from "@prisma/client";
import { createPayment } from "./actions";

export default function PaymentsClient({ payments, stats, tenantId }: { payments: any[], stats: any, tenantId: string }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const filteredPayments = payments.filter(p => 
    p.receiptNumber.toLowerCase().includes(search.toLowerCase()) || 
    (p.student && (p.student.firstName + " " + p.student.lastName).toLowerCase().includes(search.toLowerCase())) ||
    (p.referenceNumber && p.referenceNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreatePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createPayment({
        tenantId,
        amount: Number(formData.get("amount")),
        paymentMethod: formData.get("paymentMethod") as PaymentMethod,
        referenceNumber: formData.get("referenceNumber") as string,
        studentId: formData.get("studentId") as string || undefined,
        invoiceId: formData.get("invoiceId") as string || undefined,
        recordedById: "dummy-user-id", // In a real app, this comes from auth session
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChannelIcon = (method: string) => {
    switch (method) {
      case "MOBILE_MONEY": return Smartphone;
      case "BANK_TRANSFER": return CreditCard;
      case "CASH": return Banknote;
      default: return Banknote;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Payments & Receipts</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Receive Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
               <ArrowDownLeft className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Collections</p>
               <p className="text-2xl font-black text-slate-800">{formatCurrency(stats.todaysCollections)}</p>
            </div>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center shrink-0">
               <Smartphone className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">M-Pesa Volume</p>
               <p className="text-2xl font-black text-slate-800">{formatCurrency(stats.mpesaVolume)}</p>
            </div>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
               <SplitSquareHorizontal className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unallocated Funds</p>
               <p className="text-2xl font-black text-slate-800">{formatCurrency(stats.unallocatedFunds)}</p>
            </div>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100/80 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search receipt no, name, reference..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              Channel: All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-black">
                <th className="p-4 pl-6">Receipt No.</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Student</th>
                <th className="p-4">Channel & Ref</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No payments found.</td>
                </tr>
              )}
              {filteredPayments.map((row) => {
                const ChanIcon = getChannelIcon(row.paymentMethod);
                return (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="p-4 pl-6 font-bold text-primary-900">{row.receiptNumber}</td>
                  <td className="p-4 text-slate-500 font-semibold">{new Date(row.paymentDate).toLocaleString()}</td>
                  <td className="p-4 font-bold text-slate-800">
                    {row.student ? `${row.student.firstName} ${row.student.lastName}` : "Unknown"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                         <ChanIcon className="w-4 h-4" />
                       </div>
                       <div className="flex flex-col">
                         <span className="font-bold text-slate-700 leading-tight">{row.paymentMethod.replace("_", " ")}</span>
                         <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{row.referenceNumber || "-"}</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-black text-slate-800">{formatCurrency(row.amount)}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                      row.status === 'ALLOCATED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      row.status === 'UNALLOCATED' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Receive Payment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Amount</label>
                <input type="number" name="amount" required min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Payment Method</label>
                <select name="paymentMethod" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="CASH">Cash</option>
                  <option value="MOBILE_MONEY">Mobile Money (M-Pesa)</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Reference Number</label>
                <input type="text" name="referenceNumber" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. RKT123456" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Student ID (Optional)</label>
                <input type="text" name="studentId" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="UUID of student..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Invoice ID (Optional)</label>
                <input type="text" name="invoiceId" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="UUID of invoice..." />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors disabled:opacity-50">
                  {isSubmitting ? "Processing..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
