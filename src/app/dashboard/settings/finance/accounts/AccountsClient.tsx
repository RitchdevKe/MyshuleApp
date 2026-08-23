"use client";

import React, { useState } from "react";
import { Building2, Plus, Trash2, CreditCard, Link } from "lucide-react";
import { createBankAccount, deleteBankAccount, createPaymentGateway, deletePaymentGateway } from "@/app/actions/finance";

export default function AccountsClient({ bankAccounts, paymentGateways }: { bankAccounts: any[], paymentGateways: any[] }) {
  const [showBankModal, setShowBankModal] = useState(false);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("");
  const [currency, setCurrency] = useState("KES");

  const [providerName, setProviderName] = useState("");
  const [paybillNumber, setPaybillNumber] = useState("");

  const handleAddBank = async () => {
    if (!bankName || !accountName || !accountNumber) return;
    setLoading(true);
    await createBankAccount({ bankName, accountName, accountNumber, branchName, currency });
    setLoading(false);
    setShowBankModal(false);
    setBankName("");
    setAccountName("");
    setAccountNumber("");
    setBranchName("");
  };

  const handleAddGateway = async () => {
    if (!providerName || !paybillNumber) return;
    setLoading(true);
    await createPaymentGateway({ providerName, paybillNumber });
    setLoading(false);
    setShowGatewayModal(false);
    setProviderName("");
    setPaybillNumber("");
  };

  return (
    <div className="p-6 md:p-8 space-y-12">
      {/* Bank Accounts Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Bank Accounts</h3>
              <p className="text-sm font-medium text-slate-500">Official school bank accounts for fee deposits.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowBankModal(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Bank Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankAccounts.map(account => (
            <div key={account.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={async () => { if(confirm("Delete account?")) await deleteBankAccount(account.id); }} className="text-slate-300 hover:text-red-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-slate-800">{account.bankName}</h4>
              <p className="text-sm font-bold text-slate-500 mb-4">{account.accountName}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Account No</span>
                  <span className="font-bold text-slate-800">{account.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Branch</span>
                  <span className="font-bold text-slate-800">{account.branchName || "-"}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Currency</span>
                  <span className="font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{account.currency}</span>
                </div>
              </div>
            </div>
          ))}
          {bankAccounts.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
              No bank accounts configured.
            </div>
          )}
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* Payment Gateways Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Mobile Money & Gateways</h3>
              <p className="text-sm font-medium text-slate-500">M-Pesa paybills and online payment providers.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowGatewayModal(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Gateway
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentGateways.map(gateway => (
            <div key={gateway.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Link className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800">{gateway.providerName}</h4>
                  <p className="text-sm font-bold text-slate-500">Paybill: {gateway.paybillNumber}</p>
                </div>
              </div>
              <button onClick={async () => { if(confirm("Delete gateway?")) await deletePaymentGateway(gateway.id); }} className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {paymentGateways.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
              No payment gateways configured.
            </div>
          )}
        </div>
      </section>

      {/* Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Add Bank Account</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Equity Bank" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Account Name</label>
                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g. Kepler High School" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Account Number</label>
                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Branch (Optional)</label>
                  <input type="text" value={branchName} onChange={(e) => setBranchName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white">
                    <option value="KES">KES</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowBankModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleAddBank} disabled={loading || !bankName || !accountName || !accountNumber} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-50">Add Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Gateway Modal */}
      {showGatewayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Add Payment Gateway</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Provider</label>
                <select value={providerName} onChange={(e) => setProviderName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white">
                  <option value="">Select Provider...</option>
                  <option value="MPESA">M-Pesa</option>
                  <option value="STRIPE">Stripe</option>
                  <option value="PESAPAL">Pesapal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Paybill / Till Number</label>
                <input type="text" value={paybillNumber} onChange={(e) => setPaybillNumber(e.target.value)} placeholder="e.g. 123456" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowGatewayModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleAddGateway} disabled={loading || !providerName || !paybillNumber} className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm disabled:opacity-50">Add Gateway</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
