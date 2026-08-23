"use client";

import React, { useState, useTransition } from "react";
import { BookOpen, Plus, Trash2, List, CheckCircle, Loader2, X } from "lucide-react";
import { createChartOfAccount, deleteChartOfAccount } from "@/app/actions/chartOfAccounts";
import { useRouter } from "next/navigation";

const TYPE_COLORS: Record<string, string> = {
  REVENUE: "text-emerald-700 bg-emerald-50 border-emerald-200",
  EXPENSE: "text-rose-700 bg-rose-50 border-rose-200",
  ASSET: "text-blue-700 bg-blue-50 border-blue-200",
  LIABILITY: "text-amber-700 bg-amber-50 border-amber-200",
  EQUITY: "text-purple-700 bg-purple-50 border-purple-200",
};

const TYPE_ORDER = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"];

export default function ChartOfAccountsClient({ accounts }: { accounts: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [accountCode, setAccountCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<"ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE">("REVENUE");
  const [description, setDescription] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setAccountCode(""); setAccountName(""); setDescription("");
    setAccountType("REVENUE");
  };

  const handleCreate = () => {
    if (!accountCode || !accountName) return;
    startTransition(async () => {
      await createChartOfAccount({ accountCode, accountName, accountType, description });
      setShowModal(false);
      resetForm();
      router.refresh();
      showToast("Account created!");
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteChartOfAccount(id);
      router.refresh();
      showToast("Account deleted.");
    });
  };

  // Group by type in canonical order
  const groupedAccounts: Record<string, any[]> = {};
  for (const type of TYPE_ORDER) groupedAccounts[type] = [];
  for (const account of accounts) {
    if (!groupedAccounts[account.accountType]) groupedAccounts[account.accountType] = [];
    groupedAccounts[account.accountType].push(account);
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Chart of Accounts</h3>
            <p className="text-sm font-medium text-slate-500">Manage financial ledgers and account categories.</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-60"
        >
          <Plus className="w-4 h-4" /> New Account
        </button>
      </div>

      <div className="space-y-6">
        {accounts.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No accounts defined yet.</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Create your first account to start your Chart of Accounts.</p>
          </div>
        ) : (
          TYPE_ORDER.filter(t => groupedAccounts[t]?.length > 0).map((type) => (
            <div key={type} className={`border rounded-2xl overflow-hidden bg-white shadow-sm border-slate-200`}>
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-black border ${TYPE_COLORS[type]}`}>
                  {type}
                </span>
                <span className="text-xs font-bold text-slate-400">{groupedAccounts[type].length} account{groupedAccounts[type].length !== 1 ? "s" : ""}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {groupedAccounts[type].map((account) => (
                  <div key={account.id} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <List className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800">{account.accountCode}</span>
                          <span className="text-sm font-bold text-slate-600">— {account.accountName}</span>
                        </div>
                        {account.description && (
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{account.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(account.id)}
                      disabled={isPending}
                      className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">New Account</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Account Code</label>
                  <input
                    type="text"
                    value={accountCode}
                    onChange={(e) => setAccountCode(e.target.value)}
                    placeholder="e.g. 4001"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Account Type</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option value="ASSET">Asset</option>
                    <option value="LIABILITY">Liability</option>
                    <option value="EQUITY">Equity</option>
                    <option value="REVENUE">Revenue</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Tuition Fee Income"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief description of this account..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={isPending || !accountCode || !accountName}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-50 transition-colors"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
