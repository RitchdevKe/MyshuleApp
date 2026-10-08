"use client";

import React, { useState } from "react";
import { allocatePayment } from "./actions";

export default function AllocationList({ payments }: { payments: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [invoiceIds, setInvoiceIds] = useState<Record<string, string>>({});

  const handleAllocate = async (paymentId: string) => {
    const invoiceId = invoiceIds[paymentId];
    if (!invoiceId) {
      alert("Please enter an Invoice ID");
      return;
    }

    setLoadingId(paymentId);
    try {
      await allocatePayment(paymentId, invoiceId);
    } catch (error: any) {
      alert(error.message || "Failed to allocate");
    } finally {
      setLoadingId(null);
    }
  };

  if (payments.length === 0) {
    return <div className="text-center text-slate-500 py-4">No pending allocations.</div>;
  }

  return (
    <div className="space-y-4">
      {payments.map((item) => (
        <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors gap-4">
          <div className="flex-1">
            <p className="font-bold text-slate-800">
              KSh {item.amount.toLocaleString()} 
              <span className="text-slate-400 font-medium text-sm ml-2">
                {item.referenceNumber || item.receiptNumber}
              </span>
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Received {new Date(item.paymentDate).toLocaleDateString()} 
              {item.notes && <span className="ml-2">• Notes: {item.notes}</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Invoice ID" 
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 w-32"
              value={invoiceIds[item.id] || ""}
              onChange={(e) => setInvoiceIds({...invoiceIds, [item.id]: e.target.value})}
            />
            <button 
              onClick={() => handleAllocate(item.id)}
              disabled={loadingId === item.id}
              className="px-4 py-2 bg-slate-100 hover:bg-primary-50 hover:text-primary-900 text-slate-600 font-bold text-sm rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loadingId === item.id ? "Allocating..." : "Allocate"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
