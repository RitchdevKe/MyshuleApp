"use client";

import React, { useState } from "react";
import { Landmark, ArrowUpRight, ArrowDownLeft, Settings2, Plus, ArrowRightLeft, FileText, MoreVertical, X } from "lucide-react";
import { addBankAccount, recordTransfer } from "./actions";
import { BankAccount, BankTransaction } from "@prisma/client";

type AccountWithStats = BankAccount & {
  bal: number;
  in30d: number;
  out30d: number;
  color: string;
  type: string;
};

type TxWithAccount = BankTransaction & {
  bankAccount: {
    accountName: string;
    bankName: string;
  };
};

export default function BankAccountsClient({
  accounts,
  transactions,
}: {
  accounts: AccountWithStats[];
  transactions: TxWithAccount[];
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  // Add Account Form State
  const [addForm, setAddForm] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchName: "",
    currency: "KES",
  });
  
  // Transfer Form State
  const [transferForm, setTransferForm] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    description: "",
    reference: "",
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addBankAccount(addForm);
    if (res.success) {
      setShowAddModal(false);
      setAddForm({ bankName: "", accountName: "", accountNumber: "", branchName: "", currency: "KES" });
    } else {
      alert(res.error);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await recordTransfer({
      fromAccountId: transferForm.fromAccountId,
      toAccountId: transferForm.toAccountId,
      amount: parseFloat(transferForm.amount),
      description: transferForm.description,
      reference: transferForm.reference,
      date: new Date(),
    });
    if (res.success) {
      setShowTransferModal(false);
      setTransferForm({ fromAccountId: "", toAccountId: "", amount: "", description: "", reference: "" });
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800">Connected Accounts</h2>
          <p className="text-sm font-medium text-slate-500">Manage your bank and mobile money accounts.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all">
            <ArrowRightLeft className="w-4 h-4" /> Record Transfer
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all">
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((bank, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl shadow-inner bg-${bank.color}-50 text-${bank.color}-600`}>
                  <Landmark className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-800">{bank.accountName}</h3>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider">{bank.type}</span>
                     <p className="text-sm font-semibold text-slate-500">• {bank.accountNumber}</p>
                   </div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-primary-900 bg-white hover:bg-primary-50 rounded-xl transition-colors shadow-sm border border-slate-100">
                 <Settings2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{bank.currency} {bank.bal.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                     <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In (30D)</p>
                     <p className="text-sm font-bold text-slate-700">{bank.currency} {bank.in30d.toLocaleString()}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                     <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Out (30D)</p>
                     <p className="text-sm font-bold text-slate-700">{bank.currency} {bank.out30d.toLocaleString()}</p>
                  </div>
               </div>
            </div>

            {/* Quick Actions Overlay (Appears on Hover) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 rounded-b-3xl flex justify-around opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
               <button 
                  onClick={() => {
                    setTransferForm({...transferForm, fromAccountId: bank.id});
                    setShowTransferModal(true);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-900">
                 <ArrowRightLeft className="w-4 h-4" /> Transfer
               </button>
               <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-900">
                 <FileText className="w-4 h-4" /> Statement
               </button>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No bank accounts found. Add one to get started.
          </div>
        )}
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800">Recent Bank Transactions</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Across all connected accounts</p>
          </div>
          <button className="text-sm font-bold text-primary-900 hover:text-primary-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                         {tx.type === 'IN' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{tx.description}</p>
                        <p className="text-xs text-slate-500 font-medium">{tx.reference || '-'} • {new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{tx.bankAccount.accountName}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className={`text-sm font-black ${tx.type === 'IN' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === 'IN' ? '+' : '-'} {tx.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      tx.isReconciled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tx.isReconciled ? 'Reconciled' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-xl transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">Add Bank Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bank Name</label>
                <input type="text" required value={addForm.bankName} onChange={e => setAddForm({...addForm, bankName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. KCB Bank" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Account Name</label>
                <input type="text" required value={addForm.accountName} onChange={e => setAddForm({...addForm, accountName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Main Account" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Account Number</label>
                <input type="text" required value={addForm.accountNumber} onChange={e => setAddForm({...addForm, accountNumber: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. 1122334455" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Branch Name</label>
                <input type="text" value={addForm.branchName} onChange={e => setAddForm({...addForm, branchName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Westlands" />
              </div>
              <button type="submit" className="w-full py-3 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold shadow-md">
                Save Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Record Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">Record Transfer</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">From Account</label>
                <select required value={transferForm.fromAccountId} onChange={e => setTransferForm({...transferForm, fromAccountId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select account...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.accountName} ({acc.bankName})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">To Account</label>
                <select required value={transferForm.toAccountId} onChange={e => setTransferForm({...transferForm, toAccountId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select account...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.accountName} ({acc.bankName})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</label>
                <input type="number" required min="0.01" step="0.01" value={transferForm.amount} onChange={e => setTransferForm({...transferForm, amount: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. 50000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <input type="text" required value={transferForm.description} onChange={e => setTransferForm({...transferForm, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Internal Transfer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Reference (Optional)</label>
                <input type="text" value={transferForm.reference} onChange={e => setTransferForm({...transferForm, reference: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. TR-1002" />
              </div>
              <button type="submit" className="w-full py-3 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold shadow-md">
                Complete Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
