import React from "react";
import { Search, Plus, Filter, FolderTree, ChevronRight } from "lucide-react";

export default function ChartOfAccountsPage() {
  const accountTypes = [
    {
      type: "Assets",
      balance: "KSh 45,200,000",
      accounts: [
        { code: "1001", name: "Main Bank Account", balance: "KSh 4,820,000" },
        { code: "1002", name: "Petty Cash", balance: "KSh 45,000" },
        { code: "1100", name: "Accounts Receivable", balance: "KSh 2,150,000" },
        { code: "1200", name: "Fixed Assets (Property)", balance: "KSh 38,185,000" }
      ]
    },
    {
      type: "Liabilities",
      balance: "KSh 3,450,000",
      accounts: [
        { code: "2001", name: "Accounts Payable", balance: "KSh 1,200,000" },
        { code: "2100", name: "Payroll Liabilities", balance: "KSh 850,000" },
        { code: "2200", name: "Prepaid Tuition", balance: "KSh 1,400,000" }
      ]
    },
    {
      type: "Equity",
      balance: "KSh 41,750,000",
      accounts: [
        { code: "3001", name: "Retained Earnings", balance: "KSh 41,750,000" }
      ]
    },
    {
      type: "Revenue",
      balance: "KSh 24,800,000",
      accounts: [
        { code: "4001", name: "Tuition Fees", balance: "KSh 18,500,000" },
        { code: "4002", name: "Transport Fees", balance: "KSh 4,200,000" },
        { code: "4003", name: "Other Income", balance: "KSh 2,100,000" }
      ]
    },
    {
      type: "Expenses",
      balance: "KSh 15,700,000",
      accounts: [
        { code: "5001", name: "Salaries & Wages", balance: "KSh 8,200,000" },
        { code: "5002", name: "Utilities", balance: "KSh 1,100,000" },
        { code: "5003", name: "Maintenance", balance: "KSh 2,400,000" },
        { code: "5004", name: "Supplies", balance: "KSh 4,000,000" }
      ]
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      
      {/* Toolbar */}
      <div className="p-5 border-b border-slate-100/80 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search accounts by name or code..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Filter Types
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accountTypes.map((group, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-primary-900" />
                  {group.type}
                </h3>
                <span className="font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  {group.balance}
                </span>
              </div>
              
              <div className="space-y-1">
                {group.accounts.map((acc, aIdx) => (
                  <div key={aIdx} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-xs text-slate-400 w-10">{acc.code}</span>
                      <span className="font-bold text-slate-700 group-hover:text-primary-900">{acc.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm text-slate-600">{acc.balance}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
