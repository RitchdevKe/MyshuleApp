"use client";

import React, { useState, useTransition } from "react";
import { Wallet, Plus, CreditCard, Building, Smartphone, Trash2 } from "lucide-react";
import { addPaymentMethod, deletePaymentMethod } from "@/app/actions/subscription";
import { useRouter } from "next/navigation";

export default function PaymentMethodsClient({ initialMethods }: { initialMethods: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ providerName: 'Stripe', apiKey: '', apiSecret: '', paybillNumber: '' });

  const handleAdd = () => {
    startTransition(async () => {
      await addPaymentMethod(formData);
      setIsModalOpen(false);
      setFormData({ providerName: 'Stripe', apiKey: '', apiSecret: '', paybillNumber: '' });
      router.refresh();
    });
  };

  const getProviderIcon = (name: string) => {
    if (name.toLowerCase().includes('mpesa') || name.toLowerCase().includes('m-pesa')) return <Smartphone className="w-6 h-6 text-emerald-500" />;
    if (name.toLowerCase().includes('stripe') || name.toLowerCase().includes('card')) return <CreditCard className="w-6 h-6 text-indigo-500" />;
    return <Building className="w-6 h-6 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Payment Methods</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Configure gateways for your institution to accept payments.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white font-bold rounded-xl hover:bg-secondary-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Gateway
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialMethods.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white/50 border border-slate-200 border-dashed rounded-3xl">
            <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="text-lg font-bold text-slate-600">No Gateways Configured</div>
            <p className="text-sm text-slate-500 mt-1">Add a payment gateway to start accepting fees.</p>
          </div>
        ) : (
          initialMethods.map((method) => (
            <div key={method.id} className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner border border-slate-100">
                  {getProviderIcon(method.providerName)}
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${method.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {method.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-800">{method.providerName}</h3>
              {method.paybillNumber && (
                <div className="text-sm font-medium text-slate-500 mt-1">
                  Paybill: {method.paybillNumber}
                </div>
              )}
              <div className="mt-auto pt-6 flex justify-end gap-2">
                <button 
                  onClick={() => startTransition(async () => {
                    await deletePaymentMethod(method.id);
                    router.refresh();
                  })}
                  disabled={isPending}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded-xl disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-white/20">
            <h3 className="text-2xl font-black text-slate-800 mb-6">Add Payment Gateway</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Provider Name</label>
                <select
                  value={formData.providerName}
                  onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all"
                >
                  <option value="Stripe">Stripe</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {formData.providerName === 'M-Pesa' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Paybill / Till Number</label>
                  <input
                    type="text"
                    value={formData.paybillNumber}
                    onChange={(e) => setFormData({ ...formData, paybillNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all"
                    placeholder="e.g. 123456"
                  />
                </div>
              )}

              {(formData.providerName === 'Stripe' || formData.providerName === 'PayPal') && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">API Key</label>
                    <input
                      type="text"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">API Secret</label>
                    <input
                      type="password"
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-secondary-500 text-white font-bold rounded-xl hover:bg-secondary-600 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Saving...' : 'Save Gateway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
