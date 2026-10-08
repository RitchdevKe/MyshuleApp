"use client";

import React, { useState } from "react";
import { RefreshCcw, Plus, X, Search, FileText } from "lucide-react";
import { processRefund } from "./actions";

type Refund = any;
type Payment = any;

interface Props {
  refunds: Refund[];
  payments: Payment[];
}

export default function RefundsClient({ refunds, payments }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentId || !amount) return;

    try {
      setIsSubmitting(true);
      await processRefund({
        paymentId,
        amount: parseFloat(amount),
        reason,
      });
      setIsModalOpen(false);
      setPaymentId("");
      setAmount("");
      setReason("");
    } catch (error) {
      console.error(error);
      alert("Failed to process refund");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Refunds & Reversals</h2>
          <p className="text-sm text-slate-500">Manage and view all refunds and reversals.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Initiate Refund
        </button>
      </div>

      {refunds.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <RefreshCcw className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Refunds Yet</h3>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto mb-6">Process refunds for overpayments, student withdrawals, or reverse incorrectly posted receipts securely.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-md"
          >
            Initiate Refund
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Receipt</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(refund.refundDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      KES {refund.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {refund.payment?.receiptNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {refund.payment?.student ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">
                            {refund.payment.student.firstName} {refund.payment.student.lastName}
                          </span>
                          <span className="text-xs">{refund.payment.student.admissionNumber}</span>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={refund.reason}>
                      {refund.reason || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {refund.recordedBy?.firstName} {refund.recordedBy?.lastName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Initiate Refund / Reversal</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Select Payment</label>
                <select
                  value={paymentId}
                  onChange={(e) => {
                    setPaymentId(e.target.value);
                    const p = payments.find((x) => x.id === e.target.value);
                    if (p) setAmount(p.amount.toString());
                  }}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">-- Select a payment to refund --</option>
                  {payments.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.receiptNumber} - KES {p.amount.toLocaleString()} ({p.student ? `${p.student.firstName} ${p.student.lastName}` : "Unknown Student"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (KES)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Reason for refund/reversal..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? "Processing..." : "Process Refund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
