"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Filter, FolderTree, ChevronRight, X } from "lucide-react";
import { addChartOfAccount } from "./actions";
import { AccountType } from "@prisma/client";

type AccountGroup = {
  type: string;
  rawType: string;
  balance: number;
  accounts: {
    id: string;
    code: string;
    name: string;
    balance: number;
  }[];
};

interface ChartOfAccountsClientProps {
  initialData: AccountGroup[];
}

export default function ChartOfAccountsClient({ initialData }: ChartOfAccountsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    accountCode: "",
    accountName: "",
    accountType: "ASSET" as AccountType,
    description: "",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return initialData;
    const lowerSearch = searchTerm.toLowerCase();
    
    return initialData.map((group) => {
      const filteredAccounts = group.accounts.filter(
        (acc) =>
          acc.name.toLowerCase().includes(lowerSearch) ||
          acc.code.toLowerCase().includes(lowerSearch)
      );
      return {
        ...group,
        accounts: filteredAccounts,
      };
    }).filter(group => group.accounts.length > 0);
  }, [initialData, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await addChartOfAccount(formData);
      if (result.success) {
        setIsModalOpen(false);
        setFormData({ accountCode: "", accountName: "", accountType: "ASSET", description: "" });
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      {/* Toolbar */}
      <div className="p-5 border-b border-slate-100/80 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search accounts by name or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Filter Types
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((group, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-primary-900" />
                  {group.type}
                </h3>
                <span className="font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  {formatCurrency(group.balance)}
                </span>
              </div>
              
              <div className="space-y-1">
                {group.accounts.length === 0 ? (
                  <div className="text-center text-sm text-slate-400 py-2">No accounts found</div>
                ) : (
                  group.accounts.map((acc, aIdx) => (
                    <div key={aIdx} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-xs text-slate-400 w-10">{acc.code}</span>
                        <span className="font-bold text-slate-700 group-hover:text-primary-900">{acc.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-sm text-slate-600">{formatCurrency(acc.balance)}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Add New Account</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Account Code</label>
                <input 
                  type="text" 
                  required
                  value={formData.accountCode}
                  onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g. 1001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Account Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g. Main Bank Account"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Account Type</label>
                <select 
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value as AccountType })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="ASSET">Asset</option>
                  <option value="LIABILITY">Liability</option>
                  <option value="EQUITY">Equity</option>
                  <option value="REVENUE">Revenue</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="Brief description of this account"
                  rows={3}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
