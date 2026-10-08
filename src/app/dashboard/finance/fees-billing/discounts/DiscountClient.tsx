"use client";

import React, { useState, useTransition } from "react";
import { BadgePercent, Plus, X } from "lucide-react";
import { applyDiscount } from "./actions";

export default function DiscountClient({ initialInvoices, allInvoices }: { initialInvoices: any[], allInvoices: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleApply = async () => {
    if (!selectedInvoice || !discountAmount) return;
    
    startTransition(async () => {
      const res = await applyDiscount(selectedInvoice, parseFloat(discountAmount));
      if (res.success) {
        setIsModalOpen(false);
        setSelectedInvoice("");
        setDiscountAmount("");
      } else {
        alert(res.error || "Failed to apply discount");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Apply Discount
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialInvoices.map((invoice, i) => {
          const colors = ["purple", "amber", "blue", "emerald", "rose"];
          const color = colors[i % colors.length];
          return (
            <div key={invoice.id} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-start gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className={`p-4 bg-${color}-50 text-${color}-600 rounded-2xl`}>
                <BadgePercent className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800">Invoice #{invoice.invoiceNumber}</h3>
                <p className="text-xs font-bold text-slate-500 mb-4">{invoice.student?.firstName} {invoice.student?.lastName}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                   <span className="text-sm font-bold text-slate-600">Status: {invoice.status}</span>
                   <span className="text-sm font-black text-rose-500">- KSh {invoice.discount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
        {initialInvoices.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 font-medium">
            No discounts applied yet.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Apply Discount</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Invoice</label>
                <select 
                  value={selectedInvoice}
                  onChange={(e) => setSelectedInvoice(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">-- Choose Invoice --</option>
                  {allInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      #{inv.invoiceNumber} - {inv.student?.firstName} {inv.student?.lastName} (Subtotal: KSh {inv.subTotal})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Discount Amount (KSh)</label>
                <input 
                  type="number" 
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g. 1500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApply}
                  disabled={isPending || !selectedInvoice || !discountAmount}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-semibold transition-all"
                >
                  {isPending ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
