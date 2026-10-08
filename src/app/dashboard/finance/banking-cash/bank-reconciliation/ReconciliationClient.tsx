"use client";

import React, { useState } from "react";
import { GitCompareArrows, UploadCloud, Search, CheckCircle2, AlertCircle, FileSpreadsheet, ArrowRight, Landmark } from "lucide-react";
import { autoMatchTransactionsAction } from "./actions";

type BankAccount = { id: string; bankName: string; accountName: string; accountNumber: string };
type BankTransaction = { id: string; bankAccountId: string; date: Date; description: string; reference: string | null; amount: number; isReconciled: boolean; type: string };
type BankReconciliation = { id: string; statementBalance: number; systemBalance: number; difference: number; status: string };

export default function ReconciliationClient({
  accounts,
  transactions,
  latestReconciliation
}: {
  accounts: BankAccount[];
  transactions: BankTransaction[];
  latestReconciliation: BankReconciliation | null;
}) {
  const [activeBankId, setActiveBankId] = useState(accounts.length > 0 ? accounts[0].id : "");
  const [isMatching, setIsMatching] = useState(false);

  const activeTransactions = transactions.filter(t => t.bankAccountId === activeBankId);
  const activeReconciliations = latestReconciliation; // Note: In a real app we'd filter reconciliations by activeBankId as well, but for simplicity using the prop passed down.

  const handleAutoMatch = async () => {
    if (!activeBankId) return;
    setIsMatching(true);
    try {
      await autoMatchTransactionsAction(activeBankId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMatching(false);
    }
  };

  const dummyBankStatement = [
    { id: "bnk-1", date: "10 Oct 2026", desc: "M-PESA PAYBILL 888999", amount: "45,000", matchStatus: "unmatched", matchTo: null },
    { id: "bnk-2", date: "09 Oct 2026", desc: "CHQ BR CLEARING 0012", amount: "-120,000", matchStatus: "unmatched", matchTo: null },
    { id: "bnk-3", date: "07 Oct 2026", desc: "BANK CHARGES", amount: "-1,500", matchStatus: "unmatched", matchTo: null },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800">Reconciliation Workspace</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Match system records against imported bank statements.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={activeBankId}
            onChange={(e) => setActiveBankId(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.bankName} - {acc.accountName}</option>
            ))}
            {accounts.length === 0 && <option value="">No Accounts Found</option>}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-all">
             <UploadCloud className="w-4 h-4 text-primary-900" /> Import Statement
          </button>
          <button 
            onClick={handleAutoMatch}
            disabled={isMatching || !activeBankId}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all disabled:opacity-50"
          >
             <GitCompareArrows className="w-4 h-4" /> {isMatching ? "Matching..." : "Auto-Match"}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Statement Bal</p>
            <p className="text-xl font-black text-slate-800">
               KSh {activeReconciliations?.statementBalance?.toLocaleString() || "0"}
            </p>
         </div>
         <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">System Bal</p>
            <p className="text-xl font-black text-slate-800">
               KSh {activeReconciliations?.systemBalance?.toLocaleString() || "0"}
            </p>
         </div>
         <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl col-span-1 md:col-span-2 flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Difference</p>
               <p className="text-xl font-black text-amber-700">
                  KSh {activeReconciliations?.difference?.toLocaleString() || "0"}
               </p>
            </div>
            <div className="text-right">
               <p className="text-sm font-bold text-amber-700">
                 {activeTransactions.filter(t => !t.isReconciled).length} Unmatched items
               </p>
               <button className="text-xs font-bold text-amber-800 underline mt-1">Review items</button>
            </div>
         </div>
      </div>

      {/* Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
         
         {/* Center Link Icon (Visual Only) */}
         <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm z-10 text-slate-400">
            <GitCompareArrows className="w-5 h-5" />
         </div>

         {/* Left Column: System Transactions */}
         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <FileSpreadsheet className="w-4 h-4 text-primary-900" />
                 System Records
               </h3>
               <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search..." className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary-900 w-40" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {activeTransactions.length === 0 && (
                 <div className="text-center text-sm text-slate-500 py-8">No transactions found.</div>
               )}
               {activeTransactions.map((tx) => (
                  <div key={tx.id} className={`p-4 rounded-2xl border transition-all ${
                     tx.isReconciled ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <p className="font-bold text-slate-800 text-sm">{tx.description}</p>
                           <p className="text-xs font-medium text-slate-500 mt-0.5">
                             {new Date(tx.date).toLocaleDateString()} • {tx.reference || "No Ref"}
                           </p>
                        </div>
                        <p className={`font-black text-sm ${tx.type === 'OUT' ? 'text-slate-800' : 'text-emerald-600'}`}>
                           {tx.type === 'OUT' ? '-' : ''}{tx.amount.toLocaleString()}
                        </p>
                     </div>
                     <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                           tx.isReconciled ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                           {tx.isReconciled && <CheckCircle2 className="w-3 h-3" />}
                           {!tx.isReconciled && <div className="w-2 h-2 rounded-full bg-slate-300" />}
                           {tx.isReconciled ? "matched" : "unmatched"}
                        </span>
                        
                        {!tx.isReconciled && (
                           <button className="text-xs font-bold text-primary-900 hover:underline">Find Match</button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right Column: Bank Statement */}
         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Landmark className="w-4 h-4 text-primary-900" />
                 Bank Statement
               </h3>
               <span className="text-xs font-bold bg-primary-100 text-primary-800 px-2.5 py-1 rounded-lg">Imported: 2h ago</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {dummyBankStatement.map((tx) => (
                  <div key={tx.id} className={`p-4 rounded-2xl border transition-all ${
                     tx.matchStatus === 'matched' ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <p className="font-bold text-slate-800 text-sm">{tx.desc}</p>
                           <p className="text-xs font-medium text-slate-500 mt-0.5">{tx.date}</p>
                        </div>
                        <p className={`font-black text-sm ${tx.amount.startsWith('-') ? 'text-slate-800' : 'text-emerald-600'}`}>
                           {tx.amount}
                        </p>
                     </div>
                     <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                           tx.matchStatus === 'matched' ? 'text-emerald-600' : 'text-rose-500'
                        }`}>
                           {tx.matchStatus === 'matched' && <CheckCircle2 className="w-3 h-3" />}
                           {tx.matchStatus === 'unmatched' && <AlertCircle className="w-3 h-3" />}
                           {tx.matchStatus === 'unmatched' ? 'Needs Action' : tx.matchStatus}
                        </span>
                        
                        {tx.matchStatus === 'unmatched' && (
                           <button className="flex items-center gap-1 text-xs font-bold text-primary-900 hover:underline">
                              Create Transaction <ArrowRight className="w-3 h-3" />
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
}
