"use client";

import React from "react";
import { RefreshCcw } from "lucide-react";

export default function RefundsReversalsPage() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
        <RefreshCcw className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2">Refunds & Reversals</h3>
      <p className="text-sm text-slate-500 font-medium max-w-md mx-auto mb-6">Process refunds for overpayments, student withdrawals, or reverse incorrectly posted receipts securely.</p>
      <button className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-md">
        Initiate Refund / Reversal
      </button>
    </div>
  );
}
