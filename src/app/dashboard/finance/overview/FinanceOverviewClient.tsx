"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PieChart, LineChart, CreditCard, BarChart3, Building } from "lucide-react";
import SummaryTab from "./components/SummaryTab";
import CashflowTab from "./components/CashflowTab";
import ReceivablesTab from "./components/ReceivablesTab";
import BudgetTab from "./components/BudgetTab";
import AccountsTab from "./components/AccountsTab";

const TABS = [
  { id: "summary", label: "Summary", icon: PieChart },
  { id: "cashflow", label: "Cash Flow", icon: LineChart },
  { id: "receivables", label: "Receivables", icon: CreditCard },
  { id: "budget", label: "Budget", icon: BarChart3 },
  { id: "accounts", label: "Accounts", icon: Building },
];

export default function FinanceOverviewClient({ 
  summaryData, 
  cashflowData, 
  receivablesData, 
  budgetData, 
  accountsData,
  initialYear,
  initialTerm
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("summary");

  const [year, setYear] = useState(initialYear || "2026");
  const [term, setTerm] = useState(initialTerm || "Term 2");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    params.set("term", term);
    router.push(`?${params.toString()}`);
  }, [year, term, router, searchParams]);

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Card */}
      <div className="bg-primary-900 p-5 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Finance Overview</h1>
          <p className="text-sm text-primary-200 font-medium mt-1">Monitor the financial health of the institution.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2.5 bg-primary-800 border border-primary-700 rounded-xl text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all cursor-pointer">
            <option value="2026">Financial Year 2026</option>
            <option value="2025">Financial Year 2025</option>
          </select>
          <select 
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="px-4 py-2.5 bg-primary-800 border border-primary-700 rounded-xl text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all cursor-pointer">
            <option value="Term 2">Term 2</option>
            <option value="Term 1">Term 1</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/20" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "summary" && <SummaryTab data={summaryData} />}
      {activeTab === "cashflow" && <CashflowTab data={cashflowData} />}
      {activeTab === "receivables" && <ReceivablesTab data={receivablesData} />}
      {activeTab === "budget" && <BudgetTab data={budgetData} />}
      {activeTab === "accounts" && <AccountsTab data={accountsData} />}
    </div>
  );
}
