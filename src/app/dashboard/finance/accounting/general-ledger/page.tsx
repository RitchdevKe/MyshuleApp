import React from "react";
import GeneralLedgerClient from "./general-ledger-client";
import { getAccounts, getGeneralLedgerData } from "./actions";

export default async function GeneralLedgerPage() {
  const accounts = await getAccounts();
  const lines = await getGeneralLedgerData();

  // Aggregate data for Top Cards
  const stats = {
    totalAssets: 0,
    totalLiabilities: 0,
    totalRevenue: 0,
    totalExpenses: 0,
  };

  accounts.forEach((acc) => {
    // Find all lines for this account
    const accLines = lines.filter((l) => l.chartOfAccountId === acc.id);
    let balance = 0;
    
    // For Assets and Expenses, debit increases balance, credit decreases
    // For Liabilities, Equity, Revenue, credit increases balance, debit decreases
    accLines.forEach((l) => {
      if (acc.accountType === "ASSET" || acc.accountType === "EXPENSE") {
        balance += (l.debit - l.credit);
      } else {
        balance += (l.credit - l.debit);
      }
    });

    if (acc.accountType === "ASSET") stats.totalAssets += balance;
    if (acc.accountType === "LIABILITY") stats.totalLiabilities += balance;
    if (acc.accountType === "REVENUE") stats.totalRevenue += balance;
    if (acc.accountType === "EXPENSE") stats.totalExpenses += balance;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">General Ledger</h1>
        <p className="text-slate-500 font-medium">View and filter all journal entries and account transactions.</p>
      </div>
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Assets", value: stats.totalAssets, color: "text-blue-600" },
          { label: "Total Liabilities", value: stats.totalLiabilities, color: "text-rose-600" },
          { label: "Total Revenue", value: stats.totalRevenue, color: "text-emerald-600" },
          { label: "Total Expenses", value: stats.totalExpenses, color: "text-amber-600" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-500">{stat.label}</span>
            <span className={`text-2xl font-black ${stat.color}`}>
              KSh {stat.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <GeneralLedgerClient accounts={accounts} lines={lines} />
    </div>
  );
}
