"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { createBill } from "./actions";
import { useRouter } from "next/navigation";

export function NewBillButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    vendorName: "",
    ref: "",
    amount: "",
    dueDate: "",
    status: "OPEN",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBill({
        vendorName: formData.vendorName,
        ref: formData.ref,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status,
      });
      setIsOpen(false);
      router.refresh();
      setFormData({
        vendorName: "",
        ref: "",
        amount: "",
        dueDate: "",
        status: "OPEN",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary-900 hover:bg-primary-800 transition-colors p-5 rounded-3xl shadow-sm shadow-primary-900/20 flex flex-col items-center justify-center gap-3 text-white group h-full"
      >
        <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
        <span className="font-bold">Record New Bill</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Record New Bill</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Vendor Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.vendorName}
                  onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g. Textbook Centre Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bill Reference (PO Number)</label>
                <input 
                  required
                  type="text" 
                  value={formData.ref}
                  onChange={(e) => setFormData({...formData, ref: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g. INV-8890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (KSh)</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
                <input 
                  required
                  type="date" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 bg-white"
                >
                  <option value="OPEN">Open</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary-900 text-white font-bold py-3 rounded-xl hover:bg-primary-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
