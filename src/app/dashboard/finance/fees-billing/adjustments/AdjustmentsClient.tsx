"use client";

import React, { useState } from "react";
import { ArrowRightLeft, Plus, X } from "lucide-react";
import { createAdjustment } from "./actions";

type InvoiceItem = {
  id: string;
  description: string;
  amount: number;
  invoice: {
    invoiceNumber: string;
    student: {
      firstName: string;
      lastName: string;
    };
  };
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  student: {
    firstName: string;
    lastName: string;
  };
};

interface AdjustmentsClientProps {
  adjustments: InvoiceItem[];
  invoices: Invoice[];
}

export default function AdjustmentsClient({ adjustments, invoices }: AdjustmentsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [invoiceId, setInvoiceId] = useState("");
  const [description, setDescription] = useState("Adjustment: ");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAdjustment({
        invoiceId,
        description,
        amount: parseFloat(amount)
      });
      setIsModalOpen(false);
      setInvoiceId("");
      setDescription("Adjustment: ");
      setAmount("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ArrowRightLeft className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Debit & Credit Notes</h3>
        <p className="text-sm text-slate-500 font-medium max-w-md mx-auto mb-6">Create manual adjustments for overcharges, penalties, or bespoke corrections to individual student accounts.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20"
        >
          <Plus className="w-4 h-4" />
          New Adjustment
        </button>
      </div>

      {adjustments.length > 0 && (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6">
          <h4 className="text-lg font-bold text-slate-800 mb-4">Recent Adjustments</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl">Invoice #</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 rounded-tr-xl text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{adj.invoice.invoiceNumber}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {adj.invoice.student.firstName} {adj.invoice.student.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{adj.description}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${adj.amount < 0 ? "text-green-600" : "text-red-600"}`}>
                      {adj.amount < 0 ? "-" : "+"}KSh {Math.abs(adj.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">New Adjustment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Select Invoice</label>
                <select
                  required
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="" disabled>Select an invoice...</option>
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} - {inv.student.firstName} {inv.student.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <input
                  required
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Adjustment: Scholarship"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (Negative for Credit)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. -5000"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
