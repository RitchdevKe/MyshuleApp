"use client";

import React, { useState } from "react";
import { AlertOctagon } from "lucide-react";
import { sendBatchReminders } from "./actions";

export default function DebtRecoveryActions() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await sendBatchReminders();
      if (res?.success) {
        setMessage(res.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to send reminders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Debt Recovery Actions</h3>
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Batch Reminders"}
        </button>
      </div>
      <div className="p-8 text-center text-slate-500">
        <AlertOctagon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h4 className="font-bold text-slate-700 mb-2">Automated Debt Reminders</h4>
        <p className="text-sm max-w-sm mx-auto mb-4">
          Set up automated SMS and Email reminders based on aging buckets (e.g. send gentle reminder at 15 days past due).
        </p>
        {message && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-xl border border-emerald-100">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
