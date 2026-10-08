"use client";

import React, { useState } from "react";
import { Calculator, Check, X } from "lucide-react";
import { startBillingRun } from "./actions";

type Run = {
  ref: string;
  date: string;
  target: string;
  count: string;
  amount: string;
  status: string;
};

type Term = {
  id: string;
  name: string;
  academicYear: { name: string };
};

type FeeStructure = {
  id: string;
  name: string;
  totalAmount: number;
  class: { name: string };
  academicYear: { name: string };
};

export default function BillingRunsClient({
  billingRuns,
  terms,
  feeStructures,
}: {
  billingRuns: Run[];
  terms: Term[];
  feeStructures: FeeStructure[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      await startBillingRun(formData);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 relative">
      <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 rounded-3xl border border-primary-200/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-black text-primary-900">Run Batch Billing</h2>
          <p className="text-sm text-primary-700 font-medium mt-1">
            Generate invoices for an entire class, grade, or school at once.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-600/20 whitespace-nowrap"
        >
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
            {billingRuns.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No billing runs found.
                </td>
              </tr>
            ) : (
              billingRuns.map((run, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="p-4 pl-6 font-bold text-primary-900">{run.ref}</td>
                  <td className="p-4 text-slate-600 font-semibold">{run.date}</td>
                  <td className="p-4 text-slate-800 font-bold">{run.target}</td>
                  <td className="p-4 text-right text-slate-600 font-bold">{run.count}</td>
                  <td className="p-4 text-right font-black text-slate-800">KSh {run.amount}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                        run.status === "Posted"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {run.status === "Posted" && <Check className="w-3 h-3" />}
                      {run.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Start Billing Run</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700" htmlFor="termId">
                  Academic Term
                </label>
                <select
                  name="termId"
                  id="termId"
                  required
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                >
                  <option value="">Select a term...</option>
                  {terms.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.name} ({term.academicYear.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700" htmlFor="feeStructureId">
                  Fee Structure / Class
                </label>
                <select
                  name="feeStructureId"
                  id="feeStructureId"
                  required
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                >
                  <option value="">Select a fee structure...</option>
                  {feeStructures.map((fs) => (
                    <option key={fs.id} value={fs.id}>
                      {fs.name} - {fs.class.name} (KSh {fs.totalAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Start Run"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
