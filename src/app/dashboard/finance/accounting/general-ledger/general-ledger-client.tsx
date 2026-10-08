"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, ChevronDown } from "lucide-react";
import type { ChartOfAccount, JournalLine, JournalEntry } from "@prisma/client";

type LedgerLine = JournalLine & {
  journalEntry: JournalEntry;
  account: ChartOfAccount;
};

interface Props {
  accounts: ChartOfAccount[];
  lines: LedgerLine[];
}

export default function GeneralLedgerClient({ accounts, lines }: Props) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLines = useMemo(() => {
    let filtered = lines;
    if (selectedAccountId !== "all") {
      filtered = filtered.filter((line) => line.chartOfAccountId === selectedAccountId);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (line) =>
          line.description?.toLowerCase().includes(lowerSearch) ||
          line.journalEntry.description.toLowerCase().includes(lowerSearch) ||
          line.journalEntry.reference?.toLowerCase().includes(lowerSearch)
      );
    }
    return filtered;
  }, [lines, selectedAccountId, searchTerm]);

  // Calculate closing balance for the selected account(s)
  const closingBalance = useMemo(() => {
    return filteredLines.reduce((acc, line) => {
      // Typically, Assets/Expenses increase with debit, decrease with credit
      // Liabilities/Equity/Revenue increase with credit, decrease with debit
      // We'll just show the net difference or cumulative balance for simplicity here.
      return acc + (line.debit - line.credit);
    }, 0);
  }, [filteredLines]);

  const selectedAccountName = selectedAccountId === "all"
    ? "All Accounts"
    : accounts.find(a => a.id === selectedAccountId)?.accountName || "Unknown Account";

  // Compute running balance
  let runningBalance = 0;

  return (
    <div className="space-y-6">
      {/* Filters and Selection */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-1 min-w-[250px]">
            <select 
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900 cursor-pointer"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              <option value="all">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountCode} - {acc.accountName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
            />
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Date Range
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4 text-slate-400" />
            Export
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Account Transactions</h3>
            <p className="text-sm font-medium text-slate-500">Showing entries for {selectedAccountName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">Net Change</p>
            <p className="font-black text-xl text-primary-900">
              KSh {Math.abs(closingBalance).toLocaleString()} {closingBalance >= 0 ? '(Dr)' : '(Cr)'}
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-primary-900 text-xs uppercase font-bold text-white">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Ref / Description</th>
                <th className="px-6 py-4 text-right">Debit (KSh)</th>
                <th className="px-6 py-4 text-right">Credit (KSh)</th>
                <th className="px-6 py-4 text-right">Balance (KSh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLines.map((line) => {
                const dateStr = new Date(line.journalEntry.entryDate).toLocaleDateString();
                const desc = line.description || line.journalEntry.description;
                const ref = line.journalEntry.reference || `JRNL-${line.journalEntry.id.substring(0, 5)}`;
                
                // Account for balance (naive running balance: Dr - Cr)
                runningBalance += (line.debit - line.credit);

                return (
                  <tr key={line.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{dateStr}</div>
                      <div className="text-xs text-slate-400 font-medium">{ref}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-700">{line.account.accountCode}</div>
                      <div className="text-xs text-slate-500">{line.account.accountName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{desc}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      {line.debit > 0 ? (
                        <span className="flex items-center justify-end gap-1">
                          <ArrowDownLeft className="w-4 h-4" />
                          {line.debit.toLocaleString()}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-rose-600">
                      {line.credit > 0 ? (
                        <span className="flex items-center justify-end gap-1">
                          <ArrowUpRight className="w-4 h-4" />
                          {line.credit.toLocaleString()}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-800">
                      {Math.abs(runningBalance).toLocaleString()} {runningBalance >= 0 ? '(Dr)' : '(Cr)'}
                    </td>
                  </tr>
                );
              })}
              {filteredLines.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
